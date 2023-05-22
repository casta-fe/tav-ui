<template>
  <div v-if="cascadeProFirstLetter.visible" class="ta-cascade-pro-first-letter">
    <span v-if="firstLetterTitle">{{ firstLetterTitle }}</span>
    <CheckableTag
      v-for="firstLetter in cascadeProFirstLetter.list"
      :key="firstLetter"
      :checked="selectedFirstLetters.indexOf(firstLetter!) > -1"
      @change="(checked) => handleChange(firstLetter!, checked)"
    >
      {{ firstLetter }}
    </CheckableTag>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import { CheckableTag } from 'ant-design-vue'
import { cascadeProFirstLetterProps } from '../types'
import { useCascadeProContext } from '../hooks'

export interface CascadeProFirstLetterInstance {
  handleFirstLetterClearAll: (...args: any) => void
}

export default defineComponent({
  name: 'TaCascadeProFirstLetter',
  components: {
    CheckableTag,
  },
  props: cascadeProFirstLetterProps,
  emits: ['change'],
  setup(props, { emit, expose }) {
    const { firstLetterVisible, options } = useCascadeProContext()

    const selectedFirstLetters = ref<string[]>([])

    const cascadeProFirstLetter = computed(() => {
      const visible = unref(firstLetterVisible)

      // const visible = props.firstLetterVisible && props.firstLetterVisible && props.firstLetterFields && props.firstLetterFields.length > 0

      const groupOptions = unref(options).group
      const currentGroupOptions = groupOptions[0]

      const firstLetters = currentGroupOptions.map((option) => option.firstLetter)
      // 如果传入的数据中没有 firstLetter 属性该组件也不显示
      const isNotHaveFirstLetters =
        firstLetters.filter((firstLetter) => !firstLetter).length === currentGroupOptions.length

      if (visible && !isNotHaveFirstLetters) {
        const firstLetters = [
          ...new Set(currentGroupOptions.map((option) => option.firstLetter)),
        ].sort()

        return {
          visible: true,
          list: firstLetters,
        }
      } else {
        return {
          visible: false,
          list: [],
        }
      }
    })

    // // TODO 根据不同级数据动态显示首字母 fieldIndex 从 selectrecordfibers 来
    // const handler = () => {
    //   const _selectRecord = unref(selectRecord)
    //   const _fields = unref(fields)
    //   const result = _selectRecord.split('-')
    //   if (result.length > _fields.length) {
    //     // 异常情况，返回一级兜底
    //     console.warn('CascadePro handleOptions has error.')
    //     const groupOptions = unref(options).group
    //     const currentGroupOptions = groupOptions[0]
    //     return handleFirstLetters(currentGroupOptions)
    //   } else {
    //     if (result.length === 1) {
    //       if (result[0] === '') {
    //         // 初始化，selectrecord 为 ''
    //         const groupOptions = unref(options).group
    //         const currentGroupOptions = groupOptions[0]
    //         return handleFirstLetters(currentGroupOptions)
    //       } else {
    //         // 只在一级选择
    //         const treeOptions = unref(options).tree
    //         const currentGroupOptions = treeOptions.find(
    //           (option) => option.id === result[0]
    //         )?.children
    //         return handleFirstLetters(currentGroupOptions)
    //       }
    //     } else {
    //       // 根据 idpath 找到当前的children
    //       if (result.length === _fields.length) {
    //         // 在最后一级选择什么也不做
    //       } else {
    //         // 在最后一级与一级之间选择
    //         const treeOptions = unref(options).tree
    //         let currentGroupOptions: CascadeProOption[] = []
    //         for (let i = 0; i < result.length; i++) {
    //           const options =
    //             currentGroupOptions && currentGroupOptions.length > 0
    //               ? currentGroupOptions
    //               : treeOptions
    //           currentGroupOptions = options.find((option) => option.id === result[i])?.children!
    //         }
    //         return currentGroupOptions
    //       }
    //     }
    //   }
    // }

    // // TODO 根据不同级数据动态显示首字母
    // watch(
    //   () => selectRecord,
    //   () => {
    //     handler()
    //   },
    //   { immediate: true }
    // )

    const handleChange = (firstLetter: string, checked: boolean) => {
      const nextSelectedFirstLetters = checked
        ? [firstLetter]
        : unref(selectedFirstLetters).filter(
            (selectedFirstLetter) => selectedFirstLetter !== firstLetter
          )
      selectedFirstLetters.value = nextSelectedFirstLetters
      emit('change', unref(selectedFirstLetters))
    }

    const handleFirstLetterClearAll = () => {
      selectedFirstLetters.value = []
    }

    expose({
      handleFirstLetterClearAll,
    })

    return {
      cascadeProFirstLetter,
      selectedFirstLetters,
      handleChange,
    }
  },
})
</script>
