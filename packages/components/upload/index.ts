import { withInstall } from '@tav-ui/utils/with-install'
import { FileBranch, PreviewTable, UpdateFile } from './src/components'
import { default as Upload } from './src/Upload'
export const TaUpdateFile = withInstall(UpdateFile)
export const TaPreviewTable = withInstall(PreviewTable)
export const TaFileBranch = withInstall(FileBranch)
export const TaUpload = withInstall(Upload)
export default TaUpload
export * from './src/hooks'
export type { BasicPropsType as UploadBasciProps } from './src/types'
