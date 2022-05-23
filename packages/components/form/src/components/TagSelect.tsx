import { computed, defineComponent, ref, toRaw, unref, watch } from 'vue'
import { Select } from 'ant-design-vue'
import { getPopupContainer } from '@tav-ui/utils/basic'
import type { PropType, Ref } from 'vue'
import type { VueNode } from '@tav-ui/utils'

type Recordable<T = any> = Record<string, T>
type LabelValueOption<T = any, K = any> = { label: string; value: T } & Recordable<K>
type LabelValueOptions<T = any, K = any> = LabelValueOption<T, K>

export default defineComponent({
  name: 'TagSelect',
  components: { Select },
  props: {
    options: {
      type: [Array, Object] as PropType<
        LabelValueOptions<number | string> | Ref<LabelValueOptions<number | string>>
      >,
      default: () => [],
    },
    value: {
      type: Array as unknown as PropType<[number[], LabelValueOptions<number | string>]>,
      default: () => [],
    },
    selectThenHide: { type: Boolean, default: false },
    notFoundContent: [String, Object] as PropType<string | VueNode>,
    maxTagCount: Number,
    onSearch: Function as PropType<(keyword?: string) => void>,
    onSelectEnd: Function as PropType<(result: [any[], any[]]) => void>,
    getPopupContainer: Function as PropType<(...args: any[]) => any>,
  },
  emits: ['change'],
  setup(props, { emit }) {
    const options = ref([] as unknown as LabelValueOptions)

    // 选中options [{label:"label0",value:0}]
    const selected = ref<any[]>([])
    // 选中值 [0]
    const selectedValues = computed({
      get: () => selected.value.map((el) => el.value),
      set: (v) => {
        selected.value = options.value.filter((el) => v.includes(el.value))
      },
    })
    const selectedRawOptions = computed(() =>
      options.value.filter((el) => selectedValues.value.includes(el.value))
    )
    const throwOptions = computed(() => [
      selectedValues.value,
      toRaw(selectedRawOptions.value).map((el) => toRaw(el)),
    ])
    // 外部options变化 清空已选项
    watch(
      () => unref(props.options),
      (v) => {
        selectedValues.value = []
        options.value = v
      },
      {
        immediate: true,
      }
    )
    // 回填
    watch(
      () => props.value,
      (v) => {
        selectedValues.value = v?.[0] ?? []
        if (selectedValues.value.length === 0) emit('change')
      },
      {
        immediate: false,
      }
    )
    // 提交表单项结果给表单
    watch(
      () => selectedValues.value,
      (v, p) => {
        if (v.length === p.length && v.every((el, index) => el === p[index])) return
        if (v.length === 0) {
          emit('change')
          return
        }

        emit('change', throwOptions.value)
      }
    )

    const computedOptions = computed(() =>
      props.selectThenHide
        ? options.value.filter((el) => !selected.value.some((value) => value.value === el.value))
        : options.value
    )

    const computedNotFoundContent = computed(() => {
      if (selectedValues.value.length === 0) return props.notFoundContent ?? null
      return null
    })

    return () => (
      <Select
        style={{
          width: '100%',
        }}
        mode="multiple"
        allowClear={true}
        /**
         * 为了 "选中后隐藏选项" 功能
         * 选中后options(会发生变动)与已选项不能匹配
         * 导致选中的标签显示值为 [value] 值
         */
        labelInValue={true}
        value={selected.value}
        onUpdate:value={(v) => (selected.value = v)}
        option-filter-prop="label"
        options={computedOptions.value}
        notFoundContent={computedNotFoundContent.value as VueNode}
        showArrow={selectedValues.value.length === 0}
        showSearch={true}
        onSearch={props.onSearch}
        onDropdownVisibleChange={(v) =>
          v && props.onSelectEnd?.(throwOptions.value as [any[], any[]])
        }
        getPopupContainer={props.getPopupContainer ?? getPopupContainer}
        maxTagCount={props.maxTagCount}
      />
    )
  },
})
