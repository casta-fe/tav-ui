import { type ExtractPropTypes, type PropType } from 'vue'
import { type FileUploadImageResponseRecord } from '../../../../typings'

export const editorUploadimageLinkProps = {
  disabled: { type: Boolean, default: false },
  /** 控制上传成功后的小图是 cover 还是 contain */
  keepImageOriginalAspectRatio: {
    type: Boolean,
    default: true,
  },
  /** 控制上传成功后的小图宽度 */
  imageWidth: {
    type: Number,
  },
  /** 控制上传成功后的小图的比例 */
  imageAspectRatio: {
    type: String as PropType<'1-1' | '4-3' | '3-4' | '16-9'>,
  },
  /** 控制上传成功后预览图的比例 */
  previewImageAspectRatio: {
    type: String as PropType<'1-1' | '4-3' | '3-4' | '16-9'>,
  },
}

export type EditorUploadImageLinkProps = ExtractPropTypes<typeof editorUploadimageLinkProps>

export const editorUploadimageLinkEmits = {}

export type EditorUploadImageLinkEmits = typeof editorUploadimageLinkEmits

export interface EditorUploadImageLinkInstance {
  getValues: () => Promise<FileUploadImageResponseRecord[]>
  cleanup(): void
}
