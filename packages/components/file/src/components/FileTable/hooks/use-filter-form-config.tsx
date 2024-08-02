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
  filterFormFileTypeData: Ref<any>
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
        field: 'typeCode',
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
            showCheckedStrategy: 'SHOW_PARENT',
            treeDataSimpleMode: {
              id: 'id',
              pId: 'parentId',
            },
            fieldNames: {
              label: 'name',
              value: 'id',
            },
            dropdownClassName: `${DEFAULT_FILETABLE_CLASSNAME}-filter-form-file-type-tree-select`,
            dropdownStyle: { maxHeight: '480px', overflow: 'hidden' },
            listHeight: 450,
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
                          typeCode: filterFormFileTypeData.value.map((v: any) => v.id),
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
      // TODO: Owners
    ],
  }

  return DEFAULT_FILTER_FORM_CONFIG
}

export function useFilterFormConfig(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
  filterFormFileTypeData: Ref<any>
}) {
  const { mergedProps, tableProRef, filterFormFileTypeData } = options

  return computed(() => {
    const filterFormConfig = mergedProps.value.filterFormConfig

    if (mergedProps.value.dataSource) {
      // 如果传入 datasource 则隐藏筛选
      return {
        enabled: false,
      }
    }

    if (isBoolean(filterFormConfig)) {
      if (filterFormConfig) {
        return defaultFilterFormConfigBuilder(mergedProps, tableProRef, filterFormFileTypeData)
      } else {
        return {
          enabled: false,
        }
      }
    } else {
      let result = defaultFilterFormConfigBuilder(mergedProps, tableProRef, filterFormFileTypeData)
      result = filterFormConfig(result)
      return result
    }
  })
}
