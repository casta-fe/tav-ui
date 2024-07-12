import { type ExtractPropTypes, type PropType } from 'vue'
import {
  DEFAULT_FILE_ACCPET,
  DEFAULT_FILE_MAX_COUNT,
  DEFAULT_FILE_NAME_REGEXP,
  DEFAULT_FILE_SIZE_RANGE,
  DEFAULT_MULTIPLE,
} from '../consts'
import { type Keys } from '../utils'
import { type ApiParams } from './types'

export interface UploadFileListItem {
  /** @description 文件的实际id，根据此id和版本定位最新文件，非必传 */
  actualId?: string
  /** @description 文件地址，根据业务实际情况指定，必传不能为空 */
  address: string
  /**
   * Format: int32
   * @description 应用id，非必传
   */
  appId?: number
  /** @description 业务表实际id，非必传 */
  businessId?: string
  /** @description 业务key，由业务端拼接而成，如果不为空的话businessId一定也不能为空，非必传 */
  businessKey?: string
  createBy?: string
  /** @description 上传人 */
  createByName?: string
  /**
   * Format: date-time
   * @description 创建时间
   */
  createTime?: string
  /**
   * Format: int32
   * @description 0:未删除，1:已删除，必传不能为空
   */
  deleted: number
  /** @description 文件大小 */
  fileSize?: string
  /** @description 文件全称，包含后缀，必传不能为空 */
  fullName: string
  /** Format: int32 */
  hyperlink?: number
  /**
   * Format: int64
   * @description 主键主键，编辑时不能为空
   */
  id?: number
  /** @description 关联的模块code */
  moduleCode?: string
  /**
   * Format: int64
   * @description 关联的模块id，必传不能为空
   */
  moduleId: number
  /** @description 关联的模块名称 */
  moduleName?: string
  /** @description 文件名称（不包含后缀），必传不能为空 */
  name: string
  /**
   * Format: int64
   * @description 持续时间，如果为音视频文件不为空，非必传
   */
  runtime?: number
  /**
   * Format: int64
   * @description 文件大小，必传不能为空
   */
  size: number
  /**
   * Format: int32
   * @description 源文件下载标识 value = 1
   */
  sourceFileDownload?: number
  /** @description 文件后缀，必传不能为空 */
  suffix: string
  /**
   * Format: int64
   * @description 文件类型，关联f_type-id，必传不能为空
   */
  type: number
  /** @description 文件类型code */
  typeCode?: string
  /** @description 关联的文件类型名称 */
  typeName?: string
  /**
   * Format: int64
   * @description 版本号，默认为1，如果有更新则累加，必传不能为空
   */
  version: number
  /**
   * Format: int32
   * @description 水印文件下载标识 value = 2
   */
  watermarkFileDownload?: number
}

export const fileInjectedProps = {
  appId: { type: Number },
  /** 文件类型控制 */
  accpet: { type: String, default: DEFAULT_FILE_ACCPET },
  /** 文件是否支持多选 */
  multiple: { type: Boolean, default: DEFAULT_MULTIPLE },
  /** 文件最大上传个数 */
  maxCount: { type: Number, default: DEFAULT_FILE_MAX_COUNT },
  /** 文件大小控制 */
  sizeRange: { type: Array as PropType<(number | null)[]>, default: DEFAULT_FILE_SIZE_RANGE },
  /** 文件名非法字符校验 */
  nameRegExp: { type: Object as PropType<RegExp>, default: DEFAULT_FILE_NAME_REGEXP },

  //:============================== File CRUD API ==============================://
  /** 文件上传接口，传入 uploadFile */
  apiCreateFile: {
    type: Function as PropType<
      (params: {
        files?: File[]
        moduleCode?: string
        typeCode?: string
        businessId?: string
        businessKey?: string
        appId?: number
      }) => Promise<any>
    >,
  },
  /** 查询文件接口，传入 queryfile */
  apiReadFile: {
    type: Function as PropType<
      (params: {
        startTime?: string
        endTime?: string
        searchValue?: string
        moduleCode?: string
        typeCode?: string
        businessId?: string
        businessKey?: string
        appId?: number
      }) => Promise<any>
    >,
  },
  /** 更新文件接口，传入 updateFile */
  apiUpdateFile: { type: Function as PropType<(formData: FormData) => Promise<any>> },
  /** 删除文件接口，传入 removeFile */
  apiDeleteFile: { type: Function as PropType<(formData: FormData) => Promise<any>> },
  //:============================== File CRUD API ==============================://

  //:============================== Link CRUD API ==============================://
  /** 超链接上传接口，传入 uploadHyperlink */
  apiCreateLink: { type: Function as PropType<(formData: FormData) => Promise<any>> },
  // TODO: RUD API?
  //:============================== Link CRUD API ==============================://

  //:============================== File Type CRUD API ==============================://
  // /** filetype 上传接口，传入 uploadFiletype */
  // apiCreateFileType?: (formData: FormData) => Promise<any>
  /** filetype 查询接口，传入 queryfiletype */
  apiReadFileType: {
    type: Function as PropType<
      (params: { moduleCode?: string[]; typeCodes?: string[]; appId?: number }) => Promise<any>
    >,
  },
  /** filetype 更新接口，传入 updateFileType */
  apiUpdateFileType: { type: Function as PropType<(formData: FormData) => Promise<any>> },
  /** filetype 上传接口，传入 removefiletype */
  apiDeleteFileType: { type: Function as PropType<(formData: FormData) => Promise<any>> },
  //:============================== File Type CRUD API ==============================://

  //:============================== File Action API ==============================://
  /** 下载接口，传入 download */
  apiDownload: { type: Function as PropType<(formData: FormData) => Promise<any>> },
  //:============================== File Action API ==============================://
}

export type FileInjectedProps = ExtractPropTypes<typeof fileInjectedProps>

export const fileInjectedPropsKeys = Object.keys(fileInjectedProps) as FileInjectedPropsKeys

export type FileInjectedPropsKeys = Keys<keyof typeof fileInjectedProps>[]
