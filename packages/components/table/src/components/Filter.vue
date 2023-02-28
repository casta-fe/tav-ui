<template>
  <div class="ta-basic-table-filter flex align-center" :data-filter-params="tableFilterParams">
    是否互斥：{{ filterExclusion }}
    <BasicForm
      v-if="isInputFormShow"
      ref="inputFormRef"
      class="filter-input-form"
      @register="inputFormRegister"
    />
    <Button
      v-if="isPannelFormShow"
      class="filter-pannel-form-modal-activator"
      type="primary"
      pre-icon="ant-design:filter-outlined"
      :post-icon="state.visible ? 'ant-design:caret-up-outlined' : 'ant-design:caret-down-outlined'"
      @click="openPannelFormModal"
    >
      <div style="position: relative; display: inline-flex; margin: 0 8px">
        更多筛选
        <Badge
          v-if="state.choosedNum > 0"
          :count="state.choosedNum"
          :number-style="{ backgroundColor: '#52c41a' }"
        />
      </div>
    </Button>
    <BasicModal
      title="更多筛选"
      :style="state.dialogStyle"
      :width="state.dialogStyle.width"
      :mask-style="{ background: 'rgba(0,0,0,0)' }"
      mask-closable
      @register="pannelFormModalRegister"
      @visible-change="pannelFormModalVisible"
    >
      <BasicForm ref="pannelFormRef" class="filter-pannel-form" @register="pannelFormRegister" />
      <template #footer>
        <Button type="primary" @click="handlePannelFormSubmit">确定</Button>
        <Button @click="handlePannelFormResetFields">重置</Button>
      </template>
    </BasicModal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, nextTick, reactive, ref, unref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Badge } from 'ant-design-vue'
import { merge } from 'lodash-es'
import Button from '@tav-ui/components/button'
import BasicForm from '@tav-ui/components/form'
import { useForm } from '@tav-ui/components/form/src/hooks/useForm'
import BasicModal from '@tav-ui/components/modal'
import { useModal } from '@tav-ui/components/modal/src/hooks/useModal'
import { useWindowSizeFn } from '@tav-ui/hooks/event/useWindowSizeFn'
import type { FilterForms, TableActionType } from '../types/table'
// import { BasicForm, FormSchema, useForm } from "@tav-ui/components/Form";
import type { FormSchema } from '@tav-ui/components/form/src/types/form'
import type { Emitter } from '@tav-ui/utils/mitt'
import type { PropType } from 'vue'

const props = {
  forms: {
    type: Object as PropType<Partial<FilterForms>>,
    default: () => undefined,
  },
  tableAction: {
    type: Object as PropType<TableActionType>,
    default: () => undefined,
  },
  filterExclusion: {
    type: Boolean,
    default: true,
  },
}

export default defineComponent({
  name: 'TableFilter',
  components: { Badge, Button, BasicForm, BasicModal },
  props,
  setup(props) {
    const tableEmitter = inject('tableEmitter') as Emitter
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
    let inputFormSchema = {}

    if (props.forms?.inputForm) {
      // 因为这里定死是 inputSearch，但是开发中可能是inputSearch但是会重写onSearch方法，所以这里需要merge
      if (
        // 方便投管迁移，兼容 Omit<FormSchema, "label" | "component"> 写法
        !(props.forms?.inputForm as any).component ||
        (props.forms?.inputForm as any).component === 'InputSearch'
      ) {
        inputFormSchema = merge(defaultInputFormSchema, unref(props.forms?.inputForm))
      } else {
        // 如果开发传入的 component 不是 inputseacrh，那么直接按照传入的schema生成，不merge
        inputFormSchema = unref(props.forms?.inputForm)
      }
    }
    const pannelFormSchema = props.forms?.pannelForm ?? []

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
      return props.forms?.inputForm
    })

    const isPannelFormShow = computed(() => {
      return props.forms?.pannelForm || props.forms?.pannelForm?.length
    })

    // 处理 inputForm
    async function inputFormSubmit(value: string) {
      if (!value) inputFormResetFields()
      state.inputForm = inputFormGetFieldsValue()
      if (props.filterExclusion) {
        // input查询与更多筛选不能同时存在, 所以先置空接口参数对象，再置空表单
        state.currentFilter = {}
        state.currentFilter = state.inputForm
        // 置空 pannelform
        unref(isPannelFormRegister) && pannelFormResetFields()
        state.visible = false
        state.choosedNum = 0
        state.pannelForm = {}
      } else {
        const _res = await validatePannelForm()
        const res = JSON.parse(JSON.stringify(_res))
        state.pannelForm = res
        state.currentFilter = { ...state.inputForm, ...state.pannelForm }
      }
      console.log(state.currentFilter)
      // 发送请求
      props.tableAction?.reload({
        searchInfo: {
          filter: { ...state.currentFilter },
          model: { page: 1 },
        },
      })
      tableEmitter.emit('table:filter-submit', { filter: { ...state.currentFilter } })
    }

    const inputForm: FormSchema[] = [inputFormSchema as FormSchema]

    const [
      inputFormRegister,
      { resetFields: inputFormResetFields, getFieldsValue: inputFormGetFieldsValue },
    ] = useForm({
      labelWidth: 120,
      schemas: inputForm,
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
    tableEmitter.on('table:fetch-refs', async ({ table }) => {
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
      //filterExclusion为true时候 input查询与更多筛选不能同时存在, 所以先置空接口参数对象，再置空表单

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
      console.log({ ...state.currentFilter })
      // 发送请求
      props.tableAction?.reload({
        searchInfo: {
          filter: { ...state.currentFilter },
          model: { page: 1 },
        },
      })
      tableEmitter.emit('table:filter-submit', { filter: { ...state.currentFilter } })
      closePannelFormModal()
    }

    function handlePannelFormResetFields() {
      pannelFormResetFields()
      state.visible = false
      state.choosedNum = 0
      state.pannelForm = {}
      state.currentFilter = { ...state.inputForm }
      props.tableAction?.reload({
        searchInfo: {
          filter: { ...state.currentFilter },
          model: { page: 1 },
        },
      })
      closePannelFormModal()
      tableEmitter.emit('table:filter-submit', { filter: { ...state.currentFilter } })
    }

    return {
      state,
      tableFilterParams,
      inputFormRef,
      pannelFormRef,
      isInputFormShow,
      isPannelFormShow,
      inputFormRegister,
      pannelFormModalRegister,
      openPannelFormModal,
      pannelFormModalVisible,
      pannelFormRegister,
      handlePannelFormSubmit,
      handlePannelFormResetFields,
      pannelFormSetFieldsValue,
    }
  },
})
</script>
