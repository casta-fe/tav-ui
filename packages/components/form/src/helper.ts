import { tavI18n } from '@tav-ui/locales'
import { dateUtil } from '@tav-ui/utils/dateUtil'
import { isNumber, isObject } from '@tav-ui/utils/is'
import type { ValidationRule } from 'ant-design-vue/lib/form/Form'
import type { ComponentType } from './types/index'

type Recordable<T = any> = Record<string, T>
/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType, label = '') {
  if (component.includes('Input') || component.includes('Complete'))
    return `${tavI18n('Tav.common.inputText')}${label}`

  if (component.includes('Picker')) return `${tavI18n('Tav.common.chooseText')}${label}`

  if (
    component.includes('Select') ||
    component.includes('Cascader') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    // return `请选择${label}`;
    return `${tavI18n('Tav.common.chooseText')}${label}`
  }
  return ''
}

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker']

function genType() {
  return [...DATE_TYPE, 'RangePicker']
}

export function setComponentRuleType(
  rule: ValidationRule,
  component: ComponentType,
  valueFormat: string
) {
  if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component))
    rule.type = valueFormat ? 'string' : 'object'
  else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component))
    rule.type = 'array'
  else if (['InputNumber'].includes(component)) rule.type = 'number'
}

export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr
  if (valueFormat) attr.value = isObject(value) ? dateUtil(value).format(valueFormat) : value
  else if (DATE_TYPE.includes(component) && value) attr.value = dateUtil(attr.value)
}

export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val
  if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component))
    return val && isNumber(val) ? `${val}` : val

  return val
}

/**
 * 时间字段
 */
export const dateItemType = genType()
