<script setup lang="ts">
import { type UnwrapRef, computed, ref, /*useAttrs,*/ useSlots } from 'vue'
import { ButtonGroup as AButtonGroup } from 'ant-design-vue'
import { type ITableProInstance } from '@tav-ui/components/table-pro'
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
// import { TaFileActionUploadLink } from './components/FileActionUploadLink'
import {
  type FileTableEmits,
  type FileTableInstance,
  type FileTableProps,
  TaFileTable,
} from './components/FileTable'
import { type FileInstance, type GlobalConfigFileProps, fileEmits, fileProps } from './typings'
import {
  DEFAULT_FILEACTIONS_CLASSNAME,
  DEFAULT_FILEACTIONS_ID,
  DEFAULT_FILE_CLASSNAME,
  DEFAULT_FILE_ID,
} from './consts'
import { type ArgumentsOf } from './utils'

defineOptions({
  name: 'TaFile',
  inheritAttrs: false,
})

const elRef = ref<UnwrapRef<FileInstance['elRef']>>()
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
  /** apiparams 已组件中的 apiparams 为准，如果组件内部传递了那么在组件内部维护否则使用大组件的 apiparams 下发 */
  ...{
    apiParams: props.fileTypeSelect?.apiParams
      ? {}
      : {
          appId: fileApiParams.value.value.appId,
          moduleCode: fileApiParams.value.value.moduleCode,
          typeCodes: fileApiParams.value.value.typeCodes,
          permissionControl: fileApiParams.value.value.permissionControl,
        },
  },
}))

const fileActionUploadRef = ref<FileActionUploadInstance>()
const fileActionUploadProps = computed(() => ({
  ...props.fileActionUpload,
  mode: props.mode,
  /** apiparams 已组件中的 apiparams 为准，如果组件内部传递了那么在组件内部维护否则使用大组件的 apiparams 下发 */
  ...{
    apiParams: props.fileActionUpload?.apiParams
      ? {}
      : {
          appId: fileApiParams.value.value.appId,
          moduleCode: fileApiParams.value.value.moduleCode,
          typeCode: fileApiParams.value.value.typeCode,
          businessId: fileApiParams.value.value.businessId,
          businessKey: fileApiParams.value.value.businessKey,
          businessParamsJson: fileApiParams.value.value.businessParamsJson,
          fileActualId: fileApiParams.value.value.fileActualId,
          instantUpdate: fileApiParams.value.value.instantUpdate,
        },
  },
}))

// const fileActionUploadLinkProps = computed(() => ({
//   // ...props.fileActionUploadLink,
//   mode: props.mode,
//   /** apiparams 已组件中的 apiparams 为准，如果组件内部传递了那么在组件内部维护否则使用大组件的 apiparams 下发 */
//   ...{
//     apiParams: props.fileActionUpload?.apiParams
//       ? {}
//       : {
//           appId: fileApiParams.value.value.appId,
//           moduleCode: fileApiParams.value.value.moduleCode,
//           typeCode: fileApiParams.value.value.typeCode,
//           businessId: fileApiParams.value.value.businessId,
//           businessKey: fileApiParams.value.value.businessKey,
//           businessParamsJson: fileApiParams.value.value.businessParamsJson,
//           fileActualId: fileApiParams.value.value.fileActualId,
//           instantUpdate: fileApiParams.value.value.instantUpdate,
//         },
//   },
// }))

const __fileTableProps = ref<FileTableProps & GlobalConfigFileProps['fileTable']>(
  props.fileTable ?? ({} as any)
)
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
  /** apiparams 已组件中的 apiparams 为准，如果组件内部传递了那么在组件内部维护否则使用大组件的 apiparams 下发 */
  ...{
    apiParams: _fileTableProps.value.value?.apiParams
      ? {}
      : {
          appId: fileApiParams.value.value.appId,
          moduleCode: fileApiParams.value.value.moduleCode,
          typeCode: fileApiParams.value.value.typeCode,
          typeCodes: fileApiParams.value.value.typeCodes,
          permissionControl: fileApiParams.value.value.permissionControl,
          businessId: fileApiParams.value.value.businessId,
          businessIds: fileApiParams.value.value.businessIds,
          businessKey: fileApiParams.value.value.businessKey,
          businessCheck: fileApiParams.value.value.businessCheck,
          fileActualId: fileApiParams.value.value.fileActualId,
          fileActualIds: fileApiParams.value.value.fileActualIds,
          id: fileApiParams.value.value.id,
          ids: fileApiParams.value.value.ids,
          searchValue: fileApiParams.value.value.searchValue,
          startTime: fileApiParams.value.value.startTime,
          endTime: fileApiParams.value.value.endTime,
        },
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
  const [files] = args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>
  const fileTableTableProInstance = (fileTableRef.value?.tableProRef as any)?.instance
  const { fullData } = (fileTableTableProInstance as ITableProInstance['instance']).getTableData()
  _fileTableProps.value.value = {
    ..._fileTableProps.value.value,
    dataSource: [...files, ...JSON.parse(JSON.stringify(fullData))],
  }

  emits(
    'fileActionUpload:uploadedChange',
    ...(args as unknown as ArgumentsOf<FileActionUploadEmits['uploadedChange']>)
  )
}

function handleFileTableChange(...args: any) {
  const _args = args as unknown as ArgumentsOf<FileTableEmits['change']>
  emits('change', ..._args)
}

function handleFileTableActualidsChange(...args: any) {
  const _args = args as unknown as ArgumentsOf<FileTableEmits['actualidsChange']>
  emits('update:fileActualIds', ..._args)
}

defineExpose({
  elRef,
  fileTypeSelectRef,
  fileActionUploadRef,
  fileTableRef,
})
</script>

<template>
  <section :id="DEFAULT_FILE_ID" ref="elRef" :class="DEFAULT_FILE_CLASSNAME">
    <section v-if="props.headerVisible" :class="`${DEFAULT_FILE_CLASSNAME}-header`">
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

                  <!-- <template v-if="slots['FileActionUploadLink']">
                    <slot name="FileActionUploadLink" v-bind="fileActionUploadLinkProps" />
                  </template>
                  <template v-else>
                    <TaFileActionUploadLink v-bind="fileActionUploadLinkProps" />
                    <TaFileActionUploadLinkForm />
                  </template> -->

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
