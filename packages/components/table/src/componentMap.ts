// import { ApiSelect, ApiTreeSelect } from '@casta-fe-playground/components/Form';
import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
} from 'ant-design-vue';
import type { Component } from 'vue';
import type { ComponentType } from './types/componentType';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputNumber', InputNumber);
componentMap.set('Select', Select);
// componentMap.set('ApiSelect', ApiSelect);
// componentMap.set('ApiTreeSelect', ApiTreeSelect);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);
componentMap.set('DatePicker', DatePicker);
componentMap.set('TimePicker', TimePicker);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
