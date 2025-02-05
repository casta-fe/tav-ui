<template>
  <TaBasicTitle v-if="!isDetail" :class="prefixCls" :help-message="helpMessage">
    {{ !$slots.title ? title : '' }}
  </TaBasicTitle>

  <div v-else :class="[prefixCls, `${prefixCls}--detail`]">
    <span :class="`${prefixCls}__twrap`">
      <span v-if="showDetailBack" @click="handleClose">
        <ArrowLeftOutlined :class="`${prefixCls}__back`" />
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span :class="`${prefixCls}__toolbar`">
      <slot name="titleToolbar" />
    </span>
  </div>
</template>
<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import TaBasicTitle from '@tav-ui/components/basic-title'
import { propTypes } from '@tav-ui/utils/propTypes'

export default defineComponent({
  name: 'BasicDrawerHeader',
  components: { TaBasicTitle, ArrowLeftOutlined },
  props: {
    isDetail: propTypes.bool,
    showDetailBack: propTypes.bool,
    helpMessage: {
      type: [String, Array] as PropType<string | string[]>,
    },
    title: propTypes.string,
  },
  emits: ['close'],
  setup(_, { emit }) {
    const prefixCls = 'ta-basic-drawer-header'

    function handleClose() {
      emit('close')
    }

    return { prefixCls, handleClose }
  },
})
</script>
