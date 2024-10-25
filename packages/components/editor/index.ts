import { withInstall } from '@tav-ui/utils/with-install'
import Editor from './src/index.vue'

const TaEditor = withInstall(Editor)

export { replaceEditorUrlVarsToValue, replaceEditorUrlValueToVars } from './src/utils'
export { TaEditor }
export default TaEditor
