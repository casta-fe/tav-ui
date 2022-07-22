import { formatNumber, formatToDate } from '@tav-ui/utils'
import { ProvinceCityOptions } from '@tav-ui/utils/geo'
import { isArray, isString } from '@tav-ui/utils/is'
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

  const provinceItem = ProvinceCityOptions.find((el) => province == el.value)
  if (!provinceItem) return ''
  // #endregion

  // 直辖市不重复 市
  IS_TWO_LEVEL || res.push(provinceItem.label)

  // #region city
  if (!city) return res.join(joinChar)

  const cityItem = provinceItem?.children?.find((el) => city == el.value)
  if (!cityItem) return res.join(joinChar)
  // #endregion

  res.push(cityItem.label)

  // #region district
  // 北京-北京市-东城区 -> 北京市-东城区
  if (!district || (noDistrict && !IS_TWO_LEVEL)) return res.join(joinChar)

  const districtItem = cityItem?.children?.find((el) => district == el.value)
  if (!districtItem) return res.join(joinChar)
  // #endregion

  res.push(districtItem.label)

  return res.join(joinChar)
}

export const formats = {
  number,
  date,
  geo,
}

export function useFormats(params: VxeGlobalRendererHandles.RenderEditParams): string | void {
  const { row, column } = params
  if (column.formatter) {
    let formatFn: undefined | ((...args: any[]) => any) = undefined
    let formatterArgs: any[] = []

    if (isString(column.formatter)) {
      formatFn = formats[column.formatter]
    } else if (isArray(column.formatter)) {
      const [name, ...args] = column.formatter
      formatFn = formats[name]
      formatterArgs = args
    }

    return formatFn?.({ cellValue: row[column.field], ...params }, ...formatterArgs)
  }
}
