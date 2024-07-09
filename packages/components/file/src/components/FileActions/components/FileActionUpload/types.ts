import { type UploadProps as AUploadProps } from 'ant-design-vue'
import { type ButtonProps } from '@tav-ui/components/button'
import { type FileInjectedProps } from '../../../../typings/injected-props'

export interface FileActionUploadProps extends Omit<AUploadProps, 'type'>, ButtonProps {
  /** 使用 uploadType 重写 upload 中的 type 属性，避免与 button 中的 type 重复 */
  uploadType: AUploadProps['type']

  visible?: boolean
  accpet: FileInjectedProps['accpet']
  sizeRange: FileInjectedProps['sizeRange']
  maxCount: FileInjectedProps['maxCount']
  api: FileInjectedProps['apiCreateFile']
  beforeApi?: (...args: any[]) => Promise<any>
  afterApi?: (...args: any[]) => Promise<any>
}

export interface FileActionUploadEmits {
  click: (evt: MouseEvent) => boolean
}
