<script setup lang="ts">
import {
  type Ref,
  type UnwrapRef,
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  /*useSlots, useAttrs*/
} from 'vue'
import { TaTablePro } from '@tav-ui/components/table-pro'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { DEFAULT_APIPARAMS, DEFAULT_FILETABLE_CLASSNAME, DEFAULT_FILETABLE_ID } from '../../consts'
import {
  VersionCaches,
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../../hooks'
import { type FileActionUploadApiResponseRecord } from '../../typings'
import { type ArgumentsOf, fileSingleDownload, isOwnerOrAdmin } from '../../utils'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  TaFileActionUpload as TaFileActionUploadForActionUpdateBtn,
} from '../FileActionUpload'
import { type FileVersionTableAction, TaFileVersion } from '../FileVersion'
import { TaFileLog } from '../FileLog'
import { TaFilePreview } from '../FilePreview'
import {
  type ApiUpdateFileNameAndLinkParams,
  type FileTableInstance,
  type FileTableProps,
  type FileTableReloadApiParams,
  fileTableEmits,
  fileTableProps,
} from './types'
import {
  useActions,
  useColumns,
  useDataSource,
  useFilterFormConfig,
  useMode,
  useTableActions,
} from './hooks'

/**
 * 1. Table 数据源来源于 api：queryfile/queryfilelist 与 datasource（__uploadDataSource、__uploadLinkDataSource 为内部使用的上传文件、超链接数据源）
 * 2. useRequest 只用于行操作的请求，例如：删除、行编辑
 * 2. 表格行数据的增删改查直接调用 vxetable api 实现而非像 taupload 中共用一个 datasource 操作，这样能解耦数据操作降低复杂度
 * 3. 表格默认调用 queryfile/queryfilelist，本次修改将分页器也支持不分页接口，做到分页器与接口数据解耦
 * 4. 文件数据的缓存只用于编辑/立即更新模式，因为这俩种模式下点击更新后都会由前端计算并将数据作为 verisonlist 通过双向绑定的 actualids 传出；只读/新增模式点击版本时直接调用 queryfilehistory
 * 5. 与模式强相关的操作都在 use-mode.ts 中
 */
defineOptions({
  name: 'TaFileTable',
  inheritAttrs: false,
})

