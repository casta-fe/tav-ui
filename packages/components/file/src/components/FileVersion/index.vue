<script setup lang="ts">
import { type UnwrapRef, computed, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { TaModal, TaTablePro } from '@tav-ui/components'
import { DEFAULT_FILEVERSION_CLASSNAME, DEFAULT_FILEVERSION_ID } from '../../consts'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type FileActionUploadApiResponseRecord } from '../../typings'
import { fileSingleDownload } from '../../utils'
import { TaFilePreview } from '../FilePreview'
import {
  type FileVersionInstance,
  type FileVersionProps,
  fileVersionEmits,
  fileVersionProps,
} from './types'
import { useActions, useColumns, useMode } from './hooks'

/**
 * fileversion 只用 datasource 来展示数据
 */
defineOptions({
  name: 'TaFileVersion',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileVersionInstance['elRef']>>()
const props = defineProps(fileVersionProps)
const emits = defineEmits(fileVersionEmits)
// const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 fileVersion props 结合，同名 props 已 fileVersion props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileVersionProps>(globalConfigProps, props, 'TaFileVersion')

// 针对业务抽象不同模式进行数据处理
const {
  apiActions: { historyApiOptions },
} = useMode({ mergedProps })

const dataSource = ref(mergedProps.value.dataSource)
watch(
  () => JSON.stringify(mergedProps.value.dataSource),
  (curdatasource, predatasource) => {
    if (curdatasource && curdatasource !== predatasource) {
      const rows = JSON.parse(
        JSON.stringify([...(mergedProps.value.dataSource ?? [])])
      ) as FileActionUploadApiResponseRecord[]

      dataSource.value = [...rows]
    }
  }
)
const dataSourceOrApiConfig = computed<{
  data: any
  api: any
  beforeApi: any
  afterApi: any
}>(() => {
  if (dataSource.value) {
    return {
      data: dataSource.value,
      api: undefined,
      beforeApi: undefined,
      afterApi: undefined,
    }
  } else {
    return {
      data: [] as any,
      api: undefined,
      beforeApi: undefined,
      afterApi: undefined,
    }
  }
})

// 统一内部 loading 状态
const _loading = ref(mergedProps.value.loading)
const loading = computed({
  get() {
    return _loading
  },
  set(newLoading: any) {
    _loading.value = newLoading.value
  },
})

// 使用 api 处理数据
const { setDisable } = useDisable()
const { setLoading } = useLoading()
const {
  result: ApiResult,
  // error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
  loading,
})

async function useModeFetchDataSource() {
  const options = historyApiOptions(mergedProps.value.apiParams, mergedProps.value.file!)
  if (!options) return
  await handleApi(options)

  if (ApiResult.value.length > 0) {
    dataSource.value = JSON.parse(JSON.stringify(ApiResult.value ?? []))
  }
}

// 预览处理
const filePreviewModalVisible = ref(false)
const filePreviewFile = ref<FileActionUploadApiResponseRecord>()
function handleViewBtnClick(row: FileActionUploadApiResponseRecord) {
  filePreviewModalVisible.value = true
  filePreviewFile.value = row
}

// 水印下载处理
async function handleDownloadWatermarkBtnClick(row: FileActionUploadApiResponseRecord) {
  if (!mergedProps.value.apiDownloadWaterMarkerFile) {
    console.warn('[tavui TaFileVersion] apiDownloadWaterMarkerFile is undefined')
    return
  }
  loading.value.value = true
  await fileSingleDownload({
    file: row,
    api: mergedProps.value.apiDownloadWaterMarkerFile!,
  })
  loading.value.value = false
}

// 下载处理
async function handleDownloadBtnClick(row: FileActionUploadApiResponseRecord) {
  if (!mergedProps.value.apiDownloadFile) {
    console.warn('[tavui TaFileVersion] apiDownloadFile is undefined')
    return
  }
  loading.value.value = true
  await fileSingleDownload({
    file: row,
    api: mergedProps.value.apiDownloadFile!,
  })
  loading.value.value = false
}

// 处理操作列
const actions = useActions({
  mergedProps,
  handleViewBtnClick,
  handleDownloadWatermarkBtnClick,
  handleDownloadBtnClick,
})

// 处理表格列
const columns = useColumns({
  mergedProps,
  actions,
})

const modalVisible = ref(mergedProps.value.visible)

watch(
  () => mergedProps.value.visible,
  (visible) => {
    if (visible) {
      if (!modalVisible.value) open()
    } else {
      if (modalVisible.value) close()
    }
  }
)

async function open() {
  modalVisible.value = true
  emits('open')
  emits('update:visible', modalVisible.value)

  if (mergedProps.value.immediate) {
    loading.value.value = true
    await useModeFetchDataSource()
    loading.value.value = false
  }
}

function close() {
  modalVisible.value = false
  emits('close')
  emits('update:visible', modalVisible.value)
}

function handleOnVisibleChange(isOpen: boolean) {
  if (!isOpen) {
    close()
  }
}

defineExpose({
  elRef,
  open,
  close,
})
</script>

<template>
  <section :id="DEFAULT_FILEVERSION_ID" ref="elRef" :class="DEFAULT_FILEVERSION_CLASSNAME">
    <TaModal
      :visible="modalVisible"
      title="TaFileVersion"
      :width="mergedProps.width"
      :wrap-class-name="`${DEFAULT_FILEVERSION_CLASSNAME}-modal ${mergedProps.wrapClassName ?? ''}`"
      :destroy-on-close="mergedProps.destroyOnClose"
      :mask-closable="mergedProps.maskClosable"
      :get-popup-container="mergedProps.getPopupContainer"
      :footer="null"
      @visible-change="handleOnVisibleChange"
    >
      <template #title>
        <div :class="`${DEFAULT_FILEVERSION_CLASSNAME}-modal-title`">
          {{ mergedProps.file?.fullName || mergedProps.file?.name }}
        </div>
      </template>
      <template #default>
        <div :class="`${DEFAULT_FILEVERSION_CLASSNAME}-modal-body`">
          <TaTablePro
            :loading="loading.value"
            :checkbox-config="mergedProps.checkboxConfig"
            :pager-config="mergedProps.pagerConfig"
            :show-operations="mergedProps.showOperations"
            :fill-inner="mergedProps.fillInner"
            :columns="columns"
            v-bind="dataSourceOrApiConfig"
          />
        </div>
        <TaFilePreview
          v-model:visible="filePreviewModalVisible"
          :mode="mergedProps.mode"
          :api-params="mergedProps.apiParams"
          :file="filePreviewFile"
        />
      </template>
    </TaModal>
  </section>
</template>
