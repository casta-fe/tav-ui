import { type FileVersionCache } from '../hooks'

export type FileActualIdsObjectArray = {
  actualId: string
  moduleCode: string | undefined
  versionList: FileVersionCache[]
}[]

export type FileActualIdsStringArray = string[]

export type FileActualIds = FileActualIdsObjectArray | FileActualIdsStringArray

export interface FileActionUploadApiResponseRecord {
  /** @description 文件的实际id，根据此id和版本定位最新文件，非必传 */
  actualId?: string
  /** @description 文件地址，根据业务实际情况指定，必传不能为空 */
  address: string
  /**
   * Format: int32
   * @description 应用id，非必传
   */
  appId?: number
  /**
   * Format: int32
   * @description 现生成的文件 1：是，0否，默认为0
   */
  auto?: number
  /** @description 业务属性对应的业务实际名称，需要调用业务系统进行翻译 */
  businessDisplayItemText?: string
  /** @description 业务属性值 */
  businessDisplayItemValue?: string
  /** @description 业务表实际id，非必传 */
  businessId?: string
  /** @description 业务key，由业务端拼接而成，如果不为空的话businessId一定也不饿能为空，非必传 */
  businessKey?: string
  createBy?: string
  /** @description 上传人 */
  createByName?: string
  /**
   * Format: date-time
   * @description 上传时间
   */
  createTime?: string
  /**
   * Format: int32
   * @description 0:未删除，1:已删除，必传不能为空
   */
  deleted: number
  /** @description 扩展字段 */
  expand?: string
  /** @description 文件大小 */
  fileSize?: string
  /** @description 文件全称，包含后缀，必传不能为空 */
  fullName: string
  /**
   * Format: int32
   * @description 是否超链接
   */
  hyperlink?: number
  /**
   * Format: int64
   * @description 主键主键，编辑时不能为空
   */
  id?: number
  /** @description 模块code */
  moduleCode?: string
  /** @description 模块文件节点结构全称 */
  moduleFullName?: string
  /**
   * Format: int64
   * @description 关联的模块id，必传不能为空
   */
  moduleId: number
  /** @description 文件名称（不包含后缀），必传不能为空 */
  name: string
  owner?: string
  /** @description 负责人 */
  ownerName?: string
  /**
   * Format: int64
   * @description 文件大小，必传不能为空
   */
  size: number
  /**
   * Format: int32
   * @description 源文件下载标识
   */
  sourceFileDownload?: number
  /** @description 文件后缀，必传不能为空 */
  suffix: string
  /**
   * Format: int64
   * @description 文件类型，关联f_type-id，必传不能为空
   */
  type: number
  /** @description 类型code */
  typeCode?: string
  /** @description 关联的文件类型名称 */
  typeName?: string
  /**
   * Format: date-time
   * @description 更新时间
   */
  updateTime?: string
  /**
   * Format: int64
   * @description 版本号，默认为1，如果有更新则累加，必传不能为空
   */
  version: number
  /**
   * Format: int32
   * @description 水印文件下载标识
   */
  watermarkFileDownload?: number
}

export interface FileTypeSelectApiResponseRecord {
  /**
   * Format: int32
   * @description appId
   */
  appId?: number
  /** @description 文件类型编码，必传不能为空 */
  code: string
  /**
   * Format: int64
   * @description 主键主键，编辑时不能为空
   */
  id?: number
  /** @description 模块code */
  moduleCode?: string
  /**
   * Format: int64
   * @description 模块id
   */
  moduleId?: number
  /**
   * Format: int64
   * @description 改类型所属模块的上级模块id
   */
  moduleParentId?: number
  /** @description 文件类型名称，必传不能为空 */
  name: string
  /** @description 备注，非必传 */
  remark?: string
  /**
   * Format: double
   * @description 排序号，必传不能为空
   */
  seq: number
  /** @description 字符串拼接id */
  sid?: string
}

