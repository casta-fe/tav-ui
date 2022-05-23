import { round } from 'lodash-es'

/**
 * @param number 要格式化的数字
 * @param decimals 保留几位小数
 * @param decPoint 小数点符号
 * @param thousandsSep 千分位符号
 * @returns formattedNumber
 */
export function formatNumber(
  number: number | string,
  decimals: number | 'auto' = 2,
  decPoint = '.',
  thousandsSep = ','
): string {
  if (null === number) {
    return '-'
  } else if (undefined === number) {
    return number
  }
  number = `${number}`.replace(/[^0-9+-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  const toFixedFix = (n, prec) => {
    const k = 10 ** prec
    return `${round(n * k) / k}`
  }
  let prec
  // auto 最小2位 最大8位
  if (decimals == 'auto') {
    const arr = n.toString().split('.')
    if (arr[1] == undefined || arr[1].length < 2) {
      prec = 2
    } else if (arr[1].length > 6) {
      prec = 6
    } else {
      prec = arr[1].length
    }
  } else {
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  }
  const s = toFixedFix(n, prec).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, `$1${thousandsSep}$2`)
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(decPoint)
}
