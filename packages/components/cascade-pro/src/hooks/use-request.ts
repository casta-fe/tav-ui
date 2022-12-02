import { computed, ref, unref } from 'vue'
import { debounce } from 'lodash-es'
import { DebounceDely, RequestErrorTip } from '../constants'
import type {
  CascadeProOption,
  ISearchData,
  IUseFieldRequest,
  IUseSelectRecordsReturn,
} from '../types'

/** 缓存 */
const CASCADE_PRO_CACHE: Map<string, any> = new Map()

/**
 * 根据得到的 fields 数据与当前选中数据，把当前数据的所有父级取出来，放入selectrecords 方便做选中状态处理
 *
 * @param records
 */
const handleSelectRecordsAfterGetFields = (
  records: CascadeProOption[][],
  selectRecord: CascadeProOption,
  idPathSplitResult: string[],
  setSelectRecords: IUseSelectRecordsReturn['setSelectRecords'],
  type: 'init' | 'normal'
) => {
  if (type === 'init') {
    setSelectRecords([], 'recover')
  } else {
    const allParentRecords: CascadeProOption[] = []
    for (let i = 0; i < idPathSplitResult.length - 1; i++) {
      const options = records[i]
      const parentRecord = options.find((option) => option.id === idPathSplitResult[i])
      parentRecord && allParentRecords.push(parentRecord)
    }

    if (allParentRecords.length > 0) {
      setSelectRecords([...allParentRecords, unref(selectRecord)], 'normal')
    } else {
      setSelectRecords([unref(selectRecord)], 'normal')
    }
  }
}

/**
 * 排序，默认降序
 *
 * @param options
 * @returns
 */
function getFirstLetterSortedOptions(options: CascadeProOption[]) {
  return options.sort((a, b) => {
    const nameA = a.firstLetter?.toUpperCase()
    const nameB = b.firstLetter?.toUpperCase()
    if (nameA && nameB) {
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
    }
    return 0
  })
}

function handleOptionsWithFirstLetterVisible(options: CascadeProOption[]) {
  const handledFirstLetterSort = getFirstLetterSortedOptions(options)
  const firstLetters = [
    ...new Set(handledFirstLetterSort.map((option) => option.firstLetter)),
  ] as string[]
  const firstLettersMap = firstLetters.reduce((result, cur) => {
    result[cur] = 0
    return result
  }, {} as Record<string, number>)
  const groupByFirstLetterOptions = handledFirstLetterSort.map((option) => {
    const { firstLetter } = option
    if (firstLettersMap[firstLetter!] === 0) {
      firstLettersMap[firstLetter!]++
      return { ...option, firstLetterGroup: firstLetter }
    } else {
      return { ...option, firstLetterGroup: '' }
    }
  })

  return groupByFirstLetterOptions
}

function searchData(param: ISearchData): CascadeProOption[][] | null {
  const firstLetterVisible = unref(param.firstLetterVisible)
  const { id, pid, fieldIndex, idPathSplitResult } = unref(param.selectRecordFibers)
  const tree = unref(param.options).tree

  // 初始化 selectRecord idPath = ''
  if (id === '' && pid === '' && fieldIndex === 0) {
    if (firstLetterVisible) {
      if (!CASCADE_PRO_CACHE.has(unref(param.id))) {
        CASCADE_PRO_CACHE.set(unref(param.id), {
          firstFieldFirstLetterResult: handleOptionsWithFirstLetterVisible(tree),
        })
      }
      const cache = CASCADE_PRO_CACHE.get(unref(param.id))

      handleSelectRecordsAfterGetFields(
        [cache['firstFieldFirstLetterResult']],
        unref(param.selectRecord),
        idPathSplitResult,
        param.setSelectRecords,
        'init'
      )
      return [cache['firstFieldFirstLetterResult']]
    } else {
      handleSelectRecordsAfterGetFields(
        [tree],
        unref(param.selectRecord),
        idPathSplitResult,
        param.setSelectRecords,
        'init'
      )
      return [tree]
    }
  } else {
    const currentFieldLength = idPathSplitResult.length

    // 取下一级
    const nextFieldLength = currentFieldLength + 1

    const records: CascadeProOption[][] = []
    for (let i = 0; i < nextFieldLength; i++) {
      if (i === 0) {
        if (firstLetterVisible) {
          if (!CASCADE_PRO_CACHE.has(unref(param.id))) {
            CASCADE_PRO_CACHE.set(unref(param.id), {
              firstFieldFirstLetterResult: handleOptionsWithFirstLetterVisible(tree),
            })
          }
          const cache = CASCADE_PRO_CACHE.get(unref(param.id))

          records.push(cache['firstFieldFirstLetterResult'])
        } else {
          records.push(tree)
        }
      } else {
        // 回溯 TODO 能否cache优化？
        const currentOptions = records[i - 1].find(
          (option) => option.id === idPathSplitResult[i - 1]
        )?.children
        records.push(currentOptions!)
      }
    }

    const response = records.filter(Boolean)
    handleSelectRecordsAfterGetFields(
      response,
      unref(param.selectRecord),
      idPathSplitResult,
      param.setSelectRecords,
      'normal'
    )
    return response
  }
}

/**
 * 根据当前点击，获取即将渲染的数据
 *
 * @param param
 * @returns
 */
export function useFieldRequest(param: IUseFieldRequest) {
  const resultRef = ref<CascadeProOption[][]>([])
  const errorRef = ref<string>('')

  const onClick = (selected: CascadeProOption) => {
    const selectRecord = selected
    param.setSelectRecord(selectRecord)
    param.setLoading(true)

    const response = searchData({
      firstLetterVisible: param.firstLetterVisible,
      selectRecord: param.selectRecord,
      setSelectRecords: param.setSelectRecords,
      selectRecordFibers: param.selectRecordFibers,
      options: param.options,
      id: param.id,
    })
    if (Array.isArray(response)) {
      resultRef.value = response
      errorRef.value = ''
    } else if (response === null) {
      // 返回 null 什么都不做
    } else {
      resultRef.value = []
      errorRef.value = RequestErrorTip
    }
    param.setLoading(false)
  }

  if (param.immediate) {
    onClick(unref(param.selectRecord))
  }

  const result = computed(() => unref(resultRef))
  const error = computed(() => unref(errorRef))

  return {
    result,
    error,
    onClick: debounce(onClick, DebounceDely),
  }
}
