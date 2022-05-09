import { h } from 'vue';
import { isString } from '@tav-ui/utils/is';
import Icon from '../../icon/src/icon.vue';
import type { FunctionalComponent, VNode } from 'vue';

export interface ComponentProps {
  icon: VNode | string;
}

export const TreeIcon = ({ icon }: ComponentProps) => {
  if (!icon) return null;
  if (isString(icon)) {
    return h(Icon, { icon, class: 'mr-1' });
  }
  return Icon;
};
