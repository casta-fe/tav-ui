import { computed, defineComponent, ref, unref, watch } from 'vue'
import { Spin } from 'ant-design-vue'
import { TaFileView, TaTablePro, TaTableProAction } from '@tav-ui/components'
import { Cell } from '../../../table-pro/src/components/cell'
import { getActionColumnMaxWidth, useFileTypeCode } from '../hooks'
import { UpdateTypeForm } from '../components/UpdateTypeForm'
import { UpdateNameForm } from './UpdateNameForm'
import { UpdateFile } from './UpdateFile'
import { FileBranch } from './FileBranch'
import type { PropType, Ref } from 'vue'
import type {
  ITableProInstance,
  TableProActionItem,
  TableProColumn,
} from '@tav-ui/components/table-pro'
import type { Handler } from '../main'
import type {
  BasicPropsType,
  FileItemType,
  LabelValueOption,
  PreviewTablePropType,
  PromiseFn,
} from '../types'

export const PreviewTable = defineComponent({
  props: {
    parentProps: {
      type: Object as PropType<BasicPropsType>,
    },
    handler: {
      type: Object as PropType<Handler>,
      required: true,
    },
    dataSource: {
      type: Array as PropType<FileItemType[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
    showTableAction: {
      type: Object as PropType<PreviewTablePropType['showTableAction']>,
      required: true,
    },
    onClickName: Function,
    canResize: {
      type: Boolean,
      required: true,
    },
    tableActionPermission: {
      type: Object as PropType<PreviewTablePropType['tableActionPermission']>,
      required: true,
    },
    customOptions: Array as PropType<PreviewTablePropType['customOptions']>,
    download: Function,
    updateFileNameAndAddress: Function as PropType<PromiseFn>,
    typeCodeRecord: {
      type: Object,
      required: true,
    },
    coverColumnTitle: Object as PropType<BasicPropsType['coverColumnTitle']>,
    hideColumnFields: {
      type: Array as PropType<BasicPropsType['hideColumnFields']>,
      default: () => [],
    },
    insertColumns: Array as PropType<BasicPropsType['insertColumns']>,
    nameColumnWidth: { type: [Number, String], default: 300 },
    moduleCode: { type: String, required: true },
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const hasBranch = computed(() => typeof props.handler?.apis.updateFile === 'function')
    const taTableProInstanceRef = ref<ITableProInstance>()
    const clearEdit = () => taTableProInstanceRef.value?.instance.clearEdit()
    // init begin
    const { getOptionsByTypeCodes } = useFileTypeCode(props.typeCodeRecord)
    // init end

    const typeCodeArray = computed(() => props.dataSource.map((el) => el.typeCode))

    // const nameColumnWidthRef = ref<number>(300)
    const currentEditCellIsLoading = ref(false)
    let currentEditCell: null | Record<'rowIndex' | 'columnIndex', string | number> = null
    // const currentEditColumnField = ref('')

    const fetchedTypeCodeArray = ref([] as any[])
    watch(
      () => props.moduleCode,
      (moduleCode) => {
        moduleCode &&
          props.handler?.apis.queryFileType?.([moduleCode]).then(({ data }) => {
            fetchedTypeCodeArray.value = data
          })
      },
      { immediate: true }
    )
    const typeCodeOptions = computed(() => {
      // @ts-ignore
      const options = props.customOptions ?? unref(getOptionsByTypeCodes(typeCodeArray.value))

      if (!options.length) {
        return fetchedTypeCodeArray.value.map((typeItem) => ({
          ...typeItem,
          label: typeItem.name,
          value: typeItem.code,
        }))
      }

      for (const typeItem of fetchedTypeCodeArray.value)
        options.some((el) => el.value == typeItem.code) ||
          options.push({
            ...typeItem,
            label: typeItem.name,
            value: typeItem.code,
          })

      return options
    })

    const getActionColumn = computed<TableProColumn[]>(() => {
      if (
        props.showTableAction.preview === false &&
        props.showTableAction.download === false &&
        props.showTableAction.downloadWatermark === false &&
        props.showTableAction.delete === false
      )
        return []

      const labels: string[] = []

      // #region 配置显示的操作列
      if (props.showTableAction.preview !== false) labels.push('查看')
      if (props.showTableAction.download !== false) {
        if (props.showTableAction.downloadWatermark === false) labels.push('下载')
        else labels.push('下载源文件')
      }
      if (props.showTableAction.downloadWatermark !== false) labels.push('下载水印文件')
      if (props.showTableAction.delete !== false) labels.push('删除')

      const hidePopoverRefs: Ref<{ hidePopover?: () => void }>[] = []

      // #endregion
      const columns: TableProColumn[] = [
        {
          title: props.coverColumnTitle?.fullName ?? '文件名称',
          field: 'fullName',
          visible: !props?.hideColumnFields!.includes('fullName'),
          width: props.nameColumnWidth,
          ...(props.updateFileNameAndAddress ? { editRender: {} } : {}),
          slots: {
            edit: ({ row, rowIndex, columnIndex }) => {
              currentEditCell = { rowIndex, columnIndex }
              // currentEditColumnField.value = column.field

              return [
                <UpdateNameForm
                  row={row}
                  onEnter={() => {
                    clearEdit()
                  }}
                  onChange={(payload) => {
                    if (
                      (row.hyperlink &&
                        payload.name === row.name &&
                        payload.address === row.address) ||
                      (!row.hyperlink && payload.name === row.name)
                    ) {
                      return
                    }

                    if (!props.updateFileNameAndAddress) {
                      console.warn('未传入 修改文件名的api: updateFileNameAndAddress')
                      return
                    }

                    currentEditCellIsLoading.value = true
                    props
                      .updateFileNameAndAddress(payload)
                      .then(() => {
                        row.name = payload.name
                        row.hyperlink
                          ? (row.address = payload.address)
                          : (row.fullName = `${payload.name}.${row.suffix}`)
                      })
                      .finally(() => (currentEditCellIsLoading.value = false))
                  }}
                />,
              ]
            },
            default: ({ row, rowIndex, columnIndex }) => {
              const res =
                row.hyperlink != 1
                  ? [
                      // 普通文件
                      <Cell column={{ field: 'fullName' }} type="body">
                        <span>{row.fullName}</span>,
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
                            setTimeout(() => {
                              clearEdit()
                            }, 0)
                          }}
                        >
                          {row.address}
                        </a>
                      </Cell>,
                    ]

              if (currentEditCellIsLoading.value) {
                if (currentEditCell) {
                  if (
                    rowIndex === currentEditCell.rowIndex &&
                    columnIndex === currentEditCell.columnIndex
                  ) {
                    res.unshift(<Spin size="small" />)
                  }
                }
              }

              return res
            },
          },
        },
        {
          title: props.coverColumnTitle?.typeName ?? '文件类型',
          field: 'typeName',
          visible: !props?.hideColumnFields!.includes('typeName'),
          minWidth: 220,
          ...(props.handler.apis.updateFileType ? { editRender: {} } : {}),
          slots: {
            edit: ({ row, rowIndex, columnIndex }) => {
              currentEditCell = { rowIndex, columnIndex }
              // currentEditColumnField.value = column.field

              return [
                <UpdateTypeForm
                  row={row}
                  onSelect={setTimeout.bind(null, clearEdit, 0)}
                  onChange={(option: LabelValueOption, promise: Promise<void>) => {
                    currentEditCellIsLoading.value = true
                    promise
                      .then(() => {
                        row.typeName = option.label
                        row.typeCode = option.value
                      })
                      .finally(() => (currentEditCellIsLoading.value = false))
                  }}
                  handler={props.handler}
                  customOptions={typeCodeOptions.value}
                />,
              ]
            },
            default: ({ row, rowIndex, columnIndex }) => {
              const res = [
                typeCodeOptions.value?.find((el) => el.value === row.typeCode)?.label ||
                  row.typeCode,
              ]

              if (currentEditCellIsLoading.value) {
                if (currentEditCell) {
                  if (
                    rowIndex === currentEditCell.rowIndex &&
                    columnIndex === currentEditCell.columnIndex
                  ) {
                    res.unshift(<Spin size="small" />)
                  }
                }
              }

              return [
                <Cell column={{ field: 'fullName' }} type="body">
                  {...res}
                </Cell>,
              ]
            },
          },
        },
        {
          title: props.coverColumnTitle?.fileSize ?? '文件大小',
          field: 'fileSize',
          visible: !props?.hideColumnFields!.includes('fileSize'),
          minWidth: 100,
        },
        {
          title: props.coverColumnTitle?.createByName ?? '上传人',
          field: 'createByName',
          visible: !props?.hideColumnFields!.includes('createByName'),
        },
        {
          title: props.coverColumnTitle?.version ?? '版本',
          field: 'version',
          visible: !props?.hideColumnFields!.includes('version') && hasBranch.value,
          minWidth: 100,
          customRender: ({ row, rowIndex }) => {
            hidePopoverRefs[rowIndex] || (hidePopoverRefs[rowIndex] = ref({}))

            return (
              <>
                {row.hyperlink === 0 ? (
                  <FileBranch
                    width={taTableProInstanceRef.value?.instance?.$el?.offsetWidth || undefined}
                    onShowPopover={() => {
                      hidePopoverRefs.forEach((el) => {
                        el.value.hidePopover?.()
                      })
                    }}
                    ref={hidePopoverRefs[rowIndex]}
                    isShowDeleteAction={props.parentProps?.fileBranchIsShowDeleteAction}
                    tableActionPermission={props.tableActionPermission}
                    showTableAction={props.showTableAction}
                    download={props.download}
                    file={row}
                    getPopupContainer={() => taTableProInstanceRef.value?.instance.$el}
                  />
                ) : (
                  ''
                )}
              </>
            )
          },
        },
        {
          title: props.coverColumnTitle?.createTime ?? '更新时间',
          field: 'createTime',
          minWidth: 150,
          visible: !props?.hideColumnFields!.includes('createTime'),
          // customRender: ({ row: { createTime } }) => formatToDate(createTime),
        },
        {
          width: getActionColumnMaxWidth(labels),
          fixed: 'right',
          title: props.coverColumnTitle?.action ?? '操作',
          field: 'action',
          visible: !props?.hideColumnFields!.includes('action'),
          align: 'center',
          customRender: ({ row }) => {
            return (
              <>
                <TaTableProAction actions={getActions(row)} />
              </>
            )
          },
        },
      ]

      if (props.insertColumns?.length) {
        for (const columnItem of props.insertColumns) {
          if (!columnItem.column) continue

          const prevIndex = columns.findIndex(
            (el) => (columnItem.position ?? 'createTime') === el.field
          )
          if (-1 === prevIndex) continue

          if ('before' === columnItem.beforeOrAfter) {
            columns.splice(prevIndex, 0, columnItem.column)
          } else {
            // 默认after
            columns.splice(prevIndex + 1, 0, columnItem.column)
          }
        }
      }

      return columns
    })

    const getActions = (record) => {
      const actions: TableProActionItem[] = [
        {
          label: '查看',
          permission: props.tableActionPermission.preview,
          enabled: record.hyperlink === 1 ? false : props.showTableAction.preview ?? true,
          onClick() {
            if (record.hyperlink === 1) {
              window.open(record.address)?.focus()
              return
            }
            previewRecord.value = [record]
            showPreview.value = true
          },
        },
        {
          label: '更新',
          enabled: !!(record.hyperlink === 1
            ? false
            : props.readonly
            ? false
            : (hasBranch.value && props.showTableAction.update) ?? true),
          // @ts-ignore
          onClick() {
            updateFileRef.value.showFilePicker(record)
            // console.log('上传')
          },
        },
      ]
      actions.push(
        {
          label: '下载水印文件',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
            ? false
            : props.readonly
            ? false
            : (props.showTableAction.downloadWatermark ?? true) && record.watermarkFileDownload),
          onClick() {
            props.download?.(record, undefined, true)
          },
        },
        {
          // 有下载水印文件 ? 区分 : 下载源文件显示为(下载)
          label: props.showTableAction.downloadWatermark === undefined ? '下载源文件' : '下载',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
            ? false
            : props.readonly
            ? false
            : (props.showTableAction.download ?? true) && record.sourceFileDownload),
          onClick() {
            props.download?.(record)
          },
        },
        {
          label: '删除',
          permission: props.tableActionPermission.delete,
          enabled: props.showTableAction.delete ?? !props.readonly,
          // @ts-ignore
          popConfirm: {
            title: '是否确认删除?',
            confirm: () => {
              emit('delete', record)
            },
          },
        }
      )
      return actions
    }

    const showPreview = ref(false)
    const previewRecord = ref<FileItemType[]>([])
    // 更新文件的回调
    const updateFileRef = ref()
    const updateFileChange = (record) => {
      if (props.handler && props.handler.updateItem) {
        props.handler.updateItem(record)
      }
    }
    return () => (
      <div class="ta-upload-preview-table">
        <TaTablePro
          ref={taTableProInstanceRef}
          // 传此api -> 可编辑
          editConfig={
            (props.updateFileNameAndAddress || props.handler.apis.updateFileType) && {
              // trigger: 'manual',
              trigger: 'click',
              mode: 'cell',
              autoClear: true, //'typeName' !== currentEditColumnField.value,
            }
          }
          pagerConfig={{ enabled: false }}
          showOperations={false}
          data={props.dataSource}
          loading={props.loading}
          columns={getActionColumn.value}
          fillInner={false}
          checkboxConfig={{ enabled: false }}
        />
        <UpdateFile
          ref={updateFileRef}
          readonly={props.readonly}
          accept={props.parentProps?.accept || ''}
          onUpdateSuccess={updateFileChange}
        />
        <TaFileView
          AppId={props.parentProps?.AppId}
          show={showPreview.value}
          onUpdate:show={(v) => (showPreview.value = v)}
          list={previewRecord.value as any}
        />
      </div>
    )
  },
})
