import type { NamePath } from 'ant-design-vue/lib/form/interface';
import type { ComputedRef, Ref } from 'vue';
import type { FormProps, UseFormReturnType } from '../types/form';
declare type Recordable<T = any> = Record<string, T>;
declare type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};
export declare type ValidateFields = (nameList?: NamePath[]) => Promise<Recordable>;
declare type Props = Partial<DynamicProps<FormProps>>;
export declare function useForm(props?: Props): UseFormReturnType;
export {};
