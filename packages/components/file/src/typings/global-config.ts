import { type ExtractPropTypes, type PropType } from 'vue'
import {
  DEFAULT_FILE_ACCPET,
  DEFAULT_FILE_MAX_COUNT,
  DEFAULT_FILE_NAME_REGEXP,
  DEFAULT_FILE_SIZE_RANGE,
  DEFAULT_MULTIPLE,
} from '../consts'
import {
  type FileActionUploadApiParams,
  type FileTableApiParams,
  type FileTypeSelectApiParams,
  type FileVersionApiParams,
} from './types'

/** 真实的接口参数，来自 swagger */
export interface ApiQueryFileTypeParams {
  appId: FileTypeSelectApiParams['appId']
  moduleCode: FileTypeSelectApiParams['moduleCode']
  typeCodes: FileTypeSelectApiParams['typeCodes']
  permissionControl: FileTypeSelectApiParams['permissionControl']
}

/** 真实的接口参数，来自 swagger */
export interface ApiUploadFileParams {
  appId: FileActionUploadApiParams['appId']
  moduleCode: FileActionUploadApiParams['moduleCode']
  typeCode: FileActionUploadApiParams['typeCode']
  businessId?: FileActionUploadApiParams['businessId']
  businessKey?: FileActionUploadApiParams['businessKey']
  businessParamsJson: FileActionUploadApiParams['businessParamsJson']
  files: FileActionUploadApiParams['files']
}

/** 真实的接口参数，来自 swagger */
export interface ApiQueryFileParams {
  appId: FileTableApiParams['appId']
  moduleCode: FileTableApiParams['moduleCode']
  typeCodes: FileTableApiParams['typeCodes']
  permissionControl: FileTableApiParams['permissionControl']
  businessIds: FileTableApiParams['businessIds']
  businessKey: FileTableApiParams['businessKey']
  businessCheck: FileTableApiParams['businessCheck']
  searchValue: string
  startTime: string
  endTime: string
}

/** 真实的接口参数，来自 swagger */
export interface ApiUpdateFileParams {
  appId: FileActionUploadApiParams['appId']
  fileActualId: FileActionUploadApiParams['fileActualId']
  instantUpdate: FileActionUploadApiParams['instantUpdate']
  files: FileActionUploadApiParams['files']
}

/** 真实的接口参数，来自 swagger */
export interface ApiUpdateFileNameAndLinkParams {
  appId: FileActionUploadApiParams['appId']
  /** 文件id */
  id: string
  /** 修改后的文件名称 */
  name: string
  /** 超链接修改后的链接地址 */
  address: string
}

/** 真实的接口参数，来自 swagger */
export interface ApiQueryFileHistoryParams {
  appId: FileVersionApiParams['appId']
  /** 文件真实id列表 */
  fileActualIds: FileVersionApiParams['fileActualIds']
  permissionControl: FileVersionApiParams['permissionControl']
}

/** 真实的接口参数，来自 swagger */
export interface ApiDeleteFileParams {
  appId: FileTableApiParams['appId']
  actualId: FileTableApiParams['fileActualId']
}

/** 真实的接口参数，来自 swagger */
export interface ApiDownloadFileParams {
  appId: FileTableApiParams['appId']
  /** file id */
  id: FileTableApiParams['id']
}

/** 真实的接口参数，来自 swagger */
export interface ApiDownloadWaterMarkerFileParams {
  appId: FileTableApiParams['appId']
  /** file id */
  id: FileTableApiParams['id']
}

/** 真实的接口参数，来自 swagger */
export interface ApiPreviewFileParams {
  appId: FileTableApiParams['appId']
  /** file id */
  id: FileTableApiParams['id']
}

