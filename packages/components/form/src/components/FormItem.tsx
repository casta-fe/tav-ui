/* eslint-disable dot-notation */
import { computed, defineComponent, h, ref, toRefs, unref, watch, withDirectives } from 'vue'
import { EditOutlined, LockOutlined } from '@ant-design/icons-vue'
import { Col, Divider, Form } from 'ant-design-vue'
import { cloneDeep, upperFirst } from 'lodash-es'
import AutoFocusDirective from '@tav-ui/directives/src/autoFocus'
import clickOutside from '@tav-ui/directives/src/clickOutside'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
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
import BasicHelp from '@tav-ui/components/basic-help'
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
import type { ValidationRule } from 'ant-design-vue/lib/form/Form'
import type { TableActionType } from '@tav-ui/components/table/src/types/table'
import type { FormActionType, FormProps, FormSchema } from '../types/form'

type Recordable<T = any> = Record<string, T>
type Nullable<T> = T | null

const NUMBER_MAX = 9999999999
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
  directives: {
    clickOutside,
  },
  setup(props, { slots }) {
    // ?????? memberselect
    // ??????????????????????????????
    const { schema, formProps } = toRefs(props) as {
      schema: Ref<FormSchema>
      formProps: Ref<FormProps>
    }

    // ::==================== i7eo????????? ///// start ///// ====================:: //
    const itemValue = computed(
      () => props.formModel[props.schema.field] || props.schema.defaultValue
    )
    const editableItemValue = ref<any>(itemValue.value) // ?????????
    const hasEditable = computed(() => Reflect.has(props.schema, 'editable'))
    const isEditable = computed(() => !!props.schema.editable)
    const isEditableItemClicked = ref<boolean>(false) // ????????????/??????
    const itemRef = ref<HTMLElement | null>(null) // ???????????????

    unref(hasEditable) &&
      watch(
        () => props.formModel[props.schema.field],
        (newVal, oldVal) => {
          if (isBoolean(newVal)) {
            // ??????switch???checkbox
            if (isDef(newVal) && newVal !== oldVal) {
              // ????????????????????????????????????????????????
              setEditableFormItemValue(props.schema, newVal)
            } else {
              // ???????????????
              setEditableFormItemValue(props.schema, editableItemValue)
            }
          } else {
            // ?????????????????????select??????0????????????????????????label
            // eslint-disable-next-line eqeqeq
            if (props.schema.component == 'Select') setEditableFormItemValue(props.schema, newVal)

            if (!isNullOrUnDef(newVal) && newVal !== oldVal) {
              // ????????????????????????????????????????????????
              setEditableFormItemValue(props.schema, newVal)
            } else if (isNullOrUnDef(newVal) && oldVal && newVal !== oldVal) {
              // ????????????????????????????????????????????????
              setEditableFormItemValue(props.schema, newVal)
            } else {
              // ???????????????
              setEditableFormItemValue(props.schema, editableItemValue)
            }
          }

          // if (newVal && newVal !== oldVal) {
          //   // ????????????????????????????????????????????????
          //   setEditableFormItemValue(props.schema, newVal);
          // } else if (!newVal && oldVal && newVal !== oldVal) {
          //   // ????????????????????????????????????????????????
          //   setEditableFormItemValue(props.schema, newVal);
          // } else {
          //   // ???????????????
          //   setEditableFormItemValue(props.schema, editableItemValue);
          // }
        },
        { immediate: true }
      )
    watch(
      () => props.formModel[props.schema.field],
      (newVal) => {
        getFormItemPrecision(newVal, false)
      },
      { immediate: true }
    )
    // ??????editable updateschema??? setFieldsValue??????????????????????????????????????????
    unref(hasEditable) &&
      watch(
        () => (props.schema.componentProps as any)?.options,
        () => {
          setEditableFormItemValue(props.schema, itemValue.value)
        }
      )
    function setEditableFormItemValue(schema, _value) {
      const value = unref(_value)
      if (isString(value)) {
        // select ????????? label
        if (editableComponentSelectTypeMap.has(schema.component)) {
          const target = schema.componentProps?.options?.find(
            (option) => option.value === value || option.label === value
          )
          editableItemValue.value = target ? target.label : '-'
        } else if (editableComponentTimeTypeMap.has(schema.component)) {
          // ??????????????????????????????????????????
          const valueFormat = schema.componentProps.valueFormat
          if (value && value != '-') {
            editableItemValue.value = formatToDate(value, valueFormat)
          } else {
            editableItemValue.value = '-'
          }

          // editableItemValue.value = value ? formatToDate(value, valueFormat) : "-";
        } else {
          // input ?????????
          // inputNumber ????????????????????????????????????
          editableItemValue.value = value || '-'
        }
      } else if (isNumber(value)) {
        // select ????????? label
        if (editableComponentSelectTypeMap.has(schema.component)) {
          let schemaOptions: any[] = []
          // ??????????????? ?????????????????????????????????????????????option????????????editable??????????????????????????????????????????????????????
          if (schema.component == 'MemberSelect') {
            const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
            const allUserList = globalConfig.value?.TaMemberSelect?.allUserList || []
            schemaOptions = [...(schema.componentProps?.options || []), ...allUserList]
          } else {
            schemaOptions = schema.componentProps?.options
          }
          const target = schemaOptions.find(
            (option) => option.value === value || option.label === value
          )
          editableItemValue.value = target ? target.label : '-'
        } else {
          const inputFormatter = schema.componentProps?.formatter
          if (inputFormatter) {
            // ?????? inputNumber formatter
            editableItemValue.value = inputFormatter(value)
          } else {
            // input ?????????
            editableItemValue.value = value
          }
        }
      } else if (isArray(value)) {
        // select || checkGroup ???????????????label ??? ?????????
        if (
          editableComponentSelectTypeMap.has(schema.component) ||
          (editableComponentChecksTypeMap.has(schema.component) &&
            schema.component.includes('Group'))
        ) {
          let schemaOptions: any[] = []
          // ??????????????? ?????????????????????????????????????????????option????????????editable??????????????????????????????????????????????????????
          if (schema.component == 'MemberSelect') {
            const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
            const allUserList = globalConfig.value?.TaMemberSelect?.allUserList || []
            schemaOptions = [...(schema.componentProps?.options || []), ...allUserList]
          } else {
            schemaOptions = schema.componentProps?.options
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
          // date ?????? string
          const valueFormat = schema.componentProps?.valueFormat
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
        editableItemValue.value = value ? '??????' : '??????'
      } else {
        // ????????????
        // 1. ????????? defaultvalue??????????????? resetFields???newval ??? undefined
        //  ????????????0????????? by hyb
        editableItemValue.value = isNullOrUnDef(value) ? '-' : itemValue.value
      }
    }

    function handleOnChange(go = false) {
      if (unref(hasEditable) && props.schema.component) {
        const isMultipleSelect =
          editableComponentSelectTypeMap.has(props.schema.component) &&
          props.schema.componentProps &&
          ((props.schema.componentProps as any).mode === 'multiple' ||
            (props.schema.componentProps as any).mode === 'tags')
        const isCheckTypeGroup =
          editableComponentChecksTypeMap.has(props.schema.component) &&
          props.schema.component.includes('Group')
        const isTimePicker = props.schema.component === 'TimePicker'
        const isRangePickerHasTimePicker =
          props.schema.component === 'RangePicker' &&
          props.schema.componentProps &&
          (props.schema.componentProps as any).showTime
        const isOpenMultipleSelect =
          editableComponentSelectTypeMap.has(props.schema.component) &&
          props.schema.componentProps &&
          (props.schema.componentProps as any).multiple === true

        // ??? rangepicker????????????????????????????????????
        if (go) {
          showEditableDom(editableTriggerChangeToCloseComponentMap, props.schema)
        } else {
          // ???????????????????????????????????????
          // 1. ??????????????????????????????clickoutside?????????????????????????????????
          // 2. CheckTypeGroup???clickoutside??????
          // 3. TimePicker???clickoutside??????
          // 4. RangePicker?????????timepicker
          // 5. tree???memberselect?????????????????? multiple: true
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
        if (componentMap.has(schema.component)) isEditableItemClicked.value = false
      }
      if (schema.required) {
        // if (props.schema.field === "purposeInvestScale") {
        //   debugger;
        // }
        const schemaValue = props.formModel[schema.field]
        //  ????????????0????????? by hyb
        // eslint-disable-next-line eqeqeq
        if (schema.component == 'InputNumber') {
          if (schemaValue !== undefined && !isNull(schemaValue)) hide()
        } else {
          if (schemaValue) {
            hide()
          } else {
            // ??????????????????????????????????????????
            // ?????????????????????????????????????????????????????????????????????????????????????????????????????? async-validator ??????????????? change blur???
          }
        }
      } else {
        hide()
      }
    }

    function handleClickOutside() {
      // ???????????????????????? input ???
      showEditableDom(editableTriggeClickoutsideToCloseComponentMap, props.schema)
    }
    // ::==================== i7eo????????? ///// end   ///// ====================:: //

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
      const { disabled: globDisabled } = props.formProps
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      let disabled = !!globDisabled || itemDisabled
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
        valueType = 'string',
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
          // ??????
          return Promise.reject(msg)
        } else if (Array.isArray(value) && value.length === 0) {
          // ????????????
          return Promise.reject(msg)
        } else if (typeof value === 'string' && value.trim() === '') {
          // ????????????
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
          // ??????????????????tree??????
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
            if (valueType) rule.type = valueType
            else rule.type = component === 'InputNumber' ? 'number' : 'string'
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
          '??????????????????{0}???'.replace('{0}', `${rules[characterInx].max}`)
      }
      return rules
    }
    // ?????????????????????????????? ?????????2?????????6
    function getFormItemPrecision(_value, getDomValue) {
      if (props.schema.component !== 'InputNumber') {
        return
      }
      if (_value === undefined) {
        return
      }
      // console.log(props.schema.componentProps);
      if (props.schema.componentProps && props.schema.componentProps['noAutoPrecision']) {
        return
      }
      let precision = 0
      let value = _value
      if (getDomValue && itemRef.value) {
        const inputEle = itemRef.value.querySelector('input')
        if (inputEle) {
          value = inputEle.value
        }
        // inputEle
      }
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

      if (!props.schema.componentProps) {
        // eslint-disable-next-line vue/no-mutating-props
        props.schema.componentProps = { precision }
      } else {
        // eslint-disable-next-line vue/no-mutating-props
        props.schema.componentProps['precision'] = precision
      }
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
          setTimeout(() => {
            getFormItemPrecision(value, true)
          }, 50)
          // ::==================== i7eo????????? ///// start ///// ====================:: //
          handleOnChange()
          // ::==================== i7eo????????? ///// end   ///// ====================:: //
        },
      }

      const Comp = component && (componentMap.get(component) as ReturnType<typeof defineComponent>)
      const size = props.formProps['size']
      const propsData: Recordable = {
        // allowClear: unref(hasEditable) ? false : true, // i7eo?????????????????????clickoutside
        // getPopupContainer: (trigger: Element) => (trigger ? trigger.parentNode : document.body),
        size,
        ...unref(getComponentsProps),
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

      // ::==================== i7eo????????? ///// start  ///// ====================:: //
      const setMaxLengthComponentNames = ['Input', 'InputPassword', 'InputSearch', 'InputTextArea'] // ????????????????????????????????????
      if (component && setMaxLengthComponentNames.includes(component)) {
        if (component === 'InputTextArea') {
          compAttr.maxlength = (componentProps as any)?.maxLength ?? 256
          compAttr.showCount = (componentProps as any)?.showCount ?? true
          compAttr.autoSize = (componentProps as any)?.autoSize ?? { minRows: 4, maxRows: 4 }
        } else {
          compAttr.maxlength = 32
        }
      }
      if (component === 'InputNumber') {
        compAttr.max = (componentProps as any)?.max ?? NUMBER_MAX
        compAttr.min = (componentProps as any)?.min ?? 0
        compAttr.precision = (componentProps as any)?.precision ?? undefined
      }

      if (unref(hasEditable)) {
        if (component && editableComponentSelectTypeMap.has(component)) {
          compAttr.autofocus = true
          compAttr.defaultOpen = true
          compAttr.getPopupContainer = () => unref(itemRef)
        } else if (component && editableComponentTimeTypeMap.has(component)) {
          compAttr.open = true
          compAttr.getCalendarContainer = () => unref(itemRef)
          compAttr.onOk = (dates) => {
            props.setFormModel(field, dates)
            handleOnChange(true)
          }
        }
      }
      // if (!renderComponentContent) return <Comp {...compAttr} />;
      if (!renderComponentContent) {
        return unref(hasEditable) ? (
          withDirectives(h(Comp, { ...compAttr }), [[AutoFocusDirective]])
        ) : (
          <Comp {...compAttr} />
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
      // ::==================== i7eo????????? ///// end   ///// ====================:: //
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
      const { itemProps, slot, render, field, suffix, component } = props.schema
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

        // ::==================== i7eo????????? ///// start ///// ====================:: //
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
          // ???????????????????????????6???
          if (
            props.schema.component === 'InputNumber' &&
            typeof editableItemValue.value == 'number'
          ) {
            if (props.schema.componentProps) {
              const precision = props.schema.componentProps['precision']
              return precision
                ? editableItemValue.value.toFixed(precision)
                : editableItemValue.value
            } else {
              return editableItemValue.value
            }
          } else {
            return <div>{editableItemValue.value}</div>
          }
        }

        const createEditableFormItem = () => {
          return !unref(isEditableItemClicked) ? (
            <div
              class={
                props.schema.component === 'InputNumber'
                  ? 'ta-form-item__cell number-cell'
                  : 'ta-form-item__cell'
              }
              title={editableItemValue.value}
              onClick={() => {
                if (unref(isEditable)) isEditableItemClicked.value = true
              }}
            >
              {getEditableFormContent()}

              {unref(isEditable) ? (
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
                `????????? ${component} ???????????????????????????????????????????????????: ${editableComponentMap}`
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
            <div>{renderFormItem()}</div>
          </Form.Item>
        )
        // ::==================== i7eo????????? ///// end   ///// ====================:: //
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
