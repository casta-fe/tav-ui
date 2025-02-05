<template>
  <Select
    v-model:value="state"
    :disabled="disabled"
    :placeholder="placeholder"
    :options="selectState.allList"
    :mode="mode"
    :filter-option="filterHandle"
    show-search
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
        {{ tavI18n('Tav.common.loadingText') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, ref, unref, watch } from 'vue'
import { Select } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { useRuleFormItem } from '@tav-ui/hooks/component/useFormItem'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import { isFunction } from '@tav-ui/utils/is'
import { propTypes } from '@tav-ui/utils/propTypes'
import { tavI18n } from '@tav-ui/locales'
import type { PropType } from 'vue'
type OptionsItem = { label: string; value: string; disabled?: boolean }
type TypeItems = 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE' | undefined
type Recordable = Record<string, any>
export default defineComponent({
  name: 'TaApiSelect',
  components: {
    Select,
    LoadingOutlined,
  },
  inheritAttrs: true,
  props: {
    value: [Array, Object, String, Number],
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<any>>,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    // api params
    params: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    // // 是否开启远程搜索
    // remote: {
    //   type: Boolean,
    //   default: false
    // },
    // 搜索的key
    showSearchKey: {
      type: String,
      default: 'searchValue',
    },
    // 是否允许自定义输入
    custom: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<TypeItems>,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('name'),
    valueField: propTypes.string.def('id'),
  },
  emits: ['options-change', 'change'],
  setup(props, { emit }) {
    const selectState = reactive({
      searchValue: '',
      allList: [] as OptionsItem[],
    })
    const loading = ref(false)
    const isFirstLoad = ref(true)
    const emitData = ref<any[]>([])
    const attrs = useAttrs()
    // Embedded in the form, just use the hook binding to perform form verification
    // const [state] = useRuleFormItem(props, 'value', 'change', emitData)
    const [state] = useRuleFormItem(props, 'value', 'change', emitData)
    watch(
      () => props.params,
      () => {
        console.log('apiSelect params改变')
        !unref(isFirstLoad) && fetch()
      },
      { deep: true }
    )
    // 发请求
    async function fetch() {
      const api = props.api
      if (!api || !isFunction(api)) return
      selectState.allList = []
      try {
        loading.value = true
        const params = { ...props.params }
        params[props.showSearchKey] = selectState.searchValue
        const res = await api({ ...params })
        const data: any[] = Array.isArray(res.data) ? res.data : res.data.result
        let list: OptionsItem[] = []
        data.forEach((v) => {
          list.push({
            label: v[props.labelField],
            value: v[props.valueField],
          })
        })
        // 允许自定义就给list最前面插入当前插入的数据
        if (props.custom && selectState.searchValue != '') {
          list = [{ label: selectState.searchValue, value: '0' }, ...list]
        }
        selectState.allList = list
        nextTick(() => {
          emitChange()
        })
      } catch (error) {
      } finally {
        loading.value = false
      }
    }

    function emitChange() {
      emit('options-change', unref(selectState.allList))
    }

    function handleChange(_, ...args) {
      emitData.value = args
      emit('change', state.value, ...args)
    }
    const filterHandle = (keyword: string, item: OptionsItem) => {
      return item.label.indexOf(keyword) > -1
    }
    const pageInit = () => {
      fetch()
    }
    pageInit()
    return {
      state: state as unknown as string,
      filterHandle,
      tavI18n,
      attrs,
      selectState,
      loading,
      handleChange,
    }
  },
})
</script>
