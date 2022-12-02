import { computed, ref, unref } from 'vue'
import type { CascadeProOption, IUseSelectRecord, IUseSelectRecordReturn } from '../types'

/**
 * 设置当前选中的数据（一条）
 *
 * @returns
 */
export function useSelectRecord(param: IUseSelectRecord): IUseSelectRecordReturn {
  const selectRecordRef = ref<CascadeProOption>(unref(param.defaultValue).selectRecord)
  const selectRecord = computed(() => unref(selectRecordRef))

  const selectRecordFibersRef = ref<{
    id: string
    pid: string
    fieldIndex: number
    idPathSplitResult: string[]
  }>({
    id: '',
    pid: '',
    fieldIndex: 0,
    idPathSplitResult: [],
  })

  const selectRecordFibers = computed(() => unref(selectRecordFibersRef))

  function setSelectRecord(selectRecord: CascadeProOption) {
    setSelectRecordFibers(selectRecord.idPath)
    selectRecordRef.value = {
      ...selectRecord,
      fieldIndex: unref(selectRecordFibers).fieldIndex,
    }
  }

  function setSelectRecordFibers(selectRecordIdPath: string | undefined) {
    const idPath = unref(selectRecordIdPath)
    const fields = unref(param.fields)
    if (!idPath) {
      selectRecordFibersRef.value = {
        id: '',
        pid: '',
        fieldIndex: 0,
        idPathSplitResult: [],
      }
    } else {
      const result = idPath.split('-')

      if (result.length > fields.length) {
        console.warn('CascadePro handleOptions has error.')
        selectRecordFibersRef.value = {
          id: '',
          pid: '',
          fieldIndex: 0,
          idPathSplitResult: [],
        }
      }

      if (result.length === 1) {
        if (result[0] === '') {
          selectRecordFibersRef.value = {
            id: '',
            pid: '',
            fieldIndex: 0,
            idPathSplitResult: [],
          }
        } else {
          selectRecordFibersRef.value = {
            id: result[0],
            pid: '',
            fieldIndex: 0,
            idPathSplitResult: result,
          }
        }
      } else {
        selectRecordFibersRef.value = {
          id: result[result.length - 1],
          pid: result[result.length - 1 - 1],
          fieldIndex: result.length - 1,
          idPathSplitResult: result,
        }
      }
    }
  }

  return { selectRecord, setSelectRecord, selectRecordFibers /*, setSelectRecordFibers*/ }
}
