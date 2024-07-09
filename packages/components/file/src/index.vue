<script setup lang="ts">
import { computed, ref, unref, useAttrs, useSlots } from 'vue'
import { createId, createNS } from './utils'
import { createFileContext, useComponentProps, useFileGlobalConfig, useMergedProps } from './hooks'
// import { type FileEmits, type FileProps } from './typings/types'
import { type FileTypeSelectProps, TaFileTypeSelect } from './components/FileTypeSelect'
import { type FileTableProps, TaFileTable } from './components/FileTable'
import { type FileActionsProps, TaFileActions, useFileActionsSlots } from './components/FileActions'
import { type ApiParams, type FileInjectedProps } from './typings'

// 注意该文件与 types 文件中的 props 类型需要同步更新
export interface FileProps extends FileInjectedProps, ApiParams {
  /** 顶部显隐控制 */
  headerVisible?: boolean
  /** 顶部操作区显隐控制 */
  headerActionsVisible?: boolean
  title?: string
  titleVisible?: boolean

  fileTypeSelect?: FileTypeSelectProps
  fileActions?: FileActionsProps
  fileTable?: FileTableProps
}

const ns = createNS('file')
const cls = ns.b()
const id = createId(cls)

defineOptions({
  name: 'TaFile',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FileProps>(), {
  apiParams: () => ({
    moduleCodes: [] as string[],
    typeCodes: [] as string[],
    permissionControl: false,
  }),

  headerVisible: true,
  headerActionsVisible: true,
  title: 'TaFile',
  titleVisible: false,
})
// const emits = defineEmits<FileEmits>()
const slots = useSlots()
const attrs = useAttrs()

const { getSlotKeys: getFileActionsSlotKeys } = useFileActionsSlots(slots)

// 将 globalconfig 与 file props 结合，同名 props 已 file props 为主
const fileGlobalConfig = useFileGlobalConfig()
const mergedProps = useMergedProps<FileInjectedProps, FileProps>(fileGlobalConfig, props)

// 组装 FileInjectedProps、ApiParams、子组件需要的 props 方便子组件单独使用
const componentFileTypeSelectProps = useComponentProps<
  FileProps,
  ApiParams['apiParams'],
  FileProps['fileTypeSelect']
>(mergedProps, mergedProps.value.apiParams, mergedProps.value.fileTypeSelect)
const componentFileActionsProps = useComponentProps<
  FileProps,
  ApiParams['apiParams'],
  FileProps['fileActions']
>(mergedProps, mergedProps.value.apiParams, mergedProps.value.fileActions)

// createFileContext({
//   apiParams: computed(() => mergedProps.value.apiParams),
// })
</script>

<template>
  <section :id="id" :class="cls">
    <section v-if="mergedProps.headerVisible" :class="`${cls}-header`">
      <section :class="`${cls}-title-wrapper`">
        <template v-if="slots.FileTitle">
          <slot name="FileTitle" />
        </template>
        <template v-else>
          <div :class="`${cls}-title`">{{ mergedProps.title }}</div>
        </template>
      </section>

      <section v-if="mergedProps.headerActionsVisible" :class="`${cls}-header-actions`">
        <section :class="`${cls}-type-select-wrapper`">
          <template v-if="slots.FileTypeSelect">
            <slot name="FileTypeSelect" />
          </template>
          <template v-else>
            <TaFileTypeSelect v-bind="componentFileTypeSelectProps" />
          </template>
        </section>
        <section :class="`${cls}-actions-wrapper`">
          <TaFileActions v-bind="componentFileActionsProps">
            <template v-for="slotKey in getFileActionsSlotKeys" #[slotKey]="data">
              <slot :name="slotKey" v-bind="data || {}" />
            </template>
          </TaFileActions>
        </section>
      </section>
    </section>

    <section :class="`${cls}-main`">
      <section :class="`${cls}-table-wrapper`">
        <template v-if="slots.FileTable">
          <slot name="FileTable" />
        </template>
        <template v-else>
          <TaFileTable
            v-bind="{
              ...mergedProps.apiParams,
              ...mergedProps.fileTable,
            }"
          />
        </template>
      </section>
    </section>

    <!-- <section :class="`${cls}-footer`"></section> -->
  </section>
</template>
