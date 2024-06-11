/* eslint-disable dot-notation */
import {
  computed,
  defineComponent,
  h,
  nextTick,
  ref,
  toRefs,
  unref,
  watch,
  withDirectives,
} from 'vue'
import { EditOutlined, LockOutlined } from '@ant-design/icons-vue'
import { Col, Divider, Form } from 'ant-design-vue'
import { cloneDeep, uniqBy, upperFirst } from 'lodash-es'
import dayjs from 'dayjs'
import AutoFocusDirective from '@tav-ui/directives/src/autoFocus'
import clickOutside from '@tav-ui/directives/src/clickOutside'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { formatToDate, getMomentFormatString } from '@tav-ui/utils/dateUtil'
import { getSlot } from '@tav-ui/utils/helper/tsxHelper'
import { tavI18n } from '@tav-ui/locales'
import {
  isArray,
  isBoolean,
  isDef,
  isFunction,
  isNull,
  isNullOrUnDef,
  isNumber,
  isString,
} from '@tav-ui/utils/is'
import { error } from '@tav-ui/utils/log'
import BasicHelp from '@tav-ui/components/basic-help'
import { numberToChinese } from '@tav-ui/utils'
import {
  componentMap,
  editableComponentChecksTypeMap,
  editableComponentMap,
  editableComponentSelectTypeMap,
  editableComponentTimeTypeMap,
  editableTriggeClickoutsideToCloseComponentMap,
  editableTriggerChangeToCloseComponentMap,
} from '../componentMap'
import { createPlaceholderMessage, setComponentRuleType } from '../helper'
import { useItemLabelWidth } from '../hooks/useLabelWidth'
import type { PropType, Ref } from 'vue'
import type { RuleType, RuleObject as ValidationRule } from 'ant-design-vue/lib/form/interface'
import type { TableActionType } from '@tav-ui/components/table/src/types/table'
import type { FormActionType, FormProps, FormSchema } from '../types/form'

type Recordable<T = any> = Record<string, T>
type Nullable<T> = T | null

