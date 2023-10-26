import { computed, defineComponent, nextTick, reactive, ref, unref } from 'vue'
import Button from '@tav-ui/components/button'
import { TaForm, useForm } from '@tav-ui/components/form'
import { TaModal, useModal } from '@tav-ui/components/modal'
import { isObject } from '@tav-ui/utils/is'
import {
  ACTION_COLUMNS,
  CamelCaseToCls,
  ComponentCustomActionName,
  SELECT_COMPONENTS,
} from '../../const'
import { useTableContext } from '../../hooks/useTableContext'
import Settings from './settings'
import type { FormSchema } from '@tav-ui/components/form'
import type { ComputedRef, PropType, Ref, Slots } from 'vue'
import type { TableProColumnInfo, TableProInstance } from '../../types'
import type { CustomActionSetting, TableProCustomActionConfig, TreeDataItem } from '../../typings'

const ComponentPrefixCls = CamelCaseToCls(ComponentCustomActionName)

const FileDataTypeOptions = [
  {
    label: '全量数据(过滤)',
    value: 'allSearch',
  },
  {
    label: '全量数据',
    value: 'all',
  },
  {
    label: '当前页的选中数据',
    value: 'selected',
  },
  {
    label: '当前页的全部数据',
    value: 'current',
  },
]
const ExportModalFormSchemas: FormSchema[] = [
  {
    field: 'fileName',
    component: 'Input',
    label: '文件名',
    required: true,
    componentProps: {
      placeholder: '请输入文件名',
    },
  },
  // {
  //   field: 'fileDescription',
  //   component: 'Input',
  //   label: '描述',
  //   required: false,
  //   componentProps: {
  //     placeholder: '请输入表格描述',
  //   },
  // },
  {
    field: 'fileSeq',
    component: 'Select',
    label: '序号列',
    required: false,
    defaultValue: 1,
    componentProps: {
      placeholder: '请选择是否生成表格序号列',
      options: [
        {
          label: '自动生成',
          value: 1,
        },
        {
          label: '不生成',
          value: 0,
        },
      ],
    },
  },
  {
    field: 'fileType',
    component: 'Select',
    label: '文件类型',
    required: true,
    defaultValue: 'xlsx',
    componentProps: {
      placeholder: '请选择文件类型',
      options: [
        {
          label: 'Excel（.xlsx）',
          value: 'xlsx',
        },
        // {
        //   label: 'CSV（.csv）',
        //   value: 'csv',
        // },
        // {
        //   label: '网页（.html）',
        //   value: 'html',
        // },
        // {
        //   label: 'XML数据（.xml）',
        //   value: 'xml',
        // },
        // {
        //   label: '文本数据（.txt）',
        //   value: 'txt',
        // },
      ],
    },
  },
  {
    field: 'fileDataType',
    component: 'Select',
    label: '文件数据',
    required: true,
    defaultValue: '',
    componentProps: {
      placeholder: '请选择文件数据',
      options: [],
    },
  },
  {
    field: 'fileContainFields',
    component: 'TreeSelect',
    label: '文件字段',
    required: true,
    componentProps: {
      placeholder: '请选择到导出的文件字段',
      treeCheckable: true,
      allowClear: true,
      showCheckedStrategy: 'SHOW_ALL',
      treeDefaultExpandAll: true,
      treeData: [],
    },
  },
]

const props = {
  config: {
    type: Object as PropType<TableProCustomActionConfig>,
  },
  tableRef: {
    type: Object as PropType<Ref<TableProInstance | null>>,
  },
  tableSlots: {
    type: Object as PropType<Slots>,
  },
}

