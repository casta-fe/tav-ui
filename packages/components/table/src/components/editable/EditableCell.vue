<template>
  <div :class="prefixCls">
    <div
      v-show="!isEdit"
      :class="{ [`${prefixCls}__normal`]: true, 'ellipsis-cell': column?.ellipsis }"
      @click="handleEdit"
    >
      <div class="cell-content" :title="column?.ellipsis ? getValues ?? '' : ''">
        {{ getValues ? getValues : '&nbsp;' }}
      </div>
      <FormOutlined v-if="!column?.editRow" :class="`${prefixCls}__normal-icon`" />
    </div>

    <a-spin v-if="isEdit" :spinning="spinning">
      <div v-click-outside="onClickOutside" :class="`${prefixCls}__wrapper`">
        <CellComponent
          v-bind="getComponentProps"
          ref="elRef"
          :component="getComponent"
          :style="getWrapperStyle"
          :popover-visible="getRuleVisible"
          :rule="getRule"
          :rule-message="ruleMessage"
          :class="getWrapperClass"
          @change="handleChange"
          @options-change="handleOptionsChange"
          @press-enter="handleEnter"
        />
        <div v-if="!getRowEditable" :class="`${prefixCls}__action`">
          <CheckOutlined :class="[`${prefixCls}__icon`, 'mx-2']" @click="handleSubmitClick" />
          <CloseOutlined :class="`${prefixCls}__icon `" @click="handleCancel" />
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts">
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
import { computed, defineComponent, nextTick, ref, toRaw, unref, watchEffect } from 'vue'
import { CheckOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue'
import { omit, pick, set } from 'lodash-es'
import { Spin } from 'ant-design-vue'
import clickOutside from '@tav-ui/directives/src/clickOutside'
import { isArray, isBoolean, isFunction, isNumber, isString } from '@tav-ui/utils/is'
import { propTypes } from '@tav-ui/utils/propTypes'
// import { treeToList } from '@tav-ui/utils/helper/treeHelper';
import { useTableContext } from '../../hooks/useTableContext'
import { createPlaceholderMessage } from './helper'
import { CellComponent } from './CellComponent'
import type { EditRecordRow } from './index'
import type { BasicColumn } from '../../types/table'
import type { CSSProperties, PropType } from 'vue'

interface ChangeEvent extends Event {
  target: HTMLInputElement
}
type Recordable<T = any> = Record<string, T>

export default defineComponent({
  name: 'EditableCell',
  components: { FormOutlined, CloseOutlined, CheckOutlined, CellComponent, ASpin: Spin },
  directives: {
    clickOutside,
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Recordable>,
      default: '',
    },
    record: {
      type: Object as PropType<EditRecordRow>,
      default: undefined,
    },
    column: {
      type: Object as PropType<BasicColumn>,
      default: undefined,
    },
    index: propTypes.number,
  },
  setup(props) {
    const table = useTableContext()
    const isEdit = ref(false)
    const elRef = ref()
    const ruleVisible = ref(false)
    const ruleMessage = ref('')
    const optionsRef = ref<any[]>([])
    const currentValueRef = ref<any>(props.value)
    const defaultValueRef = ref<any>(props.value)
    const spinning = ref<boolean>(false)

    const prefixCls = 'ta-editable-cell'

    const getComponent = computed(() => props.column?.editComponent || 'Input')
    const getRule = computed(() => props.column?.editRule)

    const getRuleVisible = computed(() => {
      return unref(ruleMessage) && unref(ruleVisible)
    })

    const getIsCheckComp = computed(() => {
      const component = unref(getComponent)
      return ['Checkbox', 'Switch'].includes(component)
    })

    const getComponentProps = computed(() => {
      const compProps = props.column?.editComponentProps ?? {}
      // const component = unref(getComponent);
      const apiSelectProps: Recordable = {}
      // if (component === 'ApiSelect') {
      //   apiSelectProps.cache = true;
      // }

      const isCheckValue = unref(getIsCheckComp)

      const valueField = isCheckValue ? 'checked' : 'value'
      const val = unref(currentValueRef)

      const value = isCheckValue ? (isNumber(val) && isBoolean(val) ? val : !!val) : val

      return {
        size: 'small',
        getPopupContainer: () => unref(table?.wrapRef.value) ?? document.body,
        getCalendarContainer: () => unref(table?.wrapRef.value) ?? document.body,
        placeholder: createPlaceholderMessage(unref(getComponent)),
        ...apiSelectProps,
        ...omit(compProps, 'onChange'),
        [valueField]: value,
      }
    })

    const getValues = computed(() => {
      const { editComponentProps, editValueMap } = props.column || {}

      const value = unref(currentValueRef)

      if (editValueMap && isFunction(editValueMap)) {
        return editValueMap(value)
      }

      const component = unref(getComponent)
      if (!component.includes('Select')) {
        return value
      }

      // todo 这里只能单选，如果要做行内单元格编辑这部分需要把edittableform的逻辑处理搬过来 holy shit
      // 先用弹窗
      const options: any[] = editComponentProps?.options ?? (unref(optionsRef) || [])
      const option = options.find((item) => `${item.value}` === `${value}`)

      return option?.label ?? value
    })

    const getWrapperStyle = computed((): CSSProperties => {
      if (unref(getIsCheckComp) || unref(getRowEditable)) {
        return {}
      }
      return {
        width: 'calc(100% - 48px)',
      }
    })

    const getWrapperClass = computed(() => {
      const { align = 'center' } = props.column || {}
      return `edit-cell-align-${align}`
    })

    const getRowEditable = computed(() => {
      const { editable } = props.record || {}
      return !!editable
    })

    watchEffect(() => {
      defaultValueRef.value = props.value
      currentValueRef.value = props.value
    })

    watchEffect(() => {
      const { editable } = props.column || {}
      if (isBoolean(editable) || isBoolean(unref(getRowEditable))) {
        isEdit.value = !!editable || unref(getRowEditable)
      }
    })

    function handleEdit() {
      if (unref(getRowEditable) || unref(props.column?.editRow)) return
      ruleMessage.value = ''
      isEdit.value = true
      nextTick(() => {
        const el = unref(elRef)
        el?.focus?.()
      })
    }

    async function handleChange(e: any) {
      const component = unref(getComponent)
      if (!e) {
        currentValueRef.value = e
      } else if (e?.target && Reflect.has(e.target, 'value')) {
        currentValueRef.value = (e as ChangeEvent).target.value
      } else if (component === 'Checkbox') {
        currentValueRef.value = (e as ChangeEvent).target.checked
      } else if (isString(e) || isBoolean(e) || isNumber(e)) {
        currentValueRef.value = e
      }
      const onChange = props.column?.editComponentProps?.onChange
      // eslint-disable-next-line prefer-rest-params
      if (onChange && isFunction(onChange)) onChange(...arguments)

      table.emit?.('edit-change', {
        column: props.column,
        value: unref(currentValueRef),
        record: toRaw(props.record),
      })
      handleSubmiRule()
    }

    async function handleSubmiRule() {
      const { column, record } = props
      const { editRule } = column || {}
      const currentValue = unref(currentValueRef)

      if (editRule) {
        if (isBoolean(editRule) && !currentValue && !isNumber(currentValue)) {
          ruleVisible.value = true
          const component = unref(getComponent)
          ruleMessage.value = createPlaceholderMessage(component)
          return false
        }
        if (isFunction(editRule)) {
          const res = await editRule(currentValue, record as Recordable)
          if (res) {
            ruleMessage.value = res
            ruleVisible.value = true
            return false
          } else {
            ruleMessage.value = ''
            return true
          }
        }
      }
      ruleMessage.value = ''
      return true
    }

    async function handleSubmit(needEmit = true, valid = true) {
      if (valid) {
        const isPass = await handleSubmiRule()
        if (!isPass) return false
      }

      const { column, index, record } = props
      if (!record) return false
      const { key, dataIndex } = column || {}
      const value = unref(currentValueRef)
      if (!key && !dataIndex) return

      const dataKey = (dataIndex || key) as string

      if (!record.editable) {
        const { getBindValues } = table

        const { beforeEditSubmit, columns } = unref(getBindValues)

        if (beforeEditSubmit && isFunction(beforeEditSubmit)) {
          spinning.value = true
          const keys: string[] = columns
            .map((_column) => _column.dataIndex)
            .filter((field) => !!field) as string[]
          let result: any = true
          try {
            result = await beforeEditSubmit({
              record: pick(record, keys),
              index,
              key: key as string,
              value,
            })
          } catch (e) {
            result = false
          } finally {
            spinning.value = false
          }
          if (result === false) {
            return
          }
        }
      }

      set(record, dataKey, value)
      //const record = await table.updateTableData(index, dataKey, value);
      needEmit && table.emit?.('edit-end', { record, index, key, value })
      isEdit.value = false
    }

    async function handleEnter() {
      if (props.column?.editRow) {
        return
      }
      handleSubmit()
    }

    function handleSubmitClick() {
      handleSubmit()
    }

    function handleCancel() {
      isEdit.value = false
      currentValueRef.value = defaultValueRef.value
      const { column, index, record } = props
      const { key, dataIndex } = column || {}
      table.emit?.('edit-cancel', {
        record,
        index,
        key: dataIndex || key,
        value: unref(currentValueRef),
      })
    }

    function onClickOutside() {
      if (props.column?.editable || unref(getRowEditable)) {
        return
      }
      const component = unref(getComponent)

      if (component.includes('Input')) {
        handleCancel()
      }
    }

    // only ApiSelect or TreeSelect
    function handleOptionsChange(options: any[]) {
      // const { replaceFields } = props.column?.editComponentProps ?? {};
      // const component = unref(getComponent);
      // if (component === 'ApiTreeSelect') {
      //   const { title = 'title', value = 'value', children = 'children' } = replaceFields || {};
      //   let listOptions: Recordable[] = treeToList(options, { children });
      //   listOptions = listOptions.map((item) => {
      //     return {
      //       label: item[title],
      //       value: item[value],
      //     };
      //   });
      //   optionsRef.value = listOptions as LabelValueOptions;
      // } else {
      //   optionsRef.value = options;
      // }
      optionsRef.value = options
    }

    function initCbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle: (...arg: any[]) => any) {
      if (props.record) {
        /* eslint-disable  */
        isArray(props.record[cbs])
          ? props.record[cbs]?.push(handle)
          : (props.record[cbs] = [handle])
      }
    }

    if (props.record) {
      initCbs('submitCbs', handleSubmit)
      initCbs('validCbs', handleSubmiRule)
      initCbs('cancelCbs', handleCancel)

      if (props.column?.dataIndex) {
        if (!props.record.editValueRefs) props.record.editValueRefs = {}
        props.record.editValueRefs[props.column?.dataIndex.toString()] = currentValueRef
      }
      /* eslint-disable  */
      props.record.onCancelEdit = () => {
        isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach((fn) => fn())
      }
      /* eslint-disable */
      props.record.onSubmitEdit = async () => {
        if (isArray(props.record?.submitCbs)) {
          if (!props.record?.onValid?.()) return
          const submitFns = props.record?.submitCbs || []
          submitFns.forEach((fn) => fn(false, false))
          table.emit?.('edit-row-end')
          return true
        }
      }
    }

    return {
      isEdit,
      prefixCls,
      handleEdit,
      currentValueRef,
      handleSubmit,
      handleChange,
      handleCancel,
      elRef,
      getComponent,
      getRule,
      onClickOutside,
      ruleMessage,
      getRuleVisible,
      getComponentProps,
      handleOptionsChange,
      getWrapperStyle,
      getWrapperClass,
      getRowEditable,
      getValues,
      handleEnter,
      handleSubmitClick,
      spinning,
    }
  },
})
</script>
