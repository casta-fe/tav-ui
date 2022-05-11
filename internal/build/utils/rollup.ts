import chalk from 'chalk'
import consola from 'consola'
import { getPackageDependencies, uiPackage } from '../helper'
import type { OutputOptions, RollupBuild, RollupWarning } from 'rollup'

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(uiPackage)

  return (id: string) => {
    const packages: string[] = peerDependencies
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }

    return [...new Set(packages)].some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

export function formatBundleFilename(name: string, minify: boolean, ext: string) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}

export function onwarn(warning: RollupWarning) {
  const { code, message } = warning
  // 确定是引用的类库报错后可以在这里屏蔽
  const HideWarningCodes = ['UNUSED_EXTERNAL_IMPORT', 'CIRCULAR_DEPENDENCY', 'THIS_IS_UNDEFINED']
  if (HideWarningCodes.some((warningCode) => warningCode === code)) {
    return
  }
  consola.info(`rollup report: ${chalk.grey(`${code}`)} , \n message is: ${message}`)
}
