import * as components from '@tav-ui/components';
import { useMessage } from '../components/useMessage';
import { useForm } from '../components/form/src/hooks/useForm';
import { useModal } from '../components/modal/src/hooks/useModal';
import { loadingCreate } from '../components/loading/src/loading-methods';
import { useTable } from '../components/table/src/hooks/useTable';
import type { App } from 'vue';
const install = (app: App) => {
  // 每个组件在写的时候都提供了install方法

  // 有的是组件，有的可能是指令 xxx.install = () => { app.directive() }
  // components.forEach((component) => app.use(component));

  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });
};

export default {
  install,
};
export { useMessage, useForm, useModal, loadingCreate, useTable };
export * from '@tav-ui/components';
