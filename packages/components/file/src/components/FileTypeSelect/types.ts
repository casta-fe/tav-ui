import { type SelectProps as ASelectProps } from 'ant-design-vue'
import { type ApiParams, type FileInjectedProps } from '../../typings'

// 注意该文件与 vue 文件中的 props 类型需要同步更新
/** 继承 FileInjectedProps, ApiParams 是为了方便组件单独使用 */
export interface FileTypeSelectProps extends FileInjectedProps, ApiParams, ASelectProps {
  visible?: boolean
  defaultValue?: string
  immediate?: boolean

  api?: FileInjectedProps['apiReadFileType']
  beforeApi?: (...args: any[]) => Promise<any>
  afterApi?: (...args: any[]) => Promise<any>

  // 需要支持表单项目
}

export interface FileTypeSelectEmits {
  click: (evt: MouseEvent) => boolean
}
