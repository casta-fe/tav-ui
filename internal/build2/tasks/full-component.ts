/**
 * 安装依赖 pnpm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-vue -D -w
 */
import commonjs from '@rollup/plugin-commonjs'; // 将 CommonJS 模块转换为 ES6
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve'; // 处理文件路径
import fs from 'fs/promises';
import { parallel } from 'gulp';
import path from 'path';
import type { OutputOptions } from 'rollup';
import { rollup } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import { bundleConfig, type Module } from '../config/bundle';
import { buildOutput, uiRoot } from '../config/paths';
import { pathRewriter } from '../utils';

const buildFull = async () => {
  // rollup 打包的配置信息
  const config = {
    input: path.resolve(uiRoot, 'index.ts'), // 打包入口
    plugins: [nodeResolve(), typescript(), vue(), commonjs(), json()],
    external: (id: string) => /^vue/.test(id), // 打包的时候不打包vue代码
  };

  // 组件库  esm umd  两种使用方式 import 导入组件库 在浏览器中使用script
  const bundleConfig = [
    {
      format: 'umd', // 打包的格式
      file: path.resolve(buildOutput, 'index.js'),
      name: 'tavUi', // 全局变量名字
      exports: 'named', // 导出的名字 用命名的方式导出 libraryTarget:"" name:""
      globals: {
        // 表示使用的vue是全局的
        vue: 'Vue',
        'ant-design-vue': 'ant-design-vue',
      },
    },
    {
      format: 'esm',
      file: path.resolve(buildOutput, 'index.esm.js'),
    },
  ];

  const bundle = await rollup(config);

  return Promise.all(
    bundleConfig.map((option) => {
      bundle.write(option as OutputOptions);
      return option;
    })
  );
};

async function buildEntry() {
  // 读取tav-ui目录下的所有内容，包括目录和文件
  const entryFiles = await fs.readdir(uiRoot, { withFileTypes: true });

  // 过滤掉 不是文件的内容和package.json文件  index.ts 作为打包入口
  const entryPoints = entryFiles
    .filter((f) => f.isFile())
    .filter((f) => !['package.json'].includes(f.name))
    .map((f) => path.resolve(uiRoot, f.name));

  const config = {
    input: entryPoints,
    plugins: [nodeResolve(), vue(), typescript(), json()],
    external: (id: string) => /^vue/.test(id) || /^@tav-ui/.test(id),
  };
  const bundle = await rollup(config);
  return Promise.all(
    Object.values(bundleConfig)
      .map((config) => ({
        format: config.format,
        dir: config.output.path,
        paths: pathRewriter(<Module>config.output.name),
      }))
      .map((option) => bundle.write(option as OutputOptions))
  );
}

// gulp适合流程控制和代码的转义  没有打包的功能
export const buildFullComponent = parallel(buildFull, buildEntry);
