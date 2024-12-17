import { round, trimEnd } from 'lodash-es'
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

/**
 * @param number 要格式化的数字
 * @param chineseMultip 倍率，如果单位是万元的时候可以传10000
 * @returns string
 */
export function numberToChinese(num: number | string, chineseMultip = 1, max = 1e12) {
  if (isNullOrUnDef(num) || (typeof num === 'string' && /[^\d.]/.test(num))) {
    return ''
  }
  const number = chineseMultiply(Number(num), chineseMultip)
  if (number > max) {
    return '金额过大暂不支持'
  }
  const chineseNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const chineseUnits = [
    '',
    '拾',
    '佰',
    '仟',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '兆',
    '十',
    '百',
    '千',
    '京',
    '十',
    '百',
    '千',
    '垓',
    '十',
    '百',
    '千',
    '秭',
    '十',
    '百',
    '千',
    // '穣',
    // '沟',
    // '涧',
    // '正',
    // '载',
    // '极',
  ]
  const chineseDecimals = ['角', '分', '厘', '毫']
  // console.log(num,number)
  let result = ''
  if (number == 0) {
    return chineseNums[0]
  }

  const numStr = number.toString()
  const integerPart = numStr.split('.')[0]
  const decimalPart = numStr.split('.')[1] || ''

  // 处理整数部分
  const len = integerPart.length
  let useLastUni = false
  for (let i = 0; i < len; i++) {
    const digit = parseInt(integerPart[i])
    const unit = len - i - 1
    if (digit !== 0) {
      result += chineseNums[digit] + chineseUnits[unit]
    } else {
      // 处理连续的零，只添加一个零
      if (result[result.length - 1] !== chineseNums[0]) {
        const lastPart = integerPart.slice(i, integerPart.length - 1)
        // const usedPart = integerPart.slice(0, i)
        if (lastPart.length > 3 && Number(lastPart) === 0 && !useLastUni) {
          useLastUni = true
          result += chineseUnits[unit - (unit % 4)]
        } else {
          result += chineseNums[digit]
        }
      }
    }
  }

  // 处理小数部分
  const decimalLen = decimalPart.length
  if (decimalLen > 0) {
    result += '圆'
  }
  for (let i = 0; i < decimalLen; i++) {
    const digit = parseInt(decimalPart[i])
    if (digit !== 0) {
      result += chineseNums[digit] + (i < chineseDecimals.length ? chineseDecimals[i] : '')
    }
  }
  // if (result.endsWith('零')) {
  //   result = result.
  // }
  return trimEnd(result, '零')
}

export function numberToSimpleChinese(num: number): string {
  const numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千']
  const bigUnits = ['', '万', '亿']
  if (num < 0 || num >= 10e12) {
    console.warn('数字太大')
    return '-'
  }

  // 处理 0
  if (num === 0) return numbers[0]

  // 处理负数
  const isNegative = num < 0
  num = Math.abs(num)

  // 分离整数和小数部分
  const [integer, decimal] = num.toString().split('.')

  const convertSection = (section: number): string => {
    let result = ''
    let unitPos = 0
    let needZero = false

    while (section > 0) {
      const digit = section % 10
      if (digit === 0) {
        if (needZero) {
          result = numbers[0] + result
          needZero = false
        }
      } else {
        result = numbers[digit] + units[unitPos] + result
        needZero = true
      }
      unitPos++
      section = Math.floor(section / 10)
    }
    return result
  }

  // 处理整数部分
  let integerResult = ''
  let section = 0
  let sectionPos = 0
  let needZero = false
  let tmp = parseInt(integer)

  while (tmp > 0) {
    section = tmp % 10000
    if (section !== 0) {
      const sectionStr = convertSection(section)
      if (needZero) {
        integerResult = numbers[0] + integerResult
      }
      integerResult = sectionStr + (section === 0 ? '' : bigUnits[sectionPos]) + integerResult
      needZero = section < 1000 && section > 0
    }
    sectionPos++
    tmp = Math.floor(tmp / 10000)
  }

  // 处理特殊情况
  integerResult = integerResult.replace(/零+$/, '')
  integerResult = integerResult.replace(/零+/g, '零')
  integerResult = integerResult.replace(/零([万亿])/g, '$1')

  if (integerResult.startsWith('一十')) {
    integerResult = integerResult.substring(1)
  }

  // 处理小数部分
  let decimalResult = ''
  if (decimal) {
    decimalResult = '点'
    for (const digit of decimal) {
      decimalResult += numbers[parseInt(digit)]
    }
  }

  // 组合最终结果
  let result = ''

  // 添加负号
  if (isNegative) {
    result += '负'
  }

  // 添加整数和小数部分
  result += integerResult
  if (decimalResult) {
    result += decimalResult
  }

  return result || numbers[0]
}

export function add(arg1, arg2) {
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const c = Math.abs(r1 - r2)
  const m = 10 ** Math.max(r1, r2)
  if (c > 0) {
    const cm = 10 ** c
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}
export function subtract(arg1, arg2) {
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = 10 ** Math.max(r1, r2) //last modify by deeka //动态控制精度长度
  const n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
export function chineseMultiply(arg1: number, arg2: number) {
  let m = 0
  const s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m
}
export function divide(arg1, arg2) {
  let t1 = 0,
    t2 = 0

  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {}
  const r1 = Number(arg1.toString().replace('.', ''))
  const r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * 10 ** (t2 - t1)
}
