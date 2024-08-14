import { type ComputedRef, type Ref, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isBoolean } from '@tav-ui/utils'
import {
  type FileTableFilterFormConfig,
  type FileTableInstance,
  type FileTableProps,
} from '../types'
import { DEFAULT_FILETABLE_CLASSNAME } from '../../../consts'
import { type GlobalConfigFileProps } from '../../../typings'

export function defaultFilterFormConfigBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>,
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>,
  filterFormFileTypeData: Ref<any>,
  filterFormFileTypeAllTypeCodesData: Ref<string[]>
) {
  const DEFAULT_FILTER_FORM_CONFIG: FileTableFilterFormConfig = {
    inputForm: {
      field: 'searchValue',
      componentProps: {
        'enter-button': true,
        placeholder: tavI18n('Tav.file.filter.1'),
      },
    },
    pannelForm: [
      {
        field: 'name',
        label: tavI18n('Tav.file.filter.3'),
        colProps: { span: 24 },
        component: 'Input',
        componentProps: {
          allowClear: true,
        },
      },
      {
        field: 'typeCodes',
        label: tavI18n('Tav.file.filter.2'),
        colProps: { span: 24 },
        component: 'TreeSelect',
        defaultValue: [],
        componentProps: ({ formActionType }) => {
          return {
            treeData: filterFormFileTypeData.value,
            treeNodeFilterProp: 'name', // 模糊搜索这里配置原数据中的属性
            treeCheckable: true,
            allowClear: true,
            // showCheckedStrategy: 'SHOW_PARENT',
            treeDataSimpleMode: {
              id: 'code',
              pId: 'parentId',
            },
            fieldNames: {
              label: 'name',
              value: 'code',
            },
            dropdownClassName: `${DEFAULT_FILETABLE_CLASSNAME}-filter-form-file-type-tree-select`,
            dropdownStyle: { maxHeight: '500px', overflow: 'hidden' },
            listHeight: 450,
            virtual: false,
            maxTagCount: 10,
            treeIcon: true,
            // treeIcon(...args: any[]) {
            //   console.log(args)
            //   return <>123</>
            // },
            dropdownRender(args: any) {
              const VNode = args.menuNode
              const VNodeProps = args.props
              return (
                <>
                  <VNode {...VNodeProps} />
                  <div
                    class={`${DEFAULT_FILETABLE_CLASSNAME}-filter-form-file-type-tree-select-actions`}
                  >
                    <button
                      class="ant-btn ant-btn-link"
                      onMousedown={(e) => e.preventDefault()}
                      onClick={() => {
                        formActionType?.setFieldsValue({
                          typeCodes: filterFormFileTypeAllTypeCodesData.value,
                        })
                      }}
                    >
                      {tavI18n('Tav.common.selectAllText')}
                    </button>
                  </div>
                </>
              )
            },
          }
        },
      },
      {
        label: tavI18n('Tav.file.columns.8'),
        field: 'timeRange',
        colProps: { span: 24 },
        component: 'RangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD 00:00:00',
        },
        valueType: 'array',
      },
      {
        label: tavI18n('Tav.member.2'),
        field: 'owners',
        colProps: { span: 24 },
        component: 'MemberSelect',
        defaultValue: [],
        componentProps: {
          allowClear: true,
          multiple: true,
        },
      },
    ],
  }

  return DEFAULT_FILTER_FORM_CONFIG
}

export function useFilterFormConfig(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
  filterFormFileTypeData: Ref<any>
  filterFormFileTypeAllTypeCodesData: Ref<string[]>
}) {
  const { mergedProps, tableProRef, filterFormFileTypeData, filterFormFileTypeAllTypeCodesData } =
    options

  return computed(() => {
    const filterFormConfig = mergedProps.value.filterFormConfig

    const filterFormConfigWithNull = {
      enabled: false,
    }

    const filterFormConfigWithDefault = () => {
      if (isBoolean(filterFormConfig)) {
        if (filterFormConfig) {
          return defaultFilterFormConfigBuilder(
            mergedProps,
            tableProRef,
            filterFormFileTypeData,
            filterFormFileTypeAllTypeCodesData
          )
        } else {
          return { ...filterFormConfigWithNull }
        }
      } else {
        let result = defaultFilterFormConfigBuilder(
          mergedProps,
          tableProRef,
          filterFormFileTypeData,
          filterFormFileTypeAllTypeCodesData
        )
        result = filterFormConfig(result)
        return result
      }
    }

    if (mergedProps.value.mode === 'read') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "filterFormConfig" not working in mode "read" combine with "dataSource"'
        )
        return { ...filterFormConfigWithNull }
      } else {
        return filterFormConfigWithDefault()
      }
    } else if (mergedProps.value.mode === 'create') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "filterFormConfig" not working in mode "create" combine with "dataSource"'
        )
        return { ...filterFormConfigWithNull }
      } else {
        console.warn(
          '[tavui TaFileTable] "filterFormConfig" not working in mode "create" combine with "api"'
        )
        return { ...filterFormConfigWithNull }
      }
    } else if (mergedProps.value.mode === 'update') {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "filterFormConfig" not working in mode "read" combine with "dataSource"'
        )
        return { ...filterFormConfigWithNull }
      } else {
        return filterFormConfigWithDefault()
      }
    } else {
      if (mergedProps.value.dataSource) {
        console.warn(
          '[tavui TaFileTable] "filterFormConfig" not working in mode "read" combine with "dataSource"'
        )
        return { ...filterFormConfigWithNull }
      } else {
        return filterFormConfigWithDefault()
      }
    }
  })
}
