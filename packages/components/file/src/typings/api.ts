export interface FileActionUploadApiResponseRecord {
  /** @description 文件的实际id，根据此id和版本定位最新文件，非必传，同一条文件数据不论更新多少次 actualId 都一样 */
  actualId?: string
  /** @description 文件地址，根据业务实际情况指定，必传不能为空 */
  address: string
  /**
   * Format: int32
   * @description 应用id，非必传
   */
  /** 现生成的文件 1：是，0否，默认为0 */
  appId?: number
  auto?: number
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
  /** pdf转换失败原因 */
  errorMsg?: string
  /** 扩展字段 */
  expand?: string
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
  /** @description 文件名称（不包含后缀），必传不能为空 */
  name: string
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
  /** 是否暂存文件 1是 0否 */
  staging?: number
  /** @description 文件后缀，必传不能为空 */
  suffix: string
  /** 是否转了pdf 1:已转 0:未转 2:失败 默认为0 */
  toPdf?: number
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
  /** 流程复制的文件 1：是，0否，默认为0 */
  workflowCopy?: number
}

export interface FileTypeSelectApiResponseRecord {
  appId?: number
  code?: string
  id?: number
  moduleId?: number
  name?: string
  parentId?: number
  remark?: string
  seq?: number
  sid?: number
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

export interface FileViewApiResponse {
  createTime?: string
  createByName?: string
  fileId?: number
  fileName?: string
  fileSize?: string
  officeType?: string
  onlineUrl?: string
  pageUrl?: string
  suffix?: string
  token?: string
  watermark?: string
  wps?: number
  wpsAppId?: string
}
