<script setup lang="ts">
import {
  type ComputedRef,
  computed,
  getCurrentInstance,
  onMounted,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { Select as ASelect, type SelectProps as ASelectProps, Empty } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { tavI18n } from '@tav-ui/locales'
import { createId, createNS } from '../../utils'
import {
  useDisable,
  useFileContext,
  useFileGlobalConfig,
  useLoading,
  useMergedProps,
} from '../../hooks'
import { type ApiParams, type FileInjectedProps, type LabelValueOptions } from '../../typings'
import { useOptions, useRequest } from './hooks'

// 注意该文件与 types 文件中的 props 类型需要同步更新
export interface _FileTypeSelectProps {
  visible?: boolean
  defaultValue?: string
  immediate?: boolean

  api?: FileInjectedProps['apiReadFileType']
  beforeApi?: (...args: any[]) => Promise<any>
  afterApi?: (...args: any[]) => Promise<any>
}
export type FileTypeSelectProps = _FileTypeSelectProps &
  FileInjectedProps &
  ApiParams &
  ASelectProps

const ns = createNS('file')
const cls = ns.b('type-select')
const id = createId(cls)

defineOptions({
  name: 'TaFileTypeSelect',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FileTypeSelectProps>(), {
  visible: true,
  defaultValue: undefined,
  immediate: true,
  params: () => ({
    permissionControl: false,
  }),
})
// const emits = defineEmits<FileTypeSelectEmits>()
const slots = useSlots()
const attrs = useAttrs()

// 0. 将全局注入的值、共用的 api params 放入 context
// 1. 大组件是否存在
// 2. 大组件存在需要将其默认值继承下来，并读取 context；不存在已自己组件传入的为准给默认值

// global context data => file comp data => file son comp data

const EmptyImage = Empty.PRESENTED_IMAGE_SIMPLE

// 将 globalconfig 与 filetypeselect props 结合，同名 props 已 filetypeselect props 为主
const fileGlobalConfig = useFileGlobalConfig()
const mergedProps = useMergedProps<FileInjectedProps, typeof props>(fileGlobalConfig, props)

const { disable, setDisable } = useDisable()
const { loading, setLoading } = useLoading()
const {
  result: apiResult,
  error: apiError,
  handleApi,
} = useRequest({
  apiParams: computed((prevApiParams: Required<ApiParams>['apiParams']) =>
    JSON.stringify(prevApiParams) === JSON.stringify(mergedProps.value.apiParams)
      ? prevApiParams
      : mergedProps.value.apiParams
  ),
  api: computed(() =>
    mergedProps.value.api
      ? mergedProps.value.api
      : mergedProps.value.apiReadFileType
      ? mergedProps.value.apiReadFileType
      : undefined
  ),
  beforeApi: computed(() => mergedProps.value.beforeApi),
  afterApi: computed(() => mergedProps.value.afterApi),
  setDisable,
  setLoading,
})

const options = useOptions({
  apiResult,
  options: computed(() => mergedProps.value.options),
})

onMounted(() => {
  mergedProps.value.immediate && handleApi()
})

// 1. 验证 apiparams 变化是否重新请求
// 2. 思考如何把逻辑抛出去，让用户直接调用
</script>

<template>
  <template v-if="mergedProps.visible">
    {{ JSON.stringify($props) }}
    <section :id="id" :class="cls">
      <ASelect :disabled="disable" :options="options">
        <template v-for="slotKey in Object.keys(slots)" #[slotKey]="data">
          <slot :name="slotKey" v-bind="data || {}" />
        </template>
        <template v-if="mergedProps.api && loading" #suffixIcon>
          <span>
            <LoadingOutlined spin class="mr-1" />
            {{ tavI18n('Tav.common.loadingText') }}
          </span>
        </template>
        <template v-if="options.length === 0 || apiError" #notFoundContent>
          <Empty :image="EmptyImage" />
          <span v-if="apiError">{{ apiError }}</span>
        </template>
      </ASelect>
    </section>
  </template>
</template>
