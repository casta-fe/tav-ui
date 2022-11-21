<template>
  <div v-if="cascadeProHot.visible" class="ta-cascade-pro-hot">
    <CheckableTag
      v-for="cascade in cascadeProHot.list"
      :key="cascade.id"
      :checked="
        selectedHots.filter((selectedCascade) => selectedCascade.id === cascade.id).length > 0
      "
      @change="(checked) => handleHotChange(cascade, checked)"
    >
      {{ cascade.name }}
    </CheckableTag>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref, watch } from 'vue'
import { CheckableTag } from 'ant-design-vue'
import { cascadeProHotProps } from '../types'
import { useCascadeProContext } from '../hooks'
import type { CascadeProOption } from '../types'

export interface CascadeProHotInstance {
  handleHotClearAll: (...args: any) => void
}

export default defineComponent({
  name: 'TaCascadeProHot',
  components: {
    CheckableTag,
  },
  props: cascadeProHotProps,
  emits: ['change'],
  setup(props, { emit, expose }) {
    const { /*hot,*/ options, selectRecords } = useCascadeProContext()
    const selectedHots = ref<CascadeProOption[]>([])
    const list = ref<CascadeProOption[]>(
      props.generateHotList(unref(options).list, props.hotKeyWords)
    )

    const cascadeProHot = computed(() => {
      return {
        visible: props.hotVisible && props.hotKeyWords && props.hotKeyWords.length > 0,
        list: props.generateHotList(unref(options).list, props.hotKeyWords),
      }
    })

    const handleHotChange = (cascade: CascadeProOption, checked: boolean) => {
      const nextSelectedHots = checked
        ? [...unref(selectedHots), cascade]
        : unref(selectedHots).filter((selectedCascade) => selectedCascade.idPath !== cascade.idPath)

      const added: CascadeProOption[] = []
      const deleted: CascadeProOption[] = []
      if (nextSelectedHots.length > unref(selectedHots).length) {
        nextSelectedHots.forEach((hot) => {
          const isExist = unref(selectedHots).find((_hot) => _hot.idPath === hot.idPath)
          if (!isExist) {
            added.push(hot)
          }
        })
      } else {
        unref(selectedHots).forEach((hot) => {
          const isExist = nextSelectedHots.find((_hot) => _hot.idPath === hot.idPath)
          if (!isExist) {
            deleted.push(hot)
          }
        })
      }

      selectedHots.value = nextSelectedHots

      emit('change', {
        added,
        deleted,
      })
    }

    const handleHotClearAll = () => {
      selectedHots.value = []
    }

    expose({
      handleHotClearAll,
    })

    watch(
      () => unref(selectRecords).length,
      () => {
        if (unref(selectRecords).length === 0) handleHotClearAll

        if (unref(selectRecords).length > 0) {
          unref(list).forEach((option) => {
            const target = unref(selectRecords).find((_option) => _option.idPath === option.idPath)
            const isExist = unref(selectedHots).find((_option) => _option.idPath === option.idPath)
            if (target && !isExist) {
              selectedHots.value = [...unref(selectedHots), target]
            }
          })
        }
      },
      {
        immediate: true,
      }
    )

    return {
      // hot,
      cascadeProHot,
      selectedHots,
      handleHotChange,
    }
  },
})
</script>
