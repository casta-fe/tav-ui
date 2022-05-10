import { nextTick, onActivated, onMounted } from 'vue';

interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

export function onMountedOrActivated(hook: Fn) {
  let mounted: boolean;

  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}
