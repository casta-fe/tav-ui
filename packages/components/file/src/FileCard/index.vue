<script setup lang="ts">
import {
  type Ref,
  computed,
  onBeforeUnmount,
  ref,
  useSlots,
  /*useAttrs*/
  watch,
} from 'vue'
import { List as AList, ButtonGroup, Divider } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import {
  type FileActionUploadLinkEmits,
  type FileActionUploadLinkInstance,
  TaFileActionUploadLink,
} from '../components/FileActionUploadLink'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  TaFileActionUpload,
  TaFileActionUpload as TaFileActionUploadForActionUpdateBtn,
} from '../components/FileActionUpload'
import {
  VersionCaches,
  useDisable,
  useGlobalConfigProps,
  useLoading,
  useMergedProps,
  useRequest,
} from '../hooks'
import { type ArgumentsOf, createId, fileSingleDownload, isOwnerOrAdmin } from '../utils'
import { DEFAULT_APIPARAMS, ns } from '../consts'
import { type FileActionUploadApiResponseRecord } from '../typings'
import { type FileVersionTableAction, TaFileVersion } from '../components/FileVersion'
import { TaFileLog } from '../components/FileLog'
import { TaFilePreview } from '../components/FilePreview'
import { type ApiUpdateFileNameAndLinkParams } from '../components/FileTable'
import { type FileCardProps, fileCardEmits, fileCardProps } from './types'
import { useActions, useItems, useMode } from './hooks'
import ListItem from './components/ListItem'

const DEFAULT_FILECARD_CLASSNAME = ns.b('card')
const DEFAULT_FILECARD_ID = createId(DEFAULT_FILECARD_CLASSNAME)

defineOptions({
  name: 'TaFileCard',
  inheritAttrs: false,
})

const headerElRef = ref<HTMLElement>()
const props = defineProps(fileCardProps)
const emits = defineEmits(fileCardEmits)
const slots = useSlots()
// const attrs = useAttrs()

const FileActionUploadForActionUpdateBtnRef = ref<FileActionUploadInstance>()
const VersionCachesController = new VersionCaches()

// 将 globalconfig 与 fileCard props 结合，同名 props 已 fileCard props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileCardProps>(globalConfigProps, props, 'TaFileCard')

const fileApiParams = ref(props.apiParams)
const fileListInnerUploadDataSource = ref<FileActionUploadApiResponseRecord[]>([])
const fileListInnerUploadLinkDataSource = ref<FileActionUploadApiResponseRecord[]>([])
const fileListDataSource = ref(
  props.dataSource
    ? [
        ...fileListInnerUploadDataSource.value,
        ...fileListInnerUploadLinkDataSource.value,
        ...props.dataSource,
      ]
    : [...fileListInnerUploadDataSource.value, ...fileListInnerUploadLinkDataSource.value]
)
watch(
  () => [JSON.stringify(props.apiParams), JSON.stringify(props.dataSource)],
  async ([curapiParams, curDataSource], [preapiParams, preDataSource]) => {
    if (curapiParams !== preapiParams) {
      fileApiParams.value = props.apiParams
    }

    if (curDataSource !== preDataSource) {
      fileListDataSource.value = [
        ...(props.dataSource
          ? [
              ...fileListInnerUploadDataSource.value,
              ...fileListInnerUploadLinkDataSource.value,
              ...props.dataSource,
            ]
          : [...fileListInnerUploadDataSource.value, ...fileListInnerUploadLinkDataSource.value]),
      ]
    }
  }
)

