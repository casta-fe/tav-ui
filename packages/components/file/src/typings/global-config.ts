import { type ExtractPropTypes, type PropType } from 'vue'
import {
  DEFAULT_FILE_ACCEPT,
  DEFAULT_FILE_MAX_COUNT,
  DEFAULT_FILE_NAME_REGEXP,
  DEFAULT_FILE_SIZE_RANGE,
  DEFAULT_MULTIPLE,
} from '../consts'
import { type ApiQueryFileTypeParams } from '../components/FileTypeSelect/types'
import {
  type ApiUpdateFileParams,
  type ApiUploadFileParams,
} from '../components/FileActionUpload/types'
import { type ApiPreviewFileParams } from '../components/FilePreview/types'
import { type ApiQueryFileHistoryParams } from '../components/FileVersion/types'
import {
  type ApiDeleteFileParams,
  type ApiDownloadFileParams,
  type ApiDownloadWaterMarkerFileParams,
  type ApiQueryFileListParams,
  type ApiQueryFileParams,
  type ApiQueryFilterFormFileTypeParams,
  type ApiUpdateFileNameAndLinkParams,
} from '../components/FileTable/types'
import { type ApiUploadLinkFileParams } from '../components/FileActionUploadLink'
import { type ApiQueryFileLogParams } from '../components/FileLog'

export const globalConfigFileProps = {
  /**根据子组件名来划分注入数据 */
  TaFileTypeSelect: {
    //:============================== CRUD API ==============================://
    // filetype 上传接口，传入 uploadFiletype，apiCreateFileType
    /** filetype 查询接口 */
    apiQueryFileType: {
      type: Function as PropType<(params: ApiQueryFileTypeParams) => Promise<any>>,
    },
    // filetype 查询接口，传入 queryfiletype，apiReadFileType
    // filetype 更新接口，传入 updateFileType
    // filetype 上传接口，传入 removefiletype，apiDeleteFileType
    //:============================== CRUD API ==============================://
  },
  TaFileActionUpload: {
    /** 文件类型控制 */
    accept: { type: String, default: DEFAULT_FILE_ACCEPT },
    /** 文件是否支持多选 */
    multiple: { type: Boolean, default: DEFAULT_MULTIPLE },
    /** 文件最大上传个数 */
    maxCount: { type: Number, default: DEFAULT_FILE_MAX_COUNT },
    /** 文件大小控制 */
    sizeRange: { type: Array as PropType<(number | null)[]>, default: DEFAULT_FILE_SIZE_RANGE },
    /** 文件名非法字符校验 */
    nameRegExp: { type: Object as PropType<RegExp>, default: DEFAULT_FILE_NAME_REGEXP },
    //:============================== FILE CRUD API ==============================://
    /** 文件上传接口，传入 uploadFile， */
    apiUploadFile: {
      type: Function as PropType<(params: ApiUploadFileParams) => Promise<any>>,
    },
    // 更新文件接口，传入 updateFile
    apiUpdateFile: {
      type: Function as PropType<(params: ApiUpdateFileParams) => Promise<any>>,
    },
    //:============================== FILE CRUD API ==============================://
  },
  TaFileActionUploadLink: {
    //:============================== CRUD API ==============================://
    // 超链接上传接口，传入 uploadHyperlink
    apiUploadLinkFile: {
      type: Function as PropType<(params: ApiUploadLinkFileParams) => Promise<any>>,
    },
    //:============================== CRUD API ==============================://
  },
  TaFileTable: {
    //:============================== FILE CRUD API ==============================://
    /** 文件上传接口，传入 uploadFile， */
    apiUploadFile: {
      type: Function as PropType<(params: ApiUploadFileParams) => Promise<any>>,
    },
    // 查询文件接口，apiReadFile
    /** 查询文件接口，传入 queryfile 分页 */
    apiQueryFile: {
      type: Function as PropType<
        (params: {
          filter: ApiQueryFileParams
          model: {
            dir?: string
            limit?: number
            page?: number
            sort?: string
          }
        }) => Promise<any>
      >,
    },
    /** 查询文件接口，传入 queryfilelist 不分页 */
    apiQueryFileList: {
      type: Function as PropType<(params: ApiQueryFileListParams) => Promise<any>>,
    },
    /** 查询历史文件接口，传入 queryHistoryFileByFileActualIds */
    apiQueryFileHistory: {
      type: Function as PropType<(params: ApiQueryFileHistoryParams) => Promise<any>>,
    },
    // 更新文件部分信息，传入 updateFileNameAndAddress
    apiUpdateFileNameAndLink: {
      type: Function as PropType<(params: ApiUpdateFileNameAndLinkParams) => Promise<any>>,
    },
    // 删除文件接口，传入 removeFile
    apiDeleteFile: {
      type: Function as PropType<(params: ApiDeleteFileParams) => Promise<any>>,
    },
    apiPreviewFile: {
      type: Function as PropType<(params: ApiPreviewFileParams) => Promise<any>>,
    },
    /** 下载接口，传入 fileDownload */
    apiDownloadFile: {
      type: Function as PropType<(params: ApiDownloadFileParams) => Promise<any>>,
    },
    /** 下载水印文件接口，传入 downloadToWatermark */
    apiDownloadWaterMarkerFile: {
      type: Function as PropType<(params: ApiDownloadWaterMarkerFileParams) => Promise<any>>,
    },
    apiQueryFilterFormFileType: {
      type: Function as PropType<(params: ApiQueryFilterFormFileTypeParams) => Promise<any>>,
    },
    //:============================== FILE CRUD API ==============================://
  },
  TaFileVersion: {
    /** 查询历史文件接口，传入 queryHistoryFileByFileActualIds */
    apiQueryFileHistory: {
      type: Function as PropType<(params: ApiQueryFileHistoryParams) => Promise<any>>,
    },
    apiPreviewFile: {
      type: Function as PropType<(params: ApiPreviewFileParams) => Promise<any>>,
    },
    /** 下载接口，传入 fileDownload */
    apiDownloadFile: {
      type: Function as PropType<(params: ApiDownloadFileParams) => Promise<any>>,
    },
    /** 下载水印文件接口，传入 downloadToWatermark */
    apiDownloadWaterMarkerFile: {
      type: Function as PropType<(params: ApiDownloadWaterMarkerFileParams) => Promise<any>>,
    },
  },
  TaFilePreview: {
    apiPreviewFile: {
      type: Function as PropType<(params: ApiPreviewFileParams) => Promise<any>>,
    },
  },
  TaFileLog: {
    apiQueryFileLog: {
      type: Function as PropType<
        (params: {
          filter: ApiQueryFileLogParams
          model: {
            dir?: string
            limit?: number
            page?: number
            sort?: string
          }
        }) => Promise<any>
      >,
    },
  },
}

export type GlobalConfigFileProps = ExtractPropTypes<typeof globalConfigFileProps>
