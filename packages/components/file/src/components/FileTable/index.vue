<script setup lang="ts">
import { type UnwrapRef, computed, ref /*useSlots, useAttrs*/, watch, unref } from 'vue'
import { TaTablePro } from '@tav-ui/components/table-pro'
import { DEFAULT_FILETABLE_CLASSNAME, DEFAULT_FILETABLE_ID } from '../../consts'
import {
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
  useVersion,
} from '../../hooks'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { type ArgumentsOf, fileSingleDownload } from '../../utils'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  type FileActionUploadProps,
  TaFileActionUpload as TaFileActionUploadForActionUpdateBtn,
} from '../FileActionUpload'
import { TaFileView } from '../FileView'
import {
  type FileTableInstance,
  type FileTableProps,
  fileTableEmits,
  fileTableProps,
} from './types'
import { useActions, useColumns, useMode } from './hooks'

defineOptions({
  name: 'TaFileTable',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileTableInstance['elRef']>>()
const tableProRef = ref<UnwrapRef<FileTableInstance['tableProRef']>>()
const props = defineProps(fileTableProps)
const emits = defineEmits(fileTableEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const FileActionUploadForActionUpdateBtnRef = ref<FileActionUploadInstance>()
const actionUpdateClickRow = ref<FileActionUploadApiResponseRecord>()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<GlobalConfigFileProps, FileTableProps>(
  globalConfigProps,
  props,
  ['fileTable']
)

const {
  useModeFetchDataSource,
  emitEventOptions,
  apiActions: {
    apiQueryFileOptions,
    rowEditorApiOptions,
    updateApiOptions,
    // downloadApiOptions,
    // downloadWaterMarkerApiOptions,
    // downloadMultiApiOptions,
    deleteApiOptions,
  },
  dataSourceActions: { editRow, updateRow, deleteRow },
} = useMode({ mergedProps })

const {
  updateVersionCache,
  cleanVersionCache,
  applyVersionCacheToDataSource,
  getVersionFileByActualId,
  getLatestVersionFileByActualId,
} = useVersion()

const dataSource = ref(mergedProps.value.dataSource)
watch(
  () => mergedProps.value.dataSource,
  (curdatasource) => {
    if (curdatasource) {
      emitEventOptions(curdatasource, dataSource, applyVersionCacheToDataSource, 'upload', emits)
      curdatasource.forEach((file) => updateVersionCache(file))
      dataSource.value = [...curdatasource]
    }
  }
)
const dataSourceOrApiConfig = computed<{
  data: any
  api: any
  beforeApi: any
  afterApi: any
}>(() => {
  // TODO: 根据 pagerconfig 判断启用分页接口还是不分页
  // if(mergedProps.value.pagerConfig && !mergedProps.value.pagerConfig.enabled) {
  //   return {
  //     data: undefined,
  //     api: ({ filter, model }: Record<string, any>) =>
  //       mergedProps.value.apiQueryFile({
  //         filter,
  //         model,
  //       }),
  //     beforeApi: (mergedProps.value.beforeApi ?? undefined) as any,
  //     afterApi: (mergedProps.value.afterApi ?? undefined) as any,
  //   }
  // }
  if (dataSource.value) {
    return {
      data: dataSource.value,
      api: undefined,
      beforeApi: undefined,
      afterApi: undefined,
      pagerConfig: { enabled: false },
    }
  } else if (mergedProps.value.api) {
    // 如果外部传入 api 则自行控制
    return {
      data: undefined,
      api: ({ filter, model }: Record<string, any>) =>
        mergedProps.value.api!({
          filter,
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
      pagerConfig: { enabled: false },
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
const { setDisable } = useDisable()
const { setLoading } = useLoading()
const {
  result: ApiResult,
  // error: apiError,
  handleApi,
} = useRequest({
  setLoading,
  setDisable,
  loading,
})
watch(
  () => ApiResult.value,
  (curdatasource) => {
    // if (curdatasource && JSON.stringify(curdatasource) !== JSON.stringify(predatasource)) {
    if (curdatasource) {
      const _dataSource = [...JSON.parse(JSON.stringify(curdatasource))]
      emitEventOptions(curdatasource, dataSource, applyVersionCacheToDataSource, 'init', emits)
      applyVersionCacheToDataSource(_dataSource)
      dataSource.value = _dataSource
    }
  }
)
useModeFetchDataSource(handleApi)

// 立即更新模式操作后（更新、删除）刷新数据
async function refreshDataSource() {
  const options = apiQueryFileOptions(mergedProps.value.apiParams)
  if (!options) return
  await handleApi(options)
}

async function handleCellEditClick(
  changeEventPayload: { id?: string; name?: string; address?: string },
  row: FileActionUploadApiResponseRecord
) {
  if (
    (row.hyperlink &&
      changeEventPayload.name === row.name &&
      changeEventPayload.address === row.address) ||
    (!row.hyperlink && changeEventPayload.name === row.name)
  ) {
    return
  }

  async function editDataSourceRow() {
    const _options = rowEditorApiOptions(mergedProps.value.apiParams)
    if (!_options) return
    const options = {
      ..._options,
      apiParams: {
        ..._options['apiParams'],
        ...changeEventPayload,
      },
    } as any
    await handleApi(options)
  }

  loading.value.value = true
  // 更新表格数据
  await editRow(dataSource, row, changeEventPayload, updateVersionCache, editDataSourceRow)
  loading.value.value = false
}

const fileViewModalVisible = ref(false)
const fileViewFile = ref<FileActionUploadApiResponseRecord>()
function handleViewBtnClick(row: FileActionUploadApiResponseRecord) {
  fileViewModalVisible.value = true
  fileViewFile.value = row
}
function handleUpdateBtnClick(row: FileActionUploadApiResponseRecord) {
  // console.log('update')
  actionUpdateClickRow.value = row

  const uploadInnerButtonEl = unref(
    FileActionUploadForActionUpdateBtnRef.value?.elRef
  )?.querySelector('[type="button"]') as HTMLButtonElement | undefined
  uploadInnerButtonEl?.click()

  loading.value.value = true
}
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
async function handleDeleteBtnClick(row: FileActionUploadApiResponseRecord) {
  // 立即更新模式调接口删除
  async function deleteDataSourceRow() {
    const options = deleteApiOptions(mergedProps.value.apiParams, row)
    if (!options) return
    await handleApi(options)
  }

  loading.value.value = true
  // 删除表格数据
  await deleteRow(
    dataSource,
    row,
    deleteDataSourceRow,
    refreshDataSource,
    applyVersionCacheToDataSource,
    emits
  )
  loading.value.value = false
}

const actions = useActions({
  mergedProps,
  handleViewBtnClick,
  handleUpdateBtnClick,
  handleDownloadWatermarkBtnClick,
  handleDownloadBtnClick,
  handleDeleteBtnClick,
})

const columns = useColumns({
  mergedProps,
  tableProRef,
  actions,
  latestVersionFile: (rowActualId) =>
    getVersionFileByActualId(rowActualId) ?? getLatestVersionFileByActualId(rowActualId),
  handleCellEditClick,
})

const editConfig = computed<any>(() =>
  mergedProps.value.enabledRowEdit
    ? {
        // trigger: 'manual',
        trigger: 'click',
        mode: 'cell',
        autoClear: true,
      }
    : undefined
)

function handleFileActionUploadForActionUpdateBtnBeforeApiUploadFile(...args: any) {
  const [apiParams] = args as unknown as ArgumentsOf<FileActionUploadProps['beforeApiUploadFile']>
  return updateApiOptions(mergedProps.value.apiParams, apiParams.files!, actionUpdateClickRow.value)
}

async function handleFileActionUploadForActionUpdateBtnChange(...args: any) {
  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>

  loading.value.value = true
  // 更新表格数据
  await updateRow(
    dataSource,
    files[0],
    actionUpdateClickRow.value?.actualId!,
    updateVersionCache,
    refreshDataSource,
    applyVersionCacheToDataSource,
    emits
  )
  loading.value.value = false

  actionUpdateClickRow.value = undefined
}

function cleanup() {
  actionUpdateClickRow.value = undefined
  cleanVersionCache()
}

defineExpose({
  elRef,
  tableProRef,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section
      :id="DEFAULT_FILETABLE_ID"
      ref="elRef"
      :class="`${DEFAULT_FILETABLE_CLASSNAME} ${DEFAULT_FILETABLE_CLASSNAME}--${mode}`"
    >
      <TaTablePro
        ref="tableProRef"
        :loading="loading.value"
        :checkbox-config="mergedProps.checkboxConfig"
        :show-operations="mergedProps.showOperations"
        :fill-inner="mergedProps.fillInner"
        :columns="columns"
        :edit-config="editConfig"
        v-bind="dataSourceOrApiConfig"
      />
      <TaFileActionUploadForActionUpdateBtn
        ref="FileActionUploadForActionUpdateBtnRef"
        :mode="mergedProps.mode"
        :multiple="false"
        :api-params="apiParams"
        :before-api-upload-file="handleFileActionUploadForActionUpdateBtnBeforeApiUploadFile"
        @uploadedChange="handleFileActionUploadForActionUpdateBtnChange"
      />
      <TaFileView
        v-model:visible="fileViewModalVisible"
        :mode="mergedProps.mode"
        :api-params="mergedProps.apiParams"
        :file="fileViewFile"
      />
    </section>
  </template>
</template>
