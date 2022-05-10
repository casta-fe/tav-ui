import fs from 'fs/promises';
import path from 'path';
import { dest, parallel, series, src } from 'gulp';
import glob from 'fast-glob';
import { ModuleKind, Project, ScriptTarget } from 'ts-morph';
import { bundleConfig } from '../config/bundle';
import { PKG_PREFIX } from '../config/constants';
import { buildOutput, projectRoot, uiRoot } from '../config/paths';
import { run, withTaskName } from '../utils';
import type { SourceFile } from 'ts-morph';

// ts 打包并不会带上自定义的类型需要手动处理
export const copyTypings = () => {
  return src(`${projectRoot}/typings/index.d.ts`).pipe(dest(path.resolve(buildOutput)));
};

// 把入口定义 分别拷贝到对应类型的目录下
export const copyEntryTypes = () => {
  const src = path.resolve(buildOutput, 'entry/types');
  const copy = (module) => {
    return parallel(
      withTaskName(`copyEntryTypes:${module}`, async () => {
        await run(`cp -r ${src}/* ${path.resolve(buildOutput, bundleConfig[module].output.path)}/`);
      })
    );
  };
  return parallel(copy('esm'), copy('cjs'));
};

// 生成入口定义
export const genEntryTypes = async () => {
  const files = await glob('*.ts', {
    cwd: uiRoot,
    absolute: true,
    onlyFiles: true,
  });

  const project = new Project({
    compilerOptions: {
      declaration: true,
      module: ModuleKind.ESNext,
      allowJs: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(buildOutput, 'entry/types'),
      target: ScriptTarget.ESNext,
      rootDir: uiRoot,
      strict: false,
    },
    skipFileDependencyResolution: true,
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });
  const sourceFiles: SourceFile[] = [];
  files.map((f) => {
    const sourceFile = project.addSourceFileAtPath(f);
    sourceFiles.push(sourceFile);
    return f;
  });
  await project.emit({
    emitOnlyDtsFiles: true, // 仅生成定义文件
  });
  const tasks = sourceFiles.map(async (sourceFile) => {
    const emitOutput = sourceFile.getEmitOutput();
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filepath = outputFile.getFilePath();
      await fs.mkdir(path.dirname(filepath), { recursive: true });
      await fs.writeFile(filepath, outputFile.getText().split(PKG_PREFIX).join('.'), 'utf8');
    }
  });
  await Promise.all(tasks);

  copyEntryTypes();
};

export const genTypes = series(
  genEntryTypes,
  // copyEntryTypes()
  copyTypings
);
