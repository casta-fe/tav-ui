import { type ComputedRef, type Ref, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { Cell } from '@tav-ui/components/table-pro/src/components/cell'
import { TaTableProAction } from '@tav-ui/components/table-pro'
import { TaFileVersion } from '../../FileVersion'
import {
  type FileTableAction,
  type FileTableColumn,
  type FileTableInstance,
  type FileTableProps,
} from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { isVersionColVisible } from '../../../utils'
import FileTableRowEditor from '../components/FileTableRowEditor/index.vue'

export function defaultColumnsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>,
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>,
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileTableAction[]>,
  latestVersionFile: (rowActualId: any) => FileActionUploadApiResponseRecord | undefined,
  handleCellEditClick: (
    changeEventPayload: {
      id?: string
      name?: string
      address?: string
    },
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>
) {
  const clearEdit = tableProRef.value?.instance?.clearEdit
  const enabledVersion = mergedProps.value.enabledVersion
  const enabledRowEdit = mergedProps.value.enabledRowEdit

  const DEFAULT_COLUMNS: FileTableColumn[] = [
    {
      title: tavI18n('Tav.file.columns.1'),
      field: 'fullName',
      fixed: 'left',
      width: 180,
      ...(enabledRowEdit ? { editRender: {} } : {}),
      slots: {
        edit: ({ row: _row }: Record<string, any>) => {
          const row = _row as FileActionUploadApiResponseRecord

          return [
            // <UpdateNameForm />
            <FileTableRowEditor
              row={row}
              onEnter={() => {
                clearEdit?.()
              }}
              onChange={async (payload: { id?: string; name?: string; address?: string }) => {
                await handleCellEditClick(payload, row)
              }}
            />,
          ]
        },
        default: ({ row: _row }: Record<string, any>) => {
          const row = _row as FileActionUploadApiResponseRecord
          const res =
            row.hyperlink != 1
              ? [
                  // 普通文件
                  <Cell column={{ field: 'fullName' }} type="body">
                    <span>{row.fullName}</span>
                  </Cell>,
                ]
              : [
                  <Cell column={{ field: 'fullName' }} type="body">
                    {/* // 超链接 */}
                    {/* eslint-disable-next-line no-irregular-whitespace */}
                    <span>{row.name}</span>　
                    <br />
                    <a
                      onClick={() => {
                        window
                          .open(row.address.includes('//') ? row.address : `//${row.address}`)
                          ?.focus()

                        clearEdit &&
                          setTimeout(() => {
                            clearEdit()
                          }, 16)
                      }}
                    >
                      {row.address}
                    </a>
                  </Cell>,
                ]

          return res
        },
      },
    },
    // typeName 不允许改变
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
    ...(isVersionColVisible(enabledVersion)
      ? [
          {
            title: tavI18n('Tav.file.columns.4'),
            field: 'version',
            minWidth: 100,
            customRender: ({ row: _row }: Record<string, any>) => {
              const row = _row as FileActionUploadApiResponseRecord
              const renderVersion = isVersionColVisible(enabledVersion, row.hyperlink, row.auto)
              const versionFile = latestVersionFile(row.actualId!)

              return (
                <>
                  {renderVersion ? (
                    <TaFileVersion
                      mode={mergedProps.value.mode}
                      apiParams={mergedProps.value.apiParams}
                      file={row as FileActionUploadApiResponseRecord}
                      versionFile={versionFile}
                    />
                  ) : (
                    ''
                  )}
                </>
              )
            },
          },
        ]
      : []),
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
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileTableAction[]>
  latestVersionFile: (rowActualId: any) => FileActionUploadApiResponseRecord | undefined
  handleCellEditClick: (
    changeEventPayload: {
      id?: string
      name?: string
      address?: string
    },
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>
}) {
  const { mergedProps, tableProRef, actions, latestVersionFile, handleCellEditClick } = options

  return computed(() => {
    const columns = mergedProps.value.columns

    let result = defaultColumnsBuilder(
      mergedProps,
      tableProRef,
      actions,
      latestVersionFile,
      handleCellEditClick
    )

    if (columns && isFunction(columns)) {
      result = columns(result)
    }

    return result
  })
}
