import { computed } from 'vue'
// import { clone } from 'xe-utils'
import type { Handler } from './main'
import type { FileItemType, LabelValueOptions, Recordable } from './types'

/**
 * ***begin***
 * ```javascript
 * <TaUpload @register="register" />
 *
 * const { register, getHandler } = useHandlerInOuter();
 *
 * getHandler().backfill()
 *
 * return {
 *   register
 * }
 * ```
 * ***end***
 * @returns hooks
 */
export const useHandlerInOuter = () => {
  let outerHandler: Handler

  const register = (handler: Handler) => {
    outerHandler = handler
  }

  const getHandler = () => {
    if (!outerHandler) {
      console.error("no register, handler it's undefined\ntry onMounted & nextTick")
    }
    return outerHandler
  }

  const backfill = () => getHandler()?.backfill()

  const clearResponse = () => getHandler()?.clearResponse()

  return { register, backfill, getHandler, clearResponse }
}

export const useFileTypeCode = (fileTypeCode: Recordable<LabelValueOptions<string, any>>) => {
  /**
   * **用typeCode数组,匹配文件类型的选项**
   * @param {string[]} typeCodeArray
   * @returns {LabelValueOptions} LabelValueOptions
   */
  const getOptionsByTypeCodes = (typeCodeArray: string[]) =>
    computed(() => {
      const options: LabelValueOptions<string> = []
      const typeCodeArraySet = [...new Set(typeCodeArray)]
      for (const key in fileTypeCode) {
        options.push(...fileTypeCode[key].filter((el) => typeCodeArraySet.includes(el.value)))
      }
      return options
    })

  /**
   * **用前缀匹配module下的typeCodeArray**
   * @param prefix string
   * @returns {LabelValueOptions} LabelValueOptions
   */
  const getOptionsByModuleCodePrefix = (prefix: string | string[]) => {
    if (!Array.isArray(prefix)) {
      prefix = [prefix]
    }
    const onlyPrefix = [...new Set(prefix)]
    const moduleCodes: string[] = []
    onlyPrefix.forEach((prefix) => {
      moduleCodes.push(...Object.keys(fileTypeCode).filter((el) => el.startsWith(prefix)))
    })
    return getOptionsByModuleCode(moduleCodes as string[])
  }

  /**
   * @param moduleCode
   * @returns {LabelValueOptions} LabelValueOptions
   */
  const getOptionsByModuleCode = (moduleCode: string | string[]) =>
    Array.isArray(moduleCode)
      ? [...new Set(moduleCode)].map((el) => fileTypeCode[el]).reduce((x, y) => x.concat(y), [])
      : fileTypeCode[moduleCode]

  /**
   * @param moduleCode
   * @param typeCodeArray
   * @param moduleCodePrefix
   * @returns {LabelValueOptions} LabelValueOptions
   */
  const mergeOptions = (
    moduleCode?: string | string[],
    typeCodeArray?: string[],
    moduleCodePrefix?: string | string[]
  ) => {
    const options = ((moduleCode && getOptionsByModuleCode(moduleCode)) || ([] as any[]))
      .concat(undefined !== typeCodeArray ? getOptionsByTypeCodes(typeCodeArray).value : [])
      .concat(undefined !== moduleCodePrefix ? getOptionsByModuleCodePrefix(moduleCodePrefix) : [])
    if (!(options && options.length)) {
      return []
    }
    const result: LabelValueOptions<string> = []
    options.forEach((el) => {
      if (
        el &&
        !result.some((resItem) => resItem.value === el.value && resItem.label === el.label)
      ) {
        result.push(el)
      }
    })

    return result
  }

  return {
    mergeOptions,
    getOptionsByTypeCodes,
    getOptionsByModuleCode,
    getOptionsByModuleCodePrefix,
  }
}

/**
 * 操作列按钮所需要的最大列宽度
 * @param arr ${string[]}
 * @param param1 config { margin=40, fontSize=12, appendWidth=10 }
 * @returns maxWidth ${number}
 */
export function getActionColumnMaxWidth(
  arr: string[],
  {
    margin = 17,
    fontSize = 12,
    appendWidth = 10,
  }: {
    margin?: number
    fontSize?: number
    appendWidth?: number
  } = {}
) {
  // TableAction 组件最多展示3个按钮, 间距为 20+20
  let l = 0
  arr.sort((x, y) => y.length - x.length)
  const _arr = arr.splice(0, 3)
  for (const str of _arr) {
    const [text, dots] = str.split('..')
    l += text.length * fontSize
    if (dots) {
      l += 2 * 4
    }
    l += margin
  }
  l += appendWidth * 2
  return l
}

export type UseFileFormatterParamsType = {
  /**
   * 更新时保存多少文件历史版本
   *
   * `"newest"` 仅保留最后一次更新
   *
   * `"all"` 保留当前版本往后所有更新
   * @default "newest"
   */
  fileVersionCount?: 'newest' | 'all'
}

export function useFileFormatter({ fileVersionCount = 'newest' }: UseFileFormatterParamsType = {}) {
  const versionRecord: Partial<Recordable<FileItemType[]>> = {}

  function upadteVersion(file: FileItemType) {
    if (fileVersionCount === 'newest') {
      if (versionRecord[file.actualId!]) {
        file.version = versionRecord[file.actualId!]![0].version + 1
        versionRecord[file.actualId!]![1] = file
      } else {
        versionRecord[file.actualId!] = [file]
      }

      return
    }

    if (versionRecord[file.actualId!]) {
      // 维护文件唯一性
      if (versionRecord[file.actualId!]?.some((el) => file.id === el.id)) return

      versionRecord[file.actualId!]!.push(file)
    } else {
      versionRecord[file.actualId!] = [file]
    }
  }

  function formatToApi(files: FileItemType[]) {
    const currentFileActualIds: string[] = []

    for (const file of files) {
      upadteVersion(file)

      currentFileActualIds.push(file.actualId!)
    }

    for (const actualId in versionRecord) {
      // 有删除操作时
      currentFileActualIds.includes(actualId) || Reflect.deleteProperty(versionRecord, actualId)
    }

    // const cloneVersionRecord = clone(versionRecord, true)
    // versionRecord = {}

    return Object.keys(versionRecord).map((k) => ({
      actualId: k,
      moduleCode: versionRecord[k]![0].moduleCode,
      versionList: versionRecord[k],
    }))
  }

  return { formatToApi, upadteVersion }
}