export const globalConfigFileProps = {
  /**根据子组件名来划分注入数据 */
  fileTypeSelect: {
    //:============================== CRUD API ==============================://
    // filetype 上传接口，传入 uploadFiletype，apiCreateFileType
    /** filetype 查询接口 */
    apiQueryFileType: {
      type: Function as PropType<(params: Partial<ApiQueryFileTypeParams>) => Promise<any>>,
    },
    // filetype 查询接口，传入 queryfiletype，apiReadFileType
    // filetype 更新接口，传入 updateFileType
    // filetype 上传接口，传入 removefiletype，apiDeleteFileType
    //:============================== CRUD API ==============================://
  },
  fileActionUpload: {
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
    //:============================== FILE CRUD API ==============================://
    //  文件上传接口，apiCreateFile
    /** 文件上传接口，传入 uploadFile， */
    apiUploadFile: {
      type: Function as PropType<(params: Partial<ApiUploadFileParams>) => Promise<any>>,
    },
    //:============================== FILE CRUD API ==============================://
  },
  fileActionUploadLink: {
    //:============================== CRUD API ==============================://
    // 超链接上传接口，传入 uploadHyperlink，apiCreateLink
    // TODO: RUD API?
    //:============================== CRUD API ==============================://
  },
  fileTable: {
    //:============================== FILE CRUD API ==============================://
    /** 文件上传接口，传入 uploadFile， */
    apiUploadFile: {
      type: Function as PropType<(params: Partial<ApiUploadFileParams>) => Promise<any>>,
    },
    // 查询文件接口，apiReadFile
    /** 查询文件接口，传入 queryfile 分页 */
    apiQueryFile: {
      type: Function as PropType<
        (params: { filter: ApiQueryFileParams; model: Record<string, any> }) => Promise<any>
      >,
    },
    /** 查询文件接口，传入 queryfilelist 不分页 */
    apiQueryFileList: {
      type: Function as PropType<(params: ApiQueryFileParams) => Promise<any>>,
    },
    // 更新文件接口，传入 updateFile
    apiUpdateFile: {
      type: Function as PropType<(params: Partial<ApiUpdateFileParams>) => Promise<any>>,
    },
    // 更新文件部分信息，传入 updateFileNameAndAddress
    apiUpdateFileNameAndLink: {
      type: Function as PropType<(params: Partial<ApiUpdateFileNameAndLinkParams>) => Promise<any>>,
    },
    // 删除文件接口，传入 removeFile
    apiDeleteFile: {
      type: Function as PropType<(params: Partial<ApiDeleteFileParams>) => Promise<any>>,
    },
    /** 下载接口，传入 fileDownload */
    apiDownloadFile: {
      type: Function as PropType<(params: Partial<ApiDownloadFileParams>) => Promise<any>>,
    },
    /** 下载水印文件接口，传入 downloadToWatermark */
    apiDownloadWaterMarkerFile: {
      type: Function as PropType<
        (params: Partial<ApiDownloadWaterMarkerFileParams>) => Promise<any>
      >,
    },
    /** 查询历史文件接口，传入 queryHistoryFileByFileActualIds */
    apiQueryFileHistory: {
      type: Function as PropType<(params: Partial<ApiQueryFileHistoryParams>) => Promise<any>>,
    },
    //:============================== FILE CRUD API ==============================://
  },
  fileVersion: {
    /** 查询历史文件接口，传入 queryHistoryFileByFileActualIds */
    apiQueryFileHistory: {
      type: Function as PropType<(params: Partial<ApiQueryFileHistoryParams>) => Promise<any>>,
    },
    apiPreviewFile: {
      type: Function as PropType<(params: Partial<ApiPreviewFileParams>) => Promise<any>>,
    },
    /** 下载接口，传入 fileDownload */
    apiDownloadFile: {
      type: Function as PropType<(params: Partial<ApiDownloadFileParams>) => Promise<any>>,
    },
    /** 下载水印文件接口，传入 downloadToWatermark */
    apiDownloadWaterMarkerFile: {
      type: Function as PropType<
        (params: Partial<ApiDownloadWaterMarkerFileParams>) => Promise<any>
      >,
    },
  },
  filePreview: {
    apiPreviewFile: {
      type: Function as PropType<(params: Partial<ApiPreviewFileParams>) => Promise<any>>,
    },
  },
}

export type GlobalConfigFileProps = ExtractPropTypes<typeof globalConfigFileProps>
