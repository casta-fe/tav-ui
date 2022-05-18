import type { ExtractPropTypes, PropType } from 'vue'

export type Recordable<T = any> = Record<string, T>

export type NumberOrNumberString = PropType<string | number | undefined>

export const virtualScrollProps = {
  height: [Number, String] as NumberOrNumberString,
  maxHeight: [Number, String] as NumberOrNumberString,
  maxWidth: [Number, String] as NumberOrNumberString,
  minHeight: [Number, String] as NumberOrNumberString,
  minWidth: [Number, String] as NumberOrNumberString,
  width: [Number, String] as NumberOrNumberString,
  bench: {
    type: [Number, String] as NumberOrNumberString,
    default: 0,
  },
  itemHeight: {
    type: [Number, String] as NumberOrNumberString,
    required: true,
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
}

export type VirtualScrollProps = ExtractPropTypes<typeof virtualScrollProps>
