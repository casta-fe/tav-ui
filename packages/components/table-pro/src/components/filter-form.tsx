import { computed, defineComponent, nextTick, reactive, ref, unref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Badge } from 'ant-design-vue'
import { merge } from 'lodash-es'
import Button from '@tav-ui/components/button'
import BasicForm from '@tav-ui/components/form'
import { useForm } from '@tav-ui/components/form/src/hooks/useForm'
import BasicModal from '@tav-ui/components/modal'
import { useModal } from '@tav-ui/components/modal/src/hooks/useModal'
import { useWindowSizeFn } from '@tav-ui/hooks/event/useWindowSizeFn'
import { tavI18n } from '@tav-ui/locales'
import { isNullOrUnDef } from '@tav-ui/utils'
import { CamelCaseToCls, ComponentFilterFormName } from '../const'
import { useTableContext } from '../hooks/useTableContext'
import type { PropType, Ref, Slots } from 'vue'
import type { FormSchema } from '@tav-ui/components/form/src/types/form'
import type { TableProInstance } from '../types'
import type { TableProFilterFormConfig } from '../typings'
const ComponentPrefixCls = CamelCaseToCls(ComponentFilterFormName)

const props = {
  config: {
    type: Object as PropType<TableProFilterFormConfig>,
  },
  tableRef: {
    type: Object as PropType<Ref<TableProInstance | null>>,
  },
  tableSlots: {
    type: Object as PropType<Slots>,
  },
  filterExclusion: {
    type: Boolean,
    default: true,
  },
  filterModalClassName: { type: String, default: '' },
}

