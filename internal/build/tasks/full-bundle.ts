import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { parallel } from 'gulp'
import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import DefineOptions from 'unplugin-vue-define-options/rollup'
import { version } from '../../../packages/tav-ui/version'
import { PKG_BRAND_NAME, PKG_CAMELCASE_NAME } from '../constants'
import { uiOutput, uiRoot } from '../helper'
import { target } from '../info'
import AliasPlugin from '../plugins/alias'
import {
  formatBundleFilename,
  generateExternal,
  onwarn,
  withTaskName,
  writeBundles,
} from '../utils'

const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

async function buildFullEntry(minify: boolean) {
  const bundle = await rollup({
    input: path.resolve(uiRoot, 'index.ts'),
    onwarn,
    plugins: [
      AliasPlugin(),
      nodePolyfills(),
      DefineOptions(),
      vue({
        isProduction: true,
      }),
      vueJsx(),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        exclude: [],
        minify,
        sourceMap: minify,
        target,
        loaders: {
          '.vue': 'ts',
        },
        define: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      json(),
    ],
    external: await generateExternal({ full: true }),
    inlineDynamicImports: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(uiOutput, 'dist', formatBundleFilename('index.full', minify, 'js')),
      exports: 'named',
      name: `${PKG_CAMELCASE_NAME}`,
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(uiOutput, 'dist', formatBundleFilename('index.full', minify, 'mjs')),
      sourcemap: minify,
      banner,
    },
  ])
}

export const buildFull = (minify: boolean) => async () => Promise.all([buildFullEntry(minify)])

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
)
