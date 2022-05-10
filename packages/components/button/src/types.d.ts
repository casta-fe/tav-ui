import type { ExtractPropTypes, PropType } from 'vue';
export declare const buttonProps: {
  color: {
    type: StringConstructor;
    validator: (v: any) => boolean;
  };
  loading: {
    type: BooleanConstructor;
  };
  disabled: {
    type: BooleanConstructor;
  };
  preIcon: {
    type: StringConstructor;
  };
  preIconColor: {
    type: StringConstructor;
  };
  postIcon: {
    type: StringConstructor;
  };
  postIconColor: {
    type: StringConstructor;
  };
  iconSize: {
    type: NumberConstructor;
    default: number;
  };
  onClick: {
    type: PropType<(...args: any[]) => any>;
    default: any;
  };
  permission: {
    type: StringConstructor;
  };
  ifShow: {
    type: BooleanConstructor;
    default: boolean;
  };
};
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;
