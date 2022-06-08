<template>
  <Button v-bind="$attrs" :disabled="isStart" :loading="loading" @click="handleStart">
    {{ getButtonText }}
  </Button>
</template>
<script lang="ts">
import { computed, defineComponent, ref, unref, watchEffect } from 'vue'
import { Button } from 'ant-design-vue'
import { isFunction } from '@tav-ui/utils/is'
import { useCountdown } from '@tav-ui/components/count-down/src/useCountdown'
import { countButtonProps } from './types'
export default defineComponent({
  name: 'TaCountButton',
  components: { Button },
  props: countButtonProps,
  setup(props) {
    const loading = ref(false)

    const { currentCount, isStart, start, reset } = useCountdown(props.count)

    const getButtonText = computed(() => {
      return !unref(isStart) ? `获取验证码` : `${unref(currentCount)}秒后重新获取`
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
