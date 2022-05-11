<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, unref, watch } from 'vue'
import { Form, Row } from 'ant-design-vue'
import { dateUtil } from '@tav-ui/utils/dateUtil'
import { deepMerge } from '@tav-ui/utils/basic'
import { useModalContext } from '@tav-ui/components/modal/src/hooks/useModalContext'
import FormAction from './components/FormAction.vue'
import FormItem from './components/FormItem.vue'
import { dateItemType } from './helper'
import useAdvanced from './hooks/useAdvanced'
import { useAutoFocus } from './hooks/useAutoFocus'
import { createFormContext } from './hooks/useFormContext'
import { useFormEvents } from './hooks/useFormEvents'
import { useFormValues } from './hooks/useFormValues'
import { formProps } from './props'
import type { Ref } from 'vue'
import type { FormActionType, FormProps, FormSchema } from './types/form'
import type { AdvanceState } from './types/hooks'
// import { cloneDeep } from 'lodash-es';
type Recordable<T = any> = Record<string, T>
type Nullable<T> = T | null
export default defineComponent({
  name: 'TaForm',
  components: { FormItem, Form, Row, FormAction },
  props: formProps,
  emits: ['advanced-change', 'reset', 'submit', 'register'],
  setup(props, { emit, attrs }) {
    const formModel = reactive<Recordable>({})
    const modalFn = useModalContext()

    const advanceState = reactive<AdvanceState>({
      isAdvanced: true,
      hideAdvanceBtn: false,
      isLoad: false,
      actionSpan: 6,
    })

    const defaultValueRef = ref<Recordable>({})
    const isInitedDefaultRef = ref(false)
    const propsRef = ref({})
    const schemaRef = ref<Nullable<FormSchema[]>>(null)
    const formElRef = ref<Nullable<FormActionType>>(null)

    const prefixCls = 'ta-basic-form'

    // Get the basic configuration of the form
    const getProps = computed((): FormProps => {
      return { ...props, ...unref(propsRef) } as FormProps
    })

    const getFormClass = computed(() => {
      // ::==================== i7eo：更新 ///// start ///// ====================:: //
      const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any)
      let hasEditableFormItemNums = 0
      for (const schema of schemas) {
        if (Reflect.has(schema, 'editable')) hasEditableFormItemNums++
      }

      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact,
          [`${prefixCls}--editable`]: hasEditableFormItemNums > 0,
        },
      ]
      // ::==================== i7eo：更新 ///// end   ///// ====================:: //
    })

    // Get uniform row style and Row configuration for the entire form
    const getRow = computed((): Recordable => {
      const { baseRowStyle = {}, rowProps } = unref(getProps)
      return {
        style: baseRowStyle,
        ...rowProps,
      }
    })

    const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) } as Recordable))

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any)
      for (const schema of schemas) {
        const { defaultValue, component } = schema

        // handle date type
        if (defaultValue && component && dateItemType.includes(component)) {
          if (!Array.isArray(defaultValue)) {
            schema.defaultValue = dateUtil(defaultValue)
          } else {
            const def: moment.Moment[] = []
            defaultValue.forEach((item) => {
              def.push(dateUtil(item))
            })
            schema.defaultValue = def
          }
        }
      }
      if (unref(getProps).showAdvancedButton)
        return schemas.filter((schema) => schema.component !== 'Divider') as FormSchema[]
      else return schemas as FormSchema[]
    })

    const { handleToggleAdvanced } = useAdvanced({
      advanceState,
      emit,
      getProps,
      getSchema,
      formModel,
      defaultValueRef,
    })

    const { handleFormValues, initDefault } = useFormValues({
      getProps,
      defaultValueRef,
      getSchema,
      formModel,
    })

    useAutoFocus({
      getSchema,
      getProps,
      isInitedDefault: isInitedDefaultRef,
      formElRef: formElRef as Ref<FormActionType>,
    })

    const {
      handleSubmit,
      setFieldsValue,
      clearValidate,
      validate,
      validateFields,
      getFieldsValue,
      updateSchema,
      resetSchema,
      appendSchemaByField,
      removeSchemaByFiled,
      resetFields,
      scrollToField,
    } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      defaultValueRef,
      formElRef: formElRef as Ref<FormActionType>,
      schemaRef: schemaRef as Ref<any[]>,
      handleFormValues,
    })

    createFormContext({
      resetAction: resetFields,
      submitAction: handleSubmit,
    })

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps)
        if (!model) return
        setFieldsValue(model)
      },
      {
        immediate: true,
      }
    )

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? [])
      }
    )

    watch(
      () => getSchema.value,
      (schema) => {
        nextTick(() => {
          //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
          modalFn?.redoModalHeight?.()
        })
        if (unref(isInitedDefaultRef)) return

        if (schema?.length) {
          initDefault()
          isInitedDefaultRef.value = true
        }
      }
    )

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps)
    }

    function setFormModel(key: string, value: any) {
      formModel[key] = value
      const { validateTrigger } = unref(getBindValue)
      if (!validateTrigger || validateTrigger === 'change')
        validateFields([key]).catch((_) => {
          // eslint-disable-next-line no-console
          console.warn(_)
        })
    }

    function handleEnterPress(e: KeyboardEvent) {
      const { autoSubmitOnEnter } = unref(getProps)
      if (!autoSubmitOnEnter) return
      if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target as HTMLElement
        if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') handleSubmit()
      }
    }

    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      updateSchema,
      resetSchema,
      setProps,
      removeSchemaByFiled,
      appendSchemaByField,
      clearValidate,
      validateFields,
      validate,
      submit: handleSubmit,
      scrollToField,
    }

    onMounted(() => {
      initDefault()
      emit('register', formActionType)
    })

    return {
      getBindValue,
      handleToggleAdvanced,
      handleEnterPress,
      formModel,
      defaultValueRef,
      advanceState,
      getRow,
      getProps,
      formElRef,
      getSchema,
      formActionType: formActionType as any,
      setFormModel,
      getFormClass,
      getFormActionBindProps: computed((): Recordable => ({ ...getProps.value, ...advanceState })),
      ...formActionType,
    }
  },
})
</script>
<template>
  <Form
    v-bind="getBindValue"
    ref="formElRef"
    :class="getFormClass"
    :model="formModel"
    @keypress.enter="handleEnterPress"
  >
    <Row v-bind="getRow">
      <!-- :style="{ 'flex-direction': getProps.layout === 'vertical' ? 'column' : 'initial' }" -->
      <slot name="formHeader" />
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :table-action="tableAction"
          :form-action-type="formActionType"
          :schema="schema"
          :form-props="getProps"
          :all-default-values="defaultValueRef"
          :form-model="formModel"
          :set-form-model="setFormModel"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}" />
          </template>
        </FormItem>
      </template>

      <FormAction v-bind="getFormActionBindProps" @toggle-advanced="handleToggleAdvanced">
        <template
          v-for="item in ['resetBefore', 'submitBefore', 'advanceBefore', 'advanceAfter']"
          #[item]="data"
        >
          <slot :name="item" v-bind="data || {}" />
        </template>
      </FormAction>
      <slot name="formFooter" />
    </Row>
  </Form>
</template>