const elRef = ref<HTMLDivElement>()
const tableProRef = ref<UnwrapRef<FileTableInstance['tableProRef']>>()
const props = defineProps(fileTableProps)
const emits = defineEmits(fileTableEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const FileActionUploadForActionUpdateBtnRef = ref<FileActionUploadInstance>()
const VersionCachesController = new VersionCaches()

// 将 globalconfig 与 fileactionupload props 结合，同名 props 已 fileactionupload props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileTableProps>(globalConfigProps, props, 'TaFileTable', {
  ...DEFAULT_APIPARAMS,
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

// 针对业务抽象不同模式进行数据处理
const {
  useModeConfigTable,
  apiActions: {
    apiQueryFileOptions,
    apiQueryFilterFormFileTypeOptions,
    rowEditorApiOptions,
    historyApiOptions,
    deleteApiOptions,
  },
  dataActions: { reloadRows, editRow, updateRow, deleteRow },
} = useMode({ mergedProps, tableProRef, emits, VersionCachesController })

const configTable = useModeConfigTable()

const { tableCreateRows, tableReadRows, tableUpdateRows, tableDeleteRows } = useTableActions({
  mergedProps,
  tableProRef,
  configTable,
  loading,
})

useDataSource({
  mergedProps,
  tableCreateRows,
  tableReadRows,
  emits,
  VersionCachesController,
  refreshTableDataApiAction,
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
async function refreshTableDataApiAction(params?: FileTableReloadApiParams) {
  loading.value.value = true
  await reloadRows(params)
  loading.value.value = false
}

// 获取筛选框 filetype 数据
const filterFormFileTypeData = ref()
const filterFormFileTypeAllTypeCodesData = ref<string[]>([])
async function handleFilterFormFileType() {
  if (!mergedProps.value.filterFormConfig) return

  loading.value.value = true
  const options = apiQueryFilterFormFileTypeOptions(mergedProps.value.apiParams)
  if (!options) return
  await handleApi(options)
  if (ApiResult.value.isTree) {
    filterFormFileTypeData.value = ApiResult.value.tree
  } else {
    filterFormFileTypeData.value = ApiResult.value.list.map((item: any) => ({
      ...item,
      parentId: item.moduleCode,
    }))
  }

  const traverse = (datas: any[], isDeep = false) => {
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i]
      if (data.nodeType === 'MODULE') {
        data.class = data.class
          ? `${data.class} child--type-module-node`
          : 'child--type-module-node'
      } else {
        data.class = data.class
          ? `${data.class} child--type-normal-node`
          : 'child--type-normal-node'
        filterFormFileTypeAllTypeCodesData.value.push(data.code)
      }

      if (data.children && data.children.length) {
        isDeep = true
        data.children = traverse(data.children, isDeep)
        isDeep = false
      } else {
        if (isDeep) {
          data.class = data.class ? `${data.class} child--deep-node` : 'child--deep-node'
        }
      }
    }

    return datas
  }
  traverse(filterFormFileTypeData.value)
  loading.value.value = false
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

  async function editRowApiAction() {
    const options = rowEditorApiOptions(mergedProps.value.apiParams, changeEventPayload)
    if (!options) return
    await handleApi(options)
  }

  loading.value.value = true
  // 更新表格数据
  await editRow(
    changeEventPayload,
    row,
    tableReadRows,
    tableUpdateRows,
    editRowApiAction,
    refreshTableDataApiAction
  )
  loading.value.value = false

  emits('rowEdit', row)
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
  FileActionUploadForActionUpdateBtnRef.value?.openFilePicker?.()

  emits('rowUpdate', row)
}
// 点击更新时 upload 回调
async function handleFileActionUploadForActionUpdateBtnChange(...args: any) {
  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>

  loading.value.value = true
  // 更新表格数据
  await updateRow(
    files[0],
    actionUpdateClickRow.value!,
    tableReadRows,
    tableUpdateRows,
    refreshTableDataApiAction
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
  try {
    await fileSingleDownload({
      file: row,
      api: mergedProps.value.apiDownloadWaterMarkerFile!,
    })
  } catch (error) {
    console.warn('[tavui TaFileTable] apiDownloadWaterMarkerFile has error', error)
  } finally {
    loading.value.value = false
  }
}

// 下载处理
async function handleDownloadBtnClick(row: FileActionUploadApiResponseRecord) {
  if (!mergedProps.value.apiDownloadFile) {
    console.warn('[tavui TaFileTable] apiDownloadFile is undefined')
    return
  }
  loading.value.value = true
  try {
    await fileSingleDownload({
      file: row,
      api: mergedProps.value.apiDownloadFile!,
    })
  } catch (error) {
    console.warn('[tavui TaFileTable] apiDownloadFile has error', error)
  } finally {
    loading.value.value = false
  }
}

// 删除处理
async function handleDeleteBtnClick(row: FileActionUploadApiResponseRecord) {
  // 立即更新模式调接口删除
  async function deleteRowApiAction() {
    const options = deleteApiOptions(mergedProps.value.apiParams, row)
    if (!options) return
    await handleApi(options)
  }

  loading.value.value = true
  // 删除表格数据
  await deleteRow(
    row,
    tableReadRows,
    tableDeleteRows,
    deleteRowApiAction,
    refreshTableDataApiAction
  )
  loading.value.value = false

  emits('rowDelete', row)
}

// 日志处理
const fileLogModalVisible = ref(false)
const fileLogFile = ref<FileActionUploadApiResponseRecord>()
async function handleLogBtnClick(row: FileActionUploadApiResponseRecord) {
  fileLogFile.value = row
  fileLogModalVisible.value = true
}

const globalConfigUserInfo = useGlobalConfig('userInfo') as Ref<Record<string, any>>

// 处理操作列
const actions = useActions({
  mergedProps,
  handleViewBtnClick,
  handleUpdateBtnClick,
  handleDownloadWatermarkBtnClick,
  handleDownloadBtnClick,
  handleDeleteBtnClick,
  handleLogBtnClick,
  globalConfigUserInfo,
})

// 处理表格列
const columns = useColumns({
  mergedProps,
  tableProRef,
  actions,
  handleCellEditClick,
  hanldeVersionClick,
  globalConfigUserInfo,
})

// 筛选项
const filterFormConfig = useFilterFormConfig({
  mergedProps,
  tableProRef,
  filterFormFileTypeData,
  filterFormFileTypeAllTypeCodesData,
})

// 行编辑配置
const editConfig = computed<any>(() =>
  mergedProps.value.enabledRowEdit &&
  (mergedProps.value.enabledOwner ? isOwnerOrAdmin(globalConfigUserInfo.value) : true)
    ? {
        // trigger: 'manual',
        trigger: 'click',
        mode: 'cell',
        autoClear: true,
      }
    : undefined
)

// fileversion actions 继承 filetable actions 权限
function handleFileVersionActions(
  ...args: [FileVersionTableAction[], { row: FileActionUploadApiResponseRecord }]
) {
  const [fileVersionActions, { row }] = args
  const useFileVersionRowGenerateFileTableActions = actions.value(row)
  return fileVersionActions.map((action) => {
    const existedFileTableAction = useFileVersionRowGenerateFileTableActions.find(
      (_action) => _action.field === action.field
    )
    if (existedFileTableAction) {
      const { enabled, permission, permissionCode } = action
      return {
        ...action,
        enabled,
        permission,
        permissionCode,
      }
    }

    return action
  })
}

// 清空状态
async function cleanup() {
  VersionCachesController.deleteAllFileCaches()
  await tableDeleteRows({
    useLoading: true,
  })
  const tableProInstance = (tableProRef.value as any)?.instance as any
  if (tableProInstance.filterRef?.filterParams !== '{}') {
    await tableProInstance.filterRef?.resetFilterInput?.(false)
    await tableProInstance.filterRef?.resetFilterPannel?.(false)
  }
}

onMounted(async () => {
  await handleFilterFormFileType()
})

// mode 变化置空状态
watch(
  () => mergedProps.value.mode,
  async () => {
    await cleanup()
  }
)
// apiparams 变化重新请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curApiParams, preApiParams) => {
    if (curApiParams && curApiParams !== preApiParams) {
      if (mergedProps.value.immediate) {
        if (!mergedProps.value.dataSource) {
          const curoptions = apiQueryFileOptions(mergedProps.value.apiParams)
          if (!curoptions) return
          const preoptions = apiQueryFileOptions(JSON.parse(preApiParams))
          if (!preoptions) return
          if (JSON.stringify(curoptions.apiParams) !== JSON.stringify(preoptions.apiParams)) {
            loading.value.value = true
            await refreshTableDataApiAction(curoptions.apiParams as any)
            loading.value.value = false
          }
        }

        if (mergedProps.value.filterFormConfig) {
          const curoptions = apiQueryFilterFormFileTypeOptions(mergedProps.value.apiParams)
          if (!curoptions) return
          const preoptions = apiQueryFilterFormFileTypeOptions(JSON.parse(preApiParams))
          if (!preoptions) return
          if (JSON.stringify(curoptions.apiParams) !== JSON.stringify(preoptions.apiParams)) {
            await handleFilterFormFileType()
          }
        }
      }
    }
  }
)

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  tableProRef,
  cleanup,
  reload: refreshTableDataApiAction,
  createRows: tableCreateRows,
  readRows: tableReadRows,
  updateRows: tableUpdateRows,
  deleteRows: tableDeleteRows,
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
        :min-height="200"
        :loading="loading.value"
        :checkbox-config="mergedProps.checkboxConfig"
        :show-operations="mergedProps.showOperations"
        :fill-inner="mergedProps.fillInner"
        :columns="columns"
        :edit-config="editConfig"
        :immediate="mergedProps.immediate"
        :filter-form-config="filterFormConfig"
        v-bind="configTable"
      />
      <TaFileActionUploadForActionUpdateBtn
        ref="FileActionUploadForActionUpdateBtnRef"
        :mode="mergedProps.mode"
        :api-params="mergedProps.apiParams"
        :update-file="actionUpdateClickRow"
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
        :actions="handleFileVersionActions"
      />
      <TaFilePreview
        v-model:visible="filePreviewModalVisible"
        :mode="mergedProps.mode"
        :immediate="true"
        :api-params="mergedProps.apiParams"
        :file="filePreviewFile"
      />
      <TaFileLog
        v-model:visible="fileLogModalVisible"
        :mode="mergedProps.mode"
        :api-params="mergedProps.apiParams"
        :file="fileLogFile"
      />
    </section>
  </template>
</template>
