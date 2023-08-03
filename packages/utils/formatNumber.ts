import { round } from 'lodash-es'
import { isNullOrUnDef } from './is'

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
export function numberToChinese(number) {
  console.log(number)
  if (isNullOrUnDef(number)) {
    return ''
  }
  const chineseNums = ['零', '壹', '贰', '贰', '肆', '伍', '陆', '柒', '捌', '玖']
  const chineseUnits = [
    '',
    '拾',
    '佰',
    '仟',
    '万',
    '亿',
    '兆',
    '京',
    '垓',
    '秭',
    '穣',
    '沟',
    '涧',
    '正',
    '载',
    '极',
  ]
  const chineseDecimals = ['角', '分', '厘', '毫']

  let result = ''

  if (number === 0) {
    return chineseNums[0]
  }

  const numStr = number.toString()
  const integerPart = numStr.split('.')[0]
  const decimalPart = numStr.split('.')[1] || ''

  // 处理整数部分
  const len = integerPart.length
  for (let i = 0; i < len; i++) {
    const digit = parseInt(integerPart[i])
    const unit = len - i - 1

    if (digit !== 0) {
      result += chineseNums[digit] + chineseUnits[unit]
    } else {
      // 处理连续的零，只添加一个零
      if (result[result.length - 1] !== chineseNums[0]) {
        result += chineseNums[digit]
      }
    }
  }

  // 处理小数部分
  const decimalLen = decimalPart.length
  if (decimalLen > 0) {
    result += '。'
  }
  for (let i = 0; i < decimalLen; i++) {
    const digit = parseInt(decimalPart[i])
    if (digit !== 0) {
      result += chineseNums[digit] + (i < chineseDecimals.length ? chineseDecimals[i] : '')
    }
  }

  return result
}
