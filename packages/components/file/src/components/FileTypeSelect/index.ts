import { withInstall } from '@tav-ui/utils/with-install'
import FileTypeSelect from './index.vue'

export * from './types'
export {
  useRequest as useFileTypeSelectRequest,
  useOptions as useFileTypeSelectOptions,
} from './hooks'
export const TaFileTypeSelect = withInstall(FileTypeSelect)
export default TaFileTypeSelect
