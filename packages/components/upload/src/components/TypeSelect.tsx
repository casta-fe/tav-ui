import { computed, defineComponent, ref, unref, watch } from 'vue'
import { Select as TaSelect } from 'ant-design-vue'
import { useFileTypeCode } from '../hooks'
import type { PropType } from 'vue'
import type { PromiseFn, Recordable, Result, TypeSelectPropType } from '../types'

export const TypeSelect = defineComponent({
  props: {
    moduleCode: String as PropType<TypeSelectPropType['moduleCode']>,
    typeCodeArray: Array as PropType<TypeSelectPropType['typeCodeArray']>,
    selected: String as PropType<TypeSelectPropType['selected']>,
    noDefaultValue: [Boolean, Object] as PropType<TypeSelectPropType['noDefaultValue']>,
    customOptions: Array as PropType<TypeSelectPropType['customOptions']>,
    typeCodeRecord: {
      type: Object,
      default: () => ({}),
    },
    queryFileType: Function as PropType<
      PromiseFn<any, Result<(Recordable & { code: string; name: string })[]>>
    >,
    onSelect: Function,
  },
  emits: ['update:selected'],
  setup(props, { emit, slots }) {
    // init begin
    const { mergeOptions } = useFileTypeCode(props.typeCodeRecord as Recordable)
    // init end
    const typeCodeArray = computed(() => props.typeCodeArray)

    // 此角色有的fileTypeCode
    const fetchedTypeCodeArray = ref<(Recordable & { code: string; name: string })[]>()

    // 从字典中取 TypeCode 选项的对应关系
    const localTypeCodeOptions = computed(() => {
      const options = props.customOptions ?? mergeOptions(props.moduleCode, typeCodeArray.value)
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
        return props.selected &&
          localTypeCodeOptions.value.some((el) => props.selected === el.value)
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
          .queryFileType([moduleCode])
          .then(({ data }) => {
            isInit.value = true
            fetchedTypeCodeArray.value = data
            if (!unref(props.noDefaultValue) && defaultValue.value !== props.selected) {
              emit('update:selected', defaultValue.value)
            }
          })
          .finally(() => (isInit.value = false))
      },
      { immediate: true }
    )

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
          allowClear={true}
          onClear={() => {
            emit('update:selected', undefined)
          }}
        />
      )
  },
})
