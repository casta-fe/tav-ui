<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { computed, defineComponent, h, unref } from 'vue'
import { useAttrs } from '@tav-ui/hooks'
import Icon from '../../icon'
import Button from '../../button'
import {buttonModalProps} from "./types"

declare type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'TaButtonModal',
  components: { Button },
  inheritAttrs: false,
  props: buttonModalProps,
  setup(props, { slots }) {
    const attrs = useAttrs()

    // get inherit binding value
    const getBindValues: Recordable = computed(() => {
      return Object.assign(
        {
          okText: '确认',
          cancelText: '取消',
        },
        {
          ...props,
          ...unref(attrs),
        },
      )
    })

    const handleButtonClick = () => {
      const _getBindValues = unref(getBindValues)

      if (_getBindValues.onClick) {
        _getBindValues.onClick()
      }
      else {
        const confirmProps = {
          class: 'modal-button-confirm',
          icon: h(ExclamationCircleOutlined),
          ..._getBindValues.popConfirm,
        }
        if (_getBindValues.icon)
          confirmProps.icon = h(Icon, { icon: unref(getBindValues).icon })

        if (_getBindValues.popConfirm && _getBindValues.popConfirm.confirm)
          confirmProps.onOk = _getBindValues.popConfirm.confirm

        if (_getBindValues.popConfirm && _getBindValues.popConfirm.cancel)
          confirmProps.onCancel = _getBindValues.popConfirm.cancel

        Modal.confirm(confirmProps)
      }
    }

    return {
      getBindValues,
      handleButtonClick,
    }
  },
})
</script>

<template>
  <div v-if="isInDropDown" class="ta-button-modal dropdown-modal-button" @click="handleButtonClick">
    <slot />
  </div>
  <Button
    v-else
    :type="getBindValues.type"
    :size="getBindValues.size"
    class="ta-button-modal"
    @click="handleButtonClick"
  >
    <slot />
  </Button>
</template>
