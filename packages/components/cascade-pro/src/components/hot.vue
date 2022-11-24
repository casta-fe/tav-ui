<template>
  <div v-if="cascadeProHot.visible" class="ta-cascade-pro-hot">
    <CheckableTag
      v-for="cascade in cascadeProHot.list"
      :key="cascade.id"
      :checked="
        selectedHots.filter((selectedCascade) => selectedCascade.idPath === cascade.idPath).length >
        0
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
    const { /*hot,*/ options, selectRecords, fields } = useCascadeProContext()
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

    const getAddAndDeleteOptions = (
      newOptions: CascadeProOption[],
      oldOptions: CascadeProOption[]
    ) => {
      const added: CascadeProOption[] = []
      const deleted: CascadeProOption[] = []
      if (newOptions.length > oldOptions.length) {
        newOptions.forEach((hot) => {
          const isExist = oldOptions.find((_hot) => _hot.idPath === hot.idPath)
          if (!isExist) {
            added.push(hot)
          }
        })
      } else {
        oldOptions.forEach((hot) => {
          const isExist = newOptions.find((_hot) => _hot.idPath === hot.idPath)
          if (!isExist) {
            const isLastField = hot.idPath.split('-').length === unref(fields).length
            deleted.push({ ...hot, type: isLastField ? 'lastField' : 'middleField' })
          }
        })
      }

      return {
        added,
        deleted,
      }
    }

    const handleHotChange = (cascade: CascadeProOption, checked: boolean) => {
      const nextSelectedHots = checked
        ? [...unref(selectedHots), cascade]
        : unref(selectedHots).filter((selectedCascade) => selectedCascade.idPath !== cascade.idPath)

      const { added, deleted } = getAddAndDeleteOptions(nextSelectedHots, unref(selectedHots))

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
      () => unref(selectRecords),
      (newSelectRecords, oldSelectRecords) => {
        if (newSelectRecords.length === 0) handleHotClearAll()

        if (newSelectRecords && oldSelectRecords) {
          const { added, deleted } = getAddAndDeleteOptions(newSelectRecords, oldSelectRecords)

          if (added.length > 0) {
            selectedHots.value = [...unref(selectedHots), ...added]
          }

          if (deleted.length > 0) {
            const remainHots = unref(selectedHots).filter((option) => {
              if (deleted.find((_option) => _option.idPath === option.idPath)) {
                return false
              }
              return true
            })

            selectedHots.value = [...unref(remainHots)]
          }
        }
      },
      {
        // immediate: true,
        deep: true,
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
