import componentSetting from '@tav-ui/settings/src/componentSetting';
import type { ExtractPropTypes } from 'vue';

type Nullable<T> = T | null;
type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

export interface BarMapItem {
  offset: string;
  scroll: string;
  scrollSize: string;
  size: string;
  key: string;
  axis: string;
  client: string;
  direction: string;
}
export interface BarMap {
  vertical: BarMapItem;
  horizontal: BarMapItem;
}

export interface ScrollbarType {
  wrap: ElRef;
}

export const scrollbarProps = {
  native: {
    type: Boolean,
    default: componentSetting.scrollbar?.native ?? false,
  },
  wrapStyle: {
    type: [String, Array],
    default: '',
  },
  wrapClass: {
    type: [String, Array],
    default: '',
  },
  containerClass: {
    type: [String, Array],
    default: '',
  },
  viewClass: {
    type: [String, Array],
    default: '',
  },
  viewStyle: {
    type: [String, Array],
    default: '',
  },
  noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  tag: {
    type: String,
    default: 'div',
  },
};

export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>;
