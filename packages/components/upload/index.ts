import { withInstall } from '@tav-ui/utils/with-install'
import { default as Upload } from './src/Upload'
export const TaUpload = withInstall(Upload)
export default TaUpload
export type { BasicPropsType as TaUploadBasciProps } from './src/types'
