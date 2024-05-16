<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import Button from '@tav-ui/components/button'
import { useScrollToCenter } from '@tav-ui/hooks'
import { isNullOrUnDef } from '@tav-ui/utils'
import { buttonGroupProps } from './types'
import type { Ref } from 'vue'
import type { ButtonGroupItem } from './types'
import type { ElRef } from '../../modal/src/types'

export default defineComponent({
  name: 'TaButtonGroup',
  components: { Button },
  props: buttonGroupProps,
  emits: ['btnClick', 'update:active'],
  setup(props, { emit }) {
    const scrollRef = ref(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clickHandle = (data: ButtonGroupItem, index: number, event) => {
      if (data.value == props.active) return
      emit('update:active', data.value)
      emit('btnClick', data)
    }

    const { scrollToCenter } = useScrollToCenter(scrollRef)
    watch(
      () => props.active,
      (v) => {
        const buttonIndex = props.buttons.findIndex((btn) => btn.value === v)
        const buttonEl = (scrollRef.value as ElRef)?.querySelectorAll('button')[buttonIndex]
        buttonEl && scrollToCenter(buttonEl)
      },
      {
        immediate: true,
      }
    )

    const permissions = useGlobalConfig('permissions') as Ref<Record<string, any>>

    const filterButton = computed(() =>
      props.buttons.filter((btn) => {
        if (!btn.permission) return true
        return permissions.value[btn.permission]?.ifShow
      })
    )

    if (props.buttons.length !== filterButton.value.length) {
      const nextBtn = filterButton.value[0]
      if (nextBtn) {
        clickHandle(nextBtn, 0, undefined)
      } else {
        emit('update:active', -1)
      }
    }
    const getNumber = (num) => {
      if (isNullOrUnDef(num)) {
        return 0
      }
      if (props.badgeMax) {
        return num > props.badgeMax ? props.badgeMax : num
      } else {
        return num
      }
    }
    return {
      scrollRef,
      getNumber,
      clickHandle,
      filterButton,
    }
  },
})
</script>

<template>
  <div class="ta-button-group" @click.stop>
    <div ref="scrollRef" class="ta-button-group-inner">
      <Button
        v-for="(item, index) in filterButton"
        :key="item.value"
        :type="active == item.value ? 'primary' : 'default'"
        :disabled="item.disabled"
        :loading="item.loading"
        @click="clickHandle(item, index, $event)"
      >
        {{ item.label }}
        <span v-if="item.number != null">（{{ item.number }}）</span>
        <sup v-if="item.badge != null" class="badge-count">
          <template v-if="item.badge !== true">
            {{ getNumber(item.badge) }}
          </template>
          <template v-else-if="item.number != null">
            {{ getNumber(item.number) }}
          </template>
        </sup>
      </Button>
    </div>
    <slot />
  </div>
</template>
