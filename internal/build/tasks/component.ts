/**
 * 安装依赖 pnpm install fast-glob -w -D
 */
import fs from 'fs/promises';
import path from 'path';
import * as VueCompiler from '@vue/compiler-sfc';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import vue from 'rollup-plugin-vue';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import glob, { sync } from 'fast-glob'; // 同步查找文件
import { parallel, series } from 'gulp';
import { rollup } from 'rollup';
// import typescript from 'rollup-plugin-typescript2';
import esbuild from 'rollup-plugin-esbuild';
import { Project } from 'ts-morph';
import { bundleConfig, target } from '../config/bundle';
import { buildOutput, projectRoot, vueComponentRoot } from '../config/paths';
import { pathRewriter, run } from '../utils';
import type { OutputOptions } from 'rollup';
import type { SourceFile } from 'ts-morph';
import type { Module } from '../config/bundle';

// 打包每个组件
const buildEachComponent = async () => {
  // 查找 components 下所有的组件目录 ["icon", "button", ...]
  const files = sync('*', {
    cwd: vueComponentRoot,
    onlyDirectories: true, // 只查找文件夹
  });

  // 分别把components文件夹下的组件，放到dist/es/components下 和 dist/lib/components
  const builds = files.map(async (file: string) => {
    // 找到每个组件的入口文件 index.ts
    const input = path.resolve(vueComponentRoot, file, 'index.ts');
    const onwarn = (warning) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      console.error(warning.message);
    };
    const config = {
      input,
      onwarn,
      // plugins: [nodeResolve(), typescript(), vue(), commonjs(), json()],
      plugins: [
        vue({
          isProduction: false,
        }),
        vueJsx(),
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        // typescript(),
        commonjs(),
        esbuild({
          sourceMap: true,
          target,
          loaders: {
            '.vue': 'ts',
          },
        }),
        json(),
      ],
      external: (id) => /^vue/.test(id) || /^ant-design-vue/.test(id) || /^@tav-ui/.test(id), // 排除掉vue和@w-plus的依赖
    };
    const bundle = await rollup(config);
    const options = Object.values(bundleConfig).map((config) => ({
      format: config.format,
      file: path.resolve(config.output.path, `components/${file}/index.js`),
      paths: pathRewriter(config.output.name as Module), // @tav-ui => tav-ui/es tav-ui/lib  处理路径
      exports: 'named',
    }));

    await Promise.all(options.map((option) => bundle.write(option as OutputOptions)));
  });

  return Promise.all(builds);
};

async function genTypes() {
  const project = new Project({
    // 生成.d.ts 我们需要有一个tsconfig
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      outDir: path.resolve(buildOutput, 'types'),
      baseUrl: projectRoot,
      paths: {
        '@tav-ui/*': ['packages/*'],
      },
      preserveSymlinks: true,
      skipLibCheck: true,
      strict: false,
    },
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  // // package 用到了自定义类型，需要手动处理
  // const typefilePaths = await glob('**/*', {
  //   // ** 任意目录  * 任意文件
  //   cwd: path.resolve(projectRoot, 'typings'),
  //   onlyFiles: true,
  //   absolute: true,
  // });

  const filePaths = await glob('**/*', {
    // ** 任意目录  * 任意文件
    cwd: vueComponentRoot,
    onlyFiles: true,
    absolute: true,
  });

  const sourceFiles: SourceFile[] = [];

  await Promise.all(
    filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await fs.readFile(file, 'utf8');
        const sfc = VueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content = script?.content ?? '';

          if (scriptSetup) {
            const compiled = VueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            });
            content += compiled.content;
          }

          const lang = scriptSetup?.lang || script?.lang || 'js';
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          );
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file); // 把所有的ts文件都放在一起 发射成.d.ts文件
        sourceFiles.push(sourceFile);
      }
    })
  );

  const diagnostics = project
    .getPreEmitDiagnostics()
    .filter((diagnostic) => diagnostic.getSourceFile()?.getFilePath());
  if (diagnostics.length > 0) {
    console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    const err = new Error('Failed to generate dts.');
    console.error(err);
    throw err;
  }

  await project.emit({
    // 默认是放到内存中的
    emitOnlyDtsFiles: true,
  });

  const tasks = sourceFiles.map(async (sourceFile: any) => {
    const emitOutput = sourceFile.getEmitOutput();
    const tasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filepath = outputFile.getFilePath();
      await fs.mkdir(path.dirname(filepath), {
        recursive: true,
      });
      await fs.writeFile(filepath, pathRewriter('es' as Module)(outputFile.getText()));
    });
    await Promise.all(tasks);
  });

  await Promise.all(tasks);

  copyTypes();
}

function copyTypes() {
  const src = path.resolve(buildOutput, 'types/components/');
  const copy = (module) => {
    const output = path.resolve(buildOutput, module, 'components');
    return () => run(`cp -r ${src}/* ${output}`);
  };
  return parallel(copy('es'), copy('lib'));
}

async function buildComponentEntry() {
  const config = {
    input: path.resolve(vueComponentRoot, 'index.ts'),
    plugins: [
      // typescript(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
      }),
      json(),
    ],
    external: () => true,
  };
  const bundle = await rollup(config);
  return Promise.all(
    Object.values(bundleConfig)
      .map((config) => ({
        format: config.format,
        file: path.resolve(config.output.path, 'components/index.js'),
      }))
      .map((config) => bundle.write(config as OutputOptions))
  );
}

export const buildComponent = series(
  buildEachComponent,
  genTypes,
  // copyTypes(),
  buildComponentEntry
);
