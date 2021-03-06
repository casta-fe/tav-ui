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
}

export default defineComponent({
  name: ComponentFilterFormName,
  props,
  setup(props) {
    const { tableEmitter } = useTableContext()

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

    // unref 中使用 ?? 会进入死循环，对象型 prop 一定要赋值兜底
    const defaultInputFormSchema: FormSchema = {
      field: 'searchValue',
      label: '',
      component: 'InputSearch',
      componentProps: {
        placeholder: '请输入',
        allowClear: false,
        'enter-button': true,
        onSearch: useDebounceFn(inputFormSubmit, 300),
      },
    }

    const inputFormSchema = computed(() => {
      let inputFormSchema = {}

      if (props.config?.inputForm) {
        // 因为这里定死是 inputSearch，但是开发中可能是inputSearch但是会重写onSearch方法，所以这里需要merge
        if (
          // 方便投管迁移，兼容 Omit<FormSchema, "label" | "component"> 写法
          !(props.config?.inputForm as any).component ||
          (props.config?.inputForm as any).component === 'InputSearch'
        ) {
          inputFormSchema = merge(defaultInputFormSchema, unref(props.config?.inputForm))
        } else {
          // 如果开发传入的 component 不是 inputseacrh，那么直接按照传入的schema生成，不merge
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

    // 处理 inputForm
    function inputFormSubmit(value: string) {
      if (!value) inputFormResetFields()
      state.inputForm = inputFormGetFieldsValue()
      // input查询与更多筛选不能同时存在, 所以先置空接口参数对象，再置空表单
      state.currentFilter = {}
      state.currentFilter = state.inputForm
      // 置空 pannelform
      unref(isPannelFormRegister) && pannelFormResetFields()
      state.visible = false
      state.choosedNum = 0
      state.pannelForm = {}
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
      if (dom) {
        const { top = 0, width = 0, left = 0 } = dom.getBoundingClientRect()
        state.dialogStyle.top = `${top}px`
        state.dialogStyle.left = `${left}px`
        state.dialogStyle.width = `${width}px`
        state.dialogStyle.margin = `${0}px`
      }
    }

    // 窗口大小改变修正宽度
    const debounceFixPannelFormModalPos = useDebounceFn(fixPannelFormModalPos, 100)
    useWindowSizeFn(debounceFixPannelFormModalPos)

    const pannelContainerRef = ref<any>(null)
    tableEmitter.on('table-pro:dom-ready', async ({ table }) => {
      pannelContainerRef.value = table
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
      state.choosedNum = Object.keys(res).reduce((result, cur) => {
        if (
          res[cur] !== undefined &&
          res[cur] !== null &&
          JSON.stringify(res[cur]) !== '[]' &&
          JSON.stringify(res[cur]) !== '{}' &&
          res[cur] &&
          JSON.stringify(res[cur])
        )
          result++
        return result
      }, 0)
      // input查询与更多筛选不能同时存在, 所以先置空接口参数对象，再置空表单
      state.currentFilter = {}
      state.currentFilter = state.pannelForm
      // 置空 inputform
      unref(isInputFormRegister) && inputFormResetFields()
      state.inputForm = {}
      // 发送请求
      unref(props.tableRef)?.commitProxy('query', {
        filter: { ...state.currentFilter },
        model: { page: 1 },
      })
      tableEmitter.emit('table-pro:filter-form-submit', { filter: { ...state.currentFilter } })
      closePannelFormModal()
    }

    function handlePannelFormResetFields() {
      pannelFormResetFields()
      state.visible = false
      state.choosedNum = 0
      state.pannelForm = {}
      state.currentFilter = { ...state.inputForm }
      unref(props.tableRef)?.commitProxy('query', {
        filter: { ...state.currentFilter },
        model: { page: 1 },
      })
      closePannelFormModal()
      tableEmitter.emit('table-pro:filter-form-submit', { filter: { ...state.currentFilter } })
    }

    watch(
      () => props.config,
      (config, prevConfig) => {
        // if (config && JSON.stringify(config) !== JSON.stringify(prevConfig))
        // 这样子只能判断异步schema同步不能进行了
        if (config) {
          // input/pannel 都有可能是异步赋值所以这里需要判断rendered
          nextTick(() => {
            tableEmitter.emit('table-pro:filter-form-rendered')
          })
        }
      }
    )

    return () => {
      return unref(isFilterFormShow) ? (
        <div class={ComponentPrefixCls} data-filter-params={tableFilterParams}>
          {unref(isInputFormShow) ? (
            <BasicForm
              ref={inputFormRef}
              class={`${ComponentPrefixCls}-input`}
              onRegister={inputFormRegister}
            />
          ) : null}
          {unref(isPannelFormShow) ? (
            <>
              <Button
                class={`${ComponentPrefixCls}-pannel-activator`}
                type={'primary'}
                preIcon={'ant-design:filter-outlined'}
                postIcon={
                  state.visible ? 'ant-design:caret-up-outlined' : 'ant-design:caret-down-outlined'
                }
                onClick={openPannelFormModal}
              >
                <div style="position: relative; display: inline-flex; margin: 0 8px">
                  更多筛选
                  {state.choosedNum > 0 ? (
                    <Badge count={state.choosedNum} numberStyle={{ backgroundColor: '#52c41a' }} />
                  ) : null}
                </div>
              </Button>
              <BasicModal
                title={'更多筛选'}
                style={state.dialogStyle}
                width={state.dialogStyle.width}
                maskStyle={{ background: 'rgba(0,0,0,0)' }}
                maskClosable
                onRegister={pannelFormModalRegister}
                onVisible-change={pannelFormModalVisible}
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
                      <Button type={'primary'} onClick={handlePannelFormSubmit}>
                        确定
                      </Button>
                      <Button onClick={handlePannelFormResetFields}>重置</Button>
                    </>
                  ),
                }}
              </BasicModal>
            </>
          ) : null}
        </div>
      ) : (
        props.tableSlots?.filterForm?.()
      )
    }
  },
})
