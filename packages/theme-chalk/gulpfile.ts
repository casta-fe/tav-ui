import path from 'path'
import chalk from 'chalk'
import consola from 'consola'
import { dest, series, src } from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import less from 'gulp-less'

function compileLess() {
  return src(path.resolve(__dirname, './src/*.less'))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(dest('./dist'))
}

function copyCss() {
  const rootDistPath = path.resolve(__dirname, '../../dist/tav-ui/theme-chalk')
  return src(path.resolve(__dirname, './dist/**')).pipe(dest(rootDistPath))
}

function copyLess() {
  const rootDistPath = path.resolve(__dirname, '../../dist/tav-ui/theme-chalk/src')
  return src(path.resolve(__dirname, './src/**')).pipe(dest(rootDistPath))
}

export default series(compileLess, copyCss, copyLess)
