import { ProvinceCityRecord, formatNumber, formatToDate, isArray, isString } from '@tav-ui/utils'
import type { VxeGlobalRendererHandles } from 'vxe-table'

function number({ cellValue }, format = 2) {
  return formatNumber(cellValue, format)
}
function date({ cellValue }, format = 'YYYY-MM-DD') {
  return formatToDate(cellValue, format)
}
function geo({ cellValue, row }, noDistrict = true, joinChar = '-') {
  const res: string[] = []

  if (!row) return ''
  const { province = cellValue, city, district } = row
  /**
   * 直辖市
   */
  const IS_TWO_LEVEL = province == city

  // #region province
  if (!province) {
    return ''
  }

  ProvinceCityRecord[province] && res.push(ProvinceCityRecord[province])
  // 直辖市不重复 市: 北京-北京市-东城区 -> 北京市-东城区
  if (city && !IS_TWO_LEVEL) {
    ProvinceCityRecord[city] && res.push(ProvinceCityRecord[city])
  }
  if (district && !noDistrict) {
    ProvinceCityRecord[district] && res.push(ProvinceCityRecord[district])
  }

  return res.join(joinChar)
}

export const formats = {
  number,
  date,
  geo,
}

export function useFormats(params: VxeGlobalRendererHandles.RenderEditParams): string | void {
  const { row, column } = params
  const formatter = column.params?.formatter

  if (formatter) {
    let formatFn: undefined | ((...args: any[]) => any) = undefined
    let formatterArgs: any[] = []

    if (isString(formatter)) {
      formatFn = formats[formatter]
    } else if (isArray(formatter)) {
      const [name, ...args] = formatter
      formatFn = formats[name]
      formatterArgs = args
    }

    return formatFn?.({ cellValue: row[column.field], ...params }, ...formatterArgs)
  }
}