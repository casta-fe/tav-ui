<template>
  <div :class="prefixCls" class="relative">
    <InputPassword
      v-if="showInput"
      v-bind="$attrs"
      allow-clear
      :value="innerValueRef"
      :disabled="disabled"
      @change="handleChange"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
    </InputPassword>
    <div :class="`${prefixCls}-bar`">
      <div :class="`${prefixCls}-bar--fill`" :data-score="getPasswordStrength" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue'
import { zxcvbn } from '@zxcvbn-ts/core'
import { Input } from 'ant-design-vue'
import { strengthMeterProps } from './types'
import type { ChangeEvent } from '@tav-ui/components/icon-picker/src/types'

export default defineComponent({
  name: 'TaStrengthMeter',
  components: { InputPassword: Input.Password },
  props: strengthMeterProps,
  emits: ['score-change', 'change'],
  setup(props, { emit }) {
    const innerValueRef = ref('')
    const prefixCls = 'ta-strength-meter'

    const getPasswordStrength = computed(() => {
      const { disabled } = props
      if (disabled) return -1
      const innerValue = unref(innerValueRef)
      const score = innerValue ? (zxcvbn(unref(innerValueRef)) as any).score : -1
      emit('score-change', score)
      return score
    })

    function handleChange(e: ChangeEvent) {
      innerValueRef.value = e.target.value
    }

    watchEffect(() => {
      innerValueRef.value = props.value || ''
    })

    watch(
      () => unref(innerValueRef),
      (val) => {
        emit('change', val)
      }
    )

    return {
      getPasswordStrength,
      handleChange,
      prefixCls,
      innerValueRef,
    }
  },
})
</script>
