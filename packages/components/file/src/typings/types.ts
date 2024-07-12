import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { type FileTypeSelectProps } from '../components/FileTypeSelect'
import { type FileActionUploadProps } from '../components/FileActionUpload'
import { type FileTableProps } from '../components/FileTable'
import { DEFAULT_API_PARAMS } from '../consts'
import { fileInjectedProps } from './injected-props'

export const apiParams = {
  appId: { type: Number },

  /**
   * Format: int64
   * @description 文件id
   */
  id: { type: Number },

  /** @description 聚合查询框, 非必填 */
  searchValue: { type: String },

  /**
   * Format: date-time
   * @description 开始时间
   */
  startTime: { type: String },

  /**
   * Format: date-time
   * @description 结束时间
   */
  endTime: { type: String },

  /** @description 模块code */
  moduleCodes: { type: Array as PropType<string[]> },

  /** @description 类型 code */
  typeCodes: { type: Array as PropType<string[]> },

  /** @description 业务 businessId，调用 upload 接口成功后如需绑定业务关系则后返回值（常用于投管，写死在代码里），不需要绑定关系返回 null */
  businessIds: { type: Array as PropType<string[]> },

  /** @description 业务 businessKey，调用 upload 接口成功后如需绑定业务关系则后返回值（常用于投管，写死在代码里），不需要绑定关系返回 null */
  businessKeys: { type: Array as PropType<string[]> },

  /** @description 权限控制 false:不控制角色查询文件类型  true:控制角色查询文件类型，默认 false */
  permissionControl: { type: Boolean },
}

export type ApiParams = ExtractPropTypes<typeof apiParams>

export const fileProps = {
  //:============================== extend props ==============================://
  ...fileInjectedProps,
  apiParams: {
    type: Object as PropType<ApiParams>,
    default: () => ({ ...DEFAULT_API_PARAMS }),
  },
  //:============================== extend props ==============================://

  /** 顶部显隐控制 */
  headerVisible: { type: Boolean, default: true },
  title: { type: String, title: 'TaFile' },
  titleVisible: { type: Boolean, default: false },
  /** 顶部操作区显隐控制 */
  headerActionsVisible: { type: Boolean, default: true },
  /** fileactions */
  fileActionsVisible: { type: Boolean, default: true },

  /** FileTypeSelect Props */
  fileTypeSelect: { type: Object as PropType<FileTypeSelectProps> },
  /** FileActionUpload Props */
  fileActionUpload: { type: Object as PropType<FileActionUploadProps> },
  // /** FileActionUploadLink Props */
  // fileActionUploadLink: { type: Object as PropType<FileActionsProps> },
  // /** FileActionUploadLinkForm Props */
  // fileActionUploadLinkForm: { type: Object as PropType<FileActionsProps> },
  /** FileTable Props */
  fileTable: { type: Object as PropType<FileTableProps> },

  // 各个组件支持的 api 以及 before/after 需要在大组件体现
}

export type FileProps = ExtractPropTypes<typeof fileProps>

export const fileEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}

export type FileEmits = typeof fileEmits

export interface FileInstance {
  elRef: Ref<HTMLDivElement | undefined>
  FileActionsElRef: Ref<HTMLDivElement | undefined>
}
