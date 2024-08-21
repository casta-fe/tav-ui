import { type ComputedRef, type Ref, computed } from 'vue'
import { isBoolean } from '@tav-ui/utils'
import {
  type FileTableCustomActionConfig,
  type FileTableInstance,
  type FileTableProps,
} from '../types'
import { type GlobalConfigFileProps } from '../../../typings'

export function defaultCustomActionConfigBuilder() {
  const DEFAULT_CUSTOM_ACTION_CONFIG: FileTableCustomActionConfig = {
    refresh: true,
  }

  return DEFAULT_CUSTOM_ACTION_CONFIG
}

export function useCustomActionConfig(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
}) {
  const { mergedProps } = options

  return computed(() => {
    const customActionConfig = mergedProps.value.customActionConfig

    const customActionConfigWithNull = {
      enabled: false,
    }

    const customActionConfigWithDefault = () => {
      if (isBoolean(customActionConfig)) {
        if (customActionConfig) {
          return defaultCustomActionConfigBuilder()
        } else {
          return { ...customActionConfigWithNull }
        }
      } else {
        let result = defaultCustomActionConfigBuilder()
        result = customActionConfig(result)
        return result
      }
    }

    if (mergedProps.value.mode === 'read') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "customActionConfig" not working in mode "read" combine with "dataSource"'
        )
        return { ...customActionConfigWithNull }
      } else {
        return customActionConfigWithDefault()
      }
    } else if (mergedProps.value.mode === 'create') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "customActionConfig" not working in mode "create" combine with "dataSource"'
        )
        return { ...customActionConfigWithNull }
      } else {
        console.warn(
          '[tavui TaFileTable] "customActionConfig" not working in mode "create" combine with "api"'
        )
        return { ...customActionConfigWithNull }
      }
    } else if (mergedProps.value.mode === 'update') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "customActionConfig" not working in mode "read" combine with "dataSource"'
        )
        return { ...customActionConfigWithNull }
      } else {
        return customActionConfigWithDefault()
      }
    } else {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "customActionConfig" not working in mode "read" combine with "dataSource"'
        )
        return { ...customActionConfigWithNull }
      } else {
        return customActionConfigWithDefault()
      }
    }
  })
}
