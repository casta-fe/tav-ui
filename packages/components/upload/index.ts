import { withInstall } from '@tav-ui/utils/with-install'
import { default as Upload } from './src/Upload'
export const TaUpload = withInstall(Upload)
export default TaUpload
export type { BasicPropsType as UploadBasciProps } from './src/types'
export * from './src/hooks'
