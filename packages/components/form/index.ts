import { withInstall } from '@tav-ui/utils/with-install'
import Form from './src/form.vue'
const TaForm = withInstall(Form)
export { default as ApiSelect } from './src/components/ApiSelect.vue'
export { default as RadioButtonGroup } from './src/components/RadioButtonGroup.vue'
export { TaForm }
export default TaForm
export { useForm } from './src/hooks/useForm'
// export * from './src/props'
export * from './src/types/form'
export * from './src/types/formItem'
