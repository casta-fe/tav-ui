<script setup lang="ts">
import { type UnwrapRef, computed, ref, /*useAttrs,*/ useSlots } from 'vue'
import { ButtonGroup as AButtonGroup } from 'ant-design-vue'
import {
  type FileTypeSelectEmits,
  type FileTypeSelectInstance,
  TaFileTypeSelect,
} from './components/FileTypeSelect'
import {
  type FileActionUploadEmits,
  type FileActionUploadInstance,
  TaFileActionUpload,
} from './components/FileActionUpload'
import {
  type FileTableEmits,
  type FileTableInstance,
  type FileTableReloadApiParams,
  TaFileTable,
} from './components/FileTable'
import { type FileInstance, fileEmits, fileProps } from './typings'
import {
  DEFAULT_APIPARAMS,
  DEFAULT_FILEACTIONS_CLASSNAME,
  DEFAULT_FILEACTIONS_ID,
  DEFAULT_FILE_CLASSNAME,
  DEFAULT_FILE_ID,
} from './consts'
import { type ArgumentsOf } from './utils'
import {
  type FileActionUploadLinkEmits,
  type FileActionUploadLinkInstance,
  TaFileActionUploadLink,
} from './components/FileActionUploadLink'

defineOptions({
  name: 'TaFile',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileInstance['elRef']>>()
const headerElRef = ref<HTMLElement>()
const props = defineProps(fileProps)
const emits = defineEmits(fileEmits)
const slots = useSlots()
// const attrs = useAttrs()

// 对 file 组件的 apiparams 进行 computed 方便属性下发
const _fileApiParams = ref(props.apiParams)
const fileApiParams = computed({
  get() {
    return _fileApiParams
  },
  set(curFileApiParams: any) {
    _fileApiParams.value = { ...curFileApiParams.value }
  },
})

const fileTypeSelectRef = ref<FileTypeSelectInstance>()
const fileTypeSelectProps = computed(() => ({
  ...props.fileTypeSelect,
  mode: props.mode,
  apiParams: {
    appId: fileApiParams.value.value.appId,
    moduleCode: fileApiParams.value.value.moduleCode,
    typeCodes: fileApiParams.value.value.typeCodes,
    permissionControl:
      fileApiParams.value.value.permissionControl ?? DEFAULT_APIPARAMS.permissionControl, // 合并默认值
    ...(props.fileTypeSelect?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
  },
}))

const fileActionUploadRef = ref<FileActionUploadInstance>()
const fileActionUploadProps = computed(() => ({
  ...props.fileActionUpload,
  mode: props.mode,
  apiParams: {
    appId: fileApiParams.value.value.appId,
    // files: fileApiParams.value.value.files,
    moduleCode: fileApiParams.value.value.moduleCode,
    typeCode: fileApiParams.value.value.typeCode,
    businessId: fileApiParams.value.value.businessId,
    businessKey: fileApiParams.value.value.businessKey,
    businessParamsJson:
      fileApiParams.value.value.businessParamsJson ?? DEFAULT_APIPARAMS.businessParamsJson, // 合并默认值
    fileName: fileApiParams.value.value.fileName,
    ...(props.fileActionUpload?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
  },
}))

const fileActionUploadLinkRef = ref<FileActionUploadLinkInstance>()
const fileActionUploadLinkProps = computed(() => ({
  ...props.fileActionUploadLink,
  mode: props.mode,
  apiParams: {
    appId: fileApiParams.value.value.appId,
    address: fileApiParams.value.value.address,
    moduleCode: fileApiParams.value.value.moduleCode,
    name: fileApiParams.value.value.name,
    typeCode: fileApiParams.value.value.typeCode,
    businessId: fileApiParams.value.value.businessId,
    businessKey: fileApiParams.value.value.businessKey,
    businessParamsJson:
      fileApiParams.value.value.businessParamsJson ?? DEFAULT_APIPARAMS.businessParamsJson, // 合并默认值
    ...(props.fileActionUploadLink?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
  },
  getFormContainer: () => headerElRef.value,
}))

// const __fileTableProps = ref<FileTableProps & GlobalConfigFileProps['TaFileTable']>( // 类型太深，ts解析器打包报错，先给 any
const __fileTableProps = ref<any>(props.fileTable ?? ({} as any))
const _fileTableProps = computed({
  get() {
    return __fileTableProps
  },
  set(curFileTableProps: any) {
    __fileTableProps.value = { ...curFileTableProps.value }
  },
})
const fileTableRef = ref<FileTableInstance>()
const fileTableProps = computed(() => ({
  ..._fileTableProps.value.value,
  mode: props.mode,
  apiParams: {
    typeCode: fileApiParams.value.value.typeCode,
    businessId: fileApiParams.value.value.businessId,
    businessParamsJson:
      fileApiParams.value.value.businessParamsJson ?? DEFAULT_APIPARAMS.businessParamsJson, // 合并默认值

    appId: fileApiParams.value.value.appId,
    businessCheck: fileApiParams.value.value.businessCheck ?? DEFAULT_APIPARAMS.businessCheck, // 合并默认值
    businessIds: fileApiParams.value.value.businessIds,
    businessKey: fileApiParams.value.value.businessKey,
    endTime: fileApiParams.value.value.endTime,
    finalTypeCodes: fileApiParams.value.value.finalTypeCodes,
    id: fileApiParams.value.value.id,
    includeStaging: fileApiParams.value.value.includeStaging ?? DEFAULT_APIPARAMS.includeStaging, // 合并默认值
    moduleCode: fileApiParams.value.value.moduleCode,
    permissionControl:
      fileApiParams.value.value.permissionControl ?? DEFAULT_APIPARAMS.permissionControl, // 合并默认值
    searchValue: fileApiParams.value.value.searchValue,
    startTime: fileApiParams.value.value.startTime,
    suffix: fileApiParams.value.value.suffix,
    typeCodes: fileApiParams.value.value.typeCodes,

    file: fileApiParams.value.value.file,
    fileActualId: fileApiParams.value.value.fileActualId,
    instantUpdate: fileApiParams.value.value.instantUpdate,

    actualIds: fileApiParams.value.value.actualIds,

    ...(_fileTableProps.value.value?.apiParams ?? {}), // 以子组件中的 apiparams 为准，这里最后覆盖
  },
}))

function handleFileTypeSelectChange(...args: any) {
  const data = args as unknown as ArgumentsOf<FileTypeSelectEmits['select']>
  const [typeCode, option] = data
  fileApiParams.value.value = {
    ..._fileApiParams.value,
    typeCode: typeCode === undefined && option === undefined ? '' : `${typeCode}`,
  }

  emits('fileTypeSelect:change', ...(args as unknown as ArgumentsOf<FileTypeSelectEmits['change']>))
}

function handleFileTypeSelectOptionsChange(...args: any) {
  emits(
    'fileTypeSelect:optionsChange',
    ...(args as unknown as ArgumentsOf<FileTypeSelectEmits['optionsChange']>)
  )
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

function handleFileActionUploadChange(...args: any) {
  emits(
    'fileActionUpload:uploadedChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>)
  )

  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>
  // 上传成功后将文件数据当作外部准备好的表格数据通过 datasource 传入
  _fileTableProps.value.value = {
    ..._fileTableProps.value.value,
    dataSource: [...files],
  }
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
  // 上传成功后将文件数据当作外部准备好的表格数据通过 datasource 传入
  _fileTableProps.value.value = {
    ..._fileTableProps.value.value,
    dataSource: [...files],
  }
}

function handleFileTableChange(...args: any) {
  const _args = args as unknown as ArgumentsOf<FileTableEmits['change']>
  emits('change', ..._args)
}

function handleFileTableActualidsChange(...args: any) {
  const _args = args as unknown as ArgumentsOf<FileTableEmits['actualidsChange']>
  emits('update:fileActualIds', ..._args)
}

async function fileTableRelod(params?: FileTableReloadApiParams) {
  await fileTableRef.value?.reload?.(params)
}
async function fileTableCreateRows(...args: ArgumentsOf<FileTableInstance['createRows']>) {
  await fileTableRef.value?.createRows(...args)
}
async function fileTableReadRows(...args: ArgumentsOf<FileTableInstance['readRows']>) {
  const rows = await fileTableRef.value?.readRows(...args)
  return rows
}
async function fileTableUpdateRows(...args: ArgumentsOf<FileTableInstance['updateRows']>) {
  await fileTableRef.value?.updateRows(...args)
}
async function fileTableDeleteRows(...args: ArgumentsOf<FileTableInstance['deleteRows']>) {
  await fileTableRef.value?.deleteRows(...args)
}

defineExpose({
  elRef,
  fileTypeSelectRef,
  fileActionUploadRef,
  fileActionUploadLinkRef,
  fileTableRef,
  fileTableReload: fileTableRelod,
  fileTableCreateRows,
  fileTableReadRows,
  fileTableUpdateRows,
  fileTableDeleteRows,
})
</script>

<template>
  <section :id="DEFAULT_FILE_ID" ref="elRef" :class="DEFAULT_FILE_CLASSNAME">
    <section
      v-if="props.headerVisible"
      ref="headerElRef"
      :class="`${DEFAULT_FILE_CLASSNAME}-header`"
    >
      <section :class="`${DEFAULT_FILE_CLASSNAME}-title-wrapper`">
        <template v-if="slots.FileTitle">
          <slot name="FileTitle" />
        </template>
        <template v-else>
          <div v-if="props.titleVisible" :class="`${DEFAULT_FILE_CLASSNAME}-title`">
            {{ props.title }}
          </div>
        </template>
      </section>

      <section
        v-if="props.headerActionsVisible && props.mode !== 'read'"
        :class="`${DEFAULT_FILE_CLASSNAME}-header-actions`"
      >
        <section :class="`${DEFAULT_FILE_CLASSNAME}-type-select-wrapper`">
          <template v-if="slots.FileTypeSelect">
            <slot name="FileTypeSelect" v-bind="fileTypeSelectProps" />
          </template>
          <template v-else>
            <TaFileTypeSelect
              ref="fileTypeSelectRef"
              v-bind="fileTypeSelectProps"
              @change="handleFileTypeSelectChange"
              @options-change="handleFileTypeSelectOptionsChange"
            />
          </template>
        </section>
        <section :class="`${DEFAULT_FILE_CLASSNAME}-actions-wrapper`">
          <template v-if="slots.FileActions">
            <slot name="FileActions" />
          </template>
          <template v-else>
            <template v-if="props.fileActionsVisible">
              <section :id="DEFAULT_FILEACTIONS_ID" :class="DEFAULT_FILEACTIONS_CLASSNAME">
                <AButtonGroup>
                  <template v-if="slots['FileActionPrefix']">
                    <slot name="FileActionPrefix" />
                  </template>

                  <template v-if="slots['FileActionUpload']">
                    <slot name="FileActionUpload" v-bind="fileActionUploadProps" />
                  </template>
                  <template v-else>
                    <TaFileActionUpload
                      ref="fileActionUploadRef"
                      v-bind="fileActionUploadProps"
                      @validate-success-change="handleFileActionUploadChangeValidateSuccessChange"
                      @validate-failure-change="handleFileActionUploadChangeValidateFailureChange"
                      @uploaded-change="handleFileActionUploadChange"
                    />
                  </template>

                  <template v-if="slots['FileActionMiddle']">
                    <slot name="FileActionMiddle" />
                  </template>

                  <template v-if="slots['FileActionUploadLink']">
                    <slot name="FileActionUploadLink" v-bind="fileActionUploadLinkProps" />
                  </template>
                  <template v-else>
                    <TaFileActionUploadLink
                      ref="fileActionUploadLinkRef"
                      v-bind="fileActionUploadLinkProps"
                      @validate-success-change="
                        handleFileActionUploadLinkChangeValidateSuccessChange
                      "
                      @validate-failure-change="
                        handleFileActionUploadLinkChangeValidateFailureChange
                      "
                      @uploaded-change="handleFileActionUploadLinkChange"
                    />
                  </template>

                  <template v-if="slots['FileActionSuffix']">
                    <slot name="FileActionSuffix" />
                  </template>
                </AButtonGroup>
              </section>
            </template>
          </template>
        </section>
      </section>
    </section>

    <section :class="`${DEFAULT_FILE_CLASSNAME}-main`">
      <section :class="`${DEFAULT_FILE_CLASSNAME}-table-wrapper`">
        <template v-if="slots.FileTable">
          <slot name="FileTable" v-bind="fileTableProps" />
        </template>
        <template v-else>
          <TaFileTable
            ref="fileTableRef"
            v-bind="fileTableProps"
            @change="handleFileTableChange"
            @actualids-change="handleFileTableActualidsChange"
          />
        </template>
      </section>
    </section>

    <!-- <section :class="`${DEFAULT_FILE_CLASSNAME}-footer`"></section> -->
  </section>
</template>
