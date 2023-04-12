<template>
  <!-- 812px -->
  <div
    style="margin: 16px; padding: 16px; border-radius: 8px; border: 1px solid #ccc; width: unset"
  >
    <ta-upload
      ref="uploadRef"
      :max-count="10"
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
      :before-upload="beforeUpload"
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
    <TaButton type="dashed" @click="getRes">getRes</TaButton>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive, ref } from 'vue'
import { TaButton, TaUpload } from '@tav-ui/components'
import type { Handler } from '@tav-ui/components/upload/src/main'

export default defineComponent({
  components: {
    TaUpload,
    TaButton,
  },
  setup() {
    const uploadRef = ref<Handler>()

    const params = reactive({
      moduleCode: 'tg_invest',
      // businessId: 'id0',
    })

    setTimeout(() => {
      params.businessKey = 'abc'
    }, 1000)

    function switchModule() {
      params.moduleCode = 'tg_invest' === params.moduleCode ? 'other_module' : 'tg_invest'
    }

    function getRes() {
      console.error('uploadRef.value?.getResult', uploadRef.value?.getResult())
    }
    const test = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    }
    const beforeUpload = async (files) => {
      console.log(files)
      const res = await test()
      return res
      // if (files.length > 1) {
      //   console.log('文件太多了')
      //   return false
      // } else {
      //   return true
      // }
    }
    // setTimeout(switchModule, 2000)

    return {
      uploadRef,
      beforeUpload,
      params,
      getRes,
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
