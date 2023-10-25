import { useGlobalConfig } from '@tav-ui/hooks'
import type { Ref } from 'vue'

const i18nFun = useGlobalConfig('i18nFun') as Ref<Record<string, any>>
export const tavI18n = (key: string) => {
  if (i18nFun.value) {
    return i18nFun.value?.t(key)
  } else {
    return ''
  }
}
