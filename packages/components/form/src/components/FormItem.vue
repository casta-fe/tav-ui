<script lang="tsx">
/* eslint-disable dot-notation */
import { EditOutlined, LockOutlined } from '@ant-design/icons-vue'
// import AutoFocusDirective from '@tav-ui/directives/src/autoFocus'
import { formatToDate, getMomentFormatString } from '@tav-ui/utils/dateUtil'
import { getSlot } from '@tav-ui/utils/helper/tsxHelper'
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
import { Col, Divider, Form } from 'ant-design-vue'
import type { ValidationRule } from 'ant-design-vue/lib/form/Form'
import { cloneDeep, upperFirst } from 'lodash-es'
import type { PropType, Ref } from 'vue'
import { computed, defineComponent, ref, toRefs, unref, watch } from 'vue'
import BasicHelp from '../../../basic-help'
import type { TableActionType } from '../../../table/src/types/table'
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
import type { FormActionType, FormProps, FormSchema } from '../types/form'

type Recordable<T = any> = Record<string, T>
type Nullable<T> = T | null

/*
  可编辑表格编写思路：
  1. 底层还是套用form，样式层面通过添加类名编写样式
  2. 数据层面：
    - 通过定义变量hasEditable、isEditable、isEditableItemClicked来做dom切换
    - 通过监听表单项model的变化来进行不同组件的数据处理（见函数setEditableFormItemValue）包括数据的初始化、数据的更新。从而达到控制dom上文字的会显的目的
    - 复杂组件（需要动态生成dom并插入document）的弹窗组件，如 datepicker、select 等，监听 onchange 选中后要隐藏，clickoutside 也要隐藏
    - 普通组件，如 input、checkbox 等，直接在 clickoutside 隐藏
  3. 特别注意：
    - 点击dom要显示弹窗的时候一般要直接把弹窗的下来打开，所以在 compattr 里面做了控制
    - 因为生成的弹窗直接插入document中，点击弹窗内容也会触发clickoutside所以必须把弹窗动态插入对应表单项下，在 compattr 中做了控制
  4. 遗留问题：
    - datepicker 组件因为选中后即隐藏看不到清除按钮所以是否把清除按钮上移到dom？
    - 只支持了部分组件，详情查看componentMap
  */

