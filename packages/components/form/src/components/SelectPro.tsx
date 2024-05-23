import { type ExtractPropTypes, computed, defineComponent, ref, unref } from 'vue'
import { Select, Tooltip } from 'ant-design-vue'
import { selectProps } from 'ant-design-vue/es/select'
import { pinyin } from 'pinyin-pro'
import Icon from '@tav-ui/components/icon'
import { useAttrs } from '@tav-ui/hooks/core/useAttrs'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PropType } from 'vue'

const selectProProps = {
  ...selectProps(),
  enabledAdd: {
    type: Boolean,
    default: false,
  },
} as any

export type SelectProProps = ExtractPropTypes<typeof selectProProps>

function triggerEvent(el, type) {
  if ('createEvent' in document) {
    // modern browsers, IE9+
    const e = document.createEvent('HTMLEvents')
    e.initEvent(type, false, true)
    el.dispatchEvent(e)
  }
}

export default defineComponent({
  name: 'SelectPro',
  components: {
    Select,
    Tooltip,
    Icon,
  },
  props: selectProProps,
  emits: ['change'],
  setup(props, { emit, slots }) {
    const { createMessage } = useMessage()

    // 如果传入 fieldNames 则从中获取 key 否则默认 key 为 label｜value
    function getDataFromFieldNames(fieldName: 'label' | 'value', name = 'fieldNames') {
      return (props as any)[name] ? (props as any)[name][fieldName] : fieldName
    }

    // 格式化数据，转为最新数据结构
    function formatValue(_value: any) {
      const { label, value } = _value
      let defaultValue = { label: label ?? null, value: value ?? null }
      // 修改组件新增返回的数据结构
      if (!label && value) {
        defaultValue = {
          label: value,
          value: null,
        }
      }

      return defaultValue
    }

    const dropdownCls = 'ta-select-pro-dropdown'
    const selectRef = ref<{ $el: HTMLElement }>()
    const attrs = useAttrs()
    const isMultiMode = computed(() => ['multiple', 'tags'].includes((props as any).mode))
    const isEnabledAdd = computed(() => (props as any).enabledAdd)
    const selected = ref<any>((props as any).value)

    // 构造含拼音数据的 option 无论是否开启 enabledadd 都会用到
    const options = ref<any[]>(JSON.parse(JSON.stringify((props as any).options)))
    options.value = options.value.map((o) => {
      let defaultValue = { ...o }

      if (Object.keys(o).length) {
        defaultValue = {
          ...defaultValue,
          // 首字母拼音
          pyfls: addPinyinData('first', o[getDataFromFieldNames('label')]),
          // 全称拼音
          pyls: addPinyinData('all', o[getDataFromFieldNames('label')]),
        }
      }

      return defaultValue
    })
    function addPinyinData(type: 'first' | 'all', value: any) {
      const options: Record<string, any> = {
        toneType: 'none',
        type: 'array',
      }

      if (type === 'first') {
        options['pattern'] = type
      }

      return (pinyin(value, options) as unknown as any[]).join('')
    }

    // 通过拼音过滤，无论是否开启 enabledadd 都会用到
    function handleFilter(inputValue: string, option: any) {
      if (option.pyfls?.includes(inputValue) || option.pyls?.includes(inputValue)) {
        return true
      }
      return false
    }

    // 通过类名控制新增项联想隐藏，无论是否开启 enabledadd 都会用到
    function toggleDropdownSearchState(searching: boolean) {
      const controlId = selectRef.value?.$el
        ?.querySelector('.ant-select-selection-search-input')
        ?.getAttribute('aria-controls')
      const el = document
        .querySelector(`#${controlId}`)
        ?.closest(`.${dropdownCls}`) as HTMLElement | null
      if (el) {
        el.dataset.searching = `${searching}`
      }
    }

    // 通过类名控制新增项不存在于下拉列表时隐藏父级 padding，无论是否开启 enabledadd 都会用到
    function toggleDropdownResultState(hasResult: boolean) {
      const controlId = selectRef.value?.$el
        ?.querySelector('.ant-select-selection-search-input')
        ?.getAttribute('aria-controls')
      const el = document
        .querySelector(`#${controlId}`)
        ?.closest(`.${dropdownCls}`) as HTMLElement | null
      if (el) {
        el.dataset.hasresult = `${hasResult}`
      }
    }

    // 监听 search 来处理 css 相关逻辑，无论是否开启 enabledadd 都会用到
    function handleSearch(value: string) {
      // 调用原本的 search event
      const onSearchEvent = (props as any).onSearch
      onSearchEvent?.(value)

      toggleDropdownSearchState(true)
      const hasSearchResult = unref(options).find(
        (o) => o[getDataFromFieldNames('value')] === value
      )
      toggleDropdownResultState(!!hasSearchResult)
    }

    function handleChange(_values: any) {
      let values = _values

      if (unref(isEnabledAdd)) {
        values = unref(selected).map((v) => formatValue(v))
      }
      // 调用原本的 change event
      const onChangeEvent = (props as any).onChange
      onChangeEvent?.(values)

      toggleDropdownSearchState(false)
      emit('change', values)
    }

    async function handleCopy(tag: any) {
      await navigator.clipboard.writeText(tag.label)
      createMessage.success(`已将 ${tag.label} 复制进粘贴板`)
    }

    /**
     * 1. 不开启 enabledadd 原生 select 组件不论什么模式
     *    a. 支持拼音搜索
     *    b. 去重
     *    c. 新增 tag 改色
     *    d. 隐藏新增底部联想
     * 2. 开启 enabledadd 原生 select 组件不论什么模式
     *    a. 内部将模式强转为 tags
     *    b. 内部控制单选模式（默认/combobox）只能选一个
     *    c. 返回的数据按照新数据结构显示：
     *       i. 多选：[{ label: string, value: string | number | null }]
     *       ii. 单选：{ label: string, value: string | number | null }
     *       iii. 其中 value: null 代表该项为新增
     *    d. 其他与 1.a 1.b 1.c 1.d 一致
     */
    const bindValues = computed(() => {
      let defaultValues: any = {
        ...props,
        ...attrs,
        options: unref(options),
        showSearch: true,
        filterOption: handleFilter,
      }

      if (unref(isMultiMode)) {
        defaultValues = {
          ...defaultValues,
          value: unref(selected),
          'onUpdate:value': (values) => {
            // 未开启 enabledadd 时，values 中为 (string | number)[]
            values = values.reduce((acc, cur) => {
              const existedOption = unref(options).find(
                (o) =>
                  o[getDataFromFieldNames('label')] === cur ||
                  o[getDataFromFieldNames('value')] === cur
              )
              // 输入值在 option 中存在且 values 不存在直接将 option 的 value 保存
              if (existedOption) {
                if (!acc.find((item) => item === existedOption[getDataFromFieldNames('value')])) {
                  acc.push(existedOption[getDataFromFieldNames('value')])
                }
              } else {
                // 输入值在 option 中不存在且 values 不存在直接将输入值保存
                if (!acc.find((item) => item === cur)) {
                  acc.push(cur)
                }
              }
              return acc
            }, [])
            // 第二步去重，已 options 已存在元素为主

            selected.value = [...values]
          },
          dropdownClassName: dropdownCls,
          onSearch: handleSearch,
          onChange: handleChange,
          onInputKeyDown: (event) => {
            // ant-design bug, 按下回车后会将重复字段删除。see：https://github.com/ant-design/ant-design/issues/20198
            const dom = event.target as HTMLInputElement
            if (
              event.key === 'Enter' &&
              dom.value &&
              unref(selected).find((item) => item === dom.value)
            ) {
              // 阻止删除已存在的 tag
              event.stopPropagation()
              triggerEvent(dom, 'blur')
            }
          },
        }
      }

      if (unref(isEnabledAdd)) {
        defaultValues = {
          ...defaultValues,
          mode: 'tags',
          labelInValue: true,
          value: unref(selected),
          'onUpdate:value': (values) => {
            // 去重
            values = values.reduce((acc, cur) => {
              if (!acc.find((item) => item.label === cur.label || item.label === cur.value)) {
                acc.push(cur)
              }
              return acc
            }, [])

            if (unref(isMultiMode)) {
              selected.value = [...values]
            } else {
              // 单选情况下只取最新的显示
              selected.value = values.length > 0 ? [values[values.length - 1]] : values
            }
          },
          dropdownClassName: dropdownCls,
          onSearch: handleSearch,
          onChange: handleChange,
          onInputKeyDown: (event) => {
            // ant-design bug, 按下回车后会将重复字段删除。see：https://github.com/ant-design/ant-design/issues/20198
            const dom = event.target as HTMLInputElement
            if (
              event.key === 'Enter' &&
              dom.value &&
              unref(selected).find((item) => item.label === dom.value || item.value === dom.value)
            ) {
              // 阻止删除已存在的 tag
              event.stopPropagation()
              triggerEvent(dom, 'blur')
            }
          },
        }
      }

      return defaultValues
    })

    return () => {
      return (
        <Select class="ta-select-pro" ref={selectRef} {...unref(bindValues)}>
          {{
            tagRender: (tag) => {
              const isAddOptions = !unref(options).find((o) =>
                o[getDataFromFieldNames('label')].includes(tag.label)
              )
              return (
                <Tooltip placement="top" title={tag.label}>
                  <span
                    class={`ant-select-selection-item ${
                      isAddOptions ? 'ant-select-selection-item--added' : ''
                    }`}
                  >
                    <span class="ant-select-selection-item-content">{tag.label}</span>
                    <span
                      class="ant-select-selection-item-remove"
                      unselectable="on"
                      aria-hidden="true"
                      style="user-select: none; margin-right: 4px;"
                      onClick={() => handleCopy(tag)}
                    >
                      <Icon icon="ant-design:copy-outlined" size="14" />
                    </span>
                    <span
                      class="ant-select-selection-item-remove"
                      unselectable="on"
                      aria-hidden="true"
                      style="user-select: none"
                      onClick={tag.onClose}
                    >
                      <Icon icon="ant-design:close-outlined" size="12" />
                    </span>
                  </span>
                </Tooltip>
              )
            },
            ...slots,
          }}
        </Select>
      )
      // return unref(isEnabledAdd) ? (
      //   <Select
      //     class="ta-select-pro ta-select-pro--multi-mode"
      //     ref={selectRef}
      //     {...unref(bindValues)}
      //   >
      //     {{
      //       tagRender: (tag) => {
      //         const isAddOptions = !unref(options).find((o) =>
      //           o[getDataFromFieldNames('label')].includes(tag.label)
      //         )
      //         return (
      //           <Tooltip placement="top" title={tag.label}>
      //             <span
      //               class={`ant-select-selection-item ${
      //                 isAddOptions ? 'ant-select-selection-item--added' : ''
      //               }`}
      //             >
      //               <span class="ant-select-selection-item-content">{tag.label}</span>
      //               <span
      //                 class="ant-select-selection-item-remove"
      //                 unselectable="on"
      //                 aria-hidden="true"
      //                 style="user-select: none; margin-right: 4px;"
      //                 onClick={() => handleCopy(tag)}
      //               >
      //                 <Icon icon="ant-design:copy-outlined" size="14" />
      //               </span>
      //               <span
      //                 class="ant-select-selection-item-remove"
      //                 unselectable="on"
      //                 aria-hidden="true"
      //                 style="user-select: none"
      //                 onClick={tag.onClose}
      //               >
      //                 <Icon icon="ant-design:close-outlined" size="12" />
      //               </span>
      //             </span>
      //           </Tooltip>
      //         )
      //       },
      //       ...slots,
      //     }}
      //   </Select>
      // ) : (
      //   <Select class="ta-select-pro" {...unref(bindValues)} />
      // )
    }
  },
})
