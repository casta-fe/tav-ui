<template>
  <div class="ta-cascade-pro-search-result">
    <div class="ta-cascade-pro-search-result-title">
      <div class="ta-cascade-pro-search-result-tip">
        {{ tavI18n('Tav.common.selectedText') }}{{ options.length }}）
      </div>
      <Button type="link" size="small" @click="handleClearAll">
        {{ tavI18n('Tav.common.clearText') }}
      </Button>
    </div>
    <div class="ta-cascade-pro-search-result-list">
      <Tag
        v-for="option in options"
        :key="option.idPath"
        closable
        @close="() => handleClear(option)"
      >
        {{ option.namePath }}
      </Tag>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, watch } from 'vue'
import { Tag } from 'ant-design-vue'
import Button from '@tav-ui/components/button'
// import { cascadeProSelectResultProps } from '../types'
import { tavI18n } from '@tav-ui/locales'
import { useCascadeProContext } from '../hooks'
// import { findChilds, findParents } from '../utils'
import type { CascadeProOption } from '../types'
import type { Ref } from 'vue'
export interface CascadeProSelectResultInstance {
  handleClear: (option: CascadeProOption) => void
  options: Ref<CascadeProOption[]>
}

export default defineComponent({
  name: 'TaCascadeProSelectResult',
  components: { Button, Tag },
  // props: cascadeProSelectResultProps,
  emits: ['clear', 'clearAll'],
  setup(props, { emit, expose }) {
    const { selectRecords, fields } = useCascadeProContext()

    const visible = ref<boolean>(false)
    const options = ref<CascadeProOption[]>([])

    /**
     * 新增选中结果时，只需要显示最深的子级即可（但是其每一个父级都放在了selectrecords中）
     *
     * @param group
     * @param result
     */
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

    /**
     * 删除时不仅要删除点击的元素，还需要删除点击元素的父级或者子级
     *
     * @param target
     * @param result
     * @param fieldType
     */
    const filterOptionsByOptionRecursive = (
      target: CascadeProOption,
      result: CascadeProOption[],
      fieldType: 'first' | 'middle' | 'last'
    ) => {
      // 去重
      if (!result.find((option) => option.idPath === target.idPath)) {
        result.push(target)
      }

      // option.idPath.split("-").length === target.idPath.split("-").length - 1 是为了兼容北京与北京市id相同的情况
      // last 指的是一级一级正向按顺序选择数据的情况（只需一层一层反向找父级），middleField 是兼容hot组件，直接跨级选择数据的情况（不仅找父级还得找子级别）
      let filterResult: CascadeProOption[] = []
      if (fieldType === 'first') {
        filterResult = unref(selectRecords).filter((option) =>
          option.idPath.includes(`${target.id}-`)
        )
      } else if (fieldType === 'last') {
        filterResult = unref(selectRecords).filter(
          (option) =>
            option.id === target.pid &&
            option.idPath.split('-').length === target.idPath.split('-').length - 1
        )
      } else {
        filterResult = unref(selectRecords).filter(
          (option) =>
            (option.id === target.pid &&
              option.idPath.split('-').length === target.idPath.split('-').length - 1) ||
            (option.pid === target.id &&
              option.idPath.split('-').length === target.idPath.split('-').length + 1)
        )
      }
      if (filterResult.length > 0) {
        // option.idPath.split("-").length === target.idPath.split("-").length 是为了兼容北京与北京市id相同的情况
        const isOtherSameLevelRecord =
          fieldType !== 'first'
            ? unref(selectRecords).filter(
                (option) =>
                  option.pid === target.pid &&
                  option.idPath.split('-').length === target.idPath.split('-').length
              ).length > 1
            : false

        // 有同级不删除，无同级再删除
        if (!isOtherSameLevelRecord) {
          filterResult.forEach((option) => {
            // 去重
            if (!result.find((_option) => _option.idPath === option.idPath)) {
              result.push(option)
            }
          })

          if (fieldType !== 'first') {
            let _fieldType: 'first' | 'middle' | 'last' = 'last'
            if (filterResult[0].idPath.split('-').length === 1) {
              _fieldType = 'first'
            } else if (filterResult[0].idPath.split('-').length === unref(fields).length) {
              _fieldType = 'last'
            } else {
              _fieldType = 'middle'
            }
            filterOptionsByOptionRecursive(filterResult[0], result, _fieldType)
          }

          // // 避免爆栈，提前返回
          // if (result.length !== unref(selectRecords).length) {
          //   filterOptionsByOptionRecursive(filterResult[0], result, fieldType)
          // }
        }
      }
    }

    const handleClear = (option: CascadeProOption) => {
      let fieldType: 'first' | 'middle' | 'last' = 'last'
      if (option.idPath.split('-').length === 1) {
        fieldType = 'first'
      } else if (option.idPath.split('-').length === unref(fields).length) {
        fieldType = 'last'
      } else {
        fieldType = 'middle'
      }

      const shouldDeleteSelectRecords: CascadeProOption[] = []
      filterOptionsByOptionRecursive(option, shouldDeleteSelectRecords, fieldType)
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
      tavI18n,
      visible,
      options,
      handleClear,
      handleClearAll,
    }
  },
})
</script>
