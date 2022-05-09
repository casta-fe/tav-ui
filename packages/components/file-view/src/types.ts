import type { ExtractPropTypes, PropType } from 'vue'
export const fileViewProps = {
  show: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array as PropType<FileItemType[]>,
    required: true,
    default: [],
  },
  fileApi: {
    type: Function,
    default: null,
  },
}

export type FileViewProps = ExtractPropTypes<typeof fileViewProps>

export interface FileItemType {
  // 文件真实id
  actualId: string
  address: string
  appId: number
  businessId: null
  businessKey: null
  createTime: string
  createBy: string | number
  createByName: string
  deleted: number
  fullName: string
  hyperlink: number
  id: number
  moduleId: number
  name: string
  runtime: null
  size: number
  suffix: string
  type: number
  version: number
  moduleCode: String
  typeCode: string
  fileId: any
}

