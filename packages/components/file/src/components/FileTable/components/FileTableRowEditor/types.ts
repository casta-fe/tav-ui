import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { DEFAULT_FILE_MODE } from '../../../../consts'
import { type FileActionUploadApiResponseRecord, type FileMode } from '../../../../typings'

export const fileTableRowEditorProps = {
  //:============================== extend props ==============================://
  // ...globalConfigFileProps['TaFileTableRowEditor'],
  // apiParams: {
  //   type: Object,
  //   default: () => ({ moduleCode: [], typeCodes: [], permissionControl: false }),
  // },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },
  //:============================== extend props ==============================://
  row: { type: Object as PropType<FileActionUploadApiResponseRecord> },
  onEnter: { type: Function as PropType<(...args: any[]) => any> },
  onChange: { type: Function as PropType<(...args: any[]) => any> },
}

export type FileTableRowEditorProps = ExtractPropTypes<typeof fileTableRowEditorProps>

export const fileTableRowEditorEmits = {
  click: (...args: any[]) => args instanceof Object,
}

export type FileTableRowEditorEmits = typeof fileTableRowEditorEmits

export interface FileTableRowEditorInstance {
  elRef: Ref<HTMLDivElement | undefined>
}
