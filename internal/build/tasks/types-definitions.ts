import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import glob from 'fast-glob'
import consola from 'consola'
import chalk from 'chalk'
import { Project } from 'ts-morph'
import * as vueCompiler from 'vue/compiler-sfc'
import { PKG_NAME } from '../constants'
import { buildOutput, excludeFiles, pkgRoot, projRoot, uiRoot } from '../helper'
import { pathRewriter } from '../utils'
import type { SourceFile } from 'ts-morph'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json')
// const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.json')
const outDir = path.resolve(buildOutput, 'types')

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  const project = new Project({
    compilerOptions: {
      emitDeclarationOnly: true,
      outDir,
      baseUrl: projRoot,
      paths: {
        [`@${PKG_NAME}/*`]: ['packages/*'],
      },
      preserveSymlinks: true,
      types: [path.resolve(projRoot, 'typings/env'), 'unplugin-vue-define-options'],
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })

  const globAnyFile = '**/*.{js?(x),ts?(x),vue}'
  const filePaths = excludeFiles(
    await glob([globAnyFile, `!${PKG_NAME}/**/*`], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const epPaths = excludeFiles(
    await glob(globAnyFile, {
      cwd: uiRoot,
      onlyFiles: true,
    })
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await fs.readFile(file, 'utf-8')
        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = script?.content ?? ''

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            })
            content += compiled.content
          }

          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          )
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...epPaths.map(async (file) => {
      const content = await fs.readFile(path.resolve(uiRoot, file), 'utf-8')
      sourceFiles.push(project.createSourceFile(path.resolve(pkgRoot, file), content))
    }),
  ])

  const diagnostics = project
    .getPreEmitDiagnostics()
    .filter((diagnostic) => diagnostic.getSourceFile()?.getFilePath())
  if (diagnostics.length > 0) {
    console.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    console.error(err)
    throw err
  }

  await project.emit({
    emitOnlyDtsFiles: true,
  })

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())
    consola.trace(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`))

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
    }

    const tasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath()
      await fs.mkdir(path.dirname(filepath), {
        recursive: true,
      })

      await fs.writeFile(filepath, pathRewriter('esm')(outputFile.getText()), 'utf8')

      consola.success(chalk.green(`Definition for file: ${chalk.bold(relativePath)} generated`))
    })

    await Promise.all(tasks)
  })

  await Promise.all(tasks)
}
