import { createVNode, defineComponent, h, reactive, render } from 'vue';
import LoadingConstructor from './loading.vue';
import type { LoadingCreateProps } from './types';

export function loadingCreate(
  props?: Partial<LoadingCreateProps>,
  target?: HTMLElement,
  wait = false
) {
  const data = reactive({
    tip: '',
    loading: true,
    ...props,
  });

  const LoadingWrap = defineComponent({
    render() {
      return h(LoadingConstructor, { ...data });
    },
  });

  const vm = createVNode(LoadingWrap);

  if (wait) {
    // TODO fix https://github.com/anncwb/vue-Castianta-admin/issues/438
    setTimeout(() => {
      render(vm, document.createElement('div'));
    }, 0);
  } else {
    render(vm, document.createElement('div'));
  }

  function close() {
    if (vm?.el && vm.el.parentNode) vm.el.parentNode.removeChild(vm.el);
  }

  function open(target: HTMLElement = document.body) {
    if (!vm || !vm.el) return;

    target.appendChild(vm.el as HTMLElement);
  }

  if (target) open(target);

  return {
    vm,
    close,
    open,
    setTip: (tip: string) => {
      data.tip = tip;
    },
    setLoading: (loading: boolean) => {
      data.loading = loading;
    },
    get loading() {
      return data.loading;
    },
    get $el() {
      return vm?.el as HTMLElement;
    },
  };
}
