import { type ApiParams } from './types'

export interface FileInjectedProps {
  appId?: number
  /** 文件类型控制 */
  accpet?: string
  /** 文件大小控制 */
  sizeRange?: [null | number, null | number]
  /** 文件是否支持多选 */
  multiple?: boolean
  /** 文件最大上传个数 */
  multipleFileCount?: number

  //:============================== File CRUD API ==============================://
  /** 文件上传接口，传入 uploadFile */
  apiCreateFile?: (formData: FormData) => Promise<any>
  /** 查询文件接口，传入 queryfile */
  apiReadFile?: (formData: FormData) => Promise<any>
  /** 更新文件接口，传入 updateFile */
  apiUpdateFile?: (formData: FormData) => Promise<any>
  /** 删除文件接口，传入 removeFile */
  apiDeleteFile?: (formData: FormData) => Promise<any>
  //:============================== File CRUD API ==============================://

  //:============================== Link CRUD API ==============================://
  /** 超链接上传接口，传入 uploadHyperlink */
  apiCreateLink?: (formData: FormData) => Promise<any>
  // TODO: RUD API?
  //:============================== Link CRUD API ==============================://

  //:============================== File Type CRUD API ==============================://
  // /** filetype 上传接口，传入 uploadFiletype */
  // apiCreateFileType?: (formData: FormData) => Promise<any>
  /** filetype 查询接口，传入 queryfiletype */
  apiReadFileType?: (params: Required<ApiParams>['apiParams']) => Promise<any>
  // 参数设置
  // moduleCode: string[];
  // /**
  //  * 根据投管角色管理中勾选的文件类型进行过滤
  //  *
  //  * 门户中需要传false
  //  * @default true
  //  */
  // permissionControl?: boolean; // default false
  // typeCode: string[]
  // appId: string

  /** filetype 更新接口，传入 updateFileType */
  apiUpdateFileType?: (formData: FormData) => Promise<any>
  /** filetype 上传接口，传入 removefiletype */
  apiDeleteFileType?: (formData: FormData) => Promise<any>
  //:============================== File Type CRUD API ==============================://

  //:============================== File Action API ==============================://
  /** 下载接口，传入 download */
  apiDownload?: (formData: FormData) => Promise<any>
  //:============================== File Action API ==============================://
}

export const FileInjectedPropsKeys = [
  'appId',
  'accpet',
  'sizeRange',
  'multiple',
  'multipleFileCount',
  'apiCreateFile',
  'apiReadFile',
  'apiUpdateFile',
  'apiDeleteFile',
  'apiCreateLink',
  'apiReadFileType',
  'apiUpdateFileType',
  'apiDeleteFileType',
  'apiDownload',
]
