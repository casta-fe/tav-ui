import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, unref, watch } from 'vue'
import { Dropdown, Empty, Input, Menu, MenuItem, Spin } from 'ant-design-vue'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { getPopupContainer } from '@tav-ui/utils/basic'
import type { PropType } from 'vue'

const { Search } = Input

const { createMessage } = useMessage()

type Result<T = any> = {
  data: T
}
type Recordable<T = any> = Record<string, T>
type LabelValueOption<T = any, K = any> = { label: string; value: T } & Recordable<K>

export type SearchableApiSelectBasicProps = {
  api: (keyword: string, page?: string | number) => Promise<Result<Recordable>>
  canInputRef?: boolean | Record<string, any>
  labelField?: string
  valueField?: string
  keyField?: string
  panelMaxHeight?: string

  value?: [string, LabelValueOption<any, any>]
  onChange?: (parame?: [string, LabelValueOption<string, string>]) => void
  getPopupContainer?: typeof getPopupContainer
  onSelect?: (value: string, option: LabelValueOption<string, string>) => void
}

export default defineComponent({
  name: 'SearchableApiSelect',
  components: { Search, Dropdown },
  props: {
    api: {
      type: Function as PropType<SearchableApiSelectBasicProps['api']>,
      required: true,
    },
    value: Array as unknown as PropType<SearchableApiSelectBasicProps['value']>,
    canInputRef: { type: [Object, Boolean], default: false },
    getPopupContainer: Function as PropType<SearchableApiSelectBasicProps['getPopupContainer']>,
    labelField: {
      type: String,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'id',
    },
    keyField: {
      type: String,
      default: 'creditCode',
    },
    panelMaxHeight: {
      type: String,
      default: '200px',
    },
    onSelect: Function as PropType<SearchableApiSelectBasicProps['onSelect']>,
    onChange: Function as PropType<SearchableApiSelectBasicProps['onChange']>,
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const selfRef = ref<{ $el: HTMLElement }>()

    const state = reactive({
      page: 1,
      value: '',
      isEnter: false,
      visible: false,
      loading: false,
      loadMoreLoading: false,
      options: [] as LabelValueOption[],
    })

    const emitValue = (empty = false) => {
      if (empty) {
        emit('change', undefined)
        return
      }
      // 空字符串不触发
      if (!state.value) return
      if (unref(props.canInputRef)) {
        emit('change', [
          state.value,
          {
            label: state.value,
            value: state.value,
            key: state.value,
          },
        ])
        props.onSelect?.(state.value, {
          label: state.value,
          value: state.value,
          key: state.value,
        })
      }
    }

    const onMouseLeave = () => {
      state.isEnter = false
    }
    const onMouseEnter = () => {
      state.isEnter = true
    }

    /**
     * 请求options ***(覆盖)***
     * @param keyword 天眼查搜索词
     */
    const fetchCurrentKeyword = async (keyword = state.value) => {
      if (keyword.length < 2) {
        createMessage.warn('请至少输入两个字进行搜索')
        return Promise.reject()
      }

      state.loading = true
      await props
        .api(keyword, 1)
        .then(({ data }) => {
          state.options = data.map((el) => ({
            ...el,
            label: el[props.labelField],
            value: el[props.valueField],
            key: el[props.keyField],
          }))
        })
        .catch(() => {
          // 5001 无数据 等
          state.options = []
        })
        .finally(() => (state.loading = false))
    }

    onMounted(() => {
      // 移除鼠标后, 延时关闭选项弹窗
      selfRef.value!.$el.addEventListener('mouseleave', onMouseLeave)
      // 移除鼠标又移入后, 取消关闭
      selfRef.value!.$el.addEventListener('mouseenter', onMouseEnter)

      watch(
        () => props.value,
        (v) => {
          if (!v) {
            // if (null === v) {
            //   emitValue(true);
            // }
            return
          } else if (!Array.isArray(v)) return

          // 下面为天眼查
          state.value = v[1].label
          if (!unref(props.canInputRef)) {
            if (!attrs.disabled && !state.options.length && state.value.length >= 2)
              fetchCurrentKeyword()
          }
        },
        {
          immediate: true,
        }
      )

      watch(
        () => unref(props.canInputRef),
        (v) => {
          // 必须走天眼查 -> 可自定义输入
          if (v) {
            emitValue()
            if (state.value.length < 2) {
              return
            }
          } else {
            emitValue(true)
          }

          if (state.options.length === 0)
            fetchCurrentKeyword().then(() => {
              if (!state.visible) {
                state.visible = true
              }
            })
        }
      )
    })

    onBeforeUnmount(() => {
      selfRef.value!.$el.removeEventListener('mouseleave', onMouseLeave)
      selfRef.value!.$el.removeEventListener('mouseenter', onMouseEnter)
    })

    return () => (
      <div>
        <Search
          ref={selfRef}
          {...attrs}
          loading={state.loading}
          onFocus={() => {
            if (state.options.length) {
              state.visible = true
            }
          }}
          onBlur={() => {
            if (state.visible && !state.isEnter) state.visible = false

            if (unref(props.canInputRef)) {
              emitValue()
              return
            }
            if (state.options.length === 0 && state.value.length >= 2) {
              fetchCurrentKeyword().then(() => {
                if (!state.visible) {
                  state.visible = true
                }
              })
            }
          }}
          allowClear
          value={state.value}
          onUpdate:value={(v) => (state.value = v)}
          // enterButton
          onChange={() => {
            // 可自己输入
            if (unref(props.canInputRef)) {
              emitValue()
              /**
               * 仅天眼查模式下,触发 "required" 校验
               * 仅当用户点击 DropDown 内的 MenuItem 选择天眼查的一条数据, emit("change", ...)
               */
            } else {
              emitValue(true)
            }
          }}
          onSearch={(keyword) => {
            // 直接点搜索或点击清除按钮
            if (!keyword) {
              emitValue(true)
              return
            }

            state.page = 1

            fetchCurrentKeyword(keyword).then(() => (state.visible = true))
          }}
        />
        <Dropdown
          visible={state.visible}
          getPopupContainer={props.getPopupContainer || getPopupContainer}
        >
          {{
            default: () => <div></div>,
            overlay: () => (
              <Menu style="margin: 0 3px">
                {state.loading ? (
                  <div style="text-align: center">
                    <Spin />
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: props.panelMaxHeight,
                      overflowY: 'auto' as const,
                      textAlign: 'left' as const,
                      width:
                        selfRef.value?.$el &&
                        `${parseInt(window.getComputedStyle(selfRef.value.$el).width) - 6}px`,
                    }}
                    onMouseleave={onMouseLeave}
                    onMouseenter={onMouseEnter}
                  >
                    {state.options.map((option, i) => (
                      <MenuItem
                        key={i}
                        title={option.label}
                        onClick={() => {
                          state.value = option.label
                          emit('change', [option.value, option])
                          props.onSelect?.(option.value, option as LabelValueOption<string, string>)
                          state.visible = false
                        }}
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          ...(option.label === state.value
                            ? {
                                color: '#555555',
                                fontWeight: '600',
                                backgroundColor: '#f0f5ff',
                              }
                            : {}),
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                    {state.options.length ? (
                      <MenuItem key={2147483647}>
                        {state.loadMoreLoading ? (
                          <div style="text-align: center">
                            <Spin />
                          </div>
                        ) : (
                          <div
                            style="text-align: center"
                            onClick={() => {
                              state.page++
                              state.loadMoreLoading = true
                              props
                                .api(state.value, state.page)
                                .then(({ data }) => {
                                  state.options.push(
                                    ...data.map((el) => ({
                                      ...el,
                                      label: el[props.labelField],
                                      value: el[props.valueField],
                                      key: el[props.keyField],
                                    }))
                                  )
                                })
                                .finally(() => {
                                  state.loadMoreLoading = false
                                })
                            }}
                          >
                            <a> 加载更多</a>
                          </div>
                        )}
                      </MenuItem>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </div>
                )}
              </Menu>
            ),
          }}
        </Dropdown>
      </div>
    )
  },
})
