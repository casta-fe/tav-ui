import type { LoadingCreateProps } from './types';
export declare function loadingCreate(
  props?: Partial<LoadingCreateProps>,
  target?: HTMLElement,
  wait?: boolean
): {
  vm: import('vue').VNode<
    import('vue').RendererNode,
    import('vue').RendererElement,
    {
      [key: string]: any;
    }
  >;
  close: () => void;
  open: (target?: HTMLElement) => void;
  setTip: (tip: string) => void;
  setLoading: (loading: boolean) => void;
  readonly loading: boolean;
  readonly $el: HTMLElement;
};
export default loadingCreate;
