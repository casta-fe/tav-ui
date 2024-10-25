import { type ExtractPropTypes } from 'vue'
import { type FileUploadImageResponseRecord } from '../../../../typings'

export const editorUploadimageLinkProps = {
  disabled: { type: Boolean, default: false },
}

export type EditorUploadImageLinkProps = ExtractPropTypes<typeof editorUploadimageLinkProps>

export const editorUploadimageLinkEmits = {}

export type EditorUploadImageLinkEmits = typeof editorUploadimageLinkEmits

export interface EditorUploadImageLinkInstance {
  getValues: () => Promise<FileUploadImageResponseRecord[]>
  cleanup(): void
}
