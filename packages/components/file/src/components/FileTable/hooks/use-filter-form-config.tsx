import { type ComputedRef, type Ref, computed } from 'vue'
import { tavI18n } from '@tav-ui/locales'
import { isBoolean } from '@tav-ui/utils'
import {
  type FileTableFilterFormConfig,
  type FileTableInstance,
  type FileTableProps,
} from '../types'
import { type GlobalConfigFileProps } from '../../../typings'

export function defaultFilterFormConfigBuilder(
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>,
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
) {
  console.log('defaultFilterFormConfigBuilder', mergedProps, tableProRef)
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
        component: 'Select',
        componentProps: {
          options: [], // TODO: 等待郭明接口，把上传节点收敛至此处。该项为多选
          optionFilterProp: 'label',
          showSearch: true,
          allowClear: true,
          mode: 'multiple',
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
    ],
  }

  return DEFAULT_FILTER_FORM_CONFIG
}

export function useFilterFormConfig(options: {
  mergedProps: ComputedRef<GlobalConfigFileProps & FileTableProps>
  tableProRef: Ref<FileTableInstance['tableProRef']['value']>
}) {
  const { mergedProps, tableProRef } = options

  return computed(() => {
    const filterFormConfig = mergedProps.value.filterFormConfig

    if (isBoolean(filterFormConfig)) {
      if (filterFormConfig) {
        return defaultFilterFormConfigBuilder(mergedProps, tableProRef)
      } else {
        return {
          enabled: false,
        }
      }
    } else {
      let result = defaultFilterFormConfigBuilder(mergedProps, tableProRef)
      result = filterFormConfig(result)
      return result
    }
  })
}
