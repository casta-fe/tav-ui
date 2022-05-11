/**
 * 打包样式
 * 安装相关依赖
 * pnpm install gulp-sass @types/gulp-sass @types/sass gulp-autoprefixer @types/gulp-autoprefixer @types/gulp-clean-css gulp-clean-css -w -D
 * gulp-autoprefixer:添加样式前缀  gulp-clean-css：压缩css
 */
/**
 * gulp是类似一个管道的方式执行，从入口开始到出口，中间一步步执行
 */
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

/**
 * 处理font文件
 */
// function copyFonts() {
//   // 从src下单fonts文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的font目录
//   return src(path.resolve(__dirname, "./src/fonts/**")).pipe(cleanCss()).pipe(dest("./dist/fonts"));
// }
// function copyLess() {
//   // 从src下单src文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的less目录
//   return src(path.resolve(__dirname, "./src/**")).pipe(dest("./dist/less"));
// }
/**
 * 把打包好的css输出到根目录的dist
 */
function copyCss() {
  const rootDistPath = path.resolve(__dirname, '../../dist/theme-chalk')
  return src(path.resolve(__dirname, './dist/**')).pipe(dest(rootDistPath))
}

function copyLess() {
  const rootDistPath = path.resolve(__dirname, '../../dist/theme-chalk/src')
  return src(path.resolve(__dirname, './src/**')).pipe(dest(rootDistPath))
}

// export default series(compileLess, copyFonts, copyCss);
// copyLess,
export default series(compileLess, copyCss, copyLess)
