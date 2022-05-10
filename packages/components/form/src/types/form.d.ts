import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import type { CSSProperties, VNode } from 'vue';
import type { ButtonProps as AntdButtonProps } from '../../../button/src/types';
import type { TableActionType } from '../../../table/src/types/table';
import type { FormItem } from './formItem';
import type { ColEx, ComponentType } from './index';
export declare type FieldMapToTime = [string, [string, string], string?][];
export declare type Rule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};
declare type Recordable<T = any> = Record<string, T>;
export interface RenderCallbackParams {
  schema: FormSchema;
  values: Recordable;
  model: Recordable;
  field: string;
}
interface ButtonProps extends AntdButtonProps {
  text?: string;
}
export interface FormActionType {
  submit: () => Promise<void>;
  setFieldsValue: <T>(values: T, useValidate?: boolean) => Promise<void>;
  resetFields: () => Promise<void>;
  getFieldsValue: () => Recordable;
  clearValidate: (name?: string | string[]) => Promise<void>;
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  removeSchemaByFiled: (field: string | string[]) => Promise<void>;
  appendSchemaByField: (
    schema: FormSchema,
    prefixField: string | undefined,
    first?: boolean
  ) => Promise<void>;
  validateFields: (nameList?: NamePath[]) => Promise<any>;
  validate: (nameList?: NamePath[]) => Promise<any>;
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
}
declare type RegisterFn = (formInstance: FormActionType) => void;
export declare type UseFormReturnType = [RegisterFn, FormActionType];
export interface FormProps {
  layout?: 'vertical' | 'inline' | 'horizontal';
  model?: Recordable;
  labelWidth?: number | string;
  labelAlign?: 'left' | 'right';
  rowProps?: RowProps;
  submitOnReset?: boolean;
  labelCol?: Partial<ColEx>;
  wrapperCol?: Partial<ColEx>;
  baseRowStyle?: CSSProperties;
  baseColProps?: Partial<ColEx>;
  schemas?: FormSchema[];
  mergeDynamicData?: Recordable;
  compact?: boolean;
  emptySpan?: number | Partial<ColEx>;
  size?: 'default' | 'small' | 'large';
  disabled?: boolean;
  fieldMapToTime?: FieldMapToTime;
  autoSetPlaceHolder?: boolean;
  autoSubmitOnEnter?: boolean;
  rulesMessageJoinLabel?: boolean;
  showAdvancedButton?: boolean;
  autoFocusFirstItem?: boolean;
  autoAdvancedLine?: number;
  alwaysShowLines?: number;
  showActionButtonGroup?: boolean;
  resetButtonOptions?: Partial<ButtonProps>;
  submitButtonOptions?: Partial<ButtonProps>;
  actionColOptions?: Partial<ColEx>;
  showResetButton?: boolean;
  showSubmitButton?: boolean;
  resetFunc?: () => Promise<void>;
  submitFunc?: () => Promise<void>;
  transformDateFunc?: (date: any) => string;
  colon?: boolean;
}
export interface FormSchema {
  field: string;
  changeEvent?: string;
  valueField?: string;
  label: string | VNode;
  subLabel?: string;
  helpMessage?:
    | string
    | string[]
    | ((renderCallbackParams: RenderCallbackParams) => string | string[]);
  helpComponentProps?: Partial<HelpComponentProps>;
  labelWidth?: string | number;
  disabledLabelWidth?: boolean;
  valueType?: string;
  editable?: boolean;
  component?: ComponentType;
  componentProps?:
    | ((opt: {
        schema: FormSchema;
        tableAction: TableActionType;
        formActionType: FormActionType;
        formModel: Recordable;
      }) => Recordable)
    | object;
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
  suffix?: string | number | ((values: RenderCallbackParams) => string | number);
  rules?: Rule[];
  rulesMessageJoinLabel?: boolean;
  itemProps?: Partial<FormItem>;
  colProps?: Partial<ColEx>;
  defaultValue?: any;
  isAdvanced?: boolean;
  span?: number;
  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;
  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => any)
    | VNode
    | VNode[]
    | string;
  slot?: string;
  colSlot?: string;
  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
}
export interface HelpComponentProps {
  maxWidth: string;
  showIndex: boolean;
  text: any;
  color: string;
  fontSize: string;
  icon: string;
  absolute: boolean;
  position: any;
}
export {};
