import { computed, defineComponent, nextTick, reactive, ref, unref } from 'vue'
import { cloneDeep } from 'lodash-es'
import Button from '@tav-ui/components/button'
import { TaForm, useForm } from '@tav-ui/components/form'
import { TaModal, useModal } from '@tav-ui/components/modal'
import { isBoolean, isFunction, isObject } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
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
    const FileDataTypeOptions = [
      {
        label: tavI18n('Tav.tablePro.export.4o1'),
        value: 'selected',
      },
      // {
      //   label: tavI18n('Tav.tablePro.export.4o2'),
      //   value: 'current',
      // },
      {
        label: tavI18n('Tav.tablePro.export.4o4'),
        value: 'allSearch',
      },
      {
        label: tavI18n('Tav.tablePro.export.4o3'),
        value: 'all',
      },
    ]

    const ExportModalFormSchemas: FormSchema[] = [
      {
        field: 'fileName',
        component: 'Input',
        label: tavI18n('Tav.tablePro.export.1'),
        required: true,
        componentProps: {
          placeholder: tavI18n('Tav.tablePro.export.1p'),
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
        label: tavI18n('Tav.tablePro.export.2'),
        required: false,
        defaultValue: 1,
        componentProps: {
          placeholder: tavI18n('Tav.tablePro.export.2p'),
          options: [
            {
              label: tavI18n('Tav.tablePro.export.2o1'),
              value: 1,
            },
            {
              label: tavI18n('Tav.tablePro.export.2o2'),
              value: 0,
            },
          ],
        },
      },
      {
        field: 'fileType',
        component: 'Select',
        label: tavI18n('Tav.tablePro.export.3'),
        required: true,
        defaultValue: 'xlsx',
        componentProps: {
          disabled: true,
          placeholder: tavI18n('Tav.tablePro.export.3p'),
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
        label: tavI18n('Tav.tablePro.export.4'),
        required: true,
        defaultValue: '',
        componentProps: {
          placeholder: tavI18n('Tav.tablePro.export.4p'),
          options: [],
        },
      },
      {
        field: 'fileContainFields',
        component: 'TreeSelect',
        label: tavI18n('Tav.tablePro.export.5'),
        required: true,
        componentProps: {
          disabled: true,
          placeholder: tavI18n('Tav.tablePro.export.5p'),
          treeCheckable: true,
          allowClear: true,
          showCheckedStrategy: 'SHOW_ALL',
          treeDefaultExpandAll: true,
          treeData: [],
        },
      },
    ]
    const settingsRef = ref<CustomActionSetting | null>(null)
    const actionRef = ref<ComputedRef | null>(null)
    const { tableEmitter, tablePropsRef, isCheckboxCacheEnabled, checkboxCacheList } =
      useTableContext()
    const handledColumns = ref<any[]>([])
    const backupColumns = ref<any[]>([])
    const prepareExport = ref<boolean>(false)
    const exportLoading = ref<boolean>(false)
    const keyField = computed(() => unref(tablePropsRef).rowConfig.keyField)
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

    const getPermission = (data: any) => (isObject(data) ? data?.permission : undefined)
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
          permissionCode={
            isBoolean(props.config?.statistical)
              ? undefined
              : props.config?.statistical?.permissionCode
          }
          usePermission={
            isBoolean(props.config?.statistical)
              ? undefined
              : props.config?.statistical?.usePermission
          }
        >
          {tavI18n('Tav.tablePro.setting.6')}
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
          permissionCode={
            isBoolean(props.config?.add) ? undefined : props.config?.add?.permissionCode
          }
          usePermission={
            isBoolean(props.config?.add) ? undefined : props.config?.add?.usePermission
          }
        >
          {tavI18n('Tav.common.addText')}
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
          permissionCode={
            isBoolean(props.config?.delete) ? undefined : props.config?.delete?.permissionCode
          }
          usePermission={
            isBoolean(props.config?.delete) ? undefined : props.config?.delete?.usePermission
          }
        >
          {tavI18n('Tav.common.delText')}
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
          permissionCode={
            isBoolean(props.config?.import) ? undefined : props.config?.import?.permissionCode
          }
          usePermission={
            isBoolean(props.config?.import) ? undefined : props.config?.import?.usePermission
          }
        >
          {tavI18n('Tav.common.exportText')}
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

    const exportModalLoading = ref(false)
    function exportModalChangeLoading(loading: boolean) {
      exportModalLoading.value = loading
    }

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
          exportModalLoading.value = false
          // eslint-disable-next-line no-unsafe-finally
          return { data, errors: errorFields }
        }
      }
      const handleExport = async () => {
        exportModalChangeLoading(true)
        const { data, errors } = await handleSubmit()
        if (errors.length === 0) {
          const _columns = handledColumns.value ?? []
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
          const traverse = (columns: any, result: any[]) => {
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i]
              if (column.children && column.children.length) {
                const current = handleFilterSelectedColumn(column) as any
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
                const current = handleFilterSelectedColumn(column) as any
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

          let checkedDatas = [] as any
          if (isCheckboxCacheEnabled.value) {
            checkedDatas = checkboxCacheList.value
          } else {
            checkedDatas = props.tableRef?.value?.getCheckboxRecords() as any
          }
          if (
            (props.config?.export as any)?.afterApi &&
            isFunction((props.config?.export as any)?.afterApi)
          ) {
            checkedDatas =
              (await (props.config?.export as any)?.afterApi(checkedDatas)) || checkedDatas
          }

          try {
            await props.tableRef?.value?.exportData({
              filename: data.fileName,
              sheetName: data.fileName,
              type: data.fileType,
              mode: data.fileDataType.indexOf('all') > -1 ? 'all' : data.fileDataType,
              ...(data.fileDataType === 'selected' ? { data: checkedDatas } : {}),
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
              exportModalClose: () => {
                exportModalChangeLoading(false)
                exportModalClose()
              },
              useStyle: true,
              fileDescription,
              fileStyles,
              fileSeq: !!data.fileSeq,
            } as any)

            // props.tableRef?.value?.loadColumn(backupColumns.value)
            // exportModalClose()
          } catch (error) {
            console.warn(error)
            exportModalChangeLoading(false)
          }
        }
      }

      return (
        <TaModal
          onRegister={exportModalRegister}
          title={tavI18n('Tav.tablePro.setting.5')}
          width={650}
          wrapClassName={`${ComponentPrefixCls}-btn export-modal`}
          destroyOnClose={true}
          maskClosable={false}
          loading={exportModalLoading.value}
          confirmLoading={exportModalLoading.value}
          onVisible-change={(isOpen: any) => {
            if (!isOpen) {
              props.tableRef?.value?.loadColumn(backupColumns.value)
            }
          }}
        >
          {{
            default: () => exportModalForm(),
            footer: () => (
              <>
                <Button onClick={exportModalClose}>{tavI18n('Tav.common.cancelText')}</Button>
                <Button loading={exportLoading.value} type="primary" onClick={handleExport}>
                  {tavI18n('Tav.common.exportText')}
                </Button>
              </>
            ),
          }}
        </TaModal>
      )
    }

    const handleExportClick = async (e: Event) => {
      prepareExport.value = true
      //@ts-ignore
      const useUnvisibleColumn = (props.config?.export as any)?.useUnvisibleColumn ?? false
      if (isObject(props.config?.export) && props.config?.export.handleAction) {
        props.config?.export.handleAction(e)
      }

      if (isObject(props.config?.export) && props.config?.export.useBackendApi) {
        await props.config?.export.useBackendApi(state.filter)
        prepareExport.value = false
      } else {
        const _columns = props.tableRef?.value?.getTableColumn().collectColumn!
        backupColumns.value = cloneDeep(_columns)

        const mergeColumns = (columns: any, exportColumns: any = []) => {
          const createExportColumnProps = (exportColumn: any, column?: TableProColumnInfo) => {
            const params: Record<string, any> = {} // 必须放在 params 中否则 vxe 内部会把参数过滤掉
            if (exportColumn.cellContent) {
              params['cellContent'] = exportColumn.cellContent
            }
            if (exportColumn.cellFormat) {
              params['cellFormat'] = exportColumn.cellFormat
            }

            let title = ''
            if (column) {
              title = exportColumn.title || column.title || exportColumn.field
            } else {
              title = exportColumn.title ?? exportColumn.field
            }

            if (!column) {
              params['isAppendColumn'] = true
              exportColumn['id'] = exportColumn.field
            }
            return {
              ...exportColumn,
              title,
              params,
            }
          }

          // 存放通过 exportcolumn 新增的列 field
          const matchedExportColumnFields: string[] = []

          const traverse: any = (
            columns: TableProColumnInfo[],
            matchedExportColumnFields: string[]
          ) => {
            return columns
              .map((column: any) => {
                if (!column.visible && !useUnvisibleColumn) {
                  const exportColumn = exportColumns.find(
                    (exportColumn: any) => exportColumn.field === column.field
                  )
                  if (exportColumn) {
                    exportColumn?.field && matchedExportColumnFields.push(exportColumn.field)
                  }
                  return null
                } else {
                  if (column.children && column.children.length) {
                    const children = traverse(column.children, matchedExportColumnFields).filter(
                      Boolean
                    )
                    return {
                      ...column,
                      children,
                    }
                  } else {
                    const exportColumn = exportColumns.find(
                      (exportColumn: any) => exportColumn.field === column.field
                    )
                    if (exportColumn) {
                      const exportColumnProps = createExportColumnProps(exportColumn, column)
                      exportColumn?.field && matchedExportColumnFields.push(exportColumn.field)
                      for (const [k, v] of Object.entries(exportColumnProps)) {
                        column[k] = v
                      }
                      return column
                    } else {
                      return column
                    }
                  }
                }
              })
              .filter(Boolean)
          }

          const mergedColumns = traverse(columns, matchedExportColumnFields)
          return [
            ...mergedColumns,
            ...exportColumns
              .filter(
                (exportColumn: any) => !matchedExportColumnFields.includes(exportColumn.field)
              )
              .map((exportColumn: any) => {
                return {
                  visible: true,
                  minWidth: 100,
                  ...exportColumn,
                  ...createExportColumnProps(exportColumn),
                }
              }),
          ]
        }
        const mergedColumns = mergeColumns(
          _columns,
          isObject(props.config?.export) ? props.config?.export.columns?.() : []
        )
        prepareExport.value = false
        exportModalOpen()

        handledColumns.value = mergedColumns
        await props.tableRef?.value?.loadColumn(mergedColumns)
        await props.tableRef?.value?.refreshScroll()
        await props.tableRef?.value?.recalculate()

        let selectedKeys: string[] = []
        const unvisibleFields: Record<string, any>[] = []
        const appendFields: Record<string, any>[] = []
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
            item.title = tavI18n('Tav.tablePro.setting.4')
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
            useUnvisibleColumn &&
            unvisibleFields.push({
              value: currentId,
              label: title,
            })

          // 把通过追加的列筛选出来添加样式
          params &&
            params.isAppendColumn &&
            appendFields.push({
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
                if (current) {
                  // 因为export配置在分组表头的父表头中配置是没有意义的只有在最底部表头上才有效所以这里只对子表头做判断
                  const children = traverse(column.children, column.id).filter(Boolean) as any
                  return { ...current, children }
                }
                return null
              } else {
                return handleTreeDataItem(column, pid)
              }
            })
            .filter(Boolean)
        }
        const treeData: any = traverse(mergedColumns)
        const handleUnvisibleField = async (value: any) => {
          const target = unvisibleFields.find((field) => field.value === value)
          if (target) {
            await nextTick()
            const el: HTMLElement | null =
              document.querySelector(
                `#fileContainFields .ant-select-selection-item[title="${target.label}"]`
              ) ??
              document.querySelector(
                `[codefield="fileContainFields"] .ant-select-selection-item[title="${target.label}"]`
              )
            if (el) {
              el.style.backgroundColor = '#cccccc80'
            }
          }
        }
        const handleAppendField = async (value: any) => {
          const target = appendFields.find((field) => field.value === value)
          if (target) {
            await nextTick()
            const el: HTMLElement | null =
              document.querySelector(
                `#fileContainFields .ant-select-selection-item[title="${target.label}"]`
              ) ??
              document.querySelector(
                `[codefield="fileContainFields"] .ant-select-selection-item[title="${target.label}"]`
              )
            if (el) {
              el.style.backgroundColor = '#409eff80'
            }
          }
        }
        const handleFieldSelect = (value: any) => {
          useUnvisibleColumn && handleUnvisibleField(value)
          handleAppendField(value)
        }
        await nextTick()
        let _fileDataTypeDefaultValue = 'allSearch'
        const selectData = props.tableRef?.value?.getCheckboxRecords()
        if (selectData && selectData?.length > 0) {
          _fileDataTypeDefaultValue = 'selected'
        }

        await exportModalFormUpdateSchema([
          {
            field: 'fileDataType',
            componentProps: {
              options: FileDataTypeOptions,
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
        const exportConfig = isBoolean(props.config?.export) ? null : props.config?.export
        const defaultValue = exportConfig ? exportConfig.defaultValue : {}
        await exportModalFormSetFieldsValue(
          {
            fileName: exportConfig ? exportConfig.fileName : '',
            fileContainFields: selectedKeys,
            fileDataType: _fileDataTypeDefaultValue,
            ...defaultValue,
          },
          false
        )
        selectedKeys.forEach((key) => {
          useUnvisibleColumn && handleUnvisibleField(key)
          handleAppendField(key)
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
          permissionCode={
            isBoolean(props.config?.export) ? undefined : props.config?.export?.permissionCode
          }
          usePermission={
            isBoolean(props.config?.export) ? undefined : props.config?.export?.usePermission
          }
        >
          {tavI18n('Tav.common.exportText')}
        </Button>
      ) : null

    expose({
      addRef: null,
      deleteRef: null,
      importRef: null,
      exportRef: null,
      settingsRef,
      showExportModal: handleExportClick,
      showColumnsModa: () => {
        settingsRef.value?.showColumnsModa()
      },
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
