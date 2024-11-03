import { createApp } from 'vue'
import { withInstall } from '@tav-ui/utils/with-install'
import { DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME } from '../../consts'
import FileUploadPreview from './index.vue'
import { type FileUploadPreviewProps } from './types'

export function createFileUploadPreview(options: FileUploadPreviewProps) {
  const mountNode = document.createElement('section') as HTMLDivElement
  mountNode.classList.add(`functional-${DEFAULT_FILEUPLOAD_PREVIEW_CLASSNAME}`)

  const Instance = createApp(FileUploadPreview, {
    ...(options || {}),
    close: () => {
      Instance.unmount()
      document.body.removeChild(mountNode)
    },
  })

  document.body.appendChild(mountNode)
  Instance.mount(mountNode)
}

export * from './types'
export const TaFileUploadPreview = withInstall(FileUploadPreview)
export default TaFileUploadPreview
