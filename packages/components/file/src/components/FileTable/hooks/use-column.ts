import { type ComputedRef, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { type FileTableColumn, type FileTableProps } from '../types'
import { type FileInjectedProps } from './../../../typings'

function defaultColumnsBuilder(props: ComputedRef<FileInjectedProps & FileTableProps>) {
  const DEFAULT_COLUMNS: FileTableColumn[] = [
    {
      title: tavI18n('Tav.file.columns.1'),
      field: 'fullName',
      minWidth: 100,
    },
    {
      title: tavI18n('Tav.file.columns.2'),
      field: 'typeName',
      minWidth: 100,
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
      title: tavI18n('Tav.file.columns.4'),
      field: 'version',
      minWidth: 100,
    },
    {
      title: tavI18n('Tav.file.columns.8'),
      field: 'createTime',
      minWidth: 150,
    },
  ]

  return DEFAULT_COLUMNS
}

export function useColumn(options: { props: ComputedRef<FileInjectedProps & FileTableProps> }) {
  const { props } = options
  const columns = props.value.columns

  return computed(() => {
    let result: Record<string, any>[] = []

    // 已传入的 dataSource 为准
    if (columns && columns.length > 0) {
      result = [...columns]
    } else {
      result = [...defaultColumnsBuilder(props)]
    }

    return result
  })
}
