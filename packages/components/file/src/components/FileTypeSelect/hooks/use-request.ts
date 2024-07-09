import { type ComputedRef, computed, ref, unref } from 'vue'
import { isFunction, isObject } from '@tav-ui/utils/is'
import { type ApiParams } from '../../../typings'
import { type FileTypeSelectProps } from '../types'
import { type UseDisableReturn, type UseLoadingReturn } from '../../../hooks'
import { RequestErrorTip } from '../../../consts'

export function useRequest(options: {
  apiParams: ComputedRef<Required<ApiParams>['apiParams']>
  api: ComputedRef<FileTypeSelectProps['api']>
  beforeApi: ComputedRef<FileTypeSelectProps['beforeApi']>
  afterApi: ComputedRef<FileTypeSelectProps['afterApi']>
  setDisable: UseLoadingReturn['setLoading']
  setLoading: UseDisableReturn['setDisable']
}) {
  const resultRef = ref<Record<string, any>[]>([])
  const errorRef = ref<string>('')
  const { apiParams, api, beforeApi, afterApi, setLoading, setDisable } = options

  let params = apiParams.value
  const apiFunc = api.value
  const beforeApiFunc = beforeApi.value
  const afterApiFunc = afterApi.value

  async function handleApi() {
    if (!apiFunc || !isFunction(apiFunc)) return

    setLoading(true)
    setDisable(true)

    if (beforeApiFunc && isFunction(beforeApiFunc)) {
      const beforeApiResult = await beforeApiFunc(params)
      if (!isObject(beforeApiResult) && !!beforeApiResult === false) {
        // 如果返回值不是对象并且转为布尔为 false 则直接返回
        return
      } else {
        // 如果返回值为对象则覆盖 api 参数
        params = { ...params, ...beforeApiResult }
      }
    }

    const apiResult = await apiFunc(params)
    console.log(apiResult)

    if (apiResult.data && apiResult.success) {
      resultRef.value = apiResult.data
      errorRef.value = ''
    } else {
      resultRef.value = []
      errorRef.value = RequestErrorTip
    }

    setLoading(false)
    setDisable(false)
  }

  const result = computed(() => unref(resultRef))
  const error = computed(() => unref(errorRef))

  return {
    result,
    error,
    handleApi,
  }
}