export default defineComponent({
  name: 'BasicFormItem',
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
      () => props.formModel[props.schema.field] || props.schema.defaultValue,
    )
    const editableItemValue = ref<any>(itemValue.value) // 默认值
    const hasEditable = computed(() => Reflect.has(props.schema, 'editable'))
    const isEditable = computed(() => !!props.schema.editable)
    const isEditableItemClicked = ref<Boolean>(false) // 控制显示/隐藏
    const itemRef = ref<HTMLElement | null>(null) // 弹窗插入点

    unref(hasEditable)
      && watch(
        () => props.formModel[props.schema.field],
        (newVal, oldVal) => {
          if (isBoolean(newVal)) {
            // 处理switch、checkbox
            if (isDef(newVal) && newVal !== oldVal) {
              // 表单数据更新处理，当前表单项有值
              setEditableFormItemValue(props.schema, newVal)
            }
            else {
              // 初始化数据
              setEditableFormItemValue(props.schema, editableItemValue)
            }
          }
          else {
            // 临时解决方案，select值为0时候不渲染正确的label
            // eslint-disable-next-line eqeqeq
            if (props.schema.component == 'Select')
              setEditableFormItemValue(props.schema, newVal)

            if (newVal && newVal !== oldVal) {
              // 表单数据更新处理，当前表单项有值
              setEditableFormItemValue(props.schema, newVal)
            }
            else if (!newVal && oldVal && newVal !== oldVal) {
              // 表单数据更新处理，当前表单项无值
              setEditableFormItemValue(props.schema, newVal)
            }
            else {
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
        { immediate: true },
      )
    // 修改editable updateschema在 setFieldsValue之前调用，文本更新异常的问题
    unref(hasEditable)
      && watch(
        () => (props.schema.componentProps as any)?.options,
        () => {
          setEditableFormItemValue(props.schema, itemValue.value)
        },
      )
    function setEditableFormItemValue(schema, _value) {
      const value = unref(_value)
      if (isString(value)) {
        // select 要回显 label
        if (editableComponentSelectTypeMap.has(schema.component)) {
          const target = schema.componentProps?.options?.find(
            option => option.value === value || option.label === value,
          )
          editableItemValue.value = target ? target.label : '-'
        }
        else if (editableComponentTimeTypeMap.has(schema.component)) {
          // 修复日期不能正常格式化的问题
          const valueFormat = schema.componentProps.valueFormat
          // eslint-disable-next-line eqeqeq
          if (value && value != '-')
            editableItemValue.value = formatToDate(value, valueFormat)
          else editableItemValue.value = '-'

          // editableItemValue.value = value ? formatToDate(value, valueFormat) : "-";
        }
        else {
          // input 回显值
          // inputNumber 清空后也是空字符串进到这
          editableItemValue.value = value || '-'
        }
      }
      else if (isNumber(value)) {
        // select 要回显 label
        if (editableComponentSelectTypeMap.has(schema.component)) {
          const target = schema.componentProps?.options?.find(
            option => option.value === value || option.label === value,
          )
          editableItemValue.value = target ? target.label : '-'
        }
        else {
          const inputFormatter = schema.componentProps?.formatter
          if (inputFormatter) {
            // 处理 inputNumber formatter
            editableItemValue.value = inputFormatter(value)
          }
          else {
            // input 回显值
            editableItemValue.value = value
          }
        }
      }
      else if (isArray(value)) {
        // select || checkGroup 多选要回显label 用 ，分隔
        if (
          editableComponentSelectTypeMap.has(schema.component)
          || (editableComponentChecksTypeMap.has(schema.component)
            && schema.component.includes('Group'))
        ) {
          const target = schema.componentProps?.options
            ?.reduce((result, option) => {
              if (value.includes(option.value) || value.includes(option.label))
                result.push(option.label)

              return result
            }, [])
            .filter(v => v)
          editableItemValue.value = target && target.length > 0 ? target.join(',') : '-'
        }
        else {
          // date 回显 string
          const valueFormat = schema.componentProps?.valueFormat
          const [startTime, endTime] = value
          if (isNullOrUnDef(startTime) || isNullOrUnDef(endTime)) {
            editableItemValue.value = '-'
          }
          else {
            editableItemValue.value = [
              getMomentFormatString(startTime, valueFormat),
              getMomentFormatString(endTime, valueFormat),
            ].join(' ~ ')
          }
        }
      }
      else if (isBoolean(value)) {
        editableItemValue.value = value ? '开启' : '关闭'
      }
      else {
        // 其他情况
        // 1. 没有给 defaultvalue，此时调用 resetFields，newval 为 undefined
        //  添加针对0的兼容 by hyb
        editableItemValue.value = itemValue.value || schema.component === 'InputNumber' ? 0 : '-'
      }
    }

    function handleOnChange(go = false) {
      if (unref(hasEditable) && props.schema.component) {
        const isMultipleSelect
          = editableComponentSelectTypeMap.has(props.schema.component)
          && props.schema.componentProps
          && ((props.schema.componentProps as any).mode === 'multiple'
            || (props.schema.componentProps as any).mode === 'tags')
        const isCheckTypeGroup
          = editableComponentChecksTypeMap.has(props.schema.component)
          && props.schema.component.includes('Group')
        const isTimePicker = props.schema.component === 'TimePicker'
        const isRangePickerHasTimePicker
          = props.schema.component === 'RangePicker'
          && props.schema.componentProps
          && (props.schema.componentProps as any).showTime
        const isOpenMultipleSelect
          = editableComponentSelectTypeMap.has(props.schema.component)
          && props.schema.componentProps
          && (props.schema.componentProps as any).multiple === true

        // 给 rangepicker右下角的确定按钮开启后门
        if (go) {
          showEditableDom(editableTriggerChangeToCloseComponentMap, props.schema)
        }
        else {
          // 点击后不能直接隐藏的情况：
          // 1. 弹窗组件多选状态下走clickoutside隐藏，单选状态直接隐藏
          // 2. CheckTypeGroup走clickoutside隐藏
          // 3. TimePicker走clickoutside隐藏
          // 4. RangePicker开启了timepicker
          // 5. tree与memberselect控制多选是用 multiple: true
          if (
            !isMultipleSelect
            && !isCheckTypeGroup
            && !isTimePicker
            && !isRangePickerHasTimePicker
            && !isOpenMultipleSelect
          )
            showEditableDom(editableTriggerChangeToCloseComponentMap, props.schema)
        }
      }
    }

    function showEditableDom(componentMap, schema) {
      const hide = () => {
        if (componentMap.has(schema.component))
          isEditableItemClicked.value = false
      }
      if (schema.required) {
        // if (props.schema.field === "purposeInvestScale") {
        //   debugger;
        // }
        const schemaValue = props.formModel[schema.field]
        //  添加针对0的兼容 by hyb
        // eslint-disable-next-line eqeqeq
        if (schema.component == 'InputNumber') {
          if (schemaValue !== undefined && !isNull(schemaValue))
            hide()
        }
        else {
          if (schemaValue) {
            hide()
          }
          else {
            // 必填项此时无值不能隐藏表单项
            // 这里最好手动调一下表单项的校验，难点在于怎么抓到失去焦点的时机，因为 async-validator 默认时机是 change blur？
          }
        }
      }
      else {
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
      return componentProps as Recordable
    })

    const getDisable = computed(() => {
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      let disabled = !!props.formProps['disabled'] || itemDisabled
      if (isBoolean(dynamicDisabled))
        disabled = dynamicDisabled

      if (isFunction(dynamicDisabled))
        disabled = dynamicDisabled(unref(getValues))

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

      if (isBoolean(show))
        isShow = show

      if (isBoolean(ifShow))
        isIfShow = ifShow

      if (isFunction(show))
        isShow = show(unref(getValues))

      if (isFunction(ifShow))
        isIfShow = ifShow(unref(getValues))

      isShow = isShow && itemIsAdvanced
      return { isShow, isIfShow }
    }

    function handleRules(): ValidationRule[] {
      const {
        rules: defRules = [],
        component,
        valueType = 'string',
        rulesMessageJoinLabel,
        label,
        dynamicRules,
        required,
      } = props.schema

      if (isFunction(dynamicRules))
        return dynamicRules(unref(getValues)) as ValidationRule[]

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
        }
        else if (Array.isArray(value) && value.length === 0) {
          // 数组类型
          return Promise.reject(msg)
        }
        else if (typeof value === 'string' && value.trim() === '') {
          // 空字符串
          return Promise.reject(msg)
        }
        else if (
          typeof value === 'object'
          && Reflect.has(value, 'checked')
          && Reflect.has(value, 'halfChecked')
          && Array.isArray(value.checked)
          && Array.isArray(value.halfChecked)
          && value.checked.length === 0
          && value.halfChecked.length === 0
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
        rule => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
      )

      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex]
        const { isShow } = getShow()
        if (!isShow)
          rule.required = false

        if (component) {
          if (!Reflect.has(rule, 'type')) {
            if (valueType)
              rule.type = valueType
            else rule.type = component === 'InputNumber' ? 'number' : 'string'
          }

          rule.message = rule.message || defaultMsg

          if (component.includes('Input') || component.includes('Textarea'))
            rule.whitespace = true

          const valueFormat = unref(getComponentsProps)?.valueFormat
          setComponentRuleType(rule, component, valueFormat)
        }
      }

      // Maximum input length rule check
      const characterInx = rules.findIndex(val => val.max)
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message
          = rules[characterInx].message
          || '字符数应小于{0}位'.replace('{0}', `${rules[characterInx].max}`)
      }
      return rules
    }

    function renderComponent() {
      const {
        renderComponentContent,
        component,
        label,
        field,
        changeEvent = 'change',
        valueField,
        componentProps,
      } = props.schema

      const isCheck = component && ['Switch', 'Checkbox'].includes(component)

      const eventKey = `on${upperFirst(changeEvent)}`

      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          const [e] = args
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (propsData[eventKey])
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            propsData[eventKey](...args)

          const target = e ? e.target : null
          const value = target ? (isCheck ? target.checked : target.value) : e
          props.setFormModel(field, value)

          // ::==================== i7eo：添加 ///// start ///// ====================:: //
          handleOnChange()
          // ::==================== i7eo：添加 ///// end   ///// ====================:: //
        },
      }

      const Comp = component && (componentMap.get(component) as ReturnType<typeof defineComponent>)
      const size = props.formProps['size']
      const propsData: Recordable = {
        // allowClear: unref(hasEditable) ? false : true, // i7eo：添加避免触发clickoutside
        // getPopupContainer: (trigger: Element) => (trigger ? trigger.parentNode : document.body),
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable),
      }

      const isCreatePlaceholder = !propsData.disabled && props.formProps['autoSetPlaceHolder']
      // RangePicker place is an array
      if (isCreatePlaceholder && component !== 'RangePicker' && component) {
        propsData.placeholder
          = unref(getComponentsProps)?.placeholder
          || createPlaceholderMessage(component, isString(label) ? label : '')
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
          compAttr.maxlength = (componentProps as any)?.maxLength ?? 256
          compAttr.showCount = (componentProps as any)?.showCount ?? true
          compAttr.autoSize = (componentProps as any)?.autoSize ?? { minRows: 4, maxRows: 4 }
        }
        else {
          compAttr.maxlength = 32
        }
      }
      if (component === 'InputNumber') {
        compAttr.max = (componentProps as any)?.max ?? 9999999999
        compAttr.min = (componentProps as any)?.min ?? 0
        compAttr.precision = (componentProps as any)?.precision ?? 2
      }

      if (unref(hasEditable)) {
        if (component && editableComponentSelectTypeMap.has(component)) {
          compAttr.autofocus = true
          compAttr.defaultOpen = true
          compAttr.getPopupContainer = () => unref(itemRef)
        }
        else if (component && editableComponentTimeTypeMap.has(component)) {
          compAttr.open = true
          compAttr.getCalendarContainer = () => unref(itemRef)
          compAttr.onOk = (dates) => {
            props.setFormModel(field, dates)
            handleOnChange(true)
          }
        }
      }
      if (!renderComponentContent)
        return <Comp {...compAttr} />
        // return unref(hasEditable)
        //   ? (
        //       withDirectives(h(Comp, { ...compAttr }), [[AutoFocusDirective]])
        //     )
        //   : (
        //   <Comp {...compAttr} />
        //     )

      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent,
          }

      return <Comp {...compAttr}>{compSlot}</Comp>
      // return unref(hasEditable)
      //   ? (
      //       withDirectives(h(Comp, { ...compAttr }, compSlot), [[AutoFocusDirective]])
      //     )
      //   : (
      //   <Comp {...compAttr}>{compSlot}</Comp>
      //     )
      // ::==================== i7eo：更新 ///// end   ///// ====================:: //
    }

    function renderLabelHelpMessage() {
      const { label, helpMessage, helpComponentProps, subLabel } = props.schema
      const renderLabel = subLabel
        ? (
        <span>
          {label} <span class="text-secondary">{subLabel}</span>
        </span>
          )
        : (
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
      const { itemProps, slot, render, field, suffix, component } = props.schema
      const { labelCol, wrapperCol } = unref(itemLabelWidthProp)

      if (component === 'Divider') {
        return (
          <Col span={24}>
            <Divider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</Divider>
          </Col>
        )
      }
      else {
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
          unref(hasEditable)
            ? (
            <div
              ref={itemRef}
              v-click-outside={handleClickOutside}
              style="flex: 1; position: relative;"
            >
              <div style="flex:1">{getContent()}</div>
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </div>
              )
            : (
            <>
              <div style="flex:1">{getContent()}</div>
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </>
              )

        const createEditableFormItem = () => {
          return !unref(isEditableItemClicked)
            ? (
            <div
              class="ta-form-item__cell"
              title={editableItemValue.value}
              onClick={() => {
                if (unref(isEditable))
                  isEditableItemClicked.value = true
              }}
            >
              {editableItemValue.value}

              {unref(isEditable)
                ? (
                <EditOutlined class="ta-form-item--editable-icon" />
                  )
                : (
                <LockOutlined class="ta-form-item--editable-icon" />
                  )}
            </div>
              )
            : (
                createItem()
              )
        }

        const renderFormItem = () => {
          if (unref(hasEditable)) {
            if (!editableComponentMap.has(component as any)) {
              error(
                `不能将 ${component} 当作可编辑组件来使用，可编辑组件有: ${editableComponentMap}`,
              )
              return null
            }
            return createEditableFormItem()
          }
          else {
            return createItem()
          }
        }

        return (
          <Form.Item
            name={field}
            colon={props.formProps['colon']}
            class={{
              'suffix-item': showSuffix,
              'ta-form-item': true,
              [`ta-form-item--${unref(isEditable) ? 'editable' : 'diseditable'}`]:
                unref(hasEditable),
            }}
            {...(itemProps as Recordable)}
            label={renderLabelHelpMessage()}
            rules={handleRules()}
            labelCol={labelCol}
            wrapperCol={wrapperCol}
          >
            {unref(hasEditable)
              ? (
              <div style="display:flex;">{renderFormItem()}</div>
                )
              : (
              <div style="display:flex">{renderFormItem()}</div>
                )}
          </Form.Item>
        )
        // ::==================== i7eo：更新 ///// end   ///// ====================:: //
      }
    }
    /* eslint-disable react/display-name */
    /* eslint-disable react/prop-types */
    return () => {
      const { colProps = {}, colSlot, renderColContent, component } = props.schema

      if (component && !componentMap.has(component))
        return null

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
</script>
