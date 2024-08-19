import { type ExtractPropTypes, type PropType } from 'vue'
import { isBoolean } from '@tav-ui/utils'
import { DEFAULT_APIPARAM_BUSINESSPARAMSJSON, DEFAULT_FILE_MODE } from '../../consts'
import {
  type ApiParams,
  type FileActionUploadApiResponseRecord,
  type FileMode,
  globalConfigFileProps,
} from '../../typings'

// 按照 swagger 编写
export interface ApiUploadFileLinkParams {
  appId: ApiParams['appId']
  address: string
  moduleCode: ApiParams['moduleCode']
  name: string
  typeCode: ApiParams['typeCode']
  businessId?: ApiParams['businessId']
  businessKey?: ApiParams['businessKey']
  businessParamsJson?: ApiParams['businessParamsJson']
}

// 组件所需的所有 api 参数
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileActionUploadLinkApiParams extends ApiUploadFileLinkParams {}

export const fileActionUploadLinkProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileActionUploadLink'],
  apiParams: {
    type: Object as PropType<FileActionUploadLinkApiParams>,
    default: () => ({ ...DEFAULT_APIPARAM_BUSINESSPARAMSJSON }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },

  icon: { type: String, default: 'ant-design:link-outlined' },
  //:============================== extend props ==============================://
  visible: { type: Boolean, default: false },
  formVisible: { type: Boolean, default: false },
  name: { type: String },
  address: { type: String },
  getFormContainer: {
    type: Function as PropType<((instance?: any) => HTMLElement) | undefined>,
  },
  /** apiUploadFileLink 已从 ...globalConfigFileProps['fileUploadActionLink'] 取到 */
  beforeApiUploadFileLink: {
    type: Function as PropType<(apiParams: ApiUploadFileLinkParams) => Promise<any>>,
  },
  afterApiUploadFileLink: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileActionUploadLinkProps = ExtractPropTypes<typeof fileActionUploadLinkProps>

export const fileActionUploadLinkEmits = {
  formOpen: () => true,
  formClose: () => true,
  'update:formVisible': (visible: boolean) => isBoolean(visible),
  /** 上传成功前校验成功的列表 */
  validateSuccessChange: (
    ...args: [
      { name: ApiUploadFileLinkParams['name']; address: ApiUploadFileLinkParams['address'] }
    ]
  ) => args instanceof Object,
  /** 上传成功前校验失败的列表 */
  validateFailureChange: (
    ...args: [
      { name: ApiUploadFileLinkParams['name']; address: ApiUploadFileLinkParams['address'] }
    ]
  ) => args instanceof Object,
  /** 上传成功后的列表 */
  uploadedChange: (...args: [FileActionUploadApiResponseRecord[]]) => args instanceof Object,
}

export type FileActionUploadLinkEmits = typeof fileActionUploadLinkEmits

export interface FileActionUploadLinkInstance {
  cleanup(): Promise<void>
}
