<script lang="ts">
import { computed, defineComponent } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
export default defineComponent({
  name: 'BasicDrawerClose',
  components: { Tooltip, CloseOutlined },
  emits: ['cancel'],
  setup(props, { emit }) {
    const prefixCls = 'ta-basic-drawer-close'

    const getClass = computed(() => {
      return [prefixCls, `${prefixCls}--custom`]
    })

    function handleCancel(e: Event) {
      emit('cancel', e)
    }

    return {
      tavI18n,
      getClass,
      prefixCls,
      handleCancel,
    }
  },
})
</script>
<template>
  <div :class="getClass">
    <Tooltip :title="tavI18n('Tav.common.closeText')" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>
