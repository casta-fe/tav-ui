import { type Ref, type WritableComputedRef, computed, ref, unref } from 'vue'
import { isBoolean, isFunction, isObject } from 'lodash-es'
import { tavI18n } from '@tav-ui/locales'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { DEFAULT_HTTP_ERROR_TIP } from '../consts'
import { type UseDisableReturn, type UseLoadingReturn } from './'

const { createMessage } = useMessage()

export interface UseRequestHandleApiDefaultOptions<T, K> {
  apiParams: T
  api?: (params: T) => Promise<{ data: K; [k: string]: any }>
  /** 返回 true 继续执行；返回 T 代表修改后的 apiparams，用其继续执行；返回其他则退出请求*/
  beforeApi?: (params: T) => Promise<T | boolean>
  afterApi?: (params: K) => Promise<any>
  /** 是否将参数全部转换为 formdata */
  transformApiParamsToFormData?: {
    ennabled: boolean
    fileFiledName: string
  }
  /** 成功提示 */
  successMessage?: (...args: any[]) => string
  /** 失败提示 */
  failureMessage?: (...args: any[]) => string
  /** 只用 success 判断接口成功，默认使用 success + data */
  useSuccessPassRes?: boolean
  callback?: () => void
}

export function useRequest(options: {
  setLoading: UseLoadingReturn['setLoading']
  setDisable: UseDisableReturn['setDisable']
  loading?: WritableComputedRef<Ref<boolean>>
  responseDataType?: 'object' | 'array'
}) {
  const resultRef = ref<any>([])
  const errorRef = ref<string>('')
  const { setLoading, setDisable, loading, responseDataType = 'array' } = options

  if (responseDataType === 'object') {
    resultRef.value = {}
  }

  async function handleApi<
    O extends Record<string, any>,
    T extends Record<string, any>,
    K extends Record<string, any> | Record<string, any>[]
  >(options: O & UseRequestHandleApiDefaultOptions<T, K>) {
    const {
      apiParams: _apiParams,
      api: _api,
      beforeApi: _beforeApi,
      afterApi: _afterApi,
      transformApiParamsToFormData: _transformApiParamsToFormData,
      successMessage: _successMessage,
      failureMessage: _failureMessage,
      callback: _callback,
      useSuccessPassRes: _useSuccessPassRes,
    } = options

    let apiParams = _apiParams
    let api = _api
    let beforeApi = _beforeApi
    let afterApi = _afterApi
    let transformApiParamsToFormData = _transformApiParamsToFormData
    let successMessage = _successMessage
    let failureMessage = _failureMessage
    let callback = _callback
    let useSuccessPassRes = _useSuccessPassRes

    if (!api || !isFunction(api)) return

    if (loading) {
      loading.value.value = true
    } else {
      setLoading(true)
    }
    setDisable(true)

    try {
      if (beforeApi && isFunction(beforeApi)) {
        const beforeApiResult = await beforeApi(apiParams)
        if (isObject(beforeApiResult)) {
          apiParams = beforeApiResult.apiParams
          api = beforeApiResult.api
          beforeApi = beforeApiResult.beforeApi
          afterApi = beforeApiResult.afterApi
          transformApiParamsToFormData = beforeApiResult.transformApiParamsToFormData
          successMessage = beforeApiResult.successMessage
          failureMessage = beforeApiResult.failureMessage
          callback = beforeApiResult.callback
          useSuccessPassRes = beforeApiResult.useSuccessPassRes
        }
        if (isBoolean(beforeApiResult) && beforeApiResult === false) {
          callback && callback()
          return
        }
      }

      let apiResult: { data: K; [k: string]: any }

      if (transformApiParamsToFormData) {
        // 组装数据
        const formData = new FormData()
        for (const [k, v] of Object.entries(apiParams as any)) {
          if (k === transformApiParamsToFormData['fileFiledName']) {
            ;(v as File[]).forEach((file) => {
              formData.append(transformApiParamsToFormData!['fileFiledName'], file)
            })
          } else {
            formData.append(k, v as any)
          }
        }
        apiResult = await (api as unknown as (params: FormData) => Promise<any>)(formData)
      } else {
        apiResult = await api!(apiParams)
      }

      const apiSuccess = useSuccessPassRes ? apiResult.success : apiResult.data && apiResult.success
      if (apiSuccess) {
        resultRef.value = apiResult.data
        errorRef.value = ''

        successMessage && createMessage.success(successMessage())

        if (afterApi && isFunction(afterApi)) {
          resultRef.value = (await afterApi(apiResult.data)) || apiResult.data
          errorRef.value = ''
        }
      } else {
        resultRef.value = []
        errorRef.value = failureMessage ? failureMessage() : DEFAULT_HTTP_ERROR_TIP(tavI18n)
      }
    } catch (error: any) {
      resultRef.value = []
      errorRef.value = failureMessage ? failureMessage() : DEFAULT_HTTP_ERROR_TIP(tavI18n)
      createMessage.error(failureMessage ? failureMessage() : DEFAULT_HTTP_ERROR_TIP(tavI18n))
    } finally {
      if (loading) {
        loading.value.value = false
      } else {
        setLoading(false)
      }
      setDisable(false)
      callback && callback()
    }
  }

  const result = computed(() => unref(resultRef))
  const error = computed(() => unref(errorRef))

  return {
    result,
    error,
    handleApi,
  }
}