export default defineComponent({
  name: ComponentFilterFormName,
  props,
  setup(props, { expose }) {
    const { tableEmitter, deleteAllCheckboxCache } = useTableContext()

    const state = reactive({
      visible: false,
      dialogStyle: {
        top: '0',
        left: '0',
        width: '0',
        margin: '0',
      },
      inputForm: {},
      pannelForm: {},
      currentFilter: {},
      choosedNum: 0,
    })

    /** 筛选条件变化 */
    watch(
      () => JSON.stringify(state.currentFilter),
      async (curcurrentFilter, precurrentFilter) => {
        if (curcurrentFilter !== precurrentFilter) {
          await deleteAllCheckboxCache({
            deleteByPage: false,
          })
          await nextTick()
        }
      }
    )

    // unref 中使用 ?? 会进入死循环，对象型 prop 一定要赋值兜底
    const defaultInputFormSchema: FormSchema = {
      field: 'searchValue',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: false,
        'enter-button': true,

        /**
         * 改用 keydown 以及搜索按钮实现将 search 与特定组件解耦
         * 1. input/inputsearch 默认组件劫持回车以及按钮点击事件完成筛选
         * 2. 其他组件，如果组件内部有自己的回车逻辑则回车事件不做劫持，只做搜索按钮的点击劫持完成筛选
         * 3. 其他情况碰到再讨论
         */
        onSearch: undefined,
        onKeyDown: undefined,
        onInputKeyDown: undefined,
        onKeydown: useDebounceFn(unifiedInputTrigger, 300),
      },
    }

    const inputFormSchema = computed(() => {
      let inputFormSchema = {}

      if (props.config?.inputForm) {
        if (
          // 因为这里定死是 inputSearch，但是开发中可能是inputSearch但是会重写onSearch方法，所以这里需要merge
          // 方便投管迁移，兼容 Omit<FormSchema, "label" | "component"> 写法
          !(props.config?.inputForm as any).component ||
          ['Input', 'InputSearch'].includes((props.config?.inputForm as any).component)
        ) {
          inputFormSchema = merge(defaultInputFormSchema, unref(props.config?.inputForm))
        } else {
          inputFormSchema = unref(props.config?.inputForm)
        }
      }
      return [inputFormSchema as FormSchema]
    })

    const pannelFormSchema = computed(() => props.config?.pannelForm ?? [])

    const tableFilterParams = computed(() => JSON.stringify(state.currentFilter))

    // modal内的form需要先判断是否在页面中加载，点击modal后form才会注册
    const inputFormRef = ref(null)
    const isInputFormRegister = computed(() => {
      return !!inputFormRef.value
    })
    const pannelFormRef = ref(null)
    const isPannelFormRegister = computed(() => {
      return !!pannelFormRef.value
    })

    const isInputFormShow = computed(() => {
      return props.config?.inputForm
    })

    const isPannelFormShow = computed(() => {
      return props.config?.pannelForm || props.config?.pannelForm?.length
    })

    const isFilterFormShow = computed(() => {
      return props.config?.enabled
    })

    async function unifiedInputTrigger(event: KeyboardEvent | MouseEvent) {
      event.stopPropagation()
      event.preventDefault()

      if (event instanceof KeyboardEvent) {
        event.key === 'Enter' && inputFormSubmit()
      } else {
        inputFormSubmit()
      }
    }

    // 处理 inputForm
    async function inputFormSubmit() {
      state.inputForm = inputFormGetFieldsValue()
      if (!Object.keys(state.inputForm).length) return

      // 如果设置参数互斥那么只能用关键字搜索，否则是关键字加表单内容
      if (props.filterExclusion) {
        state.currentFilter = {}
        state.currentFilter = state.inputForm
        // 置空 pannelform
        unref(isPannelFormRegister) && pannelFormResetFields()
        state.visible = false
        state.choosedNum = 0
        state.pannelForm = {}
      } else {
        if (unref(isPannelFormRegister)) {
          const _res = await validatePannelForm()
          const res = JSON.parse(JSON.stringify(_res))
          state.pannelForm = res
        }
        state.currentFilter = { ...state.inputForm, ...state.pannelForm }
      }
      // console.log(state.currentFilter)
      // 发送请求
      unref(props.tableRef)?.commitProxy('query', {
        filter: { ...state.currentFilter },
        model: { page: 1 },
      })
      tableEmitter.emit('table-pro:filter-form-submit', { filter: { ...state.currentFilter } })
    }

    const [
      inputFormRegister,
      { resetFields: inputFormResetFields, getFieldsValue: inputFormGetFieldsValue },
    ] = useForm({
      labelWidth: 120,
      schemas: inputFormSchema,
      getPopupContainer: props.config?.getPopupContainer,
      showActionButtonGroup: false,
    })

    const [pannelFormModalRegister, { openModal, closeModal: closePannelFormModal }] = useModal()

    const openPannelFormModal = () => {
      fixPannelFormModalPos()
      openModal()
    }

    const pannelFormModalVisible = (visible: boolean) => {
      state.visible = visible
      if (visible) {
        nextTick(() => pannelFormSetFieldsValue(state.pannelForm))
      }
    }

    const fixPannelFormModalPos = () => {
      const dom: HTMLDivElement | null = pannelContainerRef.value
      const operationDom: HTMLDivElement | null = operationRef.value
      if (dom && operationDom) {
        const { bottom = 0 } = operationDom.getBoundingClientRect()
        const { width = 0, left = 0 } = dom.getBoundingClientRect()
        state.dialogStyle.top = `${bottom}px`
        state.dialogStyle.left = `${left}px`
        state.dialogStyle.width = `${width}px`
        state.dialogStyle.margin = `${0}px`
      }
    }

    // 窗口大小改变修正宽度
    const debounceFixPannelFormModalPos = useDebounceFn(fixPannelFormModalPos, 100)
    useWindowSizeFn(debounceFixPannelFormModalPos)

    const pannelContainerRef = ref<any>(null)
    const operationRef = ref<any>(null)
    const customerActionRef = ref<any>(null)
    tableEmitter.on('table-pro:dom-ready', async ({ table, operation, action }) => {
      pannelContainerRef.value = table
      operationRef.value = operation
      customerActionRef.value = action
    })

    const [
      pannelFormRegister,
      {
        validate: pannelFormValidate,
        resetFields: pannelFormResetFields,
        setFieldsValue: pannelFormSetFieldsValue,
      },
    ] = useForm({
      // layout: "vertical",
      labelWidth: 110,
      schemas: pannelFormSchema,
      showActionButtonGroup: false,
    })

    async function validatePannelForm() {
      try {
        return await pannelFormValidate()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('not passing', error)
      }
    }

    async function handlePannelFormSubmit() {
      const _res = await validatePannelForm()
      const res = JSON.parse(JSON.stringify(_res))
      state.visible = false
      state.pannelForm = res
      const filterWithoutShowSchemas = pannelFormSchema.value.filter(
        (s) => typeof s.show === 'undefined'
      )
      state.choosedNum = Object.keys(res)
        .filter((field) => !!filterWithoutShowSchemas.find((s: FormSchema) => s.field === field))
        .reduce((result, cur) => {
          if (
            !isNullOrUnDef(res[cur]) &&
            JSON.stringify(res[cur]) !== '[]' &&
            JSON.stringify(res[cur]) !== '["",""]' &&
            JSON.stringify(res[cur]) !== '[null,""]' &&
            JSON.stringify(res[cur]) !== '["",null]' &&
            JSON.stringify(res[cur]) !== '{}' &&
            res[cur] !== '' &&
            JSON.stringify(res[cur])
          ) {
            result++
          }
          return result
        }, 0)
      if (props.filterExclusion) {
        state.currentFilter = {}
        state.currentFilter = state.pannelForm
        // 置空 inputform
        unref(isInputFormRegister) && inputFormResetFields()
        state.inputForm = {}
      } else {
        state.inputForm = inputFormGetFieldsValue()
        state.currentFilter = { ...state.inputForm, ...state.pannelForm }
      }
      // console.log(state.currentFilter)
      // 发送请求
      unref(props.tableRef)?.commitProxy('query', {
        filter: { ...state.currentFilter },
        model: { page: 1 },
      })
      tableEmitter.emit('table-pro:filter-form-submit', { filter: { ...state.currentFilter } })
      closePannelFormModal()
    }

    async function handleInputFormResetFields(withRequest = true) {
      await inputFormResetFields()
      await nextTick()
      state.inputForm = inputFormGetFieldsValue()
      state.currentFilter = { ...state.inputForm, ...state.pannelForm }
      if (withRequest) {
        unref(props.tableRef)?.commitProxy('query', {
          filter: { ...state.currentFilter },
          model: { page: 1 },
        })
      }
      tableEmitter.emit('table-pro:filter-form-submit', { filter: { ...state.currentFilter } })
    }

    async function handlePannelFormResetFields(withRequest = true) {
      if (!props.filterExclusion) {
        await handleInputFormResetFields(false)
      }
      await pannelFormResetFields()
      await nextTick()
      state.visible = false
      state.choosedNum = 0
      state.pannelForm = {}
      state.currentFilter = { ...state.inputForm }
      if (withRequest) {
        unref(props.tableRef)?.commitProxy('query', {
          filter: { ...state.currentFilter },
          model: { page: 1 },
        })
      }
      closePannelFormModal()
      tableEmitter.emit('table-pro:filter-form-submit', { filter: { ...state.currentFilter } })
    }

    watch(
      () => JSON.stringify(props.config),
      (config, prevConfig) => {
        if (config && config !== prevConfig) {
          // input/pannel 都有可能是异步赋值所以这里需要判断rendered
          nextTick(() => {
            tableEmitter.emit('table-pro:filter-form-rendered')
          })
        }
      },
      { immediate: true }
    )

    expose({
      filterParams: tableFilterParams,
      resetFilterInput: handleInputFormResetFields,
      resetFilterPannel: handlePannelFormResetFields,
    })

    return () => {
      return unref(isFilterFormShow) ? (
        <div class={ComponentPrefixCls} data-filter-params={tableFilterParams.value}>
          {/* <>filterExclusion:{props.filterExclusion ? '互斥' : '不互斥'}</> */}
          {unref(isInputFormShow) ? (
            <div class={`${ComponentPrefixCls}-input`}>
              <BasicForm
                ref={inputFormRef}
                class={`${ComponentPrefixCls}-input-inner`}
                onRegister={inputFormRegister}
              />
              <button
                class="ant-btn ant-btn-primary ant-input-search-button"
                type="button"
                onClick={useDebounceFn(unifiedInputTrigger, 300)}
              >
                <span role="img" aria-label="search" class="anticon anticon-search">
                  <svg
                    focusable="false"
                    class=""
                    data-icon="search"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="64 64 896 896"
                  >
                    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                  </svg>
                </span>
              </button>
            </div>
          ) : null}
          {unref(isPannelFormShow) ? (
            <>
              <Button
                class={`${ComponentPrefixCls}-pannel-activator`}
                type={'primary'}
                preIcon={'material-symbols:manage-search'}
                iconSize={16}
                postIcon={
                  state.visible ? 'ant-design:caret-up-outlined' : 'ant-design:caret-down-outlined'
                }
                onClick={openPannelFormModal}
              >
                <div style="position: relative; display: inline-flex; margin: 0 4px">
                  {tavI18n('Tav.tablePro.filter.1')}
                  {state.choosedNum > 0 ? (
                    <Badge count={state.choosedNum} numberStyle={{ backgroundColor: '#52c41a' }} />
                  ) : null}
                </div>
              </Button>
              <BasicModal
                title={tavI18n('Tav.tablePro.filter.1')}
                wrapClassName={props.filterModalClassName}
                style={state.dialogStyle}
                width={state.dialogStyle.width}
                maskStyle={{ background: 'rgba(0,0,0,0)' }}
                maskClosable
                onRegister={pannelFormModalRegister}
                onVisible-change={pannelFormModalVisible}
                destroyOnClose={true}
              >
                {{
                  default: () => (
                    <BasicForm
                      ref={pannelFormRef}
                      class={`${ComponentPrefixCls}-pannel-form`}
                      onRegister={pannelFormRegister}
                    />
                  ),
                  footer: () => (
                    <>
                      <Button onClick={handlePannelFormResetFields}>
                        {tavI18n('Tav.common.resetText')}
                      </Button>
                      <Button type={'primary'} onClick={handlePannelFormSubmit}>
                        {tavI18n('Tav.common.okText')}
                      </Button>
                    </>
                  ),
                }}
              </BasicModal>
            </>
          ) : null}
        </div>
      ) : (
        <div class={ComponentPrefixCls} data-filter-params={tableFilterParams.value}>
          {props.tableSlots?.filterForm?.()}
        </div>
      )
    }
  },
})
