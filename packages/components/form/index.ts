import { withInstall } from '@tav-ui/utils/with-install'
import Form from './src/form.vue'
import apiSelect from './src/components/ApiSelect.vue'
import radioButtonGroup from './src/components/RadioButtonGroup.vue'
const TaForm = withInstall(Form)
const ApiSelect = withInstall(apiSelect)
const RadioButtonGroup = withInstall(radioButtonGroup)
export { TaForm, ApiSelect, RadioButtonGroup }
export default TaForm
export { useForm } from './src/hooks/useForm'
// export * from './src/props'
export * from './src/types/form'
export * from './src/types/formItem'
