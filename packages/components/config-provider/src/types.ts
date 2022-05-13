import type { ExtractPropTypes, PropType } from 'vue'

export const configProviderProps = {
  // namespace: {
  //   type: String,
  //   default: 'ta',
  // },
  permissions: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  components: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
