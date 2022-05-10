import { loadingCreate } from '@tav-ui/components/loading/src/loading-methods';
import type { App, Directive } from 'vue';

const loadingDirective: Directive = {
  mounted(el, binding) {
    const tip = el.getAttribute('loading-tip');
    const background = el.getAttribute('loading-background');
    const size = el.getAttribute('loading-size');
    const fullscreen = !!binding.modifiers.fullscreen;
    const instance = loadingCreate(
      {
        tip: tip || '正在加载页面 😉',
        background,
        size: size || 'large',
        loading: !!binding.value,
        absolute: !fullscreen,
      },
      fullscreen ? document.body : el
    );
    el.instance = instance;
  },
  updated(el, binding) {
    const instance = el.instance;
    if (!instance) return;
    instance.setTip(el.getAttribute('loading-tip'));
    if (binding.oldValue !== binding.value) {
      if (binding.oldValue !== binding.value) {
        instance.setLoading?.(binding.value && !instance.loading);
      }
    }
  },
  unmounted(el) {
    el?.instance?.close();
  },
};

export function setupLoadingDirective(app: App) {
  app.directive('loading', loadingDirective);
}

export default loadingDirective;
