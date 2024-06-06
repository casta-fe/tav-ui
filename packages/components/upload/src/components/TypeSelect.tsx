import { type Ref, computed, defineComponent, ref, unref, watch } from 'vue'
import { Select as TaSelect } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { useFileTypeCode } from '../hooks'
import type { PropType } from 'vue'
import type {
  BasicPropsType,
  LabelValueOptions,
  PromiseFn,
  Recordable,
  TypeSelectPropType,
} from '../types'

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
    permissionControl?: BasicPropsType['permissionControl']
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
    }
    return options
  })

  const getDefaultValue = () =>
    props.selected && localTypeCodeOptions.value.some((el) => props.selected === el.value)
      ? props.selected
      : localTypeCodeOptions.value[0]?.value

  /**
   * ***仅组件初始化时给予默认值***
   */
  const isInit = ref(true)
  const defaultValue = computed(() => {
    if (unref(props.noDefaultValue) || !isInit.value) {
      return props.selected || undefined
    } else {
      return getDefaultValue()
    }
  })

  watch(
    () => props.moduleCode,
    (moduleCode) => {
      if (!(moduleCode && props.queryFileType)) {
        emit('update:selected', defaultValue.value)
        emit('update:options', localTypeCodeOptions.value)
        isInit.value = false

        return
      }

      props
        .queryFileType({
          recursion: !!props.queryFileTypeRecursion,
          moduleCode: [moduleCode],
          permissionControl: props.permissionControl,
        })
        .then(({ data }) => {
          isInit.value = true
          fetchedTypeCodeArray.value = data
          if (defaultValue.value !== props.selected) {
            /**
             * 当仅有一个`typeCode`时, 必须选中
             */
            if (!unref(props.noDefaultValue)) {
              emit('update:selected', defaultValue.value)
            } else if (localTypeCodeOptions.value.length === 1) {
              emit('update:selected', getDefaultValue())
            }
          }

          if (undefined === props.selected && localTypeCodeOptions.value.length === 1) {
            emit('update:selected', getDefaultValue())
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
    disabledSelect: {
      type: Boolean as PropType<TypeSelectPropType['disabledSelect']>,
      default: () => false,
    },
    customOptions: Array as PropType<TypeSelectPropType['customOptions']>,
    typeCodeRecord: {
      type: Object as PropType<TypeSelectPropType['typeCodeRecord']>,
      default: () => ({}),
    },
    queryFileType: Function as PropType<TypeSelectPropType['queryFileType']>,
    onSelect: Function as PropType<TypeSelectPropType['onSelect']>,
    queryFileTypeRecursion: Boolean as PropType<TypeSelectPropType['queryFileTypeRecursion']>,
    permissionControl: Number,
    getPopupContainer: Function as PropType<() => HTMLElement>,
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
          getPopupContainer={props.getPopupContainer}
          placeholder={tavI18n('Tav.file.message.5')}
          disabled={localTypeCodeOptions.value.length === 1 || props.disabledSelect}
          allowClear={localTypeCodeOptions.value.length !== 1}
          onClear={() => {
            emit('update:selected', undefined)
          }}
        />
      )
  },
})
