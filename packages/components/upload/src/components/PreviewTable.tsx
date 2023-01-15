import { computed, defineComponent, ref, watch } from 'vue'
import { Spin } from 'ant-design-vue'
// import { promiseTimeout } from '@vueuse/shared'
import { TaFileView, TaTablePro, TaTableProAction } from '@tav-ui/components'
import { Cell } from '../../../table-pro/src/components/cell'
import { getActionColumnMaxWidth } from '../hooks'
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
  Recordable,
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
      type: Array as PropType<PreviewTablePropType['dataSource']>,
      required: true,
    },
    loading: {
      type: Boolean as PropType<PreviewTablePropType['loading']>,
      default: false,
    },
    readonly: {
      type: Boolean as PropType<PreviewTablePropType['readonly']>,
      required: true,
    },
    showTableAction: {
      type: Object as PropType<PreviewTablePropType['showTableAction']>,
      required: true,
    },
    onClickName: Function,
    tableActionPermission: {
      type: Object as PropType<PreviewTablePropType['tableActionPermission']>,
      required: true,
    },
    customOptions: Array as PropType<PreviewTablePropType['customOptions']>,
    download: Function,
    updateFileNameAndAddress: Function as PropType<PromiseFn>,
    coverColumnTitle: Object as PropType<BasicPropsType['coverColumnTitle']>,
    hideColumnFields: {
      type: Array as PropType<BasicPropsType['hideColumnFields']>,
      default: () => [],
    },
    insertColumns: Array as PropType<BasicPropsType['insertColumns']>,
    nameColumnWidth: { type: [Number, String], default: 200 },
    moduleCode: { type: String, required: true },
    uploadBtnRef: Object as PropType<Recordable>,
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const hasBranch = computed(() => typeof props.handler?.apis.updateFile === 'function')
    const taTableProInstanceRef = ref<ITableProInstance>()
    const clearEdit = () => taTableProInstanceRef.value?.instance.clearEdit()

    // const nameColumnWidthRef = ref<number>(300)
    const currentEditCellIsLoading = ref(false)
    let currentEditCell: null | Record<'rowIndex' | 'columnIndex', string | number> = null
    // const currentEditColumnField = ref('')

    const typeCodeOptions = computed(() => props.customOptions)

    let hidePopoverRefs: Ref<{ hidePopover?: () => void }>[] = []
    watch(
      () => props.dataSource.length,
      () => {
        hidePopoverRefs = []
      }
    )
    const getActionColumn = computed<TableProColumn[]>(() => {
      if (
        props.showTableAction.download === false &&
        props.showTableAction.downloadWatermark === false &&
        props.showTableAction.delete === false
      )
        return []

      const labels: string[] = []

      // #region 配置显示的操作列
      labels.push('查看')
      if (props.showTableAction.download !== false) {
        if (props.showTableAction.downloadWatermark === false) labels.push('下载')
        else labels.push('源文..')
      }
      if (props.showTableAction.downloadWatermark !== false) labels.push('水印..')
      if (props.showTableAction.delete !== false) labels.push('删除')

      // #endregion
      const columns: TableProColumn[] = [
        {
          title: props.coverColumnTitle?.fullName ?? '文件名称',
          field: 'fullName',
          fixed: 'left',
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

                    if (!props.parentProps?.immediate) {
                      row.name = payload.name
                      row.hyperlink
                        ? (row.address = payload.address)
                        : (row.fullName = `${payload.name}.${row.suffix}`)

                      props.handler.updateItem(row, row.actualId)

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
          minWidth: 100,
          ...(props.handler.apis.updateFileType ? { editRender: {} } : {}),
          slots: {
            edit: ({ row, rowIndex, columnIndex }) => {
              currentEditCell = { rowIndex, columnIndex }
              // currentEditColumnField.value = column.field

              return [
                <UpdateTypeForm
                  row={row}
                  onSelect={setTimeout.bind(null, clearEdit, 0)}
                  onChange={(option: LabelValueOption, callPromise: () => Promise<void>) => {
                    if (!props.parentProps?.immediate) {
                      row.typeName = option.label
                      row.typeCode = option.value

                      props.handler.updateItem(row, row.actualId)

                      return
                    }

                    currentEditCellIsLoading.value = true
                    callPromise()
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
              const res = [row.typeName]

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

            let width = taTableProInstanceRef.value?.instance?.$el?.offsetWidth

            if (width) {
              width -= 40

              width = `${width}px`
            }

            return (
              <>
                {row.hyperlink === 0 ? (
                  <FileBranch
                    width={width || undefined}
                    onShowPopover={() => {
                      hidePopoverRefs.forEach((el) => {
                        el.value.hidePopover?.()
                      })
                    }}
                    ref={hidePopoverRefs[rowIndex]}
                    isShowDeleteAction={props.parentProps?.fileBranchIsShowDeleteAction}
                    showTableAction={props.showTableAction}
                    download={props.download}
                    file={row}
                    getPopupContainer={() => taTableProInstanceRef.value?.instance.$el}
                    getAppendNewestFile={() =>
                      props.handler.getFileFormatter.getNewestFileByActualId(row.actualId) ??
                      props.handler.getFileFormatter.getBasicFileByActualId(row.actualId)!
                    }
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
          enabled: record.hyperlink !== 1,
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
          label: '水印文件',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
            ? false
            : // : props.readonly
              // ? false
              (props.showTableAction.downloadWatermark ?? true) && record.watermarkFileDownload),
          onClick() {
            props.download?.(record, undefined, true)
          },
        },
        {
          // 有下载水印文件 ? 区分 : 下载源文件显示为(下载)
          label: props.showTableAction.downloadWatermark === undefined ? '源文件' : '下载',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
            ? false
            : // : props.readonly
              // ? false
              (props.showTableAction.download ?? true) && record.sourceFileDownload),
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
    const updateFileChange = (record, oldFileActualIds) => {
      if (props.handler && props.handler.updateItem) {
        props.handler.updateItem(record, oldFileActualIds)
      }
    }
    return () => (
      <div
        class={{
          'ta-upload-preview-table': true,
          'no-margin-top': props.parentProps?.readonly,
          'default-height': !props.handler?.getPropsOrProvide('tableMaxHeight'),
        }}
      >
        <TaTablePro
          maxHeight={
            /**
             * 当不传此 prop 时,表格高度自动继承(给其赋值 `undefined`), 内容超过时滚动
             *
             * 当是数字时, `VXETable` 表现为有几行数据, 自动撑起几行的高度, 大于此数字 滚动
             */
            props.handler?.getPropsOrProvide('tableMaxHeight')
          }
          ref={taTableProInstanceRef}
          // 传此api -> 可编辑
          editConfig={
            props.readonly
              ? undefined
              : (props.updateFileNameAndAddress || props.handler.apis.updateFileType) && {
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
          checkboxConfig={props.parentProps?.checkboxConfig ?? { enabled: false }}
          v-slots={
            props.parentProps?.emptyState === 'header'
              ? {
                  empty: () => <span></span>,
                }
              : undefined
          }
        />
        <UpdateFile
          ref={updateFileRef}
          readonly={props.readonly}
          accept={props.parentProps?.accept || ''}
          onUpdateSuccess={updateFileChange}
          parentProps={props.parentProps}
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
