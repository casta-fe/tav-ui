<script lang="ts">
import { computed, defineComponent, unref } from 'vue'
import { Button } from 'ant-design-vue'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import Icon from '@tav-ui/components/icon'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { isUnDef } from '@tav-ui/utils'
import { buttonProps } from './types'
import type { Ref } from 'vue'

export default defineComponent({
  name: 'TaButton',
  components: { Button, Icon },
  inheritAttrs: false,
  props: buttonProps,
  setup(props) {
    // get component class
    const attrs = useAttrs({ excludeDefaultKeys: false })
    const getButtonClass = computed(() => {
      const { color, disabled } = props
      return [
        {
          [`ant-btn-${color}`]: !!color,
          'is-disabled': disabled,
        },
      ]
    })

    // get inherit binding value
    const getBindValue = computed(() => ({ ...unref(attrs), ...props }))

    const IfShow = computed(() => (code) => {
      const permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>
      const PermissionFlag = isUnDef(code) ? true : unref(permissions)[code]?.ifShow
      const PermisionCodeFlag = isUnDef(props.permissionCode) ? true : props.permissionCode === 1
      return PermissionFlag && PermisionCodeFlag && props.ifShow
    })
    return { getButtonClass, getBindValue, IfShow }
  },
})
</script>
<template>
  <Button
    v-show="IfShow(permission)"
    v-bind="getBindValue"
    :class="getButtonClass"
    class="ta-basic-button"
    @click="onClick"
  >
    <template #default="data">
      <Icon v-if="!loading && preIcon" :icon="preIcon" :size="iconSize" :color="preIconColor" />
      <template v-if="!loading">
        <slot v-bind="data || {}" />
      </template>
      <Icon v-if="!loading && postIcon" :icon="postIcon" :size="iconSize" :color="postIconColor" />
    </template>
  </Button>
</template>
