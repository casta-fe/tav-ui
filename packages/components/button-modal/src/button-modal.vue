<script lang="ts">
import { computed, defineComponent, h, ref, unref } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal, Tooltip } from 'ant-design-vue'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import Button from '@tav-ui/components/button'
import Icon from '@tav-ui/components/icon'
import { isString } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
import { buttonModalProps } from './types'
import type { TooltipProps } from 'ant-design-vue'
declare type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'TaButtonModal',
  components: { Button, Tooltip },
  inheritAttrs: false,
  props: buttonModalProps,
  setup(props) {
    const actionEl = ref(null)
    const attrs = useAttrs()

    // get inherit binding value
    const getBindValues: Recordable = computed(() => {
      return Object.assign(
        {
          okText: tavI18n('Tav.common.okText'),
          cancelText: tavI18n('Tav.common.cancelText'),
        },
        {
          ...props,
          ...unref(attrs),
        }
      )
    })

    function getTooltip(data: string | TooltipProps): TooltipProps {
      return {
        getPopupContainer: () => unref(actionEl) || document.body,
        placement: 'bottom',
        ...(isString(data) ? { title: data } : data),
      }
    }

    const handleButtonClick = () => {
      const _getBindValues = unref(getBindValues)

      if (_getBindValues.onClick) {
        _getBindValues.onClick()
      } else {
        const confirmProps = {
          class: 'modal-button-confirm',
          icon: h(ExclamationCircleOutlined),
          ..._getBindValues.popConfirm,
        }
        if (_getBindValues.icon) confirmProps.icon = h(Icon, { icon: unref(getBindValues).icon })

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
      getTooltip,
    }
  },
})
</script>

<template>
  <div>
    <div
      v-if="isInDropDown"
      class="ta-button-modal dropdown-modal-button"
      @click="handleButtonClick"
    >
      <slot />
    </div>
    <template v-else>
      <template v-if="getBindValues.tooltip">
        <Tooltip v-bind="getTooltip(getBindValues.tooltip)">
          <Button
            v-bind="{ ...getBindValues, onClick: null }"
            class="ta-button-modal"
            @click="handleButtonClick"
          >
            <slot />
          </Button>
        </Tooltip>
      </template>
      <template v-else>
        <Button
          v-bind="{ ...getBindValues, onClick: null }"
          class="ta-button-modal"
          @click="handleButtonClick"
        >
          <slot />
        </Button>
      </template>
    </template>
  </div>
</template>
