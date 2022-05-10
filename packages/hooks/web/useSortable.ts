import { nextTick, unref } from 'vue';
import type { Options } from 'sortablejs';
import type { Ref } from 'vue';

export function useSortable(el: HTMLElement | Ref<HTMLElement>, options?: Options) {
  function initSortable() {
    nextTick(async () => {
      if (!el) return;

      const Sortable = (await import('sortablejs')).default;
      Sortable.create(unref(el), {
        animation: 300,
        delay: 200,
        delayOnTouchOnly: true,
        ...options,
      });
    });
  }

  return { initSortable };
}
