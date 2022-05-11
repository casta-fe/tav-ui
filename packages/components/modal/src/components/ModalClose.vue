<script lang="ts">
import { computed, defineComponent } from 'vue'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'

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
      <Tooltip v-if="fullScreen" title="还原" placement="bottom">
        <FullscreenExitOutlined role="full" @click="handleFullScreen" />
      </Tooltip>
      <Tooltip v-else title="最大化" placement="bottom">
        <FullscreenOutlined role="close" @click="handleFullScreen" />
      </Tooltip>
    </template>
    <Tooltip title="关闭" placement="bottom">
      <CloseOutlined @click="handleCancel" />
    </Tooltip>
  </div>
</template>
