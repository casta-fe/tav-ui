import { isArray, isObject, isString } from '@tav-ui/utils/is'
import { DEFAULT_CONFIG } from '../components/tags'
import type { TableProTagsConfig } from '../typings'

/**
 * 对 tags 传入的 data 做处理
 *
 * @param data
 * @param label
 * @returns
 */
export function transformTagsData(
  data: Record<string, any>[] | Record<string, any> | string | null | undefined,
  tagConfig: TableProTagsConfig
) {
  const getConfig = Object.assign({}, DEFAULT_CONFIG, tagConfig)
  const label = getConfig.label!
  let tagList: Record<string, any>[] = []
  if (isString(data)) {
    tagList = data.split(',').map((v) => {
      return {
        [label]: v,
      }
    })
  } else if (isArray(data)) {
    tagList = [...data]
  } else if (isObject(data)) {
    tagList = [data]
  }
  return tagList
}

export function getTagsContent(
  data: Record<string, any>[] | Record<string, any> | string | null | undefined,
  tagConfig: TableProTagsConfig
) {
  const tags = transformTagsData(data, tagConfig)
  const getConfig = Object.assign({}, DEFAULT_CONFIG, tagConfig)
  const label = getConfig.label!
  return tags.map((tag) => tag[label]).join('，')
}
