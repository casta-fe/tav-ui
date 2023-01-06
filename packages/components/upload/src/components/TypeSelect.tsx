import { type Ref, computed, defineComponent, ref, unref, watch } from 'vue'
import { Select as TaSelect } from 'ant-design-vue'
import { useFileTypeCode } from '../hooks'
import type { PropType } from 'vue'
import type { LabelValueOptions, PromiseFn, Recordable, TypeSelectPropType } from '../types'

type FetchedTypeCodeType = Recordable & { code: string; name: string }

export const useOptions = (
  props: {
    moduleCode?: string
    typeCodeArray?: string[]
    customOptions?: LabelValueOptions
    typeCodeRecord?: Recordable
    queryFileType?: PromiseFn<any, { data: FetchedTypeCodeType[] }>
    noDefaultValue?: boolean | Ref<boolean>
    selected?: any
    queryFileTypeRecursion?: boolean
  },
  emit: (event: 'update:selected' | 'update:options', ...args: any[]) => void
) => {
  // 此角色有的fileTypeCode
  const fetchedTypeCodeArray = ref<FetchedTypeCodeType[]>()

  // 从字典中取 TypeCode 选项的对应关系
  const localTypeCodeOptions = computed(() => {
    const options =
      props.customOptions ??
      (props.typeCodeRecord
        ? useFileTypeCode(props.typeCodeRecord!).mergeOptions(props.moduleCode, props.typeCodeArray)
        : [])
    /**
     * 未注入文件类型控制接口 -> 不需要控制 -> 所有文件类型
     */
    if (!props.queryFileType) {
      return options
    }
    if (fetchedTypeCodeArray.value) {
      if (!options.length) {
        return fetchedTypeCodeArray.value.map((typeItem) => ({
          ...typeItem,
          label: typeItem.name,
          value: typeItem.code,
        }))
      }

      for (const typeItem of fetchedTypeCodeArray.value) {
        if (!options.some((el) => el.value == typeItem.code)) {
          options.push({
            ...typeItem,
            label: typeItem.name,
            value: typeItem.code,
          })
        }
      }
      return options
    }
    return []
  })

  /**
   * ***仅组件初始化时给予默认值***
   */
  const isInit = ref(true)
  const defaultValue = computed(() => {
    if (unref(props.noDefaultValue) || !isInit.value) {
      return props.selected || undefined
    } else {
      return props.selected && localTypeCodeOptions.value.some((el) => props.selected === el.value)
        ? props.selected
        : localTypeCodeOptions.value[0]?.value
    }
  })

  watch(
    () => props.moduleCode,
    (moduleCode) => {
      if (!(moduleCode && props.queryFileType)) {
        emit('update:selected', defaultValue.value)
        isInit.value = false

        return
      }

      props
        .queryFileType({
          recursion: !!props.queryFileTypeRecursion,
          moduleCode: [moduleCode],
        })
        .then(({ data }) => {
          isInit.value = true
          fetchedTypeCodeArray.value = data
          if (!unref(props.noDefaultValue) && defaultValue.value !== props.selected) {
            emit('update:selected', defaultValue.value)
          }

          emit('update:options', localTypeCodeOptions.value)
        })
        .finally(() => (isInit.value = false))
    },
    { immediate: true }
  )

  return {
    localTypeCodeOptions,
    defaultValue,
  }
}

export const TypeSelect = defineComponent({
  props: {
    moduleCode: String as PropType<TypeSelectPropType['moduleCode']>,
    typeCodeArray: Array as PropType<TypeSelectPropType['typeCodeArray']>,
    selected: String as PropType<TypeSelectPropType['selected']>,
    noDefaultValue: [Boolean, Object] as PropType<TypeSelectPropType['noDefaultValue']>,
    customOptions: Array as PropType<TypeSelectPropType['customOptions']>,
    typeCodeRecord: {
      type: Object as PropType<TypeSelectPropType['typeCodeRecord']>,
      default: () => ({}),
    },
    queryFileType: Function as PropType<TypeSelectPropType['queryFileType']>,
    onSelect: Function as PropType<TypeSelectPropType['onSelect']>,
    queryFileTypeRecursion: Boolean as PropType<TypeSelectPropType['queryFileTypeRecursion']>,
  },
  emits: ['update:selected', 'update:options'],
  setup(props, { emit, slots }) {
    const { localTypeCodeOptions, defaultValue } = useOptions(props, emit)

    return () =>
      (slots.default &&
        slots.default({
          typeCodeOptions: localTypeCodeOptions.value,
          selected: defaultValue.value,
        })) || (
        <TaSelect
          value={defaultValue.value}
          style="width: 200px"
          options={localTypeCodeOptions.value}
          onSelect={(value, option) => {
            props.onSelect?.(value, option)
            emit('update:selected', value, option)
          }}
          placeholder="请选择文件类型"
          disabled={localTypeCodeOptions.value.length === 1}
          allowClear={localTypeCodeOptions.value.length !== 1}
          onClear={() => {
            emit('update:selected', undefined)
          }}
        />
      )
  },
})
