<script lang="ts">
import { defineComponent } from 'vue'
import BasicArrow from '@tav-ui/components/basic-arrow'
import BasicTitle from '@tav-ui/components/basic-title'
import type { PropType } from 'vue'

const props = {
  prefixCls: { type: String },
  helpMessage: {
    type: [Array, String] as PropType<string[] | string>,
    default: '',
  },
  title: { type: String },
  show: { type: Boolean },
  canExpan: { type: Boolean },
}

export default defineComponent({
  name: 'TaCollapseHeader',
  components: { BasicArrow, BasicTitle },
  inheritAttrs: false,
  props,
  emits: ['expand'],
})
</script>
<template>
  <div :class="[`${prefixCls}__header px-2 py-5`, $attrs.class]">
    <BasicTitle :help-message="helpMessage" normal>
      <template v-if="title">
        {{ title }}
      </template>
      <template v-else>
        <slot name="title" />
      </template>
    </BasicTitle>
    <div :class="`${prefixCls}__action`">
      <slot name="action" />
      <BasicArrow v-if="canExpan" up :expand="show" @click="$emit('expand')" />
    </div>
  </div>
</template>
