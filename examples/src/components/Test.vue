<template>
  <div class="wrapper">
    <TaForm :schemas="state.schemas" :label-width="140" :editable="true" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { TaForm } from '@tav-ui/components'

export default defineComponent({
  name: 'Test',
  components: { TaForm },
  setup() {
    const state = reactive<Record<string, any>>({
      schemas: [
        {
          field: 'contractType',
          component: 'Select',
          label: '合同类型',
          required: true,
          defaultValue: [1], // 默认为合同
          componentProps: ({ formActionType, formModel }) => {
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

<style lang="less" scoprd>
.wrapper {
  width: 100%;
  height: 800px;
  padding: 16px;
  background-color: #ccc;
}
</style>
