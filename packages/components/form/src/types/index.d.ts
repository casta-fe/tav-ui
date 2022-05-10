declare type ColSpanType = number | string;
export interface ColEx {
  style?: any;
  span?: ColSpanType;
  order?: ColSpanType;
  flex?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
  xs?:
    | {
        span: ColSpanType;
        offset: ColSpanType;
      }
    | ColSpanType;
  sm?:
    | {
        span: ColSpanType;
        offset: ColSpanType;
      }
    | ColSpanType;
  md?:
    | {
        span: ColSpanType;
        offset: ColSpanType;
      }
    | ColSpanType;
  lg?:
    | {
        span: ColSpanType;
        offset: ColSpanType;
      }
    | ColSpanType;
  xl?:
    | {
        span: ColSpanType;
        offset: ColSpanType;
      }
    | ColSpanType;
  xxl?:
    | {
        span: ColSpanType;
        offset: ColSpanType;
      }
    | ColSpanType;
}
export declare type ComponentType =
  | 'Input'
  | 'InputGroup'
  | 'InputPassword'
  | 'InputSearch'
  | 'InputTextArea'
  | 'InputNumber'
  | 'InputCountDown'
  | 'Select'
  | 'ApiSelect'
  | 'TreeSelect'
  | 'ApiTreeSelect'
  | 'ApiRadioGroup'
  | 'RadioButtonGroup'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'AutoComplete'
  | 'ApiCascader'
  | 'Cascader'
  | 'DatePicker'
  | 'MonthPicker'
  | 'RangePicker'
  | 'WeekPicker'
  | 'TimePicker'
  | 'Switch'
  | 'StrengthMeter'
  | 'Upload'
  | 'IconPicker'
  | 'Render'
  | 'Slider'
  | 'Rate'
  | 'Divider'
  | 'MemberSelect'
  | 'SearchableApiSelect';
export declare type EditableComponentType =
  | 'Input'
  | 'InputGroup'
  | 'InputPassword'
  | 'InputSearch'
  | 'InputTextArea'
  | 'InputNumber'
  | 'InputCountDown'
  | 'Select'
  | 'ApiSelect'
  | 'TreeSelect'
  | 'ApiTreeSelect'
  | 'ApiRadioGroup'
  | 'RadioButtonGroup'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'AutoComplete'
  | 'ApiCascader'
  | 'Cascader'
  | 'DatePicker'
  | 'MonthPicker'
  | 'RangePicker'
  | 'WeekPicker'
  | 'TimePicker'
  | 'Switch'
  | 'StrengthMeter'
  | 'Upload'
  | 'IconPicker'
  | 'Render'
  | 'Slider'
  | 'Rate'
  | 'Divider'
  | 'MemberSelect'
  | 'SearchableApiSelect';
export {};
