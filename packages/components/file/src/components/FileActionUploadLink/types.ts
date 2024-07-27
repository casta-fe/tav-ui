import { type ExtractPropTypes, type PropType, type Ref } from 'vue'
import { DEFAULT_FILE_MODE } from '../../consts'
import { type ApiParams, type FileMode, globalConfigFileProps } from '../../typings'

// 按照 swagger 编写
export interface ApiUploadLinkFileParams {
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
export interface FileActionUploadLinkApiParams extends ApiUploadLinkFileParams {}

export const fileActionUploadLinkProps = {
  //:============================== extend props ==============================://
  ...globalConfigFileProps['TaFileActionUploadLink'],
  apiParams: {
    type: Object as PropType<FileActionUploadLinkApiParams>,
    default: () => ({ businessParamsJson: {} }),
  },
  mode: { type: String as PropType<FileMode>, default: DEFAULT_FILE_MODE },

  icon: { type: String, default: 'ant-design:upload-outlined' },
  //:============================== extend props ==============================://
  // 点开后是弹窗不需要控制显示隐藏，有无由业务数据控制提取到 filetable type 中
  visible: { type: Boolean, default: true },
  /** apiUploadLinkFile 已从 ...globalConfigFileProps['fileUploadActionLink'] 取到 */
  beforeApiUploadLinkFile: {
    type: Function as PropType<(apiParams: ApiUploadLinkFileParams) => Promise<any>>,
  },
  afterApiUploadLinkFile: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileActionUploadLinkProps = ExtractPropTypes<typeof fileActionUploadLinkProps>

export const fileActionUploadLinkEmits = {
  click: (...args: any[]) => args instanceof Object,
}

export type FileActionUploadLinkEmits = typeof fileActionUploadLinkEmits

export interface FileActionUploadLinkInstance {
  elRef: Ref<HTMLDivElement | undefined>
}
