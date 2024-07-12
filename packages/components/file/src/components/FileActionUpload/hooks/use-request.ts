import { type ComputedRef, type Ref, computed, ref, unref } from 'vue'
import { isFunction } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { DEFAULT_HTTP_ERROR_TIP } from '../../../consts'
import { type FileInjectedProps } from '../../../typings'
import { type FileActionUploadProps, type FileType } from '../types'
import { type UseDisableReturn, type UseLoadingReturn } from '../../../hooks'
import { type ArgumentsOf } from '../../../utils'

const { createMessage } = useMessage()

export function useRequest(options: {
  mergedProps: ComputedRef<FileInjectedProps & FileActionUploadProps>
  setDisable: UseLoadingReturn['setLoading']
  setLoading: UseDisableReturn['setDisable']
  resetFileList: () => void
}) {
  const resultRef = ref<Record<string, any>[]>([])
  const errorRef = ref<string>('')
  const { mergedProps, setLoading, setDisable, resetFileList } = options

  async function handleApi(
    fileList: Ref<FileType[]>,
    fileldName: Exclude<FileActionUploadProps['name'], undefined> = mergedProps.value.name!
  ) {
    const apiParams = mergedProps.value.apiParams
    const api = mergedProps.value.api
      ? mergedProps.value.api
      : mergedProps.value.apiCreateFile
      ? mergedProps.value.apiCreateFile
      : undefined
    const beforeApi = mergedProps.value.beforeApi
    const afterApi = mergedProps.value.afterApi

    if (!api || !isFunction(api)) return

    setLoading(true)
    setDisable(true)

    try {
      if (beforeApi && isFunction(beforeApi)) {
        const beforeApiResult = await beforeApi(mergedProps.value.apiParams)
        if (!beforeApiResult) {
          resetFileList()
          return
        }
      }

      // 因为每个后端接口接受同字段属性的属性名都不一致，前端抹平后按照 swagger 文档进行兼容
      const params: ArgumentsOf<FileInjectedProps['apiCreateFile']>[0] = {
        files: fileList.value,
        moduleCode: apiParams.moduleCodes?.at(-1) ?? '',
        typeCode: apiParams.typeCodes?.at(-1) ?? '',
        businessId: apiParams.businessIds?.at(-1) ?? '',
        businessKey: apiParams.businessKeys?.at(-1) ?? '',
        appId: apiParams.appId,
      }

      // 组装数据
      const formData = new FormData()
      for (const [k, v] of Object.entries(params)) {
        if (k === 'files') {
          ;(v as File[]).forEach((file) => {
            formData.append(fileldName, file)
          })
        } else {
          formData.append(k, v as any)
        }
      }
      // if (!this._immediate && ['businessId', 'businessKey'].includes(k)) continue // TODO: ???

      const apiResult = await (api as (params: FormData) => Promise<any>)(formData)

      // if (apiResult.data && apiResult.success) {
      if (apiResult.data) {
        resultRef.value = apiResult.data
        errorRef.value = ''

        createMessage.success(tavI18n('Tav.file.message.6'))

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

      createMessage.success(tavI18n('Tav.file.message.11'))
    } finally {
      setLoading(false)
      setDisable(false)
      resetFileList()
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
