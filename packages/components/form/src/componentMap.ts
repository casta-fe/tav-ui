/**
 * Component list, register here to setting it in the form
 */
// import ApiCascader from "./components/ApiCascader.vue";
// import ApiRadioGroup from "./components/ApiRadioGroup.vue";
import {
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  TreeSelect,
} from 'ant-design-vue'
import { TaMemberSelect } from '@tav-ui/components/member-select'
import { TaStrengthMeter as StrengthMeter } from '@tav-ui/components/strength-meter'
import IconPicker from '@tav-ui/components/icon-picker'
import { TaCountDown as CountdownInput } from '@tav-ui/components/count-down'
import { TaInputNumberRange } from '@tav-ui/components/input-number-range'
import { TaCascadeProSelect } from '@tav-ui/components/cascade-pro'
import ApiSelect from './components/ApiSelect.vue'
import FormTitle from './components/FormTitle.vue'
// import ApiTreeSelect from "./components/ApiTreeSelect.vue";
import RadioButtonGroup from './components/RadioButtonGroup.vue'
import SearchableApiSelect from './components/SearchableApiSelect'
import TagSelect from './components/TagSelect'
import YearPicker from './components/YearPicker'
import DateInterval from './components/DateInterval.vue'
import type { Component } from 'vue'
// import { BasicUpload } from "/@/components/Upload";
import type { ComponentType, EditableComponentType } from './types/index'
const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', Input)
componentMap.set('InputGroup', Input.Group)
componentMap.set('InputPassword', Input.Password)
componentMap.set('InputSearch', Input.Search)
componentMap.set('InputTextArea', Input.TextArea)
componentMap.set('InputNumber', InputNumber)
componentMap.set('AutoComplete', AutoComplete)

componentMap.set('Select', Select)
componentMap.set('ApiSelect', ApiSelect)
componentMap.set('TreeSelect', TreeSelect)
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
// componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('Switch', Switch)
componentMap.set('RadioButtonGroup', RadioButtonGroup)
componentMap.set('RadioGroup', Radio.Group)
componentMap.set('Checkbox', Checkbox)
componentMap.set('CheckboxGroup', Checkbox.Group)
// componentMap.set('ApiCascader', ApiCascader);
componentMap.set('Cascader', Cascader)
componentMap.set('Slider', Slider)
componentMap.set('Rate', Rate)

componentMap.set('DatePicker', DatePicker)
componentMap.set('MonthPicker', DatePicker.MonthPicker)
componentMap.set('RangePicker', DatePicker.RangePicker)
componentMap.set('WeekPicker', DatePicker.WeekPicker)
componentMap.set('TimePicker', TimePicker)
componentMap.set('StrengthMeter', StrengthMeter)
componentMap.set('IconPicker', IconPicker)
componentMap.set('InputCountDown', CountdownInput)

// componentMap.set('Upload', BasicUpload);
componentMap.set('Divider', Divider)
componentMap.set('FormTitle', FormTitle)
componentMap.set('DateInterval', DateInterval)

// customadd
add('MemberSelect', TaMemberSelect)
add('SearchableApiSelect', SearchableApiSelect)
add('TagSelect', TagSelect)
add('YearPicker', YearPicker)
add('InputNumberRange', TaInputNumberRange)
add('CascadeProSelect', TaCascadeProSelect)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

/* EditableTableForm ---------- start ---------- */

/* EditableTableForm 支持组件列表 ---------- start ---------- */

const editableComponentInputTypeMap = new Map<EditableComponentType, Component>()
// clickoutside 隐藏表单项
editableComponentInputTypeMap.set('Input', Input)
editableComponentInputTypeMap.set('InputPassword', Input.Password)
editableComponentInputTypeMap.set('InputSearch', Input.Search)
editableComponentInputTypeMap.set('InputTextArea', Input.TextArea)
editableComponentInputTypeMap.set('InputNumber', InputNumber)
const editableComponentSelectTypeMap = new Map<EditableComponentType, Component>()
// onchange/clickoutside 隐藏表单项
editableComponentSelectTypeMap.set('Select', Select)
editableComponentSelectTypeMap.set('MemberSelect', TaMemberSelect)
editableComponentSelectTypeMap.set('SearchableApiSelect', SearchableApiSelect)

const editableComponentCheckTypeMap = new Map<EditableComponentType, Component>()
// onchange/clickoutside 隐藏表单项
editableComponentCheckTypeMap.set('Switch', Switch)
editableComponentCheckTypeMap.set('Checkbox', Checkbox)
const editableComponentCheckGroupTypeMap = new Map<EditableComponentType, Component>()
// onchange/clickoutside 隐藏表单项
// 这三个都传入option
editableComponentCheckGroupTypeMap.set('CheckboxGroup', Checkbox.Group)
editableComponentCheckGroupTypeMap.set('RadioGroup', Radio.Group)
editableComponentCheckGroupTypeMap.set('RadioButtonGroup', RadioButtonGroup)
const editableComponentChecksTypeMap = new Map<EditableComponentType, Component>([
  ...editableComponentCheckTypeMap,
  ...editableComponentCheckGroupTypeMap,
])
const editableComponentTimeTypeMap = new Map<EditableComponentType, Component>()
// clickoutside 隐藏表单项
editableComponentTimeTypeMap.set('DatePicker', DatePicker)
editableComponentTimeTypeMap.set('MonthPicker', DatePicker.MonthPicker)
editableComponentTimeTypeMap.set('RangePicker', DatePicker.RangePicker)
editableComponentTimeTypeMap.set('WeekPicker', DatePicker.WeekPicker)
editableComponentTimeTypeMap.set('TimePicker', TimePicker)

const editableComponentOtherTypeMap = new Map<EditableComponentType, Component>()
editableComponentOtherTypeMap.set('InputNumberRange', TaInputNumberRange)
editableComponentOtherTypeMap.set('CascadeProSelect', TaCascadeProSelect)
editableComponentOtherTypeMap.set('SearchableApiSelect', SearchableApiSelect)

/* EditableTableForm 支持组件列表 ----------  end  ---------- */

const editableTriggeClickoutsideToCloseComponentMap = new Map<EditableComponentType, Component>([
  ...editableComponentInputTypeMap,
  ...editableComponentChecksTypeMap,
  // 下列复杂组件不仅change要关闭，clickoutside时候也得关闭
  ...editableComponentSelectTypeMap,
  ...editableComponentTimeTypeMap,
  ...editableComponentOtherTypeMap,
])
const editableTriggerChangeToCloseComponentMap = new Map<EditableComponentType, Component>([
  ...editableComponentSelectTypeMap,
  ...editableComponentCheckTypeMap,
  ...editableComponentTimeTypeMap,
  ...editableComponentOtherTypeMap,
])
const editableComponentMap = new Map<EditableComponentType, Component>([
  ...editableComponentInputTypeMap,
  ...editableComponentSelectTypeMap,
  ...editableComponentChecksTypeMap,
  ...editableComponentTimeTypeMap,
  ...editableComponentOtherTypeMap,
])
/* EditableTableForm ----------  end  ---------- */

export {
  componentMap,
  editableComponentMap,
  editableComponentInputTypeMap,
  editableComponentSelectTypeMap,
  editableComponentChecksTypeMap,
  editableComponentTimeTypeMap,
  editableComponentOtherTypeMap,
  editableTriggeClickoutsideToCloseComponentMap,
  editableTriggerChangeToCloseComponentMap,
}