export interface FileApiParamBusinessParamsJson {
  //:========================================: 投管专用 :========================================://
  /** 投管公司 code */
  investCompanyCode?: string
  /** 投管项目编号 code */
  investInvProjectNumber?: string
  /** 退出项目编号 code */
  investExitProjectNumber?: string
  /** 基金 id */
  investFundId?: string
  /** 基金管理人 id */
  investFundManagerId?: string
  /** 投资人 id */
  investInvestorId?: number
  /** 项目挖掘主数据 id */
  investXwjProjectsourceId?: number
  /** 院所拜访主数据 id */
  investInstituteManageId?: number
  //:========================================: 投管专用 :========================================://

  [key: string]: any
}

export interface FilePreviewApiResponse {
  /** @description 创建人 */
  createByName?: string
  /**
   * Format: date-time
   * @description 创建时间
   */
  createTime?: string
  /**
   * Format: int64
   * @description 文件id
   */
  fileId?: number
  /** @description 文件名称 */
  fileName?: string
  /** @description 文件大小 */
  fileSize?: string
  /** @description wps官方文档枚举值 */
  officeType?: string
  /** @description 非wps类 预览地址 */
  onlineUrl?: string
  /** @description 前端自己用的字段 pageUrl */
  pageUrl?: string
  /** @description 文件后缀 */
  suffix?: string
  /** @description wps所需token */
  token?: string
  /** @description 水印内容 */
  watermark?: string
  /**
   * Format: int32
   * @description 是否走wps预览 0-否 1-是
   */
  wps?: number
  /** @description wpsAppId */
  wpsAppId?: string
}

export interface FileFilterFormFileTypeResponseTree {
  checked?: boolean
  children?: FileFilterFormFileTypeResponseTree[]
  code?: string
  expanded?: boolean
  id?: { [key: string]: unknown }
  leaf?: boolean
  name?: string
  /** @enum {string} */
  nodeType?: 'MODULE' | 'TYPE'
  parentCode?: string
  parentId?: { [key: string]: unknown }
  /** @description nodeType为TYPE时才可能有 */
  permissionsMap?: {
    [key: string]: {
      checked?: boolean
      /** Format: int64 */
      originTypeId?: number
      /** @enum {string} */
      permissionType?: 'VIEW' | 'WATERMARK' | 'SOURCE'
      typeId?: string
    }
  }
  /** Format: double */
  seq?: number
}
export interface FileFilterFormFileTypeResponseList {
  /**
   * Format: int32
   * @description appId
   */
  appId?: number
  /** @description 文件类型编码，必传不能为空 */
  code: string
  /**
   * Format: int64
   * @description 主键主键，编辑时不能为空
   */
  id?: number
  /** @description 模块code */
  moduleCode?: string
  /**
   * Format: int64
   * @description 模块id
   */
  moduleId?: number
  /**
   * Format: int64
   * @description 改类型所属模块的上级模块id
   */
  moduleParentId?: number
  /** @description 文件类型名称，必传不能为空 */
  name: string
  /** @description 备注，非必传 */
  remark?: string
  /**
   * Format: double
   * @description 排序号，必传不能为空
   */
  seq: number
  /** @description 字符串拼接id */
  sid?: string
}
export interface FileFilterFormFileTypeResponse {
  /** @description 是否是树 */
  isTree?: boolean
  /** @description 如果不是树，取这个字段 */
  list?: FileFilterFormFileTypeResponseList[]
  /** @description 如果是树，取这个字段 */
  tree?: FileFilterFormFileTypeResponseTree[]
}

export interface FileLogApiResponseRecord {
  /** @description 文件真实id */
  actualId?: string
  /**
   * Format: int32
   * @description appId
   */
  appId?: number
  /** @description 应用端 */
  appName?: string
  /**
   * Format: int64
   * @description 操作人Id
   */
  createBy?: number
  /** @description 操作人 */
  createByName?: string
  /**
   * Format: date-time
   * @description 操作时间
   */
  createTime?: string
  /** @description 操作端 */
  deviceInfo?: string
  /** @description esId */
  esId?: string
  /** @description 拓展字段 */
  extend?: string
  /**
   * Format: int32
   * @description 文件appid
   */
  fileAppId?: number
  /** @description 文件名称 */
  fileName?: string
  /** @description 模块名称 */
  moduleFullName?: string
  /** @description 执行操作 */
  operation?: string
  /** @description 文件类型名称 */
  typeName?: string
  /** @description 文件版本 */
  version?: number
}