const NUMBER_MAX = 9999999999
export default defineComponent({
  name: 'BasicFormItem',
  directives: {
    clickOutside,
  },
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({}),
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: () => ({}),
    },
    allDefaultValues: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    setFormModel: {
      type: Function as PropType<(key: string, value: any) => void>,
      default: null,
    },
    tableAction: {
      type: Object as PropType<TableActionType>,
    },
    formActionType: {
      type: Object as PropType<FormActionType>,
    },
  },
  setup(props, { slots }) {
    // 测试 memberselect
    // 弹窗的位置，样式修改
    const { schema, formProps } = toRefs(props) as {
      schema: Ref<FormSchema>
      formProps: Ref<FormProps>
    }
    // ::==================== i7eo：添加 ///// start ///// ====================:: //
    const itemValue = computed(
      () => props.formModel[props.schema.field] || props.schema.defaultValue
    )
    //为了手动输入的时候不让改加的变量
    const canUpdatePrecision = ref(true)
    const numberPrecision = ref(2)
    const editableItemValue = ref<any>(itemValue.value) // 默认值
    const hasEditable = computed(() => !!props.formProps.editable)
    const isEditableItemClicked = ref<boolean>(false) // 控制显示/隐藏
    const itemRef = ref<HTMLElement | null>(null) // 弹窗插入点
    const AntItemRef = ref<FormProps | null>(null)
    /** 函数处理 */
    const componentProps = computed((): any => {
      let componentProps = props.schema.componentProps
      if (isFunction(props.schema.componentProps)) {
        const { schema, tableAction, formModel, formActionType } = props
        componentProps =
          props.schema.componentProps!({
            schema,
            // @ts-ignore
            tableAction,
            formModel,
            // @ts-ignore
            formActionType,
          }) ?? {}
      }
      return componentProps ?? {}
    })

    watch(
      () => props.formModel[props.schema.field],
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          getFormItemPrecision(newVal)
          // debounce(getFormItemPrecision.bind(null, newVal, false), DebounceDely)()
        }
        if (!unref(hasEditable)) {
          return
        }

        if (isBoolean(newVal)) {
          // 处理switch、checkbox
          if (isDef(newVal) && newVal !== oldVal) {
            // 表单数据更新处理，当前表单项有值
            setEditableFormItemValue(props.schema, newVal)
          } else {
            // 初始化数据
            setEditableFormItemValue(props.schema, editableItemValue)
          }
        } else {
          // 临时解决方案，select值为0时候不渲染正确的label
          // eslint-disable-next-line eqeqeq
          if (props.schema.component == 'Select') setEditableFormItemValue(props.schema, newVal)

          if (!isNullOrUnDef(newVal) && newVal !== oldVal) {
            // 表单数据更新处理，当前表单项有值
            setEditableFormItemValue(props.schema, newVal)
          } else if (isNullOrUnDef(newVal) && oldVal && newVal !== oldVal) {
            // 表单数据更新处理，当前表单项无值
            setEditableFormItemValue(props.schema, newVal)
          } else {
            // 初始化数据
            setEditableFormItemValue(props.schema, editableItemValue)
          }
        }

        // if (newVal && newVal !== oldVal) {
        //   // 表单数据更新处理，当前表单项有值
        //   setEditableFormItemValue(props.schema, newVal);
        // } else if (!newVal && oldVal && newVal !== oldVal) {
        //   // 表单数据更新处理，当前表单项无值
        //   setEditableFormItemValue(props.schema, newVal);
        // } else {
        //   // 初始化数据
        //   setEditableFormItemValue(props.schema, editableItemValue);
        // }
      },
      { immediate: true }
    )
    // 修改editable updateschema在 setFieldsValue之前调用，文本更新异常的问题
    watch(
      () => (unref(componentProps) as any)?.options,
      () => {
        if (!unref(hasEditable)) {
          return
        }
        setEditableFormItemValue(props.schema, itemValue.value)
      }
    )
    function setEditableFormItemValue(schema, _value) {
      const value = unref(_value)
      let { componentProps = {} } = schema
      if (isFunction(componentProps)) {
        const { schema: propsSchema, tableAction, formModel, formActionType } = props
        componentProps =
          componentProps({ schema: propsSchema, tableAction, formModel, formActionType }) ?? {}
      }

      if (isString(value)) {
        // select 要回显 label
        if (editableComponentSelectTypeMap.has(schema.component)) {
          const target = componentProps?.options?.find(
            (option) => option.value === value || option.label === value
          )
          editableItemValue.value = target ? target.label : '-'
        } else if (editableComponentTimeTypeMap.has(schema.component)) {
          // 修复日期不能正常格式化的问题
          const valueFormat = componentProps.valueFormat
          if (value && value != '-') {
            editableItemValue.value = formatToDate(value, valueFormat)
          } else {
            editableItemValue.value = '-'
          }
        } else {
          // input 回显值
          // inputNumber 清空后也是空字符串进到这
          editableItemValue.value = value || '-'
        }
      } else if (isNumber(value)) {
        // select 要回显 label
        if (editableComponentSelectTypeMap.has(schema.component)) {
          let schemaOptions: any[] = []
          // 成员选择器 由于匹配人员是注入的，不是通过option传入，在editable匹配时候无法匹配到，所以在这里处理下
          if (schema.component == 'MemberSelect') {
            const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
            const allUserList = globalConfig.value?.TaMemberSelect?.allUserList || []
            schemaOptions = [...(componentProps?.options || []), ...allUserList]
          } else {
            schemaOptions = componentProps?.options
          }

          const target = schemaOptions.find(
            (option) => option.value === value || option.label === value
          )
          editableItemValue.value = target ? target.label : '-'
        } else {
          editableItemValue.value = value
          // 暂时注释掉，否则editable格式化精度出问题
          // const inputFormatter = componentProps?.formatter
          // if (inputFormatter) {
          //   // 处理 inputNumber formatter
          //   editableItemValue.value = inputFormatter(value)
          // } else {
          //   // input 回显值
          //   editableItemValue.value = value
          // }
        }
      } else if (isArray(value)) {
        // select || checkGroup 多选要回显label 用 ，分隔
        if (
          editableComponentSelectTypeMap.has(schema.component) ||
          (editableComponentChecksTypeMap.has(schema.component) &&
            schema.component.includes('Group'))
        ) {
          let schemaOptions: any[] = []
          // 成员选择器 由于匹配人员是注入的，不是通过option传入，在editable匹配时候无法匹配到，所以在这里处理下
          if (schema.component == 'MemberSelect') {
            const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
            const allUserList = globalConfig.value?.TaMemberSelect?.allUserList || []
            schemaOptions = uniqBy([...(componentProps?.options || []), ...allUserList], 'id')
          } else if (schema.component == 'SearchableApiSelect') {
            const item = value?.[1]
            if (!item) return
            const keyword = item.label ?? item[componentProps?.labelField || 'name']
            keyword && (editableItemValue.value = keyword)
            return
          } else {
            schemaOptions = componentProps?.options
          }
          const target = schemaOptions
            ?.reduce((result, option) => {
              if (value.includes(option.value) || value.includes(option.label))
                result.push(option.label)
              return result
            }, [])
            .filter((v) => v)
          editableItemValue.value = target && target.length > 0 ? target.join(',') : '-'
        } else {
          // date 回显 string
          editableItemValue.value = value
          const valueFormat = componentProps?.valueFormat
          const [startTime, endTime] = value
          if (isNullOrUnDef(startTime) || isNullOrUnDef(endTime)) {
            editableItemValue.value = '-'
          } else {
            editableItemValue.value = [
              getMomentFormatString(startTime, valueFormat),
              getMomentFormatString(endTime, valueFormat),
            ].join(' ~ ')
          }
        }
      } else if (isBoolean(value)) {
        editableItemValue.value = value
          ? tavI18n('Tav.common.closeText')
          : tavI18n('Tav.common.openText')
      } else if (dayjs.isDayjs(value)) {
        const valueFormat = componentProps?.valueFormat
        editableItemValue.value = formatToDate(value, valueFormat)
      } else {
        // 其他情况
        // 1. 没有给 defaultvalue，此时调用 resetFields，newval 为 undefined
        //  添加针对0的兼容 by hyb
        editableItemValue.value = isNullOrUnDef(value) ? '-' : itemValue.value
      }
    }

    function handleOnChange(go = false) {
      if (unref(hasEditable) && props.schema.component) {
        const isMultipleSelect =
          editableComponentSelectTypeMap.has(props.schema.component) &&
          unref(componentProps) &&
          ((unref(componentProps) as any).mode === 'multiple' ||
            (unref(componentProps) as any).mode === 'tags')
        const isCheckTypeGroup =
          editableComponentChecksTypeMap.has(props.schema.component) &&
          props.schema.component.includes('Group')
        const isTimePicker = props.schema.component === 'TimePicker'
        const isRangePickerHasTimePicker =
          props.schema.component === 'RangePicker' &&
          unref(componentProps) &&
          (unref(componentProps) as any).showTime
        const isOpenMultipleSelect =
          editableComponentSelectTypeMap.has(props.schema.component) &&
          unref(componentProps) &&
          (unref(componentProps) as any).multiple === true

        // 给 rangepicker右下角的确定按钮开启后门
        if (go) {
          showEditableDom(editableTriggerChangeToCloseComponentMap, props.schema)
        } else {
          // 点击后不能直接隐藏的情况：
          // 1. 弹窗组件多选状态下走clickoutside隐藏，单选状态直接隐藏
          // 2. CheckTypeGroup走clickoutside隐藏
          // 3. TimePicker走clickoutside隐藏
          // 4. RangePicker开启了timepicker
          // 5. tree与memberselect控制多选是用 multiple: true
          if (
            !isMultipleSelect &&
            !isCheckTypeGroup &&
            !isTimePicker &&
            !isRangePickerHasTimePicker &&
            !isOpenMultipleSelect
          )
            showEditableDom(editableTriggerChangeToCloseComponentMap, props.schema)
        }
      }
    }

    function showEditableDom(componentMap, schema) {
      const hide = () => {
        if (componentMap.has(schema.component) && unref(isEditableItemClicked)) {
          isEditableItemClicked.value = false
          unref(getComponentsProps).onEditableFormItemVisible &&
            unref(getComponentsProps).onEditableFormItemVisible(unref(isEditableItemClicked))
        }
      }
      if (schema.required) {
        const schemaValue = props.formModel[schema.field]
        //  添加针对0的兼容 by hyb
        // eslint-disable-next-line eqeqeq
        // if (schema.component == 'InputNumber') {
        //   if (!isNullOrUnDef(schemaValue)) hide()
        // } else {
        //   if (!isNullOrUnDef(schemaValue)) {
        //     hide()
        //   } else {
        //     // 必填项此时无值不能隐藏表单项
        //     // 这里最好手动调一下表单项的校验，难点在于怎么抓到失去焦点的时机，因为 async-validator 默认时机是 change blur？
        //   }
        // }
        if (!isNullOrUnDef(schemaValue)) hide()
      } else {
        hide()
      }
    }

    function handleClickOutside() {
      // 处理普通组件，如 input 等
      showEditableDom(editableTriggeClickoutsideToCloseComponentMap, props.schema)
    }
    // ::==================== i7eo：添加 ///// end   ///// ====================:: //

    const itemLabelWidthProp = useItemLabelWidth(schema, formProps)

    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...props.formProps['mergeDynamicData'],
          ...allDefaultValues,
          ...formModel,
        } as Recordable,
        schema,
        formActionType: props.formActionType,
      }
    })

    const getComponentsProps = computed(() => {
      const { schema, tableAction, formModel, formActionType } = props
      let { componentProps = {} } = schema
      if (isFunction(componentProps))
        componentProps = componentProps({ schema, tableAction, formModel, formActionType }) ?? {}

      if (schema.component === 'Divider') {
        componentProps = Object.assign({ type: 'horizontal' }, componentProps, {
          orientation: 'left',
          plain: true,
        })
      }

      if (schema.component === 'Select') {
        componentProps = Object.assign(
          {
            showSearch: true,
            filterOption: true,
            optionFilterProp: 'label',
          },
          componentProps
        )
      }

      return componentProps as Recordable
    })

    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      // 兼容老程序里面的代码
      const { editable: itemEditable = true } = props.schema
      let disabled = !!globDisabled || itemDisabled || !itemEditable
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues))
      }
      return disabled
    })

    function getShow(): { isShow: boolean; isIfShow: boolean } {
      const { show, ifShow } = props.schema
      const itemIsAdvanced = props.formProps['showAdvancedButton']
        ? isBoolean(props.schema.isAdvanced)
          ? props.schema.isAdvanced
          : true
        : true

      let isShow = true
      let isIfShow = true

      if (isBoolean(show)) isShow = show

      if (isBoolean(ifShow)) isIfShow = ifShow

      if (isFunction(show)) isShow = show(unref(getValues))

      if (isFunction(ifShow)) isIfShow = ifShow(unref(getValues))

      isShow = isShow && itemIsAdvanced
      return { isShow, isIfShow }
    }

    function handleRules(): ValidationRule[] {
      const {
        rules: defRules = [],
        component,
        valueType,
        rulesMessageJoinLabel,
        label,
        dynamicRules,
        required,
      } = props.schema

      if (isFunction(dynamicRules)) return dynamicRules(unref(getValues)) as ValidationRule[]

      let rules: ValidationRule[] = cloneDeep(defRules) as ValidationRule[]

      const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
        ? rulesMessageJoinLabel
        : props.formProps['rulesMessageJoinLabel']
      const defaultMsg = component
        ? `${createPlaceholderMessage(component)}${joinLabel ? label : ''}`
        : ''

      function validator(rule: any, value: any) {
        const msg = rule.message || defaultMsg
        if (value === undefined || isNull(value)) {
          // 空值
          return Promise.reject(msg)
        } else if (Array.isArray(value) && value.length === 0) {
          // 数组类型
          return Promise.reject(msg)
        } else if (typeof value === 'string' && value.trim() === '') {
          // 空字符串
          return Promise.reject(msg)
        } else if (
          typeof value === 'object' &&
          Reflect.has(value, 'checked') &&
          Reflect.has(value, 'halfChecked') &&
          Array.isArray(value.checked) &&
          Array.isArray(value.halfChecked) &&
          value.checked.length === 0 &&
          value.halfChecked.length === 0
        ) {
          // 非关联选择的tree组件
          return Promise.reject(msg)
        }
        return Promise.resolve()
      }

      const getRequired = isFunction(required) ? required(unref(getValues)) : required

      if ((!rules || rules.length === 0) && getRequired)
        rules = [{ required: getRequired, validator }]

      const requiredRuleIndex: number = rules.findIndex(
        (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
      )

      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex]
        const { isShow } = getShow()
        if (!isShow) rule.required = false

        if (component) {
          if (!Reflect.has(rule, 'type')) {
            if (valueType) {
              rule.type = valueType as RuleType
            } else {
              rule.type = component === 'InputNumber' ? 'number' : 'string'
            }
          }

          rule.message = rule.message || defaultMsg

          if (component.includes('Input') || component.includes('Textarea')) rule.whitespace = true

          const valueFormat = unref(getComponentsProps)?.valueFormat
          setComponentRuleType(rule, component, valueFormat)
        }
      }

      // Maximum input length rule check
      const characterInx = rules.findIndex((val) => val.max)
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message =
          rules[characterInx].message ||
          '字符数应小于{0}位'.replace('{0}', `${rules[characterInx].max}`)
      }
      return rules
    }
    // 获取数字类型数据精度 最小为2最大为6
    function getFormItemPrecision(value: number | undefined) {
      const { schema, tableAction, formModel, formActionType } = props
      const { componentProps = {}, component, field } = schema
      const realcomponentProps = isFunction(componentProps)
        ? componentProps({ schema, tableAction, formModel, formActionType })
        : componentProps
      if (
        component !== 'InputNumber' ||
        value === undefined ||
        !unref(canUpdatePrecision) ||
        realcomponentProps['noAutoPrecision']
      ) {
        return
      }
      let precision = 0
      if (!isNullOrUnDef(value)) {
        const newValDecimal = String(value).split('.')[1]
        if (!newValDecimal || newValDecimal.length <= 2) {
          precision = 2
        } else if (newValDecimal.length >= 6) {
          precision = 6
        } else {
          precision = newValDecimal.length
        }
      }

      numberPrecision.value = precision
      props.setFormModel(field, value ? Number(value.toFixed(precision)) : value)
    }
    const showNumberToChinese = () => {
      const { component } = props.schema
      return (
        component === 'InputNumber' &&
        unref(getComponentsProps).useChinese &&
        !isNullOrUnDef(unref(itemValue))
      )
    }
    function getRealPopupContainer() {
      return (
        props.formProps.getPopupContainer ||
        unref(getComponentsProps).getPopupContainer ||
        undefined
      )
    }

    function renderComponent() {
      const {
        renderComponentContent,
        component,
        label,
        field,
        changeEvent = 'change',
        valueField,
      } = props.schema
      const isCheck = component && ['Switch', 'Checkbox'].includes(component)

      const eventKey = `on${upperFirst(changeEvent)}`
      const focusKey = 'onFocus'
      const blurKey = 'onBlur'
      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          const [e] = args
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (propsData[eventKey]) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            propsData[eventKey](...args)
          }
          const target = e ? e.target : null
          const value = target ? (isCheck ? target.checked : target.value) : e
          console.log(value)
          props.setFormModel(field, value)
          // ::==================== i7eo：添加 ///// start ///// ====================:: //
          handleOnChange()
          // ::==================== i7eo：添加 ///// end   ///// ====================:: //
        },
      }
      if (component === 'InputNumber') {
        on[focusKey] = (...args: Nullable<Recordable>[]) => {
          canUpdatePrecision.value = false
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (propsData[focusKey]) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            propsData[focusKey](...args)
          }
        }
        on[blurKey] = (...args: Nullable<Recordable>[]) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (propsData[blurKey]) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            propsData[blurKey](...args)
          }
          // 针对InputNumber精度问题兼容
          if (component === 'InputNumber' && itemRef.value) {
            const inputEle = itemRef.value.querySelector('input')
            if (inputEle) {
              const inputVal = inputEle.value.match(/\d+(?![\d\s])/g)?.join('.')
              const value = inputVal ? Number(inputVal) : undefined
              setTimeout(() => {
                canUpdatePrecision.value = true
                getFormItemPrecision(value)
                nextTick(() => {
                  props.setFormModel(field, value)
                })
              }, 10)
            }
          }
        }
      }
      const Comp = component && (componentMap.get(component) as ReturnType<typeof defineComponent>)
      const size = props.formProps['size']
      const propsData: Recordable = {
        size,
        ...unref(getComponentsProps),
        getPopupContainer: getRealPopupContainer(),
        disabled: unref(getDisable),
      }

      const isCreatePlaceholder = !propsData.disabled && props.formProps['autoSetPlaceHolder']
      // RangePicker place is an array
      if (isCreatePlaceholder && component !== 'RangePicker' && component) {
        propsData.placeholder =
          unref(getComponentsProps)?.placeholder ||
          createPlaceholderMessage(component, isString(label) ? label : '')
      }
      propsData.codeField = field
      propsData.formValues = unref(getValues)

      const bindValue: Recordable = {
        [valueField || (isCheck ? 'checked' : 'value')]: props.formModel[field],
      }

      const compAttr: Recordable = {
        ...propsData,
        ...on,
        ...bindValue,
      }

      // ::==================== i7eo：更新 ///// start  ///// ====================:: //
      const setMaxLengthComponentNames = ['Input', 'InputPassword', 'InputSearch', 'InputTextArea'] // 可以设置默认字符数的组件
      if (component && setMaxLengthComponentNames.includes(component)) {
        if (component === 'InputTextArea') {
          compAttr.maxlength = (unref(getComponentsProps) as any)?.maxLength ?? 256
          compAttr.showCount = (unref(getComponentsProps) as any)?.showCount ?? true
          compAttr.autoSize = (unref(getComponentsProps) as any)?.autoSize ?? {
            minRows: 4,
            maxRows: 4,
          }
        } else {
          compAttr.maxlength = (unref(getComponentsProps) as any)?.maxLength ?? 32
        }
      }
      if (component === 'InputNumber') {
        compAttr.max = unref(getComponentsProps)?.max ?? NUMBER_MAX
        compAttr.min = (unref(getComponentsProps) as any)?.min ?? 0
        compAttr.precision = unref(getComponentsProps)?.precision ?? unref(numberPrecision)
      }

      if (unref(hasEditable)) {
        if (component && editableComponentSelectTypeMap.has(component)) {
          compAttr.autofocus = true
          compAttr.defaultOpen = true
          compAttr.getPopupContainer = () => unref(itemRef)
        } else if (component && editableComponentTimeTypeMap.has(component)) {
          compAttr.open = true
          compAttr.getPopupContainer = () => unref(itemRef)
          compAttr.onOk = (dates: any) => {
            props.setFormModel(field, dates)
            handleOnChange(true)
          }
        }
      }
      if (!renderComponentContent) {
        return unref(hasEditable) ? (
          <>
            {withDirectives(h(Comp, { ...compAttr }), [[AutoFocusDirective]])}
            {showNumberToChinese() && (
              <div class="number-to-chinese">
                {numberToChinese(itemValue.value, unref(getComponentsProps)?.chineseMultip)}
              </div>
            )}
          </>
        ) : (
          <>
            <Comp {...compAttr}></Comp>
            {showNumberToChinese() && (
              // <transition name="fade-bottom" mode="out-in">
              <div class="number-to-chinese">
                {numberToChinese(itemValue.value, unref(getComponentsProps)?.chineseMultip)}
              </div>
              // </transition>
            )}
          </>
        )
      }

      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent,
          }

      // return <Comp {...compAttr}>{compSlot}</Comp>;
      return unref(hasEditable) ? (
        withDirectives(h(Comp, { ...compAttr }, compSlot), [[AutoFocusDirective]])
      ) : (
        <Comp {...compAttr}>{compSlot}</Comp>
      )
      // ::==================== i7eo：更新 ///// end   ///// ====================:: //
    }

    function renderLabelHelpMessage() {
      const { label, helpMessage, helpComponentProps, subLabel } = props.schema
      const renderLabel = subLabel ? (
        <span>
          {label} <span class="text-secondary">{subLabel}</span>
        </span>
      ) : (
        label
      )
      const getHelpMessage = isFunction(helpMessage) ? helpMessage(unref(getValues)) : helpMessage
      if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0))
        return renderLabel

      return (
        <span>
          {renderLabel}
          <BasicHelp placement="top" class="mx-1" text={getHelpMessage} {...helpComponentProps} />
        </span>
      )
    }

    function renderItem() {
      const { itemProps, slot, render, field, suffix, editSlot, component } = props.schema
      const { labelCol, wrapperCol } = unref(itemLabelWidthProp)

      if (component === 'Divider') {
        return (
          <Col span={24}>
            <Divider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</Divider>
          </Col>
        )
      } else {
        const getContent = () => {
          return slot
            ? getSlot(slots, slot, unref(getValues))
            : render
            ? render(unref(getValues))
            : renderComponent()
        }

        const showSuffix = !!suffix
        const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix

        // ::==================== i7eo：更新 ///// start ///// ====================:: //
        const createItem = () =>
          unref(hasEditable) ? (
            <div
              ref={itemRef}
              v-click-outside={handleClickOutside}
              style="flex: 1;  max-width:100%; position: relative;"
            >
              {getContent()}
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </div>
          ) : (
            <>
              <div ref={itemRef} style="flex:1; max-width:100%">
                {getContent()}
              </div>
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </>
          )
        const getEditableFormContent = () => {
          // return <div>{editableItemValue.value}</div>;
          // 暂时不强制格式化到6位
          if (editSlot) {
            return getSlot(slots, editSlot, unref(getValues))
          }
          let realContent = editableItemValue.value
          if (
            props.schema.component === 'InputNumber' &&
            typeof editableItemValue.value == 'number'
          ) {
            if (unref(componentProps)) {
              const precision = unref(getComponentsProps)?.precision ?? unref(numberPrecision)
              const value = isNullOrUnDef(precision)
                ? editableItemValue.value
                : editableItemValue.value.toFixed(precision)
              realContent = value
            }
          }
          const inputFormatter = unref(componentProps)['formatter']
          if (inputFormatter && realContent !== '-') {
            // 处理 inputNumber formatter
            realContent = inputFormatter(realContent)
          }
          return <>{realContent}</>
        }
        const getEditableFormItemClass = () => {
          let className = unref(getDisable) ? 'ta-form-item__cell disabled' : 'ta-form-item__cell'
          if (props.schema.component === 'InputNumber') {
            className += ' number-cell'
          }
          return className
        }
        const createEditableFormItem = () => {
          return !unref(isEditableItemClicked) ? (
            <div
              class={getEditableFormItemClass()}
              title={editableItemValue.value}
              onClick={() => {
                if (!unref(getDisable)) {
                  isEditableItemClicked.value = true
                  unref(getComponentsProps).onEditableFormItemVisible &&
                    unref(getComponentsProps).onEditableFormItemVisible(
                      unref(isEditableItemClicked)
                    )
                }
              }}
            >
              {getEditableFormContent()}

              {!unref(getDisable) ? (
                <EditOutlined class="ta-form-item--editable-icon" />
              ) : (
                <LockOutlined class="ta-form-item--editable-icon" />
              )}
            </div>
          ) : (
            createItem()
          )
        }

        const renderFormItem = () => {
          if (unref(hasEditable)) {
            if (!editableComponentMap.has(component as any)) {
              error(
                `不能将 ${component} 当作可编辑组件来使用，可编辑组件有: ${editableComponentMap}`
              )
              return null
            }
            return createEditableFormItem()
          } else {
            return createItem()
          }
        }

        return (
          <Form.Item
            ref={AntItemRef}
            name={field}
            colon={props.formProps['colon']}
            class={{
              'suffix-item': showSuffix,
              'ta-form-item': true,
              [`ta-form-item--${!unref(getDisable) ? 'editable' : 'diseditable'}`]:
                unref(hasEditable),
            }}
            {...(itemProps as Recordable)}
            label={renderLabelHelpMessage()}
            rules={handleRules()}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            <div>{renderFormItem()}</div>
          </Form.Item>
        )
        // ::==================== i7eo：更新 ///// end   ///// ====================:: //
      }
    }
    return () => {
      const { colProps = {}, colSlot, renderColContent, component } = props.schema

      if (component && !componentMap.has(component)) return null

      const baseColProps = props.formProps['baseColProps'] ?? {}
      const realColProps = { ...baseColProps, ...colProps }
      const { isIfShow, isShow } = getShow()
      const values = unref(getValues)

      const getContent = () => {
        return colSlot
          ? getSlot(slots, colSlot, values)
          : renderColContent
          ? renderColContent(values)
          : renderItem()
      }

      return (
        isIfShow && (
          <Col {...realColProps} v-show={isShow}>
            {getContent()}
          </Col>
        )
      )
    }
  },
})
