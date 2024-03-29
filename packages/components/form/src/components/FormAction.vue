<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Col, Form } from 'ant-design-vue'
import { propTypes } from '@tav-ui/utils/propTypes'
import BasicArrow from '@tav-ui/components/basic-arrow'
import Button from '@tav-ui/components/button'
import { tavI18n } from '@tav-ui/locales'
import { useFormContext } from '../hooks/useFormContext'
import type { ButtonProps } from '@tav-ui/components/button/src/types'
import type { PropType } from 'vue'
import type { ColEx } from '../types/index'
type ButtonOptions = Partial<ButtonProps> & { text: string }

export default defineComponent({
  name: 'BasicFormAction',
  components: {
    FormItem: Form.Item,
    Button,
    BasicArrow,
    ACol: Col,
  },
  props: {
    showActionButtonGroup: propTypes.bool.def(true),
    showResetButton: propTypes.bool.def(true),
    showSubmitButton: propTypes.bool.def(true),
    showAdvancedButton: propTypes.bool.def(true),
    resetButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    submitButtonOptions: {
      type: Object as PropType<ButtonOptions>,
      default: () => ({}),
    },
    actionColOptions: {
      type: Object as PropType<Partial<ColEx>>,
      default: () => ({}),
    },
    actionSpan: propTypes.number.def(6),
    isAdvanced: propTypes.bool,
    hideAdvanceBtn: propTypes.bool,
  },
  emits: ['toggle-advanced'],
  setup(props, { emit }) {
    const actionColOpt = computed(() => {
      const { showAdvancedButton, actionSpan: span, actionColOptions } = props
      const actionSpan = 24 - span
      const advancedSpanObj = showAdvancedButton ? { span: actionSpan < 6 ? 24 : actionSpan } : {}
      const actionColOpt: Partial<ColEx> = {
        style: { textAlign: 'right' },
        span: showAdvancedButton ? 6 : 4,
        ...advancedSpanObj,
        ...actionColOptions,
      }
      return actionColOpt
    })

    const getResetBtnOptions = computed((): ButtonOptions => {
      return Object.assign(
        {
          text: tavI18n('Tav.common.resetText'),
        },
        props.resetButtonOptions
      )
    })

    const getSubmitBtnOptions = computed(() => {
      return Object.assign(
        {
          text: tavI18n('Tav.common.queryText'),
        },
        props.submitButtonOptions
      )
    })

    function toggleAdvanced() {
      emit('toggle-advanced')
    }

    return {
      tavI18n,
      actionColOpt,
      getResetBtnOptions,
      getSubmitBtnOptions,
      toggleAdvanced,
      ...useFormContext(),
    }
  },
})
</script>
<template>
  <a-col v-if="showActionButtonGroup" v-bind="actionColOpt">
    <div style="width: 100%" :style="{ textAlign: actionColOpt.style.textAlign }">
      <FormItem>
        <slot name="resetBefore" />
        <Button
          v-if="showResetButton"
          type="default"
          class="mr-2"
          v-bind="getResetBtnOptions"
          @click="resetAction"
        >
          {{ getResetBtnOptions.text }}
        </Button>
        <slot name="submitBefore" />

        <Button
          v-if="showSubmitButton"
          type="primary"
          class="mr-2"
          v-bind="getSubmitBtnOptions"
          @click="submitAction"
        >
          {{ getSubmitBtnOptions.text }}
        </Button>

        <slot name="advanceBefore" />
        <Button
          v-if="showAdvancedButton && !hideAdvanceBtn"
          type="link"
          size="small"
          @click="toggleAdvanced"
        >
          {{ isAdvanced ? tavI18n('Tav.common.openText') : tavI18n('Tav.common.closeText') }}
          <BasicArrow class="ml-1" :expand="!isAdvanced" up />
        </Button>
        <slot name="advanceAfter" />
      </FormItem>
    </div>
  </a-col>
</template>