const fileActionUploadRef = ref<FileActionUploadInstance>()
const fileActionUploadProps = computed(() => {
  return {
    ...props.fileActionUpload,
    mode: props.mode,
    apiParams: {
      appId: fileApiParams.value.appId,
      moduleCode: fileApiParams.value.moduleCode,
      typeCode: fileApiParams.value.typeCode,
      businessId: fileApiParams.value.businessId,
      businessKey: fileApiParams.value.businessKey,
      businessParamsJson:
        fileApiParams.value.businessParamsJson ?? DEFAULT_APIPARAMS.businessParamsJson, // 合并默认值
      fileName: fileApiParams.value.fileName,
      ...(props.fileActionUpload?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
    },
    buttonType: 'primary',
  }
})

const fileActionUploadLinkRef = ref<FileActionUploadLinkInstance>()
const fileActionUploadLinkProps = computed(() => {
  return {
    ...props.fileActionUploadLink,
    mode: props.mode,
    apiParams: {
      appId: fileApiParams.value.appId,
      moduleCode: fileApiParams.value.moduleCode,
      typeCode: fileApiParams.value.typeCode,
      businessId: fileApiParams.value.businessId,
      businessKey: fileApiParams.value.businessKey,
      businessParamsJson:
        fileApiParams.value.businessParamsJson ?? DEFAULT_APIPARAMS.businessParamsJson, // 合并默认值
      ...(props.fileActionUploadLink?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
    },
    getFormContainer: () => headerElRef.value,
  }
})

function handleFileActionUploadChangeValidateSuccessChange(...args: any) {
  emits(
    'fileActionUpload:validateSuccessChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadEmits['validateSuccessChange']>)
  )
}

function handleFileActionUploadChangeValidateFailureChange(...args: any) {
  emits(
    'fileActionUpload:validateFailureChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadEmits['validateFailureChange']>)
  )
}

function handleFileActionUploadChange(...args: any) {
  emits(
    'fileActionUpload:uploadedChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>)
  )

  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>
  fileListInnerUploadDataSource.value = [...files, ...fileListInnerUploadDataSource.value]
  fileListDataSource.value = [...files, ...fileListDataSource.value]
}

function handleFileActionUploadLinkChangeValidateSuccessChange(...args: any) {
  emits(
    'fileActionUploadLink:validateSuccessChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadLinkEmits['validateSuccessChange']>)
  )
}

function handleFileActionUploadLinkChangeValidateFailureChange(...args: any) {
  emits(
    'fileActionUploadLink:validateFailureChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadLinkEmits['validateFailureChange']>)
  )
}

function handleFileActionUploadLinkChange(...args: any) {
  emits(
    'fileActionUploadLink:uploadedChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadLinkEmits['uploadedChange']>)
  )

  const [files] = args as unknown as ArgumentsOf<FileActionUploadLinkEmits['uploadedChange']>
  fileListInnerUploadLinkDataSource.value = [...files, ...fileListInnerUploadLinkDataSource.value]
  fileListDataSource.value = [...files, ...fileListDataSource.value]
}

// 统一内部 loading 状态
const _loading = ref(false)
const loading = computed({
  get() {
    return _loading
  },
  set(newLoading: any) {
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
  setDisable,
  setLoading,
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

  // const options = historyApiOptions(mergedProps.value.apiParams, row)
  // if (!options) {
  //   loading.value.value = false
  //   return []
  // }

  // const { success, data } = await mergedProps.value.apiQueryFileHistory!(options.apiParams)
  // if (success === true && data) {
  //   loading.value.value = false
  //   return [...(VersionCachesController.createFileCaches(row, data) ?? [])]
  // }

  loading.value.value = false
  return []
}

// 立即更新模式操作后（更新、删除）刷新数据
async function refreshTableDataApiAction(params?: any) {
  loading.value.value = true
  // await reloadRows(params)
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

  // async function editRowApiAction() {
  //   const options = rowEditorApiOptions(mergedProps.value.apiParams, changeEventPayload)
  //   if (!options) return
  //   await handleApi(options)
  // }

  loading.value.value = true
  // // 更新表格数据
  // await editRow(
  //   changeEventPayload,
  //   row,
  //   tableReadRows,
  //   tableUpdateRows,
  //   editRowApiAction,
  //   refreshTableDataApiAction
  // )
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
  // await updateRow(
  //   files[0],
  //   actionUpdateClickRow.value!,
  //   tableReadRows,
  //   tableUpdateRows,
  //   refreshTableDataApiAction
  // )
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
  // // 立即更新模式调接口删除
  // async function deleteRowApiAction() {
  //   const options = deleteApiOptions(mergedProps.value.apiParams, row)
  //   if (!options) return
  //   await handleApi(options)
  // }

  loading.value.value = true
  // // 删除表格数据
  // await deleteRow(
  //   row,
  //   tableReadRows,
  //   tableDeleteRows,
  //   deleteRowApiAction,
  //   refreshTableDataApiAction
  // )
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
const items = useItems({
  mergedProps,
  actions,
  handleCellEditClick,
  hanldeVersionClick,
  globalConfigUserInfo,
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
function cleanup() {
  close()
}

// mode 变化置空状态
watch(
  () => mergedProps.value.mode,
  async () => {
    cleanup()
    // if (mergedProps.value.immediate && modalVisible.value) {
    //   loading.value.value = true
    //   await useModeFetchDataSource()
    //   setTimeout(() => {
    //     loading.value.value = false
    //   }, 150)
    // }
  }
)
// apiparams 变化重新请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curApiParams, preApiParams) => {
    if (curApiParams && curApiParams !== preApiParams) {
      // if (mergedProps.value.immediate && modalVisible.value) {
      //   loading.value.value = true
      //   await useModeFetchDataSource()
      //   setTimeout(() => {
      //     loading.value.value = false
      //   }, 150)
      // }
    }
  }
)

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({
  fileActionUploadRef,
  fileActionUploadLinkRef,
  cleanup,
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section
      :id="DEFAULT_FILECARD_ID"
      :class="{
        [DEFAULT_FILECARD_CLASSNAME]: true,
        [`${DEFAULT_FILECARD_CLASSNAME}--required`]: mergedProps.required,
        [`${DEFAULT_FILECARD_CLASSNAME}--uploaded`]:
          mergedProps.dataSource && mergedProps.dataSource.length > 0,
      }"
    >
      <section
        v-if="mergedProps.headerVisible"
        ref="headerElRef"
        :class="`${DEFAULT_FILECARD_CLASSNAME}-header`"
      >
        <div v-if="mergedProps.labelVisible" :class="`${DEFAULT_FILECARD_CLASSNAME}-meta`">
          <label :class="`${DEFAULT_FILECARD_CLASSNAME}-meta__label`">
            {{ mergedProps.label }}
          </label>
          <Divider type="vertical" />
          <span :class="`${DEFAULT_FILECARD_CLASSNAME}-meta__upload-status`">
            {{
              mergedProps.dataSource && mergedProps.dataSource.length > 0
                ? tavI18n('Tav.file.cards.2')
                : tavI18n('Tav.file.cards.1')
            }}
          </span>
        </div>
        <div
          v-if="mergedProps.headerActionsVisible && mergedProps.mode !== 'read'"
          :class="`${DEFAULT_FILECARD_CLASSNAME}-actions`"
        >
          <ButtonGroup>
            <TaFileActionUploadLink
              ref="fileActionUploadLinkRef"
              v-bind="fileActionUploadLinkProps"
              @validate-success-change="handleFileActionUploadLinkChangeValidateSuccessChange"
              @validate-failure-change="handleFileActionUploadLinkChangeValidateFailureChange"
              @uploaded-change="handleFileActionUploadLinkChange"
            />
            <TaFileActionUpload
              ref="fileActionUploadRef"
              v-bind="fileActionUploadProps"
              @validate-success-change="handleFileActionUploadChangeValidateSuccessChange"
              @validate-failure-change="handleFileActionUploadChangeValidateFailureChange"
              @uploaded-change="handleFileActionUploadChange"
            >
              <template v-if="slots['FileActionUploadButton']" #FileActionUploadButton="data">
                <slot name="FileActionUploadButton" v-bind="data || {}" />
              </template>
            </TaFileActionUpload>
          </ButtonGroup>
        </div>
      </section>
      <template v-if="mergedProps.dataSource && mergedProps.dataSource.length > 0">
        <section :class="`${DEFAULT_FILECARD_CLASSNAME}-main`">
          <AList
            :class="`${DEFAULT_FILECARD_CLASSNAME}-list`"
            item-layout="horizontal"
            :loading="mergedProps.loading"
            :data-source="mergedProps.dataSource"
          >
            <template #loadMore>
              <!-- {{ loadMore: () => createLoadMore(), renderItem: ({ item }) => -->
              loadMore
            </template>
            <template #renderItem="{ item }">
              <!-- <Meta data="{item}" onItemClick="{handleMetaItemClick}" /> -->
              <ListItem
                :key="item.id"
                :row="item"
                :renders="items"
                :class-name="`${DEFAULT_FILECARD_CLASSNAME}-list-item`"
              />
            </template>
          </AList>
          <TaFileActionUploadForActionUpdateBtn
            ref="FileActionUploadForActionUpdateBtnRef"
            :mode="mergedProps.mode"
            :api-params="mergedProps.apiParams"
            :validate-type-code="false"
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
        <section v-show="false" :class="`${DEFAULT_FILECARD_CLASSNAME}-footer`">
          <div :class="`${DEFAULT_FILECARD_CLASSNAME}-error`">
            <!-- TODO: validate error -->
          </div>
        </section>
      </template>
    </section>
  </template>
</template>
