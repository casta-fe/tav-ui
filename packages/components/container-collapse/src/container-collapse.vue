<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Skeleton } from 'ant-design-vue';
import { triggerWindowResize } from '@tav-ui/utils/event/index';
import { useTimeoutFn } from '@tav-ui/hooks/core/useTimeout';
import CollapseTransition from '../../transition';
import CollapseHeader from './CollapseHeader.vue';
import { containerCollapseProps } from './types';

export default defineComponent({
  name: 'TaContainerCollapse',
  components: { CollapseTransition, CollapseHeader, Skeleton },
  props: containerCollapseProps,
  setup(props) {
    const show = ref(true);

    const prefixCls = 'ta-container-collapse';

    /**
     * @description: Handling development events
     */
    function handleExpand() {
      show.value = !show.value;
      if (props.triggerWindowResize) {
        // 200 milliseconds here is because the expansion has animation,
        useTimeoutFn(triggerWindowResize, 200);
      }
    }
    return { show, prefixCls, handleExpand };
  },
});
</script>
<template>
  <div :class="prefixCls">
    <CollapseHeader v-bind="$props" :prefix-cls="prefixCls" :show="show" @expand="handleExpand">
      <template #title>
        <slot name="title" />
      </template>
      <template #action>
        <slot name="action" />
      </template>
    </CollapseHeader>

    <div class="p-2">
      <CollapseTransition :enable="canExpan">
        <Skeleton v-if="loading" :active="loading" />
        <div v-else v-show="show" :class="`${prefixCls}__body`">
          <slot />
        </div>
      </CollapseTransition>
    </div>
    <div v-if="$slots.footer" :class="`${prefixCls}__footer`">
      <slot name="footer" />
    </div>
  </div>
</template>
