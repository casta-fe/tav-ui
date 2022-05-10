import type { NamePath } from 'ant-design-vue/lib/form/interface';
import type { ColProps } from 'ant-design-vue/lib/grid/Col';
import type { HTMLAttributes, VNodeChild } from 'vue';
export interface FormItem {
  colon?: boolean;
  extra?: string | VNodeChild | JSX.Element;
  hasFeedback?: boolean;
  help?: string | VNodeChild | JSX.Element;
  label?: string | VNodeChild | JSX.Element;
  labelCol?: ColProps & HTMLAttributes;
  required?: boolean;
  validateStatus?: '' | 'success' | 'warning' | 'error' | 'validating';
  wrapperCol?: ColProps;
  htmlFor?: string;
  labelAlign?: 'left' | 'right';
  name?: NamePath;
  rules?: object | object[];
  autoLink?: boolean;
  validateFirst?: boolean;
  validateTrigger?: string | string[] | false;
}
