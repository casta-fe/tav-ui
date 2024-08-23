import { type ComputedRef, type Ref, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { TaButton } from '@tav-ui/components/button'
import { TaTableProAction } from '@tav-ui/components/table-pro'
import { Cell } from '../../../../../table-pro/src/components/cell'
import {
  type ApiUpdateFileNameAndLinkParams,
  type FileTableAction,
  type FileTableColumn,
  type FileTableInstance,
  type FileTableProps,
} from '../types'
import {
  type FileActionUploadApiResponseRecord,
  type GlobalConfigFileProps,
} from '../../../typings'
import { isModuleFullNameColVisible, isVersionColVisible } from '../../../utils'
import FileTableRowEditor from '../components/FileTableRowEditor/index.vue'

export function defaultColumnsBuilder(
  mode: FileTableProps['mode'],
  enabledRowEdit: FileTableProps['enabledRowEdit'],
  enabledVersion: FileTableProps['enabledVersion'],
  clearEdit: ((evnt?: Event | undefined) => Promise<any>) | undefined,
  clearCellTooltip: (() => void) | undefined,
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileTableAction[]>,
  handleCellEditClick: (
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>,
  hanldeVersionClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
) {
  const DEFAULT_COLUMNS: FileTableColumn[] = [
    {
      title: tavI18n('Tav.file.columns.1'),
      field: 'fullName',
      fixed: 'left',
      minWidth: 220,
      editRender: {
        enabled: mode !== 'read' && enabledRowEdit,
      },
      slots: {
        edit: ({ row: _row }: Record<string, any>) => {
          const row = _row as FileActionUploadApiResponseRecord
          return [
            <FileTableRowEditor
              row={row}
              onEnter={() => {
                clearEdit &&
                  setTimeout(() => {
                    clearEdit()
                  }, 16)

                clearCellTooltip?.()
              }}
              onChange={async (payload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>) => {
                await handleCellEditClick(payload, row)
                clearCellTooltip?.()
              }}
            />,
          ]
        },
        default: ({ row: _row }: Record<string, any>) => {
          const row = _row as FileActionUploadApiResponseRecord
          const defaultContent =
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
                    <div style={{ display: 'inline-block', lineHeight: 1 }}>{row.name}</div>　
                    <a
                      style={{
                        display: 'block',
                        lineHeight: 1,
                        fontSize: '12px',
                        marginBottom: '6px',
                      }}
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

          return defaultContent
        },
      },
    },
    ...(isModuleFullNameColVisible(mode)
      ? [
          {
            title: tavI18n('Tav.file.columns.10'),
            field: 'moduleFullName',
            minWidth: 180,
          },
        ]
      : []),
    // typeName 不允许改变
    {
      title: tavI18n('Tav.file.columns.2'),
      field: 'typeName',
      minWidth: 120,
    },
    {
      title: tavI18n('Tav.file.columns.3'),
      field: 'fileSize',
      width: 100,
    },
    ...(isVersionColVisible(enabledVersion)
      ? [
          {
            title: tavI18n('Tav.file.columns.4'),
            field: 'version',
            width: 80,
            customRender: ({ row: _row }: Record<string, any>) => {
              const row = _row as FileActionUploadApiResponseRecord
              const renderVersion = isVersionColVisible(enabledVersion, row.hyperlink, row.auto)

              return (
                <>
                  {renderVersion ? (
                    <>
                      <TaButton
                        style={{ minWidth: 0, padding: 0 }}
                        type={'link'}
                        onClick={async () => hanldeVersionClick(row)}
                      >
                        v{row.version}
                      </TaButton>
                    </>
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
      title: tavI18n('Tav.file.columns.5'),
      field: 'createByName',
      width: 100,
    },
    {
      title: tavI18n('Tav.file.columns.8'),
      field: 'updateTime',
      minWidth: 120,
    },
    {
      title: tavI18n('Tav.common.action'),
      field: 'action',
      fixed: 'right',
      // width: 150,
      align: 'center',
      customRender: ({ row: _row }: Record<string, any>) => {
        const row = _row as FileActionUploadApiResponseRecord
        return <TaTableProAction key={row.id} actions={actions.value(row)} />
      },
    },
  ]

  return DEFAULT_COLUMNS
}

export function useColumns(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileTableAction[]>
  handleCellEditClick: (
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>
  hanldeVersionClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
}) {
  const { mergedProps, tableProRef, actions, handleCellEditClick, hanldeVersionClick } = options

  return computed(() => {
    const columns = mergedProps.value.columns
    const clearEdit = tableProRef.value?.instance?.clearEdit ?? undefined
    const clearCellTooltip = tableProRef.value?.instance?.clearCellTooltip ?? undefined
    const mode = mergedProps.value.mode
    const enabledRowEdit = mergedProps.value.enabledRowEdit
    const enabledVersion = mergedProps.value.enabledVersion

    let result = defaultColumnsBuilder(
      mode,
      enabledRowEdit,
      enabledVersion,
      clearEdit,
      clearCellTooltip,
      actions,
      handleCellEditClick,
      hanldeVersionClick
    )

    if (columns && isFunction(columns)) {
      result = columns(result)
    }

    return result
  })
}
