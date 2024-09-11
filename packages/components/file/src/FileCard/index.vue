<script setup lang="ts">
import {
  type Ref,
  computed,
  onBeforeUnmount,
  ref,
  useSlots,
  /*useAttrs*/
  watch,
  onMounted,
  toRaw,
} from 'vue'
import { List as AList, ButtonGroup, Divider, Tooltip } from 'ant-design-vue'
import AsyncValidator from 'async-validator'
import { tavI18n } from '@tav-ui/locales'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
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
import {
  type ArgumentsOf,
  createId,
  extendCurrentRowActionsAuth,
  fileSingleDownload,
  isFullNameColEdit,
} from '../utils'
import { DEFAULT_APIPARAMS, ns } from '../consts'
import { type FileActionUploadApiResponseRecord } from '../typings'
import { TaFileVersion } from '../components/FileVersion'
import { TaFileLog } from '../components/FileLog'
import { TaFilePreview } from '../components/FilePreview'
import {
  type ApiQueryFileListParams,
  type ApiUpdateFileNameAndLinkParams,
} from '../components/FileTable'
import {
  type CardValidateCallback,
  type CardValidateFailure,
  type FileCardProps,
  fileCardEmits,
  fileCardProps,
} from './types'
import {
  useActions,
  useCardActions,
  useDataSource,
  useHandleDataSource,
  useItems,
  useMode,
  useRules,
} from './hooks'
import ListItem from './components/ListItem'

const DEFAULT_FILECARD_CLASSNAME = ns.b('card')
const DEFAULT_FILECARD_ID = createId(DEFAULT_FILECARD_CLASSNAME)
const { createMessage } = useMessage()

defineOptions({
  name: 'TaFileCard',
  inheritAttrs: false,
})

const headerExtraElRef = ref<HTMLElement>()
const props = defineProps(fileCardProps)
const emits = defineEmits(fileCardEmits)
const slots = useSlots()
// const attrs = useAttrs()

const FileActionUploadForActionUpdateBtnRef = ref<FileActionUploadInstance>()
const VersionCachesController = new VersionCaches()

// 将 globalconfig 与 fileCard props 结合，同名 props 已 fileCard props 为主
const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<FileCardProps>(globalConfigProps, props, 'TaFileCard', {
  ...DEFAULT_APIPARAMS,
})

const fileApiParams = ref(props.apiParams)
watch(
  () => JSON.stringify(props.apiParams),
  async (curapiParams, preapiParams) => {
    if (curapiParams !== preapiParams) {
      fileApiParams.value = props.apiParams
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
    buttonSize: 'small',
    buttonIcon: false,
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
    getFormContainer: () => headerExtraElRef.value,
    buttonSize: 'small',
    buttonIcon: false,
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

const { setDisable } = useDisable()
const { setLoading } = useLoading()
const {
  result: ApiResult,
  error: ApiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
  loading,
})

const hasEmptyDataSource = computed(() => {
  return (
    // 数据从 cards 通过 datasource 属性下发则代表有标准的文件数据
    mergedProps.value.__dataSourceFromCards ||
    // 用户通过 datsource 传入标准文件数据或双向绑定的数据
    !mergedProps.value.dataSource
  )
})

const {
  apiActions: { apiQueryFileOptions },
  dataSource,
  handleDataSource,
  setDataSource,
  handleApiDataSource,
} = useHandleDataSource({
  mergedProps,
  emits,
  VersionCachesController,
  ApiResult,
  ApiError,
  handleApi,
})

// 针对业务抽象不同模式进行数据处理
const {
  apiActions: { rowEditorApiOptions, historyApiOptions, deleteApiOptions },
  dataActions: { reloadRows, editRow, updateRow, deleteRow },
} = useMode({
  mergedProps,
  emits,
  VersionCachesController,
  handleApiDataSource,
  hasEmptyDataSource,
})

const { cardCreateRows, cardReadRows, cardUpdateRows, cardDeleteRows } = useCardActions({
  mergedProps,
  dataSource,
  setDataSource,
  loading,
})

useDataSource({
  mergedProps,
  emits,
  VersionCachesController,
  dataSource,
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
      return extendCurrentRowActionsAuth(row, VersionCachesController.readFileCaches(row.actualId!))
  }

  const options = historyApiOptions(mergedProps.value.apiParams, row)
  if (!options) {
    loading.value.value = false
    return []
  }

  const { success, data } = await mergedProps.value.apiQueryFileHistory!(options.apiParams)
  if (success === true && data) {
    loading.value.value = false
    const result = [
      ...(VersionCachesController.createFileCaches(row, extendCurrentRowActionsAuth(row, data)) ??
        []),
    ]

    // 请求 history 接口后需要重新更新 actualids
    const dataSource = JSON.parse(JSON.stringify(await cardReadRows()))
    if (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') {
      emits('actualidsChange', VersionCachesController.getCaches())
    } else {
      emits(
        'actualidsChange',
        dataSource.map((file: any) => file.actualId)
      )
    }

    return result
  }

  loading.value.value = false
  return []
}

// 立即更新模式操作后（更新、删除）刷新数据
async function refreshCardDataApiAction(params?: Partial<ApiQueryFileListParams>) {
  await reloadRows(params)
}

// 行编辑处理
async function handleRowEditClick(
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
    cardUpdateRows,
    editRowApiAction,
    hasEmptyDataSource,
    refreshCardDataApiAction
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

/// 更新处理
const actionUpdateClickRow = ref<
  FileActionUploadApiResponseRecord & { cache: FileActionUploadApiResponseRecord[] | undefined }
>()
async function handleUpdateBtnClick(row: FileActionUploadApiResponseRecord) {
  if (mergedProps.value.mode === 'update' || mergedProps.value.mode === 'updateInstantly') {
    await beforeReadFileCaches(row)
  }

  // actionUpdateClickRow.value = row
  actionUpdateClickRow.value = { ...row, cache: VersionCachesController['caches'][row.actualId!] } // 因为不想把 VersionCachesController 当作 fileupload props 传过去所以这里把 cache 挂在 row 上
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
    cardUpdateRows,
    hasEmptyDataSource,
    refreshCardDataApiAction
  )
  loading.value.value = false

  actionUpdateClickRow.value = undefined
}

// 水印下载处理
async function handleDownloadWatermarkBtnClick(row: FileActionUploadApiResponseRecord) {
  if (!mergedProps.value.apiDownloadWaterMarkerFile) {
    console.warn('[tavui TaFileCard] apiDownloadWaterMarkerFile is undefined')
    return
  }
  loading.value.value = true
  try {
    await fileSingleDownload({
      file: row,
      api: mergedProps.value.apiDownloadWaterMarkerFile!,
    })
  } catch (error) {
    console.warn('[tavui TaFileCard] apiDownloadWaterMarkerFile has error', error)
  } finally {
    loading.value.value = false
  }
}

// 下载处理
async function handleDownloadBtnClick(row: FileActionUploadApiResponseRecord) {
  if (!mergedProps.value.apiDownloadFile) {
    console.warn('[tavui TaFileCard] apiDownloadFile is undefined')
    return
  }
  loading.value.value = true
  try {
    await fileSingleDownload({
      file: row,
      api: mergedProps.value.apiDownloadFile!,
    })
  } catch (error) {
    console.warn('[tavui TaFileCard] apiDownloadFile has error', error)
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
    cardDeleteRows,
    deleteRowApiAction,
    hasEmptyDataSource,
    refreshCardDataApiAction,
    validate
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
  VersionCachesController,
})

// 处理表格列
const items = useItems({
  mergedProps,
  actions,
  handleRowEditClick,
  hanldeVersionClick,
  // globalConfigUserInfo,
})

// 行编辑配置
const editConfig = computed<any>(() =>
  mergedProps.value.enabledRowEdit
    ? {
        // trigger: 'manual',
        trigger: 'click',
        mode: 'cell',
        autoClear: true,
        beforeEditMethod: ({ row: _row }: Record<string, any>) => {
          const row = _row as FileActionUploadApiResponseRecord
          const isEdit = isFullNameColEdit(
            mergedProps.value.enabledRowEdit,
            mergedProps.value.mode,
            mergedProps.value.enabledOwner,
            globalConfigUserInfo.value,
            row.owner
          )

          if (!isEdit) {
            createMessage.warn(`${tavI18n('Tav.common.notAuthorised')}`)
          }
          return isEdit
        },
      }
    : undefined
)

// /**
//  * 因为继承了当前行的 actions 权限数据，这里直接使用 filetable 的 actions 构造最新的 filetable actions 把 enabled 数据下发
//  * 需要时开启
//  * @param fileVersionTableActions
//  * @param info
//  */
// function handleFileVersionActions(
//   fileVersionTableActions: FileVersionTableAction[],
//   info: { row: FileActionUploadApiResponseRecord }
// ) {
//   return fileVersionTableActions.filter((fileVersionTableAction) =>
//     actions
//       .value(info.row)
//       .find((action) => action.field === fileVersionTableAction.field && action.enabled)
//   )
// }

// 处理 rules
const rules = useRules({
  mergedProps,
})

const isRequired = computed(() => !!rules.value.find((rule) => rule.required))

function getRuleByTriggerName(trigger: string) {
  return (toRaw(rules).value ?? [])
    .filter((rule) => {
      if (!rule.trigger || trigger === '') return true
      if (Array.isArray(rule.trigger)) {
        return rule.trigger.indexOf(trigger) > -1
      } else {
        return rule.trigger === trigger
      }
    })
    .map((rule) => ({ ...rule }))
}

const validateMessage = ref('')
async function validate(trigger: string, callback?: CardValidateCallback) {
  const _rules = getRuleByTriggerName(trigger)
  if (_rules.length === 0) {
    callback?.(true)
    return true
  }

  if (_rules && _rules.length > 0) {
    _rules.forEach((rule) => {
      Reflect.deleteProperty(rule, 'trigger')
      Reflect.deleteProperty(rule, 'key')
    })
  }

  const validator = new AsyncValidator({ [mergedProps.value.value!]: _rules })
  return validator
    .validate({ [mergedProps.value.value!]: dataSource.value }, { firstFields: true })
    .then(() => {
      callback?.(true)
      return true
    })
    .catch((err: CardValidateFailure) => {
      const { fields, errors } = err
      validateMessage.value = errors ? errors[0].message ?? '' : ''
      callback?.(false, fields)
      return callback ? false : Promise.reject(fields)
    })
}

async function retriggerHandleDataSource() {
  if (mergedProps.value.dataSource || mergedProps.value.immediate) {
    await handleDataSource()
  }
}

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

async function handleFileActionUploadChange(...args: any) {
  emits(
    'fileActionUpload:uploadedChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>)
  )

  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>
  if (mergedProps.value.mode === 'updateInstantly' && hasEmptyDataSource.value) {
    await refreshCardDataApiAction({ typeCodes: [mergedProps.value.value!] })
  } else {
    setDataSource([...files, ...dataSource.value])
  }
  mergedProps.value.autoValidate &&
    (await validate(
      'change',
      (...args: any[]) => args[1] && console.warn('[tavui TaFileCard] delete has error: ', args[1])
    ))
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

async function handleFileActionUploadLinkChange(...args: any) {
  emits(
    'fileActionUploadLink:uploadedChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadLinkEmits['uploadedChange']>)
  )

  const [files] = args as unknown as ArgumentsOf<FileActionUploadLinkEmits['uploadedChange']>
  if (mergedProps.value.mode === 'updateInstantly' && hasEmptyDataSource.value) {
    await refreshCardDataApiAction({ typeCodes: [mergedProps.value.value!] })
  } else {
    setDataSource([...files, ...dataSource.value])
  }
  mergedProps.value.autoValidate &&
    (await validate(
      'change',
      (...args: any[]) => args[1] && console.warn('[tavui TaFileCard] delete has error: ', args[1])
    ))
}

// 清空状态
function cleanup() {
  fileActionUploadRef.value?.cleanup()
  fileActionUploadLinkRef.value?.cleanup()
  VersionCachesController.deleteAllFileCaches()
  setDataSource([])
}

onMounted(async () => {
  await retriggerHandleDataSource()
})

// mode 变化置空状态
watch(
  () => mergedProps.value.mode,
  async () => {
    cleanup()
  }
)
// apiparams 变化重新请求
watch(
  () => JSON.stringify(mergedProps.value.apiParams),
  async (curApiParams, preApiParams) => {
    if (curApiParams && curApiParams !== preApiParams) {
      if (!mergedProps.value.dataSource) {
        const curoptions = apiQueryFileOptions(mergedProps.value.apiParams)
        if (!curoptions) return
        const preoptions = apiQueryFileOptions(JSON.parse(preApiParams))
        if (!preoptions) return
        if (JSON.stringify(curoptions.apiParams) !== JSON.stringify(preoptions.apiParams)) {
          loading.value.value = true
          await refreshCardDataApiAction(curoptions.apiParams as any)
          loading.value.value = false
        }
      }
    }
  }
)
// datasource 变化
watch(
  () => JSON.stringify(mergedProps.value.dataSource),
  async (curdatasource, predatasource) => {
    if (curdatasource && curdatasource !== predatasource) {
      VersionCachesController.deleteAllFileCaches()
      await retriggerHandleDataSource()
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
  reload: refreshCardDataApiAction,
  createRows: cardCreateRows,
  readRows: cardReadRows,
  updateRows: cardUpdateRows,
  deleteRows: cardDeleteRows,
  getDataSource: () => dataSource.value,
  validate: (callback?: CardValidateCallback) => validate('change', callback),
  clearValidate: () => {
    validateMessage.value = ''
  },
})
</script>

<template>
  <template v-if="mergedProps.visible">
    <section
      :id="DEFAULT_FILECARD_ID"
      :class="{
        [DEFAULT_FILECARD_CLASSNAME]: true,
        [`${DEFAULT_FILECARD_CLASSNAME}--${mergedProps.value}`]: mergedProps.value,
        [`${DEFAULT_FILECARD_CLASSNAME}--uploaded`]: dataSource && dataSource.length > 0,
        [`${DEFAULT_FILECARD_CLASSNAME}--required`]: isRequired,
        [`${DEFAULT_FILECARD_CLASSNAME}--validated-error`]: !!validateMessage,
      }"
    >
      <section v-if="mergedProps.headerVisible" :class="`${DEFAULT_FILECARD_CLASSNAME}-header`">
        <div v-if="mergedProps.labelVisible" :class="`${DEFAULT_FILECARD_CLASSNAME}-meta`">
          <Tooltip placement="top" :destroy-tooltip-on-hide="true">
            <template #title>
              <span>
                {{ mergedProps.label }}
              </span>
            </template>
            <span :class="`${DEFAULT_FILECARD_CLASSNAME}-meta__label`">
              {{ mergedProps.label }}
            </span>
          </Tooltip>
          <span :class="`${DEFAULT_FILECARD_CLASSNAME}-meta__label-required`">*</span>
          <Divider type="vertical" />
          <span :class="`${DEFAULT_FILECARD_CLASSNAME}-meta__upload-status`">
            {{
              dataSource && dataSource.length > 0
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
      <section
        v-if="mergedProps.headerVisible"
        ref="headerExtraElRef"
        :class="`${DEFAULT_FILECARD_CLASSNAME}-header-extra`"
      />
      <template v-if="dataSource && dataSource.length > 0">
        <section
          :class="`${DEFAULT_FILECARD_CLASSNAME}-main`"
          :style="
            mergedProps.maxHeight
              ? { maxHeight: `${mergedProps.maxHeight}px`, overflowY: 'auto' }
              : {}
          "
        >
          <AList
            :class="`${DEFAULT_FILECARD_CLASSNAME}-list`"
            item-layout="horizontal"
            :loading="loading.value"
            :data-source="dataSource"
          >
            <template #renderItem="{ item }">
              <ListItem
                :key="item.id"
                :row="item"
                :renders="items"
                :class-name="`${DEFAULT_FILECARD_CLASSNAME}-list-item`"
                :edit-config="editConfig"
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
          />
          <!-- :actions="handleFileVersionActions" 需要时再开启 -->
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
      <section :class="`${DEFAULT_FILECARD_CLASSNAME}-footer`">
        <div
          v-if="!!validateMessage"
          :class="`${DEFAULT_FILECARD_CLASSNAME}-error-message`"
          v-html="validateMessage"
        />
      </section>
    </section>
  </template>
</template>
