<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { basicProps } from '../types'
export default defineComponent({
  name: 'BasicModalFooter',
  components: { AButton: Button },
  props: basicProps,
  emits: ['ok', 'cancel'],
  setup(_, { emit }) {
    function handleOk(e: Event) {
      emit('ok', e)
    }

    function handleCancel(e: Event) {
      emit('cancel', e)
    }

    return { handleOk, tavI18n, handleCancel }
  },
})
</script>
<template>
  <div>
    <slot name="insertFooter" />
    <a-button
      v-if="showOkBtn"
      type="primary"
      :loading="confirmLoading"
      v-bind="okButtonProps"
      @click="handleOk"
    >
      {{ okText || tavI18n('Tav.common.okText') }}
    </a-button>
    <slot name="centerFooter" />
    <a-button v-if="showCancelBtn" v-bind="cancelButtonProps" @click="handleCancel">
      {{ cancelText || tavI18n('Tav.common.cancelText') }}
    </a-button>
    <slot name="appendFooter" />
  </div>
</template>
