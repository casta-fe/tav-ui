<script setup lang="ts">
import { ref, toRaw, /*useAttrs,*/ useSlots } from 'vue'
import { ButtonGroup as AButtonGroup } from 'ant-design-vue'
import { type ArgumentsOf } from './utils'
import { useComponentProps, useFileGlobalConfig, useMergedProps } from './hooks'
// import { type FileEmits, type FileProps } from './typings/types'
import {
  type FileTypeSelectEmits,
  type FileTypeSelectProps,
  TaFileTypeSelect,
} from './components/FileTypeSelect'
import {
  type FileActionUploadEmits,
  type FileActionUploadProps,
  TaFileActionUpload,
} from './components/FileActionUpload'
import { type FileTableProps, TaFileTable } from './components/FileTable'
import { type FileInjectedProps, type FileInstance, type FileProps, fileProps } from './typings'
import {
  DEFAULT_FILEACTIONS_CLASSNAME,
  DEFAULT_FILEACTIONS_ID,
  DEFAULT_FILE_CLASSNAME,
  DEFAULT_FILE_ID,
} from './consts'

defineOptions({
  name: 'TaFile',
  inheritAttrs: false,
})

const elRef = ref<FileInstance['elRef']>()
const FileActionsElRef = ref<FileInstance['FileActionsElRef']>()
const props = defineProps(fileProps)
// const emits = defineEmits<FileEmits>()
const slots = useSlots()
// const attrs = useAttrs()

// 将 globalconfig 与 file props 结合，同名 props 已 file props 为主
const fileGlobalConfig = useFileGlobalConfig()
const mergedProps = useMergedProps<FileInjectedProps, FileProps>(fileGlobalConfig, props)

// 组装 FileInjectedProps、ApiParams、子组件需要的 props 方便子组件单独使用
const { componentProps: fileTypeSelectProps, setComponentProps: setFileTypeSelectProps } =
  useComponentProps<FileTypeSelectProps>('fileTypeSelect', mergedProps)
const { componentProps: fileActionUploadProps, setComponentProps: setFileActionUploadProps } =
  useComponentProps<FileActionUploadProps>('fileActionUpload', mergedProps)
const { componentProps: fileTableProps, setComponentProps: setFileTableProps } =
  useComponentProps<FileTableProps>('fileTable', mergedProps)

function fileTypeSelectHandleSelect(...args: ArgumentsOf<FileTypeSelectEmits['select']>) {
  const [typeCode, _option, _fieldNames] = args

  // 利用 props 更新 typecode
  setFileActionUploadProps({
    ...fileActionUploadProps.value,
    apiParams: {
      ...fileActionUploadProps.value.apiParams,
      typeCodes: [`${typeCode}`],
    },
  })
}

function fileActionUploadHandleUploadFileListChange(
  ...args: ArgumentsOf<FileActionUploadEmits['uploadFileListChange']>
) {
  const [uploadFileList] = args

  // 利用 props 更新 table data
  setFileTableProps({
    ...fileTableProps.value,
    dataSource: [...toRaw(uploadFileList)],
  })
}
</script>

<template>
  <section :id="DEFAULT_FILE_ID" ref="elRef" :class="DEFAULT_FILE_CLASSNAME">
    <section v-if="mergedProps.headerVisible" :class="`${DEFAULT_FILE_CLASSNAME}-header`">
      <section :class="`${DEFAULT_FILE_CLASSNAME}-title-wrapper`">
        <template v-if="slots.FileTitle">
          <slot name="FileTitle" />
        </template>
        <template v-else>
          <div v-if="mergedProps.titleVisible" :class="`${DEFAULT_FILE_CLASSNAME}-title`">
            {{ mergedProps.title }}
          </div>
        </template>
      </section>

      <section
        v-if="mergedProps.headerActionsVisible"
        :class="`${DEFAULT_FILE_CLASSNAME}-header-actions`"
      >
        <section :class="`${DEFAULT_FILE_CLASSNAME}-type-select-wrapper`">
          <template v-if="slots.FileTypeSelect">
            <slot name="FileTypeSelect" v-bind="fileTypeSelectProps" />
          </template>
          <template v-else>
            <TaFileTypeSelect v-bind="fileTypeSelectProps" @select="fileTypeSelectHandleSelect" />
          </template>
        </section>
        <section :class="`${DEFAULT_FILE_CLASSNAME}-actions-wrapper`">
          <template v-if="slots.FileActions">
            <slot name="FileActions" />
          </template>
          <template v-else>
            <template v-if="mergedProps.fileActionsVisible">
              <section
                :id="DEFAULT_FILEACTIONS_ID"
                ref="FileActionsElRef"
                :class="DEFAULT_FILEACTIONS_CLASSNAME"
              >
                <AButtonGroup>
                  <template v-if="slots['FileActionPrefix']">
                    <slot name="FileActionPrefix" />
                  </template>

                  <template v-if="slots['FileActionUpload']">
                    <slot name="FileActionUpload" v-bind="fileActionUploadProps" />
                  </template>
                  <template v-else>
                    <TaFileActionUpload
                      v-bind="fileActionUploadProps"
                      @uploadFileListChange="fileActionUploadHandleUploadFileListChange"
                    />
                  </template>

                  <template v-if="slots['FileActionMiddle']">
                    <slot name="FileActionMiddle" />
                  </template>

                  <!-- <template v-if="slots['FileActionUploadLink']">
                    <slot name="FileActionUploadLink"></slot>
                  </template>
                  <template v-else>
                    <TaFileActionUploadLink />
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
          <TaFileTable v-bind="fileTableProps" />
        </template>
      </section>
    </section>

    <!-- <section :class="`${DEFAULT_FILE_CLASSNAME}-footer`"></section> -->
  </section>
</template>
