import { withInstall } from '@tav-ui/utils/with-install';
import Form from './src/form.vue';
const TaForm = withInstall(Form);
export { TaForm };
export default TaForm;
export { useForm } from './src/hooks/useForm';
