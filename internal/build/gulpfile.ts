import { copyFile, mkdir } from 'fs/promises'
import path from 'path'
import { parallel, series } from 'gulp'
import { copy } from 'fs-extra'
import { buildOutput, pkgRoot, projRoot, uiOutput, uiPackage } from './helper'
import { buildConfig, run, runTask, withTaskName } from './index'
import type { TaskFunction } from 'gulp'
import type { Module } from './index'

export const copyFiles = () =>
  Promise.all([
    copyFile(uiPackage, path.join(uiOutput, 'package.json')),
    copyFile(path.resolve(projRoot, 'README.md'), path.resolve(uiOutput, 'README.md')),
    copyFile(path.resolve(projRoot, 'global.d.ts'), path.resolve(uiOutput, 'global.d.ts')),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(path.resolve(uiOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(pkgRoot, 'theme-chalk/dist/index.css'),
    path.resolve(uiOutput, 'dist/index.css')
  )
}

/**
 * 1. 删除 dist
 * 2. 打包 package下所有文件
 * 3. 打包组件库文件 package/xxx-ui
 * 4. 生成 package下所有文件的 d.ts
 * 5. 打包样式文件（先打包后拷贝）
 * 6. 把类型声明文件拷贝到打包好的 es/lib 目录下
 * 7. 拷贝一些其他必要文件
 */

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(uiOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    // runTask('generateTypesDefinitions'),
    series(
      withTaskName('buildThemeChalk', () => run('pnpm run -C packages/theme-chalk build')),
      copyFullStyle
    )
  ),

  parallel(/*copyTypesDefinitions,*/ copyFiles)
)

export * from './index'
