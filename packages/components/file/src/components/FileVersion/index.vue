<script setup lang="ts">
import { computed, watch, ref /*useSlots, useAttrs*/ } from 'vue'
import { TaButton, TaModal, TaTablePro } from '@tav-ui/components'
import { DEFAULT_FILEVERSION_CLASSNAME, DEFAULT_FILEVERSION_ID } from '../../consts'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
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

const elRef = ref<FileVersionInstance['elRef']>()
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

const _loading = ref(mergedProps.value.loading)
const loading = computed({
  get() {
    return _loading
  },
  set(newLoading) {
    _loading.value = newLoading.value
  },
})

const { disable, setDisable } = useDisable()
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
      const versionFile = mergedProps.value.versionFile
      const _dataSource = [...JSON.parse(JSON.stringify(curdatasource))]
      if (
        !_dataSource.some((row: FileActionUploadApiResponseRecord) => row.id === versionFile?.id)
      ) {
        _dataSource.push({
          ...((versionFile ?? {}) as FileActionUploadApiResponseRecord),
          version: _dataSource[0] ? _dataSource[0].version + _dataSource.length : 1,
        })
      }
      dataSource.value = _dataSource
    }
  }
)

const {
  apiActions: { historyApiOptions },
} = useMode({ mergedProps })

function handleViewBtnClick(/*row: FileActionUploadApiResponseRecord*/) {
  console.log('view')
}
function handleDownloadWatermarkBtnClick(/*row: FileActionUploadApiResponseRecord*/) {
  console.log('downloadWatermark')
}
function handleDownloadBtnClick(/*row: FileActionUploadApiResponseRecord*/) {
  console.log('download')
}

const actions = useActions({
  mergedProps,
  handleViewBtnClick,
  handleDownloadWatermarkBtnClick,
  handleDownloadBtnClick,
})

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

  const options = historyApiOptions(mergedProps.value.apiParams, mergedProps.value.file!)
  if (!options) return
  await handleApi(options)
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
})
</script>

<template>
  <section :id="DEFAULT_FILEVERSION_ID" ref="elRef" :class="DEFAULT_FILEVERSION_CLASSNAME">
    <TaButton style="min-width: 0; padding: 0" type="link" :disabled="disable" @click="open">
      v{{ mergedProps.file?.version }}
    </TaButton>
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
  </section>
</template>
