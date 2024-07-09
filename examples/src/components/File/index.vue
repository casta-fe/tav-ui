<script setup lang="ts">
import { reactive } from 'vue'
import { TaFile, TaFileTypeSelect } from '@tav-ui/components/file'
import { taUploadProvideData } from '../TaUpload/provideData'

console.log(taUploadProvideData)

const singleCompData = reactive({
  api: taUploadProvideData.queryFileType,
  params: {
    moduleCodes: ['tg_invest'],
  },
})
</script>

<template>
  <section class="ta-file-test">
    <h2>TaFile 测试</h2>

    <h3>TaFile TaFileTypeSelect 测试</h3>
    <TaFileTypeSelect v-bind="singleCompData" />

    <!-- <TaFile>
      <template #FileActionUpload="{ data }">
        FileActionUpload1
        <div>{{ data }}</div>
      </template>
      <template #FileActionCustom> FileActionCustom1 </template>
    </TaFile> -->
  </section>
</template>
