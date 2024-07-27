<script setup lang="ts">
import { type UnwrapRef, computed, nextTick, ref, unref /*useSlots, useAttrs*/, watch } from 'vue'
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
  type ApiUpdateFileNameAndLinkParams,
  type FileTableInstance,
  type FileTableProps,
  fileTableEmits,
  fileTableProps,
} from './types'
import { useActions, useColumns, useMode, useTableActions } from './hooks'

/**
 * 1. Table 数据源来源于 api：queryfile/queryfilelist 与 datasource（upload 上传成功后会将文件数据通过该属性传入）；使用 datasource 传入的数据默认出现在表格最上方
 * 2. useRequest 只用于行操作的请求，例如：删除、行编辑
 * 2. 表格行数据的增删改查直接调用 vxetable api 实现而非借用 datasource 操作，这样能解耦数据操作降低复杂度
 * 3. 表格默认调用 queryfile/queryfilelist，本次修改将分页器也支持不分页接口，做到分页器与接口数据解耦
 * 4. 文件数据的缓存只用于编辑/立即更新模式，因为这俩种模式下点击更新后都会由前端计算并将数据作为 verisonlist 通过双向绑定的 actualids 传出；只读/新增模式点击版本时直接调用 queryfilehistory
 * 5. 与模式强相关的操作都在 use-mode.ts 中
 */
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
  ['TaFileTable']
)

// 针对业务抽象不同模式进行数据处理
const {
  useModeConfigTable,
  apiActions: { rowEditorApiOptions, historyApiOptions, updateApiOptions, deleteApiOptions },
  dataSourceActions: { editRow, updateRow, deleteRow },
} = useMode({ mergedProps, emits, VersionCachesController })

const configTable = useModeConfigTable()

const { tableCreateRows, tableReadRows, tableUpdateRows, tableDeleteRows } = useTableActions({
  mergedProps,
  configTable,
})

// datasource 处理外部传入 datasource（不用 api）的情况，上传成功后也会通过 datasource 将文件传入
const dataSource = ref(mergedProps.value.dataSource)
watch(
  () => mergedProps.value.dataSource,
  async (curdatasource) => {
    if (curdatasource) {
      const rows = JSON.parse(JSON.stringify([...(curdatasource ?? [])]))

      if (rows.length > 0) {
        await tableCreateRows(tableProRef, rows, null)
        const _dataSource = JSON.parse(JSON.stringify(await tableReadRows(tableProRef)))
        const dataSource = _dataSource.length > 0 ? _dataSource : rows
        emits('change', rows, dataSource, 'upload')
        emits(
          'actualidsChange',
          dataSource.map((file: any) => file.actualId)
        )

        // 这里隐藏掉，减少一次刷新，因为立即更新模式下会带着 bizid/bizcode 上传，成功已入库
        // (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') && (await refreshTableData())
      }
    }
  }
)

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
  // result: ApiResult,
  // error: apiError,
  handleApi,
} = useRequest({
  setLoading,
  setDisable,
  loading,
})

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
async function refreshTableData(params?: any) {
  const tableProInstance = (tableProRef.value as any)?.instance as any
  tableProInstance.reload(params)
}

// 行编辑处理
async function handleCellEditClick(
  changeEventPayload: Omit<ApiUpdateFileNameAndLinkParams, 'appId'>,
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
    const options = rowEditorApiOptions(mergedProps.value.apiParams, changeEventPayload)
    if (!options) return
    await handleApi(options)
  }

  loading.value.value = true
  // 更新表格数据
  await editRow(dataSource, row, changeEventPayload, editDataSourceRow)
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
  } else {
    fileVersionDataSource.value = [row]
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
  await updateRow(
    files[0],
    actionUpdateClickRow.value!,
    tableProRef,
    tableReadRows,
    tableUpdateRows,
    refreshTableData
  )
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
    row,
    tableProRef,
    tableReadRows,
    tableDeleteRows,
    deleteDataSourceRow,
    refreshTableData
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
async function cleanup() {
  await nextTick()

  fileVersionModalVisible.value = false
  fileVersionFile.value = undefined
  fileVersionDataSource.value = undefined
  filePreviewModalVisible.value = false
  filePreviewFile.value = undefined
  actionUpdateClickRow.value = undefined
  VersionCachesController.deleteAllFileCaches()
}

defineExpose({
  elRef,
  tableProRef,
  cleanup,
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
        v-bind="configTable"
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
        :immediate="
          mergedProps.mode === 'update' || mergedProps.mode === 'updateInstantly' ? false : true
        "
        :api-params="mergedProps.apiParams"
        :file="fileVersionFile"
        :data-source="fileVersionDataSource"
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
