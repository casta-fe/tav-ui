import { type ComputedRef, computed, ref, unref } from 'vue'
import { isFunction } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
import { type FileInjectedProps, type UploadFileListItem } from '../../../typings'
import { type FileTableProps } from '../types'
import { type UseDisableReturn, type UseLoadingReturn } from '../../../hooks'
import { DEFAULT_HTTP_ERROR_TIP } from '../../../consts'
import { type ArgumentsOf } from '../../../utils'

export function useRequest(options: {
  mergedProps: ComputedRef<FileInjectedProps & FileTableProps>
  setDisable: UseLoadingReturn['setLoading']
  setLoading: UseDisableReturn['setDisable']
}) {
  const resultRef = ref<UploadFileListItem[]>([])
  const errorRef = ref<string>('')
  const { mergedProps, setLoading, setDisable } = options

  async function handleApi() {
    const apiParams = mergedProps.value.apiParams
    const api = mergedProps.value.api
      ? mergedProps.value.api
      : mergedProps.value.apiReadFile
      ? mergedProps.value.apiReadFile
      : undefined
    const beforeApi = mergedProps.value.beforeApi
    const afterApi = mergedProps.value.afterApi

    if (!api || !isFunction(api)) return

    setLoading(true)
    setDisable(true)

    try {
      if (beforeApi && isFunction(beforeApi)) {
        const beforeApiResult = await beforeApi(apiParams)
        if (!beforeApiResult) return
      }

      // 因为每个后端接口接受同字段属性的属性名都不一致，前端抹平后按照 swagger 文档进行兼容
      const params: ArgumentsOf<FileInjectedProps['apiReadFile']>[0] = {
        appId: apiParams.appId,
        moduleCode: apiParams.moduleCodes?.at(-1) ?? '',
        typeCode: apiParams.typeCodes?.at(-1) ?? '',
        businessId: apiParams.businessIds?.at(-1) ?? '',
        businessKey: apiParams.businessKeys?.at(-1) ?? '',
      }

      const apiResult = await api(params)

      if (apiResult.data && apiResult.success) {
        resultRef.value = apiResult.data
        errorRef.value = ''

        if (afterApi && isFunction(afterApi)) {
          resultRef.value = (await afterApi(apiResult.data)) || apiResult.data
          errorRef.value = ''
        }
      } else {
        resultRef.value = []
        errorRef.value = DEFAULT_HTTP_ERROR_TIP(tavI18n)
      }
    } catch (error: any) {
      resultRef.value = []
      errorRef.value = DEFAULT_HTTP_ERROR_TIP(tavI18n)
    } finally {
      setLoading(false)
      setDisable(false)
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
