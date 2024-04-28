<script lang="ts">
import { computed, defineComponent } from 'vue'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
export default defineComponent({
  name: 'BasicModalClose',
  components: { Tooltip, FullscreenExitOutlined, FullscreenOutlined, CloseOutlined },
  props: {
    canFullscreen: { type: Boolean, default: true },
    fullScreen: { type: Boolean },
  },
  emits: ['cancel', 'fullscreen'],
  setup(props, { emit }) {
    const prefixCls = 'ta-basic-modal-close'

    const getClass = computed(() => {
      return [
        prefixCls,
        `${prefixCls}--custom`,
        {
          [`${prefixCls}--can-full`]: props.canFullscreen,
        },
      ]
    })

    function handleCancel(e: Event) {
      emit('cancel', e)
    }

    function handleFullScreen(e: Event) {
      e?.stopPropagation()
      e?.preventDefault()
      emit('fullscreen')
    }

    return {
      tavI18n,
      getClass,
      prefixCls,
      handleCancel,
      handleFullScreen,
    }
  },
})
</script>
<template>
  <div :class="getClass">
    <template v-if="canFullscreen">
      <Tooltip v-if="fullScreen" :title="tavI18n('Tav.modal.1')" placement="bottom">
        <FullscreenExitOutlined role="full" @click="handleFullScreen" />
      </Tooltip>
      <Tooltip v-else :title="tavI18n('Tav.modal.2')" placement="bottom">
        <FullscreenOutlined role="close" @click="handleFullScreen" />
      </Tooltip>
    </template>
    <Tooltip :title="tavI18n('Tav.common.closeText')" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>
