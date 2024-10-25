import { type ComputedRef, unref } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type UseRequestHandleApiDefaultOptions } from '../../hooks'
import { type FileUploadApiResponseRecord, type FileUploadProps } from './types'

export function useApi(options: { computedProps: ComputedRef<FileUploadProps> }) {
  const { computedProps } = options

  function uploadFileApiOptions(
    apiParams: FileUploadProps['apiParams'],
    files: File[],
    callback: () => void
  ) {
    if (!computedProps.value.api) {
      console.warn('[tavui TaFileUpload] api is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<any, any> = {
      api: computedProps.value.api,
      beforeApi: computedProps.value.beforeApi,
      afterApi: computedProps.value.afterApi,
      catchError: computedProps.value.catchApiError,
      apiParams: {
        ...apiParams,
        files: unref(files),
      },
      transformApiParamsToFormData: {
        fileFiledName: 'files',
      },
      successMessage: () => {
        return tavI18n('Tav.file.message.6')
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
      callback,
    }

    return options
  }

  function previewFileApiOptions(file: FileUploadApiResponseRecord) {
    if (!computedProps.value.previewApi) {
      console.warn('[tavui TaFileUpload] api is undefined')
      return
    }

    const options: UseRequestHandleApiDefaultOptions<any, any> = {
      api: computedProps.value.previewApi,
      beforeApi: computedProps.value.beforePreviewApi,
      afterApi: computedProps.value.afterPreviewApi,
      apiParams: {
        url: unref(file).url,
      },
      failureMessage: () => {
        return tavI18n('Tav.common.httpError')
      },
    }

    return options
  }

  return {
    apiActions: {
      uploadFileApiOptions,
      previewFileApiOptions,
    },
  }
}

export type UseApiReturn = ReturnType<typeof useApi>

/**
 * 从正常的 url 中截取文件类型已经名称
 * @param originUrl
 * @param acceptTypes
 * @returns
 */
export function transformUrlToFileUploadPreviewPropFile(
  originUrl: string,
  acceptTypes: string[]
): FileUploadApiResponseRecord {
  const data: FileUploadApiResponseRecord = {
    url: originUrl,
    name: '',
    suffix: '',
  }

  // eslint-disable-next-line no-useless-escape
  const fileTypeRegexp = new RegExp(`\.(${acceptTypes.join('|')})`, 'g')
  const matchResult = data['url'].match(fileTypeRegexp)
  if (matchResult?.length) {
    data['suffix'] = matchResult[0].split('.')[1]
  }

  let name = data['url'].split('/').at(-1)
  if (name) {
    if (name.includes('?')) {
      name = name.split('?')[0]
    }
    data['name'] = name
  }

  return data
}
