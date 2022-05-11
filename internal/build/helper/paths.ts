import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const directivesRoot = resolve(pkgRoot, 'directives')
export const enumsRoot = resolve(pkgRoot, 'enums')
export const hooksRoot = resolve(pkgRoot, 'hooks')
export const settingsRoot = resolve(pkgRoot, 'settings')
export const uiRoot = resolve(pkgRoot, 'tav-ui')
export const themeRoot = resolve(pkgRoot, 'theme-chalk')
export const utilsRoot = resolve(pkgRoot, 'utils')

// Docs
export const docsDirName = 'docs'
export const docRoot = resolve(projRoot, docsDirName)
export const vpRoot = resolve(docRoot, '.vitepress')

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist')
/** `/dist/xxx-ui` */
export const uiOutput = resolve(buildOutput, 'tav-ui')

export const projPackage = resolve(projRoot, 'package.json')
export const compPackage = resolve(compRoot, 'package.json')
export const directivesPackage = resolve(directivesRoot, 'package.json')
export const enumsPackage = resolve(enumsRoot, 'package.json')
export const hooksPackage = resolve(hooksRoot, 'package.json')
export const settingsPackage = resolve(settingsRoot, 'package.json')
export const uiPackage = resolve(uiRoot, 'package.json')
export const themePackage = resolve(themeRoot, 'package.json')
export const utilsPackage = resolve(utilsRoot, 'package.json')
export const docPackage = resolve(docRoot, 'package.json')
