import pinyin from 'js-pinyin'
import type { CascadeProOption } from '../types'

/**
 * 获取汉字拼音首字母
 *
 * @param name
 * @param idx 第几位，默认为 0
 * @returns
 */
export function getLetter(name: string | undefined, idx = 0): string {
  if (!name) return 'Z' // 无值则归属最后一个字母
  if (name.indexOf('重庆') > -1) return 'C' // 多音字修正
  return pinyin.getCamelChars(name)[idx]
}

export function createGroupOptions(level: number) {
  const cache = [] as any[]
  for (let i = 0; i < level; i++) {
    cache[i] = []
  }
  return cache as CascadeProOption[][]
}

const DEFAULT_CONFIG = {
  name: 'name',
  id: 'id',
  children: 'children',
  pid: 'pid',
}

type TreeHelperConfig = typeof DEFAULT_CONFIG

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config)

/**
 * 重新生成地址信息，原数据依赖于 geo.ts 中的 ProvinceCityOptions。目前只支持三级联动（省-市-区）
 *
 * @param tree 原始数据
 * @param deleteParentChildren
 * @returns
 */

/**
 * 重新生成组件所需数据，默认options原数据为地址数据，依赖于 geo.ts 中的 ProvinceCityOptions。目前只支持三级联动（省-市-区）
 *
 * @param options props 中传入 options 原始数据
 * @param keyConfig
 * @param fieldLength 即 fields.length
 * @param isFirstLetterVisible
 * @returns
 */
export function handleOptions(
  options: any[],
  keyConfig,
  fieldLength,
  isFirstLetterVisible
): {
  tree: CascadeProOption[]
  group: CascadeProOption[][]
  list: CascadeProOption[]
} {
  /** 处理后的原始数据 */
  const treeOptions: CascadeProOption[] = []
  /** 根据 fields 分组后的数据 */
  const groupOptions: CascadeProOption[][] = createGroupOptions(fieldLength)
  /** 扁平化数据 */
  const listOptions: CascadeProOption[] = [] // TODO 删掉 children 减少内存做优化

  if (fieldLength <= 0)
    return {
      tree: treeOptions,
      group: groupOptions,
      list: listOptions,
    }

  /** 根据 level 创建二维数组数据，一层代表一个field */
  let level = 0
  /** 处理数据 */
  const conf = getConfig(keyConfig) as TreeHelperConfig
  const { name, id, children } = conf

  function handler(
    options: any[],
    tree: any[],
    group: any[],
    list: any[],
    pid = '',
    idPath = '',
    namePath = ''
  ) {
    for (let i = 0; i < options.length; i++) {
      const temp = {
        ...options[i],
        name: options[i][name],
        id: options[i][id],
        pid: pid ? pid : '',
        idPath: idPath ? `${idPath}-${options[i][id]}` : options[i][id],
        namePath: namePath ? `${namePath}-${options[i][name]}` : options[i][name],
        isIdSameAsOnlyOneChild:
          options[i][children] &&
          options[i][children].length &&
          options[i][children].length === 1 &&
          options[i][children][0][id] === options[i][id]
            ? true
            : false,
      }

      if (isFirstLetterVisible) {
        temp['firstLetter'] = getLetter(options[i][name])
      }

      level = temp.idPath.split('-').length - 1

      if (level <= fieldLength - 1) {
        if (options[i][children] && options[i][children].length) {
          temp['children'] = []
          tree.push(temp)

          group[level].push(temp)

          list.push(temp)

          handler(
            options[i][children],
            temp['children'],
            group,
            list,
            temp.id,
            temp.idPath || temp.id,
            temp.namePath || temp.name
          )
        } else {
          tree.push(temp)

          group[level].push(temp)

          list.push(temp)
        }
      }

      if (i === options.length - 1 && level === fieldLength - 1) level = 0
    }
  }

  handler(options, treeOptions, groupOptions, listOptions)

  return {
    tree: treeOptions,
    group: groupOptions,
    list: listOptions,
  }
}

export const DEFAULT_CASCADE_PRO_SELECT_RECORD: CascadeProOption = {
  name: '',
  id: '',
  pid: '',
  idPath: '',
  namePath: '',
}

export const DEFAULT_CASCADE_PRO_SELECT_RECORDS: CascadeProOption[] = [
  DEFAULT_CASCADE_PRO_SELECT_RECORD,
]

/**
 * 后端以对象数组存储，对象中key顺序不固定，所以这里需要使用 fields 将其修改为组件内需要的数据结构
 *
 * @param defaultValue
 * @param fields
 * @returns
 */
export function getDefaultValue(
  defaultValue: any[],
  fields: string[]
): {
  selectRecord: CascadeProOption
  selectRecords: CascadeProOption[]
} {
  if (defaultValue && defaultValue.length > 0) {
    const selectRecords = defaultValue.map((option) => {
      let name = ''
      let id = ''
      let pid = ''
      let idPath = ''
      let namePath = ''

      for (let i = 0; i < fields.length; i++) {
        const key = fields[i]
        if (option[key]) {
          name = option[`${key}Name`]
          id = option[key]
          idPath = idPath ? `${idPath}-${option[key]}` : option[key]
          namePath = namePath ? `${namePath}-${option[`${key}Name`]}` : option[`${key}Name`]
        }
      }

      const idPathSplitResult = idPath.split('-')
      pid = idPathSplitResult[idPathSplitResult.length - 1 - 1]
        ? idPathSplitResult[idPathSplitResult.length - 1 - 1]
        : ''

      return {
        name,
        id,
        pid,
        idPath,
        namePath,
      }
    })
    const selectRecord = selectRecords.slice(-1)[0]
    return {
      selectRecord,
      selectRecords,
    }
  } else {
    return {
      selectRecord: DEFAULT_CASCADE_PRO_SELECT_RECORD,
      selectRecords: DEFAULT_CASCADE_PRO_SELECT_RECORDS,
    }
  }
}
