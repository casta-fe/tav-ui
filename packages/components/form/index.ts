import { withInstall } from '@tav-ui/utils/with-install'
import Form from './src/form.vue'
import apiSelect from './src/components/ApiSelect.vue'
import radioButtonGroup from './src/components/RadioButtonGroup.vue'
import searchableApiSelect from './src/components/SearchableApiSelect'
const TaForm = withInstall(Form)
const ApiSelect = withInstall(apiSelect)
const RadioButtonGroup = withInstall(radioButtonGroup)
const SearchableApiSelect = withInstall(searchableApiSelect)
export { TaForm, ApiSelect, RadioButtonGroup, SearchableApiSelect }
export default TaForm
export { useForm } from './src/hooks/useForm'
// export * from './src/props'
export * from './src/types/form'
export * from './src/types/formItem'
