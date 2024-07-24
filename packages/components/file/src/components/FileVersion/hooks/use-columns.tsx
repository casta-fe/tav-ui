import { type ComputedRef, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { TaTableProAction } from '@tav-ui/components/table-pro'
import {
  type FileVersionProps,
  type FileVersionTableAction,
  type FileVersionTableColumn,
} from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'

export function defaultColumnsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileVersionProps>,
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileVersionTableAction[]>
) {
  const DEFAULT_COLUMNS: FileVersionTableColumn[] = [
    {
      title: tavI18n('Tav.file.columns.4'),
      field: 'version',
      minWidth: 100,
      customRender: ({ row: _row }: Record<string, any>) => {
        const row = _row as FileActionUploadApiResponseRecord
        return <>v{row.version}</>
      },
    },
    {
      title: tavI18n('Tav.file.columns.1'),
      field: 'fullName',
      width: 180,
      customRender: ({ row: _row }: Record<string, any>) => {
        const row = _row as FileActionUploadApiResponseRecord
        return <>{row.hyperlink === 0 ? row.fullName : row.name}</>
      },
    },
    {
      title: tavI18n('Tav.file.columns.3'),
      field: 'fileSize',
      minWidth: 100,
    },
    {
      title: tavI18n('Tav.file.columns.5'),
      field: 'createByName',
    },

    {
      title: tavI18n('Tav.file.columns.8'),
      field: 'createTime',
      minWidth: 150,
    },
    {
      title: tavI18n('Tav.common.actions'),
      field: 'action',
      fixed: 'right',
      width: 150,
      align: 'center',
      customRender: ({ row: _row }: Record<string, any>) => {
        const row = _row as FileActionUploadApiResponseRecord
        return (
          <>
            <TaTableProAction actions={actions.value(row)} />
          </>
        )
      },
    },
  ]

  return DEFAULT_COLUMNS
}

export function useColumns(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileVersionProps>
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileVersionTableAction[]>
}) {
  const { mergedProps, actions } = options

  return computed(() => {
    const columns = mergedProps.value.columns

    let result = defaultColumnsBuilder(mergedProps, actions)

    if (columns && isFunction(columns)) {
      result = columns(result)
    }

    return result
  })
}
