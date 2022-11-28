import { ProvinceCityOptions } from '@tav-ui/utils'
import { buildUUID } from '@tav-ui/utils/uuid'
import type { CascadeProOption } from '../types'

export function buildCascadeProId() {
  const uuid = buildUUID()
  return `TaCascadePro-${uuid}`
}

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_OPTIONS: any[] = ProvinceCityOptions

export const DEFAULT_CASCADE_PRO_OPTIONS_KEY_CONFIG: Record<string, any> = {
  name: 'label',
  id: 'value',
  children: 'children',
  pid: 'pid',
}

/** 默认为地址数据 */
// export const DEFAULT_HOT: string[] = ['陕西', '北京', '江苏', '上海', '广东']
export const DEFAULT_HOT: string[] = ['610000', '110000', '320000', '310000', '440000']

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_PLACEHOLDER = '请选择地址'

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_SEARCH_PLACEHOLDER = '请输入地址名称'

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_TITLE = '地址选择'

/** 默认为地址数据 */
export const DEFAULT_CASCADE_PRO_FIRST_LETTER_TITLE = '首字母：'

/**
 * 通过option list遍历匹配传入的热门地区，支持外部传入自定义逻辑.
 *
 * 这里默认为地址的逻辑：需要注意的是这里根据id匹配；如果是直辖市或者特别行政区直接返回。
 *
 * @param list
 * @param hots
 */
export function getHots(list: CascadeProOption[], hots: string[]) {
  return hots.map((hot) => {
    const result = list.filter((item) => item.id === hot)
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
