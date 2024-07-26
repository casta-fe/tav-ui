import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { tavI18n } from '@tav-ui/locales'
import { type FileActionUploadApiResponseRecord } from '../typings'

const { createMessage } = useMessage()

export async function fileSingleDownload(options: {
  file: FileActionUploadApiResponseRecord
  api: (...args: any[]) => Promise<any>
  fileName?: string
}) {
  const { file, api, fileName } = options

  if (!file || !file.id) {
    createMessage.warning(tavI18n('Tav.file.download.1'))
    return
  }

  const { data, success } = await api({ id: file.id })
  if (success === true && data) {
    const aEl = window.document.createElement('a') as HTMLAnchorElement
    aEl.setAttribute(
      'download',
      fileName ||
        (api.name.includes('ater') ? decodeURIComponent(data.split('/').at(-1)) : file.fullName)
    )
    aEl.setAttribute('href', data)
    aEl.setAttribute('target', '_blank')
    aEl.click()
    setTimeout(() => {
      aEl.remove()
    }, 5000)
  }
}

export async function fileMultipleDownload(options: {
  files: FileActionUploadApiResponseRecord[]
  api: (...args: any[]) => Promise<any>
  fileName?: string
}) {
  const { files, api, fileName } = options

  if (Array.isArray(files) && files.length === 0) {
    createMessage.warning(tavI18n('Tav.file.download.1'))
    return
  }

  const ids = files.map((file) => file.id)
  const { success, data } = await api({ fileName: fileName || tavI18n('Tav.file.download.2'), ids })
  if (success === true && data) {
    window.open(data)
  }
}
