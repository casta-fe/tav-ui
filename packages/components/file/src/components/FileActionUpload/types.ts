import { type PropType, type Ref } from 'vue'
import { type UploadProps as AUploadProps } from 'ant-design-vue'
import { type ApiParams, type FileInjectedProps, fileInjectedProps } from '../../typings'
import { DEFAULT_API_PARAMS } from '../../consts'
import { type ArgumentsOf } from '../../utils'
import type { ExtractPropTypes } from 'vue'

export type FileType = ArgumentsOf<AUploadProps['beforeUpload']>[0]
export type UploadFileType = ArgumentsOf<AUploadProps['onPreview']>[0]

export const fileActionUploadProps = {
  //:============================== extend props ==============================://
  ...fileInjectedProps,
  apiParams: {
    type: Object as PropType<ApiParams>,
    default: () => ({ ...DEFAULT_API_PARAMS }),
  },
  // AUpload props, multiple/accpet/maxCount 已从 fileInjectedProps 解构
  // /** 暂时不考虑接收外部已上传的 file，因为当前组件不展示 previewlist 只负责上传 */
  // fileList: { type: Array as PropType<AUploadProps['fileList']> },
  icon: { type: String, default: 'ant-design:upload-outlined' },
  disabled: { type: Object as PropType<AUploadProps['disabled']> },
  name: { type: String as PropType<AUploadProps['name']>, default: 'files' },
  openFileDialogOnClick: {
    type: Boolean as PropType<AUploadProps['openFileDialogOnClick']>,
    default: true,
  },
  // /** 只做上传前的校验逻辑，详情见代码中的 beforeHandleApiAction2 */
  // beforeUpload: { type: Object as PropType<AUploadProps['beforeUpload']> },
  // /** 只做上传前的 filelist 校验，详情见代码中的 beforeHandleApiAction3 */
  // customRequest: { type: Object as PropType<AUploadProps['customRequest']> },
  //:============================== extend props ==============================://

  visible: { type: Boolean, default: true },
  // immediate: { type: Boolean, default: true },
  /** uploadFile 接口 */
  api: { type: Function as PropType<FileInjectedProps['apiCreateFile']> },
  /** beforeApi 接收参数为 apiparams，想要修改请在传入的 props 中修改，返回值仅为 boolean，返回 false 会中断 api 发送 */
  //TODO: 测试参数变化，能否重请求
  beforeApi: { type: Function as PropType<(apiParams: ApiParams) => Promise<boolean>> },
  /** afterapi 接收参数为 apiresult 数据，可以对接口返回数据做处理，返回 false 会取原始的 apiresult */
  afterApi: { type: Function as PropType<(apiResult: any) => Promise<any>> },
}

export type FileActionUploadProps = ExtractPropTypes<typeof fileActionUploadProps>

export const fileActionUploadEmits = {
  change: (...args: ArgumentsOf<AUploadProps['onChange']>) => args instanceof Object,
  fileListChange: (...args: [FileType[]]) => args instanceof Object,
  uploadFileListChange: (...args: [Record<string, any>[]]) => args instanceof Object,
}

export type FileActionUploadEmits = typeof fileActionUploadEmits

export interface FileActionUploadInstance {
  elRef: Ref<HTMLDivElement | undefined>
  /** 因为 AUpload 导出实例为 any，所以这里只能为 any */
  AUploadRef: Ref<any | undefined>
}
