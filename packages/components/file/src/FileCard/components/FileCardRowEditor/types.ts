import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { DEFAULT_FILE_MODE } from '../../../consts'
import { type FileActionUploadApiResponseRecord, type FileMode } from '../../../typings'

export const fileCardRowEditorProps = {
  //:============================== extend props ==============================://
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  //:============================== extend props ==============================://
  row: { type: Object as PropType<FileActionUploadApiResponseRecord> },
  onEnter: { type: Function as PropType<(...args: any[]) => any> },
  onChange: { type: Function as PropType<(...args: any[]) => any> },
}

export type FileCardRowEditorProps = ExtractPropTypes<typeof fileCardRowEditorProps>

export const fileCardRowEditorEmits = {
  click: (...args: any[]) => args instanceof Object,
}

export type FileCardRowEditorEmits = typeof fileCardRowEditorEmits

export interface FileCardRowEditorInstance {
  elRef: Ref<HTMLDivElement | undefined>
}
