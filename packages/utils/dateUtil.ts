/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(date: dayjs.Dayjs | string, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format)
}

export function formatToDate(date: dayjs.Dayjs | string, format = DATE_FORMAT): string {
  return date ? dayjs(date).format(format) : ''
}

export function formatToTimestamp(date: string, format = DATE_TIME_FORMAT): number {
  return dayjs(date, format).valueOf()
}

export function formatToExcelTime(date: string): number {
  const timeStamp = formatToTimestamp(date)
  return (timeStamp / 1000 + 8 * 3600) / 86400 + 70 * 365 + 19
}

export const dateUtil = dayjs

export function getMomentFormatString(date, valueFormat = DATE_FORMAT) {
  // 通过defaultvalue传入的是moment对象要把原本的值取出来
  if (dayjs.isDayjs(date)) return date.format(valueFormat)
  if (typeof date === 'string' && !(date.includes('T') || date.includes('Z'))) {
    // 通过组件选择出来的是处理好的string
    return date
  } else {
    // 通过 defaultvalue 设置time，直接通过validate获得的是iso时间，需要moment转回字符串
    return formatToDate(date, valueFormat)
  }
}
