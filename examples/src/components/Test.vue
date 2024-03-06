<template>
  <div class="wrapper">
    <h1>测试页面</h1>
    <a href="/#/">首页</a><a href="/#/test">测试</a>
    <TaForm :schemas="state.schemas" :label-width="140" :editable="true" @submit="handleSubmit" />
    <BasicTablePage />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { TaForm } from '@tav-ui/components'
import BasicTablePage from './table/Basic.vue'
export default defineComponent({
  name: 'Test',
  components: { TaForm, BasicTablePage },
  setup() {
    const state = reactive<Record<string, any>>({
      schemas: [
        {
          field: 'contractType',
          component: 'Select',
          label: '合同类型',
          required: true,
          defaultValue: [1], // 默认为合同
          componentProps: ({ formActionType }) => {
            return {
              options: [
                { label: '合同', value: 1 },
                { label: '补充协议', value: 2 },
              ],
              placeholder: '请选择文件类型',
              mode: 'multiple',
              onChange: async (val: any) => {
                // if (formModel.contractDeptRangeList?.length !== 0) {
                //   formActionType?.validate(['contractDeptRangeList'])
                // }
                if (val !== 1) {
                  await formActionType?.setFieldsValue({ projectRelIdList: undefined }, false)
                } else if (val !== 2) {
                  await formActionType?.setFieldsValue({ contractRelId: undefined }, false)
                }
              },
            }
          },
        },
      ],
    })

    const handleSubmit = () => {
      console.log(1)
    }
    return { state, handleSubmit }
  },
})
</script>

<style lang="less" scoprd></style>
