<template>
  <div style="margin: 16px; padding: 16px; border-radius: 8px; border: 1px solid #ccc">
    <ta-upload
      :params="params"
      :insert-columns="[
        { column: { field: 'abc', title: '默认新增列' } },
        { position: 'typeName', column: { field: 'def', title: '文件类型后的新增列' } },
        {
          position: 'typeName',
          beforeOrAfter: 'before',
          column: { field: 'ghi', title: '文件类型前的新增列' },
        },
      ]"
      :cover-column-title="{ fullName: '全称' }"
      :hide-column-fields="['createTime']"
      @select="onSelect"
    >
      <template #beforeButton="{ loading }">
        <TaButton :loading="loading">beforeButton</TaButton>
      </template>
      <template #centerButton="{ loading }">
        <TaButton :loading="loading">centerButton</TaButton>
      </template>
      <template #afterButton="{ loading }">
        <TaButton :loading="loading">afterButton</TaButton>
      </template>
    </ta-upload>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
import { TaButton, TaUpload } from '@tav-ui/components'

export default defineComponent({
  components: {
    TaUpload,
    TaButton,
  },
  setup() {
    return {
      params: {
        moduleCode: 'tg_invest',
        businessId: 'id0',
      },
      onSelect: console.log,
    }
  },
})
</script>
