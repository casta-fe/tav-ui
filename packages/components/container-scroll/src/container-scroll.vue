<script lang="ts">
import { defineComponent, nextTick, ref, unref } from 'vue';
import { useScrollTo } from '@tav-ui/hooks/event/useScrollTo';
import Scrollbar from '../../scrollbar';
import type { ScrollbarType } from '../../scrollbar/src/types';

export default defineComponent({
  name: 'TaScrollContainer',
  components: { Scrollbar },
  setup() {
    const scrollbarRef = ref<ScrollbarType | null>(null);

    /**
     * Scroll to the specified position
     */
    function scrollTo(to: number, duration = 500) {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) return;

      nextTick(() => {
        const wrap = unref(scrollbar.wrap);
        if (!wrap) return;

        const { start } = useScrollTo({
          el: wrap,
          to,
          duration,
        });
        start();
      });
    }

    function getScrollWrap() {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) return null;

      return scrollbar.wrap;
    }

    /**
     * Scroll to the bottom
     */
    function scrollBottom() {
      const scrollbar = unref(scrollbarRef);
      if (!scrollbar) return;

      nextTick(() => {
        const wrap = unref(scrollbar.wrap) as any;
        if (!wrap) return;

        const scrollHeight = wrap.scrollHeight as number;
        const { start } = useScrollTo({
          el: wrap,
          to: scrollHeight,
        });
        start();
      });
    }

    return {
      scrollbarRef,
      scrollTo,
      scrollBottom,
      getScrollWrap,
    };
  },
});
</script>

<template>
  <Scrollbar ref="scrollbarRef" container-class="scroll-container" v-bind="$attrs">
    <slot />
  </Scrollbar>
</template>
