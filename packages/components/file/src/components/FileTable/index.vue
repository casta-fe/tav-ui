<script setup lang="ts">
import { onMounted, ref /*useSlots, useAttrs*/ } from 'vue'
import { TaTablePro } from '@tav-ui/components/table-pro'
import { DEFAULT_FILETABLE_CLASSNAME, DEFAULT_FILETABLE_ID } from '../../consts'
import { useDisable, useFileGlobalConfig, useLoading, useMergedProps } from '../../hooks'
import { type FileInjectedProps, type UploadFileListItem } from '../../typings'
import {
  type FileTableInstance,
  type FileTableProps,
  fileTableEmits,
  fileTableProps,
} from './types'
import { useColumn, useData, useRequest } from './hooks'

defineOptions({
  name: 'TaFileTable',
  inheritAttrs: false,
})

const elRef = ref<FileTableInstance['elRef']>()
const TableProRef = ref<FileTableInstance['TableProRef']>()
const props = defineProps(fileTableProps)
const emits = defineEmits(fileTableEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const fileGlobalConfig = useFileGlobalConfig()
const mergedProps = useMergedProps<FileInjectedProps, FileTableProps>(fileGlobalConfig, props)

const { disable, setDisable } = useDisable()
const { loading, setLoading } = useLoading()
const {
  result: apiResult,
  // error: apiError,
  handleApi,
} = useRequest({
  mergedProps,
  setDisable,
  setLoading,
})

const data = useData({
  props: mergedProps,
  apiResult,
})

const columns = useColumn({
  props: mergedProps,
})

function beforeHandleApiAction() {
  // 已传入的 dataSource 为主
  if (
    !mergedProps.value.dataSource ||
    (mergedProps.value.dataSource && mergedProps.value.dataSource.length === 0)
  ) {
    handleApi()
  }
}

onMounted(() => {
  beforeHandleApiAction()
})

defineExpose({
  /** @description html element */
  elRef,
  /** @description TablePro */
  TableProRef,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section :id="DEFAULT_FILETABLE_ID" ref="elRef" :class="DEFAULT_FILETABLE_CLASSNAME">
      <TaTablePro
        ref="TableProRef"
        :loading="typeof mergedProps.loading === 'undefined' ? loading : mergedProps.loading"
        :disabled="disable"
        :readonly="mergedProps.readonly"
        :checkbox-config="mergedProps.checkboxConfig ?? { enabled: false }"
        :pager-config="mergedProps.pagerConfig"
        :show-operations="mergedProps.showOperations"
        :fill-inner="mergedProps.fillInner"
        :data="data"
        :columns="columns"
      />
    </section>
  </template>
</template>
