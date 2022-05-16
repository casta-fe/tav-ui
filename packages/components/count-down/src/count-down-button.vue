<template>
  <Button v-bind="$attrs" :disabled="isStart" :loading="loading" @click="handleStart">
    {{ getButtonText }}
  </Button>
</template>
<script lang="ts">
import { computed, defineComponent, ref, unref, watchEffect } from 'vue'
import { Button } from 'ant-design-vue'
import { isFunction } from '@tav-ui/utils/is'
import { useCountdown } from './useCountdown'
import { countDownButtonProps } from './types'

export default defineComponent({
  name: 'TaCountDownButton',
  components: { Button },
  props: countDownButtonProps,
  setup(props) {
    const loading = ref(false)

    const { currentCount, isStart, start, reset } = useCountdown(props.count)

    const getButtonText = computed(() => {
      return !unref(isStart) ? '获取验证码' : `${unref(currentCount)}秒后重新获取`
    })

    watchEffect(() => {
      props.value === undefined && reset()
    })

    /**
     * @description: Judge whether there is an external function before execution, and decide whether to start after execution
     */
    async function handleStart() {
      const { beforeStartFunc } = props
      if (beforeStartFunc && isFunction(beforeStartFunc)) {
        loading.value = true
        try {
          const canStart = await beforeStartFunc()
          canStart && start()
        } finally {
          loading.value = false
        }
      } else {
        start()
      }
    }
    return { handleStart, currentCount, loading, getButtonText, isStart }
  },
})
</script>
