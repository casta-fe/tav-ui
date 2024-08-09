import { type ComputedRef, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { type FileLogProps, type FileLogTableColumn } from '../types'
import { type GlobalConfigFileProps } from '../../../typings'

export function defaultColumnsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileLogProps>
) {
  const DEFAULT_COLUMNS: FileLogTableColumn[] = [
    {
      title: tavI18n('Tav.file.columns.15'),
      field: 'createTime',
      width: 200,
    },
    {
      title: tavI18n('Tav.file.columns.14'),
      field: 'createByName',
      width: 150,
    },
    {
      title: tavI18n('Tav.file.columns.11'),
      field: 'operationName',
      width: 150,
    },
    {
      title: tavI18n('Tav.file.columns.12'),
      field: 'appName',
      width: 200,
    },
    {
      title: tavI18n('Tav.file.columns.13'),
      field: 'deviceInfo',
      minWidth: 200,
    },
  ]

  return DEFAULT_COLUMNS
}

export function useColumns(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileLogProps>
}) {
  const { mergedProps } = options

  return computed(() => {
    const columns = mergedProps.value.columns

    let result = defaultColumnsBuilder(mergedProps)

    if (columns && isFunction(columns)) {
      result = columns(result)
    }

    return result
  })
}
