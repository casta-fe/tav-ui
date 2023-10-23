import type { ExtractPropTypes, PropType } from 'vue'
type I18nGlobalTranslation = {
  (key: string): string
  (key: string, locale: string): string
  (key: string, locale: string, list: unknown[]): string
  (key: string, locale: string, named: Record<string, unknown>): string
  (key: string, list: unknown[]): string
  (key: string, named: Record<string, unknown>): string
}
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
  i18nFun: {
    type: Object as PropType<{ t: I18nGlobalTranslation; locale?: string }>,
    defult: () => ({}),
  },
}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
