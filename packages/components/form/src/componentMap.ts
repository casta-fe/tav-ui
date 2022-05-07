/**
 * Component list, register here to setting it in the form
 */
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
import type { Component } from 'vue'
import type { ComponentType, EditableComponentType } from './types/index'
// import ApiCascader from "./components/ApiCascader.vue";
// import ApiRadioGroup from "./components/ApiRadioGroup.vue";
// import ApiSelect from "./components/ApiSelect.vue";
// import ApiTreeSelect from "./components/ApiTreeSelect.vue";
// import RadioButtonGroup from "./components/RadioButtonGroup.vue";
// import { CountdownInput } from "@casta-fe-playground/components/CountDown";
// import { IconPicker } from "@casta-fe-playground/components/Icon";
// import { MemberSelect } from "@casta-fe-playground/components/MemberSelect";
// import { StrengthMeter } from "@casta-fe-playground/components/StrengthMeter";
// import { BasicUpload } from "@casta-fe-playground/components/Upload";
// import SearchableApiSelect from "./components/SearchableApiSelect.vue";

const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', Input)
componentMap.set('InputGroup', Input.Group)
componentMap.set('InputPassword', Input.Password)
componentMap.set('InputSearch', Input.Search)
componentMap.set('InputTextArea', Input.TextArea)
componentMap.set('InputNumber', InputNumber)
componentMap.set('AutoComplete', AutoComplete)

componentMap.set('Select', Select)
// componentMap.set('ApiSelect', ApiSelect);
componentMap.set('TreeSelect', TreeSelect)
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
// componentMap.set('ApiRadioGroup', ApiRadioGroup);
componentMap.set('Switch', Switch)
// componentMap.set('RadioButtonGroup', RadioButtonGroup);
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
// componentMap.set('StrengthMeter', StrengthMeter);
// componentMap.set('IconPicker', IconPicker);
// componentMap.set('InputCountDown', CountdownInput);

// componentMap.set('Upload', BasicUpload);
componentMap.set('Divider', Divider)

// customadd
// add('MemberSelect', MemberSelect);
// add('SearchableApiSelect', SearchableApiSelect);

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
// editableComponentInputTypeMap.set("InputGroup", Input.Group);
editableComponentInputTypeMap.set('InputPassword', Input.Password)
editableComponentInputTypeMap.set('InputSearch', Input.Search)
editableComponentInputTypeMap.set('InputTextArea', Input.TextArea)
editableComponentInputTypeMap.set('InputNumber', InputNumber)
const editableComponentSelectTypeMap = new Map<EditableComponentType, Component>()
// onchange/clickoutside 隐藏表单项
editableComponentSelectTypeMap.set('Select', Select)
// editableComponentSelectTypeMap.set("ApiSelect", ApiSelect);
// editableComponentSelectTypeMap.set("TreeSelect", TreeSelect);
// editableComponentSelectTypeMap.set("ApiTreeSelect", ApiTreeSelect);
// editableComponentSelectTypeMap.set("ApiRadioGroup", ApiRadioGroup);

// editableComponentSelectTypeMap.set('MemberSelect', MemberSelect);
const editableComponentCheckTypeMap = new Map<EditableComponentType, Component>()
// onchange/clickoutside 隐藏表单项
editableComponentCheckTypeMap.set('Switch', Switch)
editableComponentCheckTypeMap.set('Checkbox', Checkbox)
const editableComponentCheckGroupTypeMap = new Map<EditableComponentType, Component>()
// onchange/clickoutside 隐藏表单项
// 这三个都传入option
editableComponentCheckGroupTypeMap.set('CheckboxGroup', Checkbox.Group)
editableComponentCheckGroupTypeMap.set('RadioGroup', Radio.Group)
// editableComponentCheckGroupTypeMap.set('RadioButtonGroup', RadioButtonGroup);
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
// clickoutside 隐藏表单项
// editableComponentOtherTypeMap.set("AutoComplete", AutoComplete);
// editableComponentOtherTypeMap.set("ApiCascader", ApiCascader);
// editableComponentOtherTypeMap.set("Cascader", Cascader);
// editableComponentOtherTypeMap.set("Slider", Slider);
// editableComponentOtherTypeMap.set("Rate", Rate);
// editableComponentOtherTypeMap.set("StrengthMeter", StrengthMeter);
// editableComponentOtherTypeMap.set("IconPicker", IconPicker);
// editableComponentOtherTypeMap.set("Upload", BasicUpload);

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
