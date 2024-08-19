import { type ComputedRef, type Ref, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isFunction } from '@tav-ui/utils'
import { TaButton } from '@tav-ui/components/button'
// import { TaTableProAction } from '@tav-ui/components/table-pro'
// import { Cell } from '../../../../../table-pro/src/components/cell'
import { type ApiUpdateFileNameAndLinkParams } from '../../components/FileTable'
import { type FileCardListItem, type FileCardListItemAction, type FileCardProps } from '../types'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { /*isModuleFullNameColVisible,*/ isOwnerOrAdmin, isVersionColVisible } from '../../utils'
// import FileTableRowEditor from '../components/FileTableRowEditor/index.vue'
import * as fileSvgs from '../file-svg'
import {
  DEFAULT_FILE_ACCEPT_TYPES,
  DEFAULT_FILE_IMAGE_TYPES,
  DEFAULT_FILE_OFFICE_TYPES,
} from '../../consts'
import TaFileListItemAction from '../components/ListItemAction'

export function defaultItemsBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>,
  actions: ComputedRef<(row: FileActionUploadApiResponseRecord) => FileCardListItemAction[]>,
  handleCellEditClick: (
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>,
  hanldeVersionClick: (row: FileActionUploadApiResponseRecord) => Promise<void>,
  globalConfigUserInfo: Ref<Record<string, any>>
) {
  // const mode = mergedProps.value.mode
  const enabledVersion = mergedProps.value.enabledVersion
  const enabledRowEdit =
    mergedProps.value.enabledRowEdit &&
    (mergedProps.value.enabledOwner ? isOwnerOrAdmin(globalConfigUserInfo.value) : true)

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

          return <>{svg(row.suffix)}</>
        },
      },
    },
    {
      field: 'content',
      children: [
        {
          field: 'description-1',
          children: [
            {
              // title: tavI18n('Tav.file.columns.1'),
              field: 'fullName',
              ...(enabledRowEdit ? { editRender: {} } : {}),
              slots: {
                // edit: ({ row: _row }: Record<string, any>) => {
                //   const row = _row as FileActionUploadApiResponseRecord

                //   return [
                //     <FileTableRowEditor
                //       row={row}
                //       // onEnter={() => {
                //       //   clearEdit?.()
                //       // }}
                //       onChange={async (payload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>) => {
                //         await handleCellEditClick(payload, row)
                //       }}
                //     />,
                //   ]
                // },
                default: ({ row }: { row: FileActionUploadApiResponseRecord }) => {
                  // const res =
                  //   row.hyperlink != 1
                  //     ? [
                  //         // 普通文件
                  //         <Cell column={{ field: 'fullName' }} type="body">
                  //           <span>{row.fullName}</span>
                  //         </Cell>,
                  //       ]
                  //     : [
                  //         <Cell column={{ field: 'fullName' }} type="body">
                  //           {/* // 超链接 */}
                  //           {/* eslint-disable-next-line no-irregular-whitespace */}
                  //           <span>{row.name}</span>
                  //           <br />
                  //           <a
                  //             onClick={() => {
                  //               window
                  //                 .open(row.address.includes('//') ? row.address : `//${row.address}`)
                  //                 ?.focus()

                  //               clearEdit &&
                  //                 setTimeout(() => {
                  //                   clearEdit()
                  //                 }, 16)
                  //             }}
                  //           >
                  //             {row.address}
                  //           </a>
                  //         </Cell>,
                  //       ]

                  return <span>{row.fullName}</span>
                },
              },
            },
            ...(isVersionColVisible(enabledVersion)
              ? [
                  {
                    // title: tavI18n('Tav.file.columns.4'),
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
                                    lineHeight: 1.5,
                                    height: 'auto',
                                  }}
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
                  },
                ]
              : []),
          ],
        },
        {
          field: 'description-2',
          children: [
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
  handleCellEditClick: (
    changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
    row: FileActionUploadApiResponseRecord
  ) => Promise<void>
  hanldeVersionClick: (row: FileActionUploadApiResponseRecord) => Promise<void>
  globalConfigUserInfo: Ref<Record<string, any>>
}) {
  const { mergedProps, actions, handleCellEditClick, hanldeVersionClick, globalConfigUserInfo } =
    options

  return computed(() => {
    const items = mergedProps.value.items

    let result = defaultItemsBuilder(
      mergedProps,
      actions,
      handleCellEditClick,
      hanldeVersionClick,
      globalConfigUserInfo
    )

    if (items && isFunction(items)) {
      result = items(result)
    }

    return result
  })
}
