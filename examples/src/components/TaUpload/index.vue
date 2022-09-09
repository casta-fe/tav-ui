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
      :file-branch-is-show-delete-action="fileBranchIsShowDeleteAction"
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
    <TaButton type="primary" @click="switchModule">switch moduleCode</TaButton>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive } from 'vue'
import { TaButton, TaUpload } from '@tav-ui/components'

export default defineComponent({
  components: {
    TaUpload,
    TaButton,
  },
  setup() {
    const params = reactive({
      // moduleCode: 'tg_invest',
      businessId: 'id0',
    })

    function switchModule() {
      params.moduleCode = 'tg_invest' === params.moduleCode ? 'other_module' : 'tg_invest'
    }

    setTimeout(switchModule, 2000)

    return {
      params,
      onSelect: console.log,
      switchModule,
      fileBranchIsShowDeleteAction(args) {
        console.error(args)
        return true
      },
    }
  },
})
</script>