export default defineComponent({
  name: ComponentCustomActionName,
  props,
  emits: ['triggerStatistical'],
  setup(props, { emit, expose }) {
    const settingsRef = ref<CustomActionSetting | null>(null)
    const actionRef = ref<ComputedRef | null>(null)
    const { tableEmitter, tablePropsRef } = useTableContext()
    const backupColumns = ref<any[]>([])
    const prepareExport = ref<boolean>(false)

    const hasTreeConfig = computed(() => {
      const treeConfig = unref(tablePropsRef).treeConfig

      if (!JSON.stringify(treeConfig)) {
        return false
      } else {
        return true
      }
    })

    const state = reactive({
      filter: {},
    })

    tableEmitter.on('table-pro:filter-form-submit', ({ filter = {} }) => {
      state.filter = filter
    })

    const getPermission = (data) => (isObject(data) ? data?.permission : undefined)

    // 统计按钮配置
    const handleStatistical = (e: Event) => {
      emit('triggerStatistical')
      if (isObject(props.config?.statistical) && props.config?.statistical.handleAction)
        props.config?.statistical.handleAction(e)
    }
    const statisticalButton = () =>
      props.config?.statistical ? (
        <Button
          class={`${ComponentPrefixCls}-btn statistical`}
          type="primary"
          preIcon={'ant-design:calculator-outlined'}
          onClick={handleStatistical}
          permission={getPermission(props.config?.statistical)}
        >
          统计
        </Button>
      ) : null

    // 新增按钮配置
    const handleAdd = (e: Event) => {
      if (isObject(props.config?.add) && props.config?.add.handleAction)
        props.config?.add.handleAction(e)
    }

    const addButton = () =>
      props.config?.add ? (
        <Button
          class={`${ComponentPrefixCls}-btn add`}
          type="primary"
          preIcon={'ant-design:plus-circle-outlined'}
          onClick={handleAdd}
          permission={getPermission(props.config?.add)}
        >
          新增
        </Button>
      ) : null

    // 删除按钮配置
    const handleDelete = (e: Event) => {
      if (isObject(props.config?.delete) && props.config?.delete.handleAction)
        props.config?.delete.handleAction(e)
    }

    const deleteButton = () =>
      props.config?.delete ? (
        <Button
          class={`${ComponentPrefixCls}-btn delete`}
          type="primary"
          preIcon={'ant-design:delete-outlined'}
          onClick={handleDelete}
          permission={getPermission(props.config?.delete)}
        >
          删除
        </Button>
      ) : null

    // 导入按钮配置
    const handleImport = (e: Event) => {
      if (isObject(props.config?.import) && props.config?.import.handleAction)
        props.config?.import.handleAction(e)
    }

    const importButton = () =>
      props.config?.import ? (
        <Button
          class={`${ComponentPrefixCls}-btn import`}
          type="primary"
          preIcon={'ant-design:import-outlined'}
          onClick={handleImport}
          permission={getPermission(props.config?.import)}
        >
          导入
        </Button>
      ) : null

    const [
      exportModalFormRegister,
      {
        setFieldsValue: exportModalFormSetFieldsValue,
        updateSchema: exportModalFormUpdateSchema,
        validate: exportModalFormValidate,
        scrollToField: exportModalFormScrollToField,
      },
    ] = useForm({
      labelWidth: 80,
      schemas: ExportModalFormSchemas,
      showActionButtonGroup: false,
    })

    const exportModalForm = () => <TaForm onRegister={exportModalFormRegister}></TaForm>

    const [exportModalRegister, { openModal: exportModalOpen, closeModal: exportModalClose }] =
      useModal()

    const exportModal = () => {
      const handleSubmit = async () => {
        let data: Record<string, any> = {}
        let errorFields: Record<string, any>[] = []
        try {
          const _formData = await exportModalFormValidate()
          data = JSON.parse(JSON.stringify(_formData))
        } catch (e: any) {
          console.log('not passing', e)
          errorFields = e.errorFields
          exportModalFormScrollToField(errorFields[0].name[0])
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return { data, errors: errorFields }
        }
      }
      const handleExport = async () => {
        const { data, errors } = await handleSubmit()
        if (errors.length === 0) {
          const _columns = props.tableRef?.value?.getTableColumn().collectColumn ?? []
          /** 扁平化树结构选中的 column id*/
          const getContainColumnIds = (fieldValue: string[]) => {
            const containColumnIds: string[] = []
            fieldValue.forEach((field: string) => {
              if (field.includes('-')) {
                containColumnIds.push(...field.split('-'))
              } else {
                containColumnIds.push(field)
              }
            })
            return [...new Set(containColumnIds)]
          }
          const containColumnIds = getContainColumnIds(data.fileContainFields)
          const handleFilterSelectedColumn = (column: TableProColumnInfo) => {
            if (containColumnIds.includes(column.id)) {
              return column
            }
            return null
          }
          const traverse = (columns, result: any[]) => {
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i]
              if (column.children && column.children.length) {
                const current = handleFilterSelectedColumn(column)
                const children = traverse(column.children, [])
                if (current) {
                  current.children = children
                  current['childNodes'] = children
                  result.push(current)
                } else {
                  children.forEach((v) => (v['childNodes'] = v.children))
                  result.push(...children)
                }
              } else {
                const current = handleFilterSelectedColumn(column)
                if (current) {
                  current['childNodes'] = current.children
                  result.push(current)
                }
              }
            }
            return result
          }
          const columns = traverse(_columns, [])
          // const fileDescription = data.fileDescription
          let fileDescription = ''
          if (isObject(props.config?.export) && props.config?.export.handleDescription) {
            fileDescription = await props.config?.export.handleDescription()
          }

          let fileStyles = {}
          if (isObject(props.config?.export) && props.config?.export.styles) {
            fileStyles = props.config?.export.styles
          }

          // console.log(data, _columns, columns)
          props.tableRef?.value?.exportData({
            filename: data.fileName,
            sheetName: data.fileName,
            type: data.fileType,
            mode: data.fileDataType.indexOf('all') > -1 ? 'all' : data.fileDataType,
            modeType: data.fileDataType,
            isHeader: true,
            // isFooter: true,
            isMerge: true,
            isColgroup: true,
            // message: true,
            // 虚拟滚动情况下，要么设置 fixedLineHeight 为 false，要么设置 original 为 true 否则导出有问题
            // original: true,
            columns,
            backupColumns,
            exportModalClose,
            useStyle: true,
            fileDescription,
            fileStyles,
            fileSeq: !!data.fileSeq,
          } as any)

          // props.tableRef?.value?.loadColumn(backupColumns.value)
          // exportModalClose()
        }
      }

      return (
        <TaModal
          onRegister={exportModalRegister}
          title={'导出设置'}
          width={650}
          wrapClassName={`${ComponentPrefixCls}-btn export-modal`}
          destroyOnClose={true}
          maskClosable={false}
          onVisible-change={(isOpen) => {
            if (!isOpen) {
              props.tableRef?.value?.loadColumn(backupColumns.value)
            }
          }}
        >
          {{
            default: () => exportModalForm(),
            footer: () => (
              <>
                <Button type="primary" onClick={handleExport}>
                  {'导出'}
                </Button>
                <Button onClick={exportModalClose}>{'取消'}</Button>
              </>
            ),
          }}
        </TaModal>
      )
    }

    const handleExportClick = async (e: Event) => {
      prepareExport.value = true
      if (isObject(props.config?.export) && props.config?.export.handleAction) {
        props.config?.export.handleAction(e)
      }

      if (isObject(props.config?.export) && props.config?.export.handleBackendApi) {
        await props.config?.export.handleBackendApi(state.filter)
        prepareExport.value = false
      } else {
        const _columns = props.tableRef?.value?.getTableColumn().collectColumn!
        backupColumns.value = _columns
        const mergeColumns = (columns, exportColumns) => {
          if (!(exportColumns && exportColumns.length)) return columns
          const createTarget = (target, other?: TableProColumnInfo) => {
            const params = {} // 必须放在 params 中否则 vxe 内部会把参数过滤掉
            if (target.cellContent) {
              params['cellContent'] = target.cellContent
            }
            if (target.columnFormat) {
              params['columnFormat'] = target.columnFormat
            }
            if (target.cellFormat) {
              params['cellFormat'] = target.cellFormat
            }

            let title = ''
            if (other) {
              title = target.title || other.title || target.field
            } else {
              title = target.title ?? target.field
            }

            if (!other) {
              params['isAppendColumn'] = true
            }
            return {
              ...target,
              title,
              params,
            }
          }
          const handledFields: string[] = []

          const traverse = (columns: TableProColumnInfo[], handledFields: string[]) => {
            return columns.map((column) => {
              if (column.children && column.children.length) {
                return { ...column, children: traverse(column.children, handledFields) }
              } else {
                const target = exportColumns.find(
                  (exportColumn) => exportColumn.field === column.field
                )
                if (target) {
                  handledFields.push(target.field)
                  const targetProps = createTarget(target, column)
                  for (const [k, v] of Object.entries(targetProps)) {
                    column[k] = v
                  }
                  return column
                } else {
                  return column
                }
              }
            })
          }

          const mergedColumns = traverse(columns, handledFields)
          return [
            ...mergedColumns,
            ...exportColumns
              .filter((exportColumn) => !handledFields.includes(exportColumn.field))
              .map((exportColumn) => {
                return {
                  visible: true,
                  minWidth: 100,
                  ...exportColumn,
                  ...createTarget(exportColumn),
                }
              }),
          ]
        }
        const mergedColumns = mergeColumns(
          _columns,
          isObject(props.config?.export) ? props.config?.export.columns : []
        )
        prepareExport.value = false
        exportModalOpen()

        await props.tableRef?.value?.loadColumn(mergedColumns)
        await props.tableRef?.value?.refreshScroll()
        await props.tableRef?.value?.recalculate()
        const columns = props.tableRef?.value?.getTableColumn().collectColumn!

        let selectedKeys: string[] = []
        const unvisibleFields: Record<string, any>[] = []
        const uninitFields: Record<string, any>[] = []
        const handleTreeDataItem = (column: TableProColumnInfo, pid: string) => {
          const { id, type, field, title, visible, disabled, params } = column
          const currentId = pid ? `${pid}-${id}` : id
          const item: TreeDataItem = {
            title,
            key: currentId,
            value: currentId,
            disabled: false,
          }
          selectedKeys.push(currentId)
          if (visible && !disabled && SELECT_COMPONENTS.includes(type!)) {
            item.title = '选中状态'
          }
          // 把选中、操作列设置为不可选择项
          if (
            visible &&
            !disabled &&
            ((type && SELECT_COMPONENTS.includes(type!)) ||
              (field && ACTION_COLUMNS.includes(field!)))
          ) {
            item.disabled = true
          }
          // 把选中、操作列设置为不可选择项，默认不导出
          if (
            (type && SELECT_COMPONENTS.includes(type!)) ||
            (field && ACTION_COLUMNS.includes(field!))
          ) {
            selectedKeys = selectedKeys.filter((key) => key !== currentId)
          }
          // 把配置visible的列筛选出来添加样式
          !visible &&
            unvisibleFields.push({
              value: currentId,
              label: title,
            })

          // 把通过追加的列筛选出来添加样式
          params &&
            params.isAppendColumn &&
            uninitFields.push({
              value: currentId,
              label: title,
            })

          return item
        }
        const traverse = (columns: TableProColumnInfo[], pid = '') => {
          return columns
            .map((column) => {
              if (column.children && column.children.length) {
                const current = handleTreeDataItem(column, pid)
                // 因为export配置在分组表头的父表头中配置是没有意义的只有在最底部表头上才有效所以这里只对子表头做判断
                const children = traverse(column.children, column.id).filter(Boolean)
                return { ...current, children }
              } else {
                return handleTreeDataItem(column, pid)
              }
            })
            .filter(Boolean)
        }
        const treeData: TreeDataItem[] = traverse(columns)
        const handleUnvisibleField = async (value) => {
          const target = unvisibleFields.find((field) => field.value === value)
          if (target) {
            await nextTick()
            const el: HTMLElement | null = document.querySelector(
              `#fileContainFields .ant-select-selection-item[title="${target.label}"]`
            )
            if (el) {
              el.style.backgroundColor = '#cccccc80'
            }
          }
        }
        const handleUninitField = async (value) => {
          const target = uninitFields.find((field) => field.value === value)
          if (target) {
            await nextTick()
            const el: HTMLElement | null = document.querySelector(
              `#fileContainFields .ant-select-selection-item[title="${target.label}"]`
            )
            if (el) {
              el.style.backgroundColor = '#409eff80'
            }
          }
        }
        const handleFieldSelect = (value) => {
          handleUnvisibleField(value)
          handleUninitField(value)
        }
        await nextTick()
        const {
          pager: { pageSize, total },
        } = props.tableRef?.value?.getProxyInfo() ?? {}
        let _fileDataTypeDefaultValue = 'current'
        let fileDataTypeOptions = FileDataTypeOptions
        // 没配置 handleAllApi，就不显示 all
        if (!(isObject(props.config?.export) && props.config?.export.handleAllApi)) {
          fileDataTypeOptions = fileDataTypeOptions.filter(
            (fileType) => fileType.value.indexOf('all') > -1
          )
        }
        if (total / pageSize <= 1) {
          _fileDataTypeDefaultValue = 'all'
          fileDataTypeOptions = fileDataTypeOptions.filter(
            (fileType) => fileType.value.indexOf('all') > -1
          )
        }
        await exportModalFormUpdateSchema([
          {
            field: 'fileDataType',
            componentProps: {
              options: fileDataTypeOptions,
            },
          },
          {
            field: 'fileContainFields',
            componentProps: {
              treeData,
              onSelect: handleFieldSelect,
            },
          },
        ])
        await nextTick()
        await exportModalFormSetFieldsValue({
          fileContainFields: selectedKeys,
          fileDataType: _fileDataTypeDefaultValue,
        })
        selectedKeys.forEach((key) => {
          handleUnvisibleField(key)
          handleUninitField(key)
        })
      }
    }

    const exportButton = () =>
      props.config?.export ? (
        <Button
          class={`${ComponentPrefixCls}-btn export`}
          type="primary"
          preIcon={'ant-design:export-outlined'}
          loading={unref(prepareExport)}
          onClick={handleExportClick}
          permission={getPermission(props.config?.export)}
        >
          导出
        </Button>
      ) : null

    expose({
      addRef: null,
      deleteRef: null,
      importRef: null,
      exportRef: null,
      settingsRef,
      actionRef,
    })

    return () => {
      return (
        <>
          {props.config?.enabled ? (
            <div class={ComponentPrefixCls} ref={actionRef}>
              {statisticalButton()}
              {addButton()}
              {deleteButton()}
              {props.tableSlots?.customAction?.()}
              {!unref(hasTreeConfig) ? (
                <>
                  {importButton()}
                  {exportButton()}
                </>
              ) : null}
              <Settings
                ref={settingsRef}
                config={props.config}
                tableRef={props.tableRef}
                tableSlots={props.tableSlots}
              />
            </div>
          ) : null}
          {exportModal()}
        </>
      )
    }
  },
})
