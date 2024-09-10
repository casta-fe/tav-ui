import { type ComputedRef, computed } from 'vue'
import { isFunction } from '@tav-ui/utils'
import { tavI18n } from '@tav-ui/locales'
import { type FileCardProps, type FileCardRuleItem } from '../types'
import { type GlobalConfigFileProps } from '../../typings'

export function defaultRulesBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
) {
  const defaultRules: FileCardRuleItem[] = [
    {
      key: 'required',
      required: true,
      trigger: 'change',
      message: () => `${mergedProps.value.value} ${tavI18n('Tav.common.required')}`,
    },
  ]

  return defaultRules
}

export function useRules(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
}) {
  const { mergedProps } = options

  return computed(() => {
    const rules = mergedProps.value.rules

    let result = defaultRulesBuilder(mergedProps)

    if (rules && isFunction(rules)) {
      result = rules(result)
    }

    return result
  })
}
