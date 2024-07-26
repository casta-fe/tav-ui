<script setup lang="ts">
import { type UnwrapRef, computed, ref, unref /*useSlots, useAttrs*/, watch } from 'vue'
import { TaTablePro } from '@tav-ui/components/table-pro'
import { DEFAULT_FILETABLE_CLASSNAME, DEFAULT_FILETABLE_ID } from '../../consts'
import {
  VersionCachesController,
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type FileActionUploadApiResponseRecord, type GlobalConfigFileProps } from '../../typings'
import { type ArgumentsOf, fileSingleDownload } from '../../utils'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  type FileActionUploadProps,
  TaFileActionUpload as TaFileActionUploadForActionUpdateBtn,
} from '../FileActionUpload'
import { TaFileVersion } from '../FileVersion'
import { TaFilePreview } from '../FilePreview'
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

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<GlobalConfigFileProps, FileTableProps>(
  globalConfigProps,
  props,
  ['fileTable']
)

// 针对业务抽象不同模式进行数据处理
const {
  useModeFetchDataSource,
  apiActions: {
    apiQueryFileOptions,
    rowEditorApiOptions,
    historyApiOptions,
    updateApiOptions,
    // downloadApiOptions,
    // downloadWaterMarkerApiOptions,
    deleteApiOptions,
  },
  dataSourceActions: { editRow, updateRow, deleteRow },
} = useMode({ mergedProps })

// datasource 处理针对于 upload 成功以及外部传入 datasource（不用 api）
const dataSource = ref(mergedProps.value.dataSource)
watch(
  () => mergedProps.value.dataSource,
  (curdatasource) => {
    if (curdatasource) {
      // TODO: 使用 vxetable 自身处理数据方法把这里新增的数据标识出来
      const rows = JSON.parse(JSON.stringify([...(curdatasource ?? [])]))
      emits('change', rows, rows, 'upload')
      emits(
        'actualidsChange',
        rows.map((file: any) => file.actualId)
      )

      dataSource.value = [...curdatasource]
      refreshDataSource()
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
  setLoading,
  setDisable,
  loading,
})
watch(
  () => ApiResult.value,
  (curdatasource) => {
    // if (curdatasource && JSON.stringify(curdatasource) !== JSON.stringify(predatasource)) {
    if (curdatasource) {
      const rows = JSON.parse(JSON.stringify([...(curdatasource ?? [])]))
      emits('change', rows, rows, 'init')
      emits(
        'actualidsChange',
        rows.map((file: any) => file.actualId)
      )

      dataSource.value = [...rows]

      VersionCachesController.createAllFileCaches(rows)
    }
  }
)
// 针对各种模式使用传入的 api 自动请求数据
mergedProps.value.immediate && useModeFetchDataSource(handleApi)

/**
 * 1. 编辑与立即更新模式将 fileversion 的 immediate 设为 false，在该函数中处理 fileversion 需要的数据
 * 2. 在只读与新增模式将 fileversion 的 immediate 设为 true，组件内自动发请求获取 fileversion 需要的数据
 */
async function beforeReadFileCaches(row: FileActionUploadApiResponseRecord) {
  loading.value.value = true

  if (
    !VersionCachesController.isCachesEmpty() &&
    VersionCachesController.readFileCaches(row.actualId!)
  ) {
    loading.value.value = false
    if (row.version === VersionCachesController.readFileCaches(row.actualId!)!.length)
      return VersionCachesController.readFileCaches(row.actualId!)
  }

  const options = historyApiOptions(mergedProps.value.apiParams, row)
  if (!options) {
    loading.value.value = false
    return []
  }

  const { success, data } = await mergedProps.value.apiQueryFileHistory!(options.apiParams)
  if (success === true && data) {
    loading.value.value = false
    return [...(VersionCachesController.createFileCaches(row, data) ?? [])]
  }

  loading.value.value = false
  return []
}

// 立即更新模式操作后（更新、删除）刷新数据
async function refreshDataSource() {
  const options = apiQueryFileOptions(mergedProps.value.apiParams)
  if (!options) return
  await handleApi(options)
}

// 行编辑处理
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
  await editRow(
    dataSource,
    row,
    changeEventPayload,
    editDataSourceRow,
    emits,
    VersionCachesController
  )
  loading.value.value = false
}

