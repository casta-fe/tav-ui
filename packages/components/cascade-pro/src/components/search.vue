<template>
  <Select
    v-if="searchVisible"
    v-model:value="value"
    class="ta-cascade-pro-search"
    show-search
    :placeholder="searchPlaceholder"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    @change="handleChange"
    @search="handleSearch"
  >
    <SelectOption
      v-for="option in options"
      :key="option.idPath"
      :value="option.idPath"
      class="ta-cascade-pro-search-option"
    >
      <template v-if="!generateSearchItem">
        <span class="ta-cascade-pro-search-option-name">{{ option.name }}</span>
        <span class="ta-cascade-pro-search-option-name-path">
          {{
            option.namePath
              .split('-')
              .slice(0, option.namePath.split('-').length - 1)
              .join('-')
          }}
        </span>
      </template>
      <template v-else>
        <component :is="generateSearchItem(option)" />
      </template>
    </SelectOption>
  </Select>
</template>

<script lang="ts">
import { defineComponent, ref, unref } from 'vue'
import { Select, SelectOption } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import { type CascadeProOption, cascadeProSearchProps } from '../types'
import { DebounceDely } from '../constants'
import { useCascadeProContext } from '../hooks'

export default defineComponent({
  name: 'TaCascadeProSearch',
  components: {
    Select,
    SelectOption,
  },
  props: cascadeProSearchProps,
  emits: ['search'],
  setup(props, { emit }) {
    const { options: dataSource } = useCascadeProContext()

    const value = ref<string | undefined>(undefined)
    const options = ref<CascadeProOption[]>([])
    const handleChange = (value: string) => {
      const result = unref(dataSource).list.find((option) => {
        return option.idPath === value
      })
      result && emit('search', result)
    }
    const handleSearch = debounce((value: string) => {
      if (!value) return
      const result = unref(dataSource).list.filter((option) => {
        return option.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      })
      options.value = result
    }, 300 || DebounceDely)

    return {
      // search,
      value,
      handleChange,
      handleSearch,
      options,
    }
  },
})
</script>
