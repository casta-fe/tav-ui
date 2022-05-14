<script lang="ts">
import { defineComponent, ref } from 'vue'
import Button from '@tav-ui/components/button'
import { buttonGroupProps } from './types'
import type { ButtonGroupItem } from './types'

export default defineComponent({
  name: 'TaButtonGroup',
  components: { Button },
  props: buttonGroupProps,
  emits: ['btnClick', 'update:active'],
  setup(props, { emit }) {
    const scrollRef = ref(null)
    const clickHandle = (data: ButtonGroupItem) => {
      if (data.value == props.active) return
      emit('update:active', data.value)
      emit('btnClick', data)
    }

    return {
      scrollRef,
      clickHandle,
    }
  },
})
</script>

<template>
  <div class="ta-button-group" @click.stop>
    <div ref="scrollRef" class="ta-button-group-inner">
      <Button
        v-for="(item, index) in buttons"
        :key="item.value"
        :type="active == item.value ? 'primary' : 'default'"
        :disabled="item.disabled"
        :permission="item.permission"
        @click="clickHandle(item, index, $event)"
      >
        {{ item.label }}
        <span v-if="item.number != null">（{{ item.number }}）</span>
      </Button>
    </div>
    <slot />
  </div>
</template>
