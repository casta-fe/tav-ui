<script setup lang="ts">
import { type UnwrapRef, computed, ref, watch /*useSlots, useAttrs*/ } from 'vue'
import { TaModal, TaTablePro } from '@tav-ui/components'
import { DEFAULT_FILEVERSION_CLASSNAME, DEFAULT_FILEVERSION_ID } from '../../consts'
import {
  VersionCachesController,
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { fileSingleDownload } from '../../utils'
import { TaFilePreview } from '../FilePreview'
import {
  type FileVersionInstance,
  type FileVersionProps,
  fileVersionEmits,
  fileVersionProps,
} from './types'
import { useActions, useColumns, useMode } from './hooks'

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
const mergedProps = useMergedProps<GlobalConfigFileProps, FileVersionProps>(
  globalConfigProps,
  props,
  ['fileVersion']
)

// 针对业务抽象不同模式进行数据处理
const {
  apiActions: { historyApiOptions },
} = useMode({ mergedProps })

// datasource 处理针对于 upload 成功以及外部传入 datasource（不用 api）
const dataSource = ref(mergedProps.value.dataSource)
watch(
  () => mergedProps.value.dataSource,
  (curdatasource) => {
    if (curdatasource) dataSource.value = [...curdatasource]
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
  } else if (mergedProps.value.api) {
    // 如果外部传入 api 则自行控制
    return {
      data: undefined,
      api: ({ filter, model }: Record<string, any>) =>
        mergedProps.value.api!({
          filter: { ...filter, ...mergedProps.value.apiParams },
          model,
        }),
      beforeApi: (mergedProps.value.beforeApi ?? undefined) as any,
      afterApi: (mergedProps.value.afterApi ?? undefined) as any,
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
watch(
  () => ApiResult.value,
  (curdatasource) => {
    // if (curdatasource && JSON.stringify(curdatasource) !== JSON.stringify(predatasource)) {
    if (curdatasource) {
      const rows = JSON.parse(JSON.stringify(curdatasource ?? []))
      dataSource.value = rows

      VersionCachesController.createAllFileCaches(rows)
    }
  }
)
// 针对各种模式使用传入的 api 自动请求数据
async function useModeFetchDataSource() {
  const options = historyApiOptions(mergedProps.value.apiParams, mergedProps.value.file!)
  if (!options) return
  await handleApi(options)
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
    console.warn('[tavui TaFileTable] apiDownloadWaterMarkerFile is undefined')
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
    console.warn('[tavui TaFileTable] apiDownloadFile is undefined')
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
  if (mergedProps.value.immediate) {
    await useModeFetchDataSource()
  }

  modalVisible.value = true
  emits('open')
  emits('update:visible', modalVisible.value)
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
      </template>
    </TaModal>
    <TaFilePreview
      v-model:visible="filePreviewModalVisible"
      :mode="mergedProps.mode"
      :api-params="mergedProps.apiParams"
      :file="filePreviewFile"
    />
  </section>
</template>
