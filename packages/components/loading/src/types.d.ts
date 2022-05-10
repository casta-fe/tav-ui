import type { ExtractPropTypes } from 'vue';
export declare enum SizeEnum {
  DEFAULT = 'default',
  SMALL = 'small',
  LARGE = 'large',
}
export declare const loadingProps: {
  tip: {
    type: StringConstructor;
    default: string;
  };
  size: {
    type: StringConstructor;
    default: SizeEnum;
    validator: (v: SizeEnum) => boolean;
  };
  absolute: {
    type: BooleanConstructor;
    default: boolean;
  };
  loading: {
    type: BooleanConstructor;
    default: boolean;
  };
  background: {
    type: StringConstructor;
  };
  theme: {
    type: StringConstructor;
  };
};
export declare type LoadingProps = ExtractPropTypes<typeof loadingProps>;
export interface LoadingCreateProps {
  tip: string;
  size: SizeEnum;
  absolute: boolean;
  loading: boolean;
  background: string;
  theme: 'dark' | 'light';
}
