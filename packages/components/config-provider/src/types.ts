import type { ExtractPropTypes, PropType } from 'vue'

export const configProviderProps = {
  appId: {
    type: String,
    required: true,
  },
  userInfo: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
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
