<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch /*, useSlots, useAttrs*/ } from 'vue'
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
import {
  DEFAULT_APIPARAM_PERMISSIONCONTROL,
  DEFAULT_EMPTY_TIP,
  DEFAULT_FILETYPESELECT_CLASSNAME,
  DEFAULT_FILETYPESELECT_ID,
  DEFAULT_TYPE_SELECT_PLACEHOLDER,
} from '../../consts'
import { useMode } from './hooks'
import {
  type FileTypeSelectEmits,
  type FileTypeSelectProps,
  fileTypeSelectEmits,
  fileTypeSelectProps,
} from './types'

defineOptions({
  name: 'TaFileTypeSelect',
  inheritAttrs: false,
})

const elRef = ref<HTMLDivElement>()
const props = defineProps(fileTypeSelectProps)
const emits = defineEmits(fileTypeSelectEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const EmptyImage = Empty.PRESENTED_IMAGE_SIMPLE

// 将 globalconfig 与 filetypeselect props 结合，同名 props 已 filetypeselect props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileTypeSelectProps>(
  globalConfigProps,
  props,
  'TaFileTypeSelect',
  {
    ...DEFAULT_APIPARAM_PERMISSIONCONTROL,
  }
)

// 针对业务抽象不同模式进行数据处理
const {
  apiActions: { typeSelectApiOptions },
} = useMode({ mergedProps })

// // Embedded in the form, just use the hook binding to perform form verification
// const [state] = useRuleFormItem(props, 'value', 'change', emitData)
const selectValue = ref<FileTypeSelectProps['value']>(props.value)

watch(
  () => JSON.stringify(mergedProps.value.value),
  () => {
    selectValue.value = mergedProps.value.value
  }
)

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
        selectValue.value = mergedProps.value.fieldNames
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
  },
  {
    immediate: true,
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
  selectValue.value = args[0] as string

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
  selectValue.value = undefined

  emits('clear', ...([undefined, undefined, mergedProps.value.fieldNames] as any))
  emits('change', ...([undefined, undefined, mergedProps.value.fieldNames] as any))
}

async function beforeHandleApiAction() {
  // 已非 api 的数据源为主
  if (!mergedProps.value.options) {
    const options = typeSelectApiOptions(mergedProps.value.apiParams)
    if (!options) return
    await handleApi(options)
  }
}

// 清空状态
function cleanup() {
  selectValue.value = undefined
}

// mode 变化置空状态
watch(
  () => mergedProps.value.mode,
  async () => {
    cleanup()
    // if (mergedProps.value.immediate) {
    //   await beforeHandleApiAction()
    // }
  }
)
// apiparams 变化重新请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curApiParams, preApiParams) => {
    if (curApiParams && curApiParams !== preApiParams) {
      if (mergedProps.value.immediate) {
        await beforeHandleApiAction()
      }
    }
  }
)

onMounted(async () => {
  if (mergedProps.value.immediate) {
    await beforeHandleApiAction()
  }
})

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  cleanup,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section :id="DEFAULT_FILETYPESELECT_ID" ref="elRef" :class="DEFAULT_FILETYPESELECT_CLASSNAME">
      <!-- @change="handleChange" -->
      <ASelect
        ref="ASelectRef"
        :value="selectValue"
        :options="options"
        :field-names="mergedProps.fieldNames"
        :placeholder="placeholder"
        :get-popup-container="mergedProps.getPopupContainer"
        :allow-clear="options.length > 1"
        :disabled="disabled"
        :loading="loading"
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
