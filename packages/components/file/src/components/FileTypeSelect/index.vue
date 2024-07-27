<script setup lang="ts">
import { type UnwrapRef, computed, onMounted, ref, watch /*, useSlots, useAttrs*/ } from 'vue'
import { Select as ASelect, Empty } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { type ArgumentsOf } from '../../utils'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type GlobalConfigFileProps } from '../../typings'
import {
  DEFAULT_EMPTY_TIP,
  DEFAULT_FILETYPESELECT_CLASSNAME,
  DEFAULT_FILETYPESELECT_ID,
  DEFAULT_TYPE_SELECT_PLACEHOLDER,
} from '../../consts'
import { useMode } from './hooks'
import {
  type FileTypeSelectEmits,
  type FileTypeSelectInstance,
  type FileTypeSelectProps,
  fileTypeSelectEmits,
  fileTypeSelectProps,
} from './types'

defineOptions({
  name: 'TaFileTypeSelect',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileTypeSelectInstance['elRef']>>()
const props = defineProps(fileTypeSelectProps)
const emits = defineEmits(fileTypeSelectEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const EmptyImage = Empty.PRESENTED_IMAGE_SIMPLE

// 将 globalconfig 与 filetypeselect props 结合，同名 props 已 filetypeselect props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<GlobalConfigFileProps, FileTypeSelectProps>(
  globalConfigProps,
  props,
  ['TaFileTypeSelect']
)

// 针对业务抽象不同模式进行数据处理
const {
  apiActions: { typeSelectApiOptions },
} = useMode({ mergedProps })

// // Embedded in the form, just use the hook binding to perform form verification
// const [state] = useRuleFormItem(props, 'value', 'change', emitData)
const value = ref<FileTypeSelectProps['value']>(props.value)

// 使用 api 处理数据
const { disable, setDisable } = useDisable()
const { loading, setLoading } = useLoading()
const {
  result: apiResult,
  error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
})
// api 相关参数变化重新发起请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  (curApiParams, preApiParams) => {
    if (!curApiParams) {
      console.warn('please select typeCode')
    }
    if (curApiParams !== preApiParams) {
      beforeHandleApiAction()
    }
  }
)

const options = computed(() => {
  if (mergedProps.value.options && mergedProps.value.options.length > 0) {
    return [...mergedProps.value.options]
  } else {
    return [...apiResult.value]
  }
})
// options 变化后触发事件
watch(
  () => JSON.stringify(options.value),
  (curOptions, preOptions) => {
    if (curOptions && curOptions !== preOptions) {
      emits('optionsChange', options.value, mergedProps.value.fieldNames)

      // 当 options 只有一项时默认选中
      if (options.value.length === 1) {
        value.value = mergedProps.value.fieldNames
          ? options.value[0][mergedProps.value.fieldNames['value']!]
          : options.value[0].value ?? options.value[0]
        emits(
          'select',
          ...([
            options.value[0][mergedProps.value.fieldNames!['value']!],
            options.value[0],
            mergedProps.value.fieldNames,
          ] as any)
        )
        emits(
          'change',
          ...([
            options.value[0][mergedProps.value.fieldNames!['value']!],
            options.value[0],
            mergedProps.value.fieldNames,
          ] as any)
        )
      }
    }
  }
)

const disabled = computed(() => {
  if (typeof mergedProps.value.disabled !== 'undefined') {
    return mergedProps.value.disabled
  } else {
    return options.value.length === 0 || disable.value
  }
})

const placeholder = computed(() =>
  options.value.length === 0
    ? DEFAULT_EMPTY_TIP(tavI18n)
    : mergedProps.value.placeholder
    ? mergedProps.value.placeholder
    : DEFAULT_TYPE_SELECT_PLACEHOLDER(tavI18n)
)

// function handleChange(...args: ArgumentsOf<FileTypeSelectEmits['change']>) {
//   emits('change', ...args)
// }

function handleSelect(...args: ArgumentsOf<FileTypeSelectEmits['select']>) {
  emits(
    'select',
    ...([...args, mergedProps.value.fieldNames] as unknown as ArgumentsOf<
      FileTypeSelectEmits['select']
    >)
  )
  emits(
    'change',
    ...([...args, mergedProps.value.fieldNames] as unknown as ArgumentsOf<
      FileTypeSelectEmits['select']
    >)
  )
}

function handleDeselect(...args: ArgumentsOf<FileTypeSelectEmits['deselect']>) {
  emits('deselect', ...args)
}

function handleDropdownVisibleChange(
  ...args: ArgumentsOf<FileTypeSelectEmits['dropdownVisibleChange']>
) {
  emits('dropdownVisibleChange', ...args)
}

function handleClear() {
  value.value = undefined

  emits('clear', ...([undefined, undefined, mergedProps.value.fieldNames] as any))
  emits('change', ...([undefined, undefined, mergedProps.value.fieldNames] as any))
}

function beforeHandleApiAction() {
  // 已传入的 options 为主
  if (
    !mergedProps.value.options ||
    (mergedProps.value.options && mergedProps.value.options.length === 0)
  ) {
    const options = typeSelectApiOptions(mergedProps.value.apiParams)
    if (!options) return
    handleApi(options)
  }
}

onMounted(() => {
  beforeHandleApiAction()
})

defineExpose({
  elRef,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section :id="DEFAULT_FILETYPESELECT_ID" ref="elRef" :class="DEFAULT_FILETYPESELECT_CLASSNAME">
      <!-- @change="handleChange" -->
      <ASelect
        ref="ASelectRef"
        :value="value"
        :options="options"
        :field-names="mergedProps.fieldNames"
        :placeholder="placeholder"
        :get-popup-container="mergedProps.getPopupContainer"
        :allow-clear="options.length > 1"
        :disabled="disabled"
        :loading="mergedProps.apiQueryFileType && loading"
        @select="handleSelect"
        @deselect="handleDeselect"
        @dropdown-visible-change="handleDropdownVisibleChange"
        @clear="handleClear"
      >
        <template v-if="options.length === 0 || apiError" #notFoundContent>
          <span v-if="apiError">{{ apiError }}</span>
          <br />
          <Empty :image="EmptyImage" />
        </template>
      </ASelect>
    </section>
  </template>
</template>
