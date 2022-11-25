import { ProvinceCityOptions } from '@tav-ui/utils'
import type { CascadeProOption } from '../types'

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_OPTIONS: any[] = ProvinceCityOptions

export const DEFAULT_CASCADE_PRO_OPTIONS_KEY_CONFIG: Record<string, any> = {
  name: 'label',
  id: 'value',
  children: 'children',
  pid: 'pid',
}

/** 默认为地址数据 */
export const DEFAULT_HOT: string[] = ['北京', '上海', '广州', '深圳', '天津', '杭州']

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_PLACEHOLDER = '请输入地址'

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_TITLE = '地址选择'

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_FIRST_LETTER_TITLE = '首字母：'

/**
 * 通过option list遍历匹配传入的热门地区，支持外部传入自定义逻辑.
 *
 * 这里默认为地址的逻辑：需要注意的是这里根据名字匹配，如果重名只取第一个；如果是直辖市或者特别行政区直接返回。
 *
 * @param list
 * @param hotAddressNames
 */
export function getHotAddressNames(list: CascadeProOption[], hotAddressNames: string[]) {
  return hotAddressNames.map((hot) => {
    const result = list.filter((item) => item.name.indexOf(hot) > -1)
    const hasMunicipalities = result.find((item) => item.isIdSameAsOnlyOneChild)
    if (hasMunicipalities) {
      return hasMunicipalities
    } else {
      return result[0]
    }
  })
}

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_FIELDS = ['province', 'city', 'district']

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_FIRST_LETTER_FIELDS = ['province', 'city', 'district']
