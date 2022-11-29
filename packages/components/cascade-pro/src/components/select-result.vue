<template>
  <div class="ta-cascade-pro-search-result">
    <div class="ta-cascade-pro-search-result-title">
      <div class="ta-cascade-pro-search-result-tip">已选（{{ options.length }}）</div>
      <Button type="link" size="small" @click="handleClearAll">清空</Button>
    </div>
    <div class="ta-cascade-pro-search-result-list">
      <ContainerScroll>
        <Tag
          v-for="option in options"
          :key="option.idPath"
          closable
          @close="() => handleClear(option)"
        >
          {{ option.namePath }}
        </Tag>
      </ContainerScroll>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, watch } from 'vue'
import { Tag } from 'ant-design-vue'
import Button from '@tav-ui/components/button'
import ContainerScroll from '@tav-ui/components/container-scroll'
// import { cascadeProSelectResultProps } from '../types'
import { useCascadeProContext } from '../hooks'
import type { CascadeProOption } from '../types'
import type { Ref } from 'vue'

export interface CascadeProSelectResultInstance {
  handleClear: (option: CascadeProOption, type?: 'middleField' | 'lastField') => void
  options: Ref<CascadeProOption[]>
}

export default defineComponent({
  name: 'TaCascadeProSelectResult',
  components: { Button, Tag, ContainerScroll },
  // props: cascadeProSelectResultProps,
  emits: ['clear', 'clearAll'],
  setup(props, { emit, expose }) {
    const { selectRecords, setSelectRecords, fields } = useCascadeProContext()

    const visible = ref<boolean>(false)
    const options = ref<CascadeProOption[]>([])

    const filterOptionsByRecursive = (group: CascadeProOption[], result: CascadeProOption[]) => {
      for (let i = 0; i < group.length; i++) {
        const item = group[i]
        // option.idPath !== item.idPath 是为了兼容北京与北京市id相同的情况
        const filterResult = unref(selectRecords).filter(
          (option) => option.pid === item.id && option.idPath !== item.idPath
        )
        if (filterResult.length > 0) {
          filterOptionsByRecursive(filterResult, result)
        } else {
          // 去重
          if (!result.find((option) => option.idPath === item.idPath)) {
            result.push(item)
          }
        }
      }
    }

    const handler = (_selectRecords: CascadeProOption[]) => {
      if (_selectRecords.length > 0) {
        visible.value = true
      } else {
        visible.value = false
      }

      const result: CascadeProOption[] = []
      filterOptionsByRecursive(unref(selectRecords), result)

      options.value = result
    }

    const filterOptionsByOptionRecursive = (
      target: CascadeProOption,
      result: CascadeProOption[],
      type: 'middleField' | 'lastField'
    ) => {
      // 去重
      if (!result.find((option) => option.idPath === target.idPath)) {
        result.push(target)
      }

      // option.idPath.split("-").length === target.idPath.split("-").length - 1 是为了兼容北京与北京市id相同的情况
      // lastField 指的是一级一级正向按顺序选择数据的情况（只需一层一层反向找父级），middleField 是兼容hot组件，直接跨级选择数据的情况（不仅找父级还得找子级别）
      const filterResult =
        type === 'lastField'
          ? unref(selectRecords).filter(
              (option) =>
                option.id === target.pid &&
                option.idPath.split('-').length === target.idPath.split('-').length - 1
            )
          : unref(selectRecords).filter(
              (option) =>
                (option.id === target.pid &&
                  option.idPath.split('-').length === target.idPath.split('-').length - 1) ||
                (option.pid === target.id &&
                  option.idPath.split('-').length === target.idPath.split('-').length + 1)
            )
      if (filterResult.length > 0) {
        // option.idPath.split("-").length === target.idPath.split("-").length 是为了兼容北京与北京市id相同的情况
        const isOtherSameLevelRecord =
          unref(selectRecords).filter(
            (option) =>
              option.pid === target.pid &&
              option.idPath.split('-').length === target.idPath.split('-').length
          ).length > 1

        // 有同级不删除，无同级再删除
        if (!isOtherSameLevelRecord) {
          filterResult.forEach((option) => {
            // 去重
            if (!result.find((_option) => _option.idPath === option.idPath)) {
              result.push(option)
            }
          })
          filterOptionsByOptionRecursive(filterResult[0], result, type)
        }
      }
    }

    const handleClear = (
      option: CascadeProOption,
      type: 'middleField' | 'lastField' = 'lastField'
    ) => {
      const shouldDeleteSelectRecords: CascadeProOption[] = []
      filterOptionsByOptionRecursive(option, shouldDeleteSelectRecords, type)
      const remainSelectRecords = unref(selectRecords).filter((option) => {
        if (shouldDeleteSelectRecords.find((_option) => _option.idPath === option.idPath)) {
          return false
        }
        return true
      })
      emit('clear', remainSelectRecords)
    }

    const handleClearAll = () => {
      unref(selectRecords).length > 0 && emit('clearAll')
    }

    watch(
      () => unref(selectRecords).length,
      () => {
        handler(unref(selectRecords))
      },
      {
        immediate: true,
      }
    )

    expose({
      handleClear,
      options,
    })

    return {
      visible,
      options,
      handleClear,
      handleClearAll,
    }
  },
})
</script>