// version 弹窗处理
const fileVersionModalVisible = ref(false)
const fileVersionFile = ref<FileActionUploadApiResponseRecord>()
const fileVersionDataSource = ref<FileActionUploadApiResponseRecord[]>()
async function hanldeVersionClick(row: FileActionUploadApiResponseRecord) {
  fileVersionFile.value = row
  if (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') {
    const fileCaches = await beforeReadFileCaches(row)
    fileVersionDataSource.value = fileCaches!
  }
  fileVersionModalVisible.value = true
}

// 预览处理
const filePreviewModalVisible = ref(false)
const filePreviewFile = ref<FileActionUploadApiResponseRecord>()
function handleViewBtnClick(row: FileActionUploadApiResponseRecord) {
  filePreviewModalVisible.value = true
  filePreviewFile.value = row
}

// 更新处理
const actionUpdateClickRow = ref<FileActionUploadApiResponseRecord>()
async function handleUpdateBtnClick(row: FileActionUploadApiResponseRecord) {
  if (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') {
    await beforeReadFileCaches(row)
  }

  actionUpdateClickRow.value = row

  const uploadInnerButtonEl = unref(
    FileActionUploadForActionUpdateBtnRef.value?.elRef
  )?.querySelector('[type="button"]') as HTMLButtonElement | undefined
  uploadInnerButtonEl?.click()
}
// 点击更新时 upload 回调
function handleFileActionUploadForActionUpdateBtnBeforeApiUploadFile(...args: any) {
  loading.value.value = true
  const [apiParams] = args as unknown as ArgumentsOf<FileActionUploadProps['beforeApiUploadFile']>
  return updateApiOptions(
    mergedProps.value.apiParams,
    apiParams.files!,
    actionUpdateClickRow.value,
    FileActionUploadForActionUpdateBtnRef.value?.resetFileList!
  )
}
async function handleFileActionUploadForActionUpdateBtnChange(...args: any) {
  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>

  loading.value.value = true
  // 更新表格数据
  await updateRow(dataSource, files[0], refreshDataSource, emits, VersionCachesController)
  loading.value.value = false

  actionUpdateClickRow.value = undefined
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

// 删除处理
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
    emits,
    VersionCachesController
  )
  loading.value.value = false
}

// 处理操作列
const actions = useActions({
  mergedProps,
  handleViewBtnClick,
  handleUpdateBtnClick,
  handleDownloadWatermarkBtnClick,
  handleDownloadBtnClick,
  handleDeleteBtnClick,
})

// 处理表格列
const columns = useColumns({
  mergedProps,
  tableProRef,
  actions,
  handleCellEditClick,
  hanldeVersionClick,
})

// 行编辑配置
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

// 清空表格状态
function cleanup() {
  actionUpdateClickRow.value = undefined
  filePreviewModalVisible.value = false
  filePreviewFile.value = undefined
  VersionCachesController.deleteAllFileCaches()
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
        @uploaded-change="handleFileActionUploadForActionUpdateBtnChange"
      />
      <TaFileVersion
        v-model:visible="fileVersionModalVisible"
        :mode="mergedProps.mode"
        :api-params="mergedProps.apiParams"
        :file="fileVersionFile"
        :data-source="fileVersionDataSource"
        :immediate="
          mergedProps.mode === 'update' || mergedProps.mode === 'updateInstantly' ? false : true
        "
      />
      <TaFilePreview
        v-model:visible="filePreviewModalVisible"
        :mode="mergedProps.mode"
        :api-params="mergedProps.apiParams"
        :file="filePreviewFile"
        :immediate="true"
      />
    </section>
  </template>
</template>
