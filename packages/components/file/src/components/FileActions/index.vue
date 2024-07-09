<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'
import { createId, createNS } from '../../utils'
import FileActionUpload from './components/FileActionUpload'
import {
  TaFileActionUploadLink as FileActionUploadLink,
  TaFileActionUploadLinkForm as FileActionUploadLinkForm,
} from './components/FileActionUploadLink'
import { useFileActionsSlots } from './hooks'

export interface FileActionsProps {
  visible?: boolean
}

const ns = createNS('file')
const cls = ns.b('actions')
const id = createId(cls)

defineOptions({
  name: 'TaFileActions',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FileActionsProps>(), {
  visible: true,
})
// const emit = defineEmits(buttonEmits)
const slots = useSlots()
const attrs = useAttrs()

const { getSlotKeys: getFileActionsSlotKeys } = useFileActionsSlots(slots)
</script>

<template>
  <template v-if="props.visible">
    <section :id="id" :class="cls">
      <template v-if="Object.keys(slots).length > 0">
        TaFileActions Slots
        <slot v-for="slotKey in getFileActionsSlotKeys" :name="slotKey" v-bind="data || {}" />
      </template>
      <template v-else>
        TaFileActions Components
        <FileActionUpload />
        <FileActionUploadLink />
        <FileActionUploadLinkForm />
      </template>
    </section>
  </template>
</template>
