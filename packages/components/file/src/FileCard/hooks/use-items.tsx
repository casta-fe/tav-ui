import { type ComputedRef, computed } from 'vue'
import { Tooltip as ATooltip } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { TaButton } from '@tav-ui/components/button'
import { type ApiUpdateFileNameAndLinkParams } from '../../components/FileTable'
import { type FileCardListItem, type FileCardListItemAction, type FileCardProps } from '../types'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { isVersionColVisible } from '../../utils'
import FileCardRowEditor from '../components/FileCardRowEditor/index.vue'
import * as fileSvgs from '../file-svg'
import {
  DEFAULT_FILE_ACCEPT_TYPES,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
} from '../../consts'
import TaFileListItemAction from '../components/ListItemAction'

export function defaultItemsBuilder(
  mode: FileCardProps['mode'],
  enabledRowEdit: FileCardProps['enabledRowEdit'],
  enabledVersion: FileCardProps['enabledVersion'],
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileCardListItemAction[]>,
  handleRowEditClick: (
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>,
  hanldeVersionClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
) {
  const DEFAULT_COLUMNS: FileCardListItem[] = [
    {
      field: 'avator',
      slots: {
        default: ({ row }: { row: FileActionUploadApiResponseRecord }) => {
          const svg = (fileSuffix: string) => {
            if (DEFAULT_FILE_ACCEPT_TYPES.includes(fileSuffix)) {
              if (DEFAULT_FILE_OFFICE_TYPES.includes(fileSuffix)) {
                if (
                  fileSuffix.includes(DEFAULT_FILE_OFFICE_TYPES[0]) ||
                  fileSuffix.includes(DEFAULT_FILE_OFFICE_TYPES[1])
                ) {
                  return fileSvgs.fileDocSvg
                } else if (
                  fileSuffix.includes(DEFAULT_FILE_OFFICE_TYPES[2]) ||
                  fileSuffix.includes(DEFAULT_FILE_OFFICE_TYPES[3])
                ) {
                  return fileSvgs.fileXlsSvg
                } else if (
                  fileSuffix.includes(DEFAULT_FILE_OFFICE_TYPES[4]) ||
                  fileSuffix.includes(DEFAULT_FILE_OFFICE_TYPES[5])
                ) {
                  return fileSvgs.filePptSvg
                } else {
                  return fileSvgs.filePdfSvg
                }
              } else if (DEFAULT_FILE_IMAGE_TYPES.includes(fileSuffix)) {
                return fileSvgs.fileImageSvg
              } else {
                return fileSvgs.fileUnknownSvg
              }
            } else {
              return fileSvgs.fileUnknownSvg
            }
          }

          return <>{row.hyperlink !== 1 ? svg(row.suffix) : fileSvgs.fileLinkSvg}</>
        },
      },
    },
    {
      field: 'content',
      children: [
        {
          // title: tavI18n('Tav.file.columns.1'),
          field: 'fullName',
          editRender: {
            enabled: mode !== 'read' && enabledRowEdit,
          },
          slots: {
            edit: ({ row }: { row: FileActionUploadApiResponseRecord }) => {
              return (
                <FileCardRowEditor
                  row={row}
                  onChange={async (payload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>) => {
                    await handleRowEditClick(payload, row)
                  }}
                />
              )
            },
            default: ({ row }: { row: FileActionUploadApiResponseRecord }) => {
              const defaultContent =
                row.hyperlink !== 1 ? (
                  <ATooltip placement="top" destroyTooltipOnHide={true}>
                    {{
                      title: () => <span>{row.fullName}</span>,
                      default: () => (
                        <span
                          //@ts-ignore
                          style={{
                            display: 'inline-block',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.fullName}
                        </span>
                      ),
                    }}
                  </ATooltip>
                ) : (
                  <>
                    <span style={{ display: 'inline-block', lineHeight: 1 }}>{row.name}</span>
                    <TaButton
                      style={{
                        minWidth: 0,
                        padding: 0,
                        lineHeight: '14px',
                        height: '14px',
                        fontSize: '12px',
                      }}
                      type={'link'}
                      size={'small'}
                      onClick={(e: Event) => {
                        e.stopPropagation()
                        window
                          .open(row.address.includes('//') ? row.address : `//${row.address}`)
                          ?.focus()
                      }}
                    >
                      {row.address}
                    </TaButton>
                  </>
                )
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    minHeight: '20px',
                  }}
                >
                  {defaultContent}
                </div>
              )
            },
          },
        },
        {
          field: 'description',
          children: [
            ...(isVersionColVisible(enabledVersion)
              ? [
                  {
                    title: tavI18n('Tav.file.columns.4'),
                    field: 'version',
                    slots: {
                      default: ({ row }: { row: FileActionUploadApiResponseRecord }) => {
                        const renderVersion = isVersionColVisible(
                          enabledVersion,
                          row.hyperlink,
                          row.auto
                        )

                        return (
                          <>
                            {renderVersion ? (
                              <>
                                <TaButton
                                  style={{
                                    minWidth: 0,
                                    padding: 0,
                                    lineHeight: 1,
                                    height: 'auto',
                                  }}
                                  type={'link'}
                                  onClick={async () => hanldeVersionClick(row)}
                                >
                                  v{row.version}
                                </TaButton>
                              </>
                            ) : (
                              '-'
                            )}
                          </>
                        )
                      },
                    },
                  },
                ]
              : []),
            {
              title: tavI18n('Tav.file.columns.5'),
              field: 'createByName',
            },
            {
              title: tavI18n('Tav.file.columns.8'),
              field: 'updateTime',
            },
          ],
        },
      ],
    },
    {
      // title: tavI18n('Tav.common.actions'),
      field: 'action',
      slots: {
        default: ({ row }: { row: FileActionUploadApiResponseRecord }) => {
          return <TaFileListItemAction actions={actions.value(row)} />
        },
      },
    },
  ]

  return DEFAULT_COLUMNS
}

export function useItems(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileCardListItemAction[]>
  handleRowEditClick: (
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>
  hanldeVersionClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
}) {
  const { mergedProps, actions, handleRowEditClick, hanldeVersionClick } = options

  return computed(() => {
    const items = mergedProps.value.items
    const mode = mergedProps.value.mode
    const enabledRowEdit = mergedProps.value.enabledRowEdit
    const enabledVersion = mergedProps.value.enabledVersion

    let result = defaultItemsBuilder(
      mode,
      enabledRowEdit,
      enabledVersion,
      actions,
      handleRowEditClick,
      hanldeVersionClick
    )

    if (items && isFunction(items)) {
      result = items(result)
    }

    return result
  })
}
