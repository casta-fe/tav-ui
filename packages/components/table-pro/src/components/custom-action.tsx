import { defineComponent, nextTick, reactive, unref } from 'vue'
import Button from '@tav-ui/components/button'
import { TaForm, useForm } from '@tav-ui/components/form'
import { TaModal, useModal } from '@tav-ui/components/modal'
import { isObject } from '@tav-ui/utils/is'
import {
  ACTION_COLUMNS,
  CamelCaseToCls,
  ComponentCustomActionName,
  SELECT_COMPONENTS,
} from '../const'
import { useTableContext } from '../hooks/useTableContext'
import type { PropType, Ref, Slots } from 'vue'
import type { FormSchema } from '@tav-ui/components/form'
import type { TableProColumnInfo, TableProInstance } from '../types'
import type { TableProCustomActionConfig, TreeDataItem } from '../typings'

const ComponentPrefixCls = CamelCaseToCls(ComponentCustomActionName)
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
    defaultValue: 'current',
    componentProps: {
      placeholder: '请选择文件数据',
      options: [
        {
          label: '选中数据（当前页选中的数据）',
          value: 'selected',
        },
        {
          label: '当前数据（当前页的数据）',
          value: 'current',
        },
        {
          label: '全量数据（包括所有分页的数据）',
          value: 'all',
        },
      ],
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
  setup(props) {
    const { tableEmitter } = useTableContext()

    const state = reactive({
      filter: {},
    })

    tableEmitter.on('table-pro:filter-form-submit', ({ filter = {} }) => {
      state.filter = filter
    })

    const handleAdd = (e: Event) => {
      if (isObject(props.config?.add) && props.config?.add.handleAction)
        props.config?.add.handleAction(e)
    }

    const getPermission = (data) => (isObject(data) ? data?.permission : undefined)

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
          exportModalClose()
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
          console.log(data, _columns, columns)
          props.tableRef?.value?.exportData({
            filename: data.fileName,
            sheetName: data.fileName,
            type: data.fileType,
            mode: data.fileDataType,
            isHeader: true,
            // isFooter: true,
            isMerge: true,
            isColgroup: true,
            // message: true,
            columns,
          })
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
      if (isObject(props.config?.export) && props.config?.export.handleAction) {
        props.config?.export.handleAction(e)
      }
      exportModalOpen()
      const columns = props.tableRef?.value?.getTableColumn().collectColumn!
      let selectedKeys: string[] = []
      const handleTreeDataItem = (column: TableProColumnInfo, pid: string) => {
        const { id, type, field, title, visible, disabled } = column
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
        return item
      }
      const traverse = (columns: TableProColumnInfo[], pid = '') => {
        return columns.map((column) => {
          if (column.children && column.children.length) {
            const current = handleTreeDataItem(column, pid)
            const children = traverse(column.children, column.id)
            return { ...current, children }
          } else {
            return handleTreeDataItem(column, pid)
          }
        })
      }
      const treeData: TreeDataItem[] = traverse(columns)
      await nextTick()
      await exportModalFormUpdateSchema({
        field: 'fileContainFields',
        componentProps: {
          treeData,
        },
      })
      await nextTick()
      await exportModalFormSetFieldsValue({
        fileContainFields: selectedKeys,
      })
    }

    const exportButton = () =>
      props.config?.export ? (
        <Button
          class={`${ComponentPrefixCls}-btn export`}
          type="primary"
          preIcon={'ant-design:export-outlined'}
          onClick={handleExportClick}
          permission={getPermission(props.config?.export)}
        >
          导出
        </Button>
      ) : null

    const handleRefresh = (e: Event) => {
      if (isObject(props.config?.refresh) && props.config?.refresh.handleAction)
        props.config?.refresh.handleAction(e)
      // query 保留query状态刷新数据
      // reload 清空状态回到第一页
      unref(props.tableRef)?.commitProxy('query')
    }

    const refreshButton = () =>
      props.config?.refresh ? (
        <Button
          class={`${ComponentPrefixCls}-btn refresh`}
          type="default"
          preIcon={'ant-design:redo-outlined'}
          onClick={handleRefresh}
          permission={getPermission(props.config?.refresh)}
        />
      ) : null

    return () => {
      return (
        <>
          {props.config?.enabled ? (
            <div class={ComponentPrefixCls}>
              {addButton()}
              {deleteButton()}
              {props.tableSlots?.customAction?.()}
              {importButton()}
              {exportButton()}
              {refreshButton()}
            </div>
          ) : null}
          {exportModal()}
        </>
      )
    }
  },
})
