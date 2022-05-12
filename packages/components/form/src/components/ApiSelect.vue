<script lang="ts">
import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { Select } from 'ant-design-vue'
import { get, omit } from 'lodash-es'
import { useRuleFormItem } from '@tav-ui/hooks/component/useFormItem'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import { isFunction } from '@tav-ui/utils/is'
import { propTypes } from '@tav-ui/utils/propTypes'
import type { PropType } from 'vue'
import type { ApiSelectOptionsItem } from './types'

export default defineComponent({
  name: 'ApiSelect',
  components: {
    Select,
    LoadingOutlined,
  },
  inheritAttrs: false,
  props: {
    value: [Array, Object, String, Number],
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(arg?: Record<string, any>) => Promise<ApiSelectOptionsItem[]>>,
      default: null,
    },
    // api params
    params: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    // support xxx.xxx.xx
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    immediate: propTypes.bool.def(true),
  },
  emits: ['options-change', 'change'],
  setup(props, { emit }) {
    const options = ref<ApiSelectOptionsItem[]>([])
    const loading = ref(false)
    const isFirstLoad = ref(true)
    const emitData = ref<any[]>([])
    const attrs = useAttrs()

    // Embedded in the form, just use the hook binding to perform form verification
    const [state] = useRuleFormItem(props, 'value', 'change', emitData) as any

    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props

      return unref(options).reduce((prev, next: Record<string, any>) => {
        if (next) {
          const value = next[valueField]
          prev.push({
            ...omit(next, [labelField, valueField]),
            label: next[labelField],
            value: numberToString ? `${value}` : value,
          })
        }
        return prev
      }, [] as ApiSelectOptionsItem[])
    })

    watchEffect(() => {
      props.immediate && fetch()
    })

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch()
      },
      { deep: true }
    )

    async function fetch() {
      const api = props.api
      if (!api || !isFunction(api)) return
      options.value = []
      try {
        loading.value = true
        const res = await api(props.params)
        if (Array.isArray(res)) {
          options.value = res
          emitChange()
          return
        }
        if (props.resultField) options.value = get(res, props.resultField) || []

        emitChange()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error)
      } finally {
        loading.value = false
      }
    }

    async function handleFetch() {
      if (!props.immediate && unref(isFirstLoad)) {
        await fetch()
        isFirstLoad.value = false
      }
    }

    function emitChange() {
      emit('options-change', unref(getOptions))
    }

    function handleChange(_, ...args) {
      emitData.value = args
    }

    return { state, attrs, getOptions, loading, handleFetch, handleChange }
  },
})
</script>
<template>
  <Select
    v-bind="$attrs"
    v-model:value="state"
    :options="getOptions"
    @dropdown-visible-change="handleFetch"
    @change="handleChange"
  >
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
    <template v-if="loading" #suffixIcon>
      <LoadingOutlined spin />
    </template>
    <template v-if="loading" #notFoundContent>
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ '请等待数据加载完成...' }}
      </span>
    </template>
  </Select>
</template>
