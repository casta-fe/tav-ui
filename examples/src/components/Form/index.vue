<template>
  <h2>Form Test Example</h2>
  <div class="mb-4">
    <TaButton class="mr-2" @click="setProps({ labelWidth: 150 })"> 更改labelWidth </TaButton>
    <TaButton class="mr-2" @click="setProps({ labelWidth: 120 })"> 还原labelWidth </TaButton>
    <TaButton class="mr-2" @click="setProps({ size: 'large' })"> 更改Size </TaButton>
    <TaButton class="mr-2" @click="setProps({ size: 'default' })"> 还原Size </TaButton>
    <TaButton class="mr-2" @click="setProps({ disabled: true })"> 禁用表单 </TaButton>
    <TaButton class="mr-2" @click="setProps({ disabled: false })"> 解除禁用 </TaButton>
    <TaButton class="mr-2" @click="setProps({ compact: true })"> 紧凑表单 </TaButton>
    <TaButton class="mr-2" @click="setProps({ compact: false })"> 还原正常间距 </TaButton>
    <TaButton class="mr-2" @click="setProps({ actionColOptions: { span: 8 } })">
      操作按钮位置
    </TaButton>
  </div>
  <div class="mb-4">
    <TaButton class="mr-2" @click="setProps({ showActionTaButtonGroup: false })">
      隐藏操作按钮
    </TaButton>
    <TaButton class="mr-2" @click="setProps({ showActionButtonGroup: true })">
      显示操作按钮
    </TaButton>
    <TaButton class="mr-2" @click="setProps({ showResetButton: false })"> 隐藏重置按钮 </TaButton>
    <TaButton class="mr-2" @click="setProps({ showResetButton: true })"> 显示重置按钮 </TaButton>
    <TaButton class="mr-2" @click="setProps({ showSubmitButton: false })"> 隐藏查询按钮 </TaButton>
    <TaButton class="mr-2" @click="setProps({ showSubmitButton: true })"> 显示查询按钮 </TaButton>
    <TaButton
      class="mr-2"
      @click="
        setProps({
          submitButtonOptions: {
            text: 'slslsl',
            disabled: true,
          },
        })
      "
    >
      修改查询按钮文字
    </TaButton>
    <TaButton
      class="mr-2"
      @click="
        setProps({
          submitButtonOptions: {
            text: '查询',
            disabled: false,
          },
        })
      "
    >
      还原查询按钮文字
    </TaButton>
    <TaButton
      class="mr-2"
      @click="
        setProps({
          resetButtonOptions: {
            disabled: true,
            text: '重置New',
          },
        })
      "
    >
      修改重置按钮
    </TaButton>
    <TaButton
      class="mr-2"
      @click="
        setProps({
          submitButtonOptions: {
            disabled: true,
            loading: true,
          },
        })
      "
    >
      修改查询按钮
    </TaButton>
    <!-- <TaButton class="mr-2" @click="handleLoad"> 联动回显 </TaButton> -->
  </div>
  <!-- <TaContainerCollapse title="useForm示例"> -->
  <TaForm ref="testForm" :schemas="schemas" :label-width="140" @submit="handleSubmit">
    <template #testSlot="{ field, model }">{{ field }} {{ model }} 可以了</template>
  </TaForm>
  <!-- </TaContainerCollapse> -->
</template>
<script lang="ts">
import { type Ref, computed, defineComponent, h, ref } from 'vue'
import { TaButton, TaForm, useForm } from '@tav-ui/components'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { API__CENTER_INDUSTRY_TAG } from '@tav-ui/components/table-pro/src/data'
import tag from '@tav-ui/components/time-line/src/components/tag'
import { useGlobalConfig } from '@tav-ui/hooks'
import type { FormSchema } from '@tav-ui/components/form'
const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
const allUserList = computed(() => globalConfig.value?.TaMemberSelect?.allUserList || [])
const schemas = ref([
  // {
  //   field: 'field00',
  //   component: 'CascadeProSelect',
  //   label: '字段00',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     title: '标签选择',
  //     // placeholder: '请选择标签',
  //     searchPlaceholder: '请输入标签名称',
  //     fields: ['tag', 'subTag'],
  //     optionsKeyConfig: {
  //       name: 'name',
  //       id: 'id',
  //       children: 'children',
  //       pid: 'pid',
  //     },
  //     // hotKeyWords: ['光子', '半导体', '人工智能', '先进制造', '军工'],
  //     hotKeyWords: [
  //       '484d222e04a711ec8b830242ac110002',
  //       '484e1d9a04a711ec8b830242ac110002',
  //       '4853fcb504a711ec8b830242ac110002',
  //       '4852cb2b04a711ec8b830242ac110002',
  //       '48562dce04a711ec8b830242ac110002',
  //     ],
  //     generatePannelItem(option, level) {
  //       if (level === 0) {
  //         return h('div', null, option.name)
  //       } else {
  //         return h('div', null, [
  //           h('span', null, option.name),
  //           h('span', null, option.type === 1 ? '技术' : '应用'),
  //         ])
  //       }
  //     },
  //     maxTagCount: 999,
  //     // generateSearchItem(option) {
  //     //   return h('div', null, option.namePath)
  //     // },
  //   },
  // },
  // {
  //   field: 'field0',
  //   component: 'CascadeProSelect',
  //   label: '字段0',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     // placeholder: '自定义placeholder',
  //     // firstLetterTitle: 'aaa',
  //     // generateHotList: (options) => {
  //     //   return options
  //     // }
  //   },
  // },
  // {
  //   field: 'field0',
  //   component: 'MemberSelect',
  //   label: '字段1',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     multiple: true,
  //     onChange(ids, list) {
  //       console.log(ids, list)
  //     },
  //     options: allUserList,
  //     placeholder: '自定义placeholder',
  //   },
  // },
  {
    field: 'field1',
    component: 'DateInterval',
    label: '普通InputNumber',
    colProps: { span: 8 },
    editSlot: 'testSlot',
    componentProps: {},
  },
  {
    field: 'field2',
    component: 'InputNumber',
    label: 'formatter',
    colProps: { span: 8 },
    componentProps: {
      precision: 8,
      formatter: (value) => `${value}%`,
    },
  },
  // {
  //   field: 'field22',
  //   component: 'InputNumber',
  //   label: '字段slot1',
  //   colProps: { span: 8 },
  //   defaultValue: 15,
  //   editslot: 'testSlot',
  //   componentProps: {
  //     precision: 4,
  //     placeholder: '请输入0-100的整数',
  //   },
  // },
  // {
  //   field: 'field3',
  //   component: 'Input',
  //   label: '字段3',

  //   colProps: {
  //     span: 8,
  //   },
  // },
  // {
  //   field: 'fieldTime',
  //   component: 'RangePicker',
  //   label: '时间字段',

  //   colProps: {
  //     span: 8,
  //   },
  // },
  // {
  //   field: 'field4',
  //   component: 'Select',
  //   label: '字段4',
  //   colProps: {
  //     span: 8,
  //   },
  //   defaultValue: '1',
  //   componentProps: {
  //     disabled: true,
  //     onEditableFormItemVisible(v) {
  //       console.log(v)
  //     },
  //     options: [
  //       {
  //         label: '选项1',
  //         value: '1',
  //         key: '1',
  //       },
  //       {
  //         label: '选项2',
  //         value: '2',
  //         key: '2',
  //       },
  //     ],
  //   },
  // },
  // {
  //   field: 'field5',
  //   component: 'CheckboxGroup',
  //   label: '字段5',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     options: [
  //       {
  //         label: '选项1',
  //         value: '1',
  //       },
  //       {
  //         label: '选项2',
  //         value: '2',
  //       },
  //     ],
  //   },
  // },
  // {
  //   field: 'field7',
  //   component: 'RadioGroup',
  //   label: '字段7',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     options: [
  //       {
  //         label: '选项1',
  //         value: '1',
  //       },
  //       {
  //         label: '选项2',
  //         value: '2',
  //       },
  //     ],
  //   },
  // },
  // {
  //   field: 'field8',
  //   component: 'ApiCascader',
  //   label: '联动',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     api: () => {
  //       console.log(1)
  //     },
  //     apiParamKey: 'parentCode',
  //     dataField: 'data',
  //     labelField: 'name',
  //     valueField: 'code',
  //     initFetchParams: {
  //       parentCode: '',
  //     },
  //     isLeaf: (record) => {
  //       return !(record.levelType < 3)
  //     },
  //   },
  // },
  // {
  //   field: 'field9',
  //   component: 'ApiCascader',
  //   label: '联动回显',
  //   colProps: {
  //     span: 8,
  //   },
  //   componentProps: {
  //     api: () => {
  //       console.log('1')
  //     },
  //     apiParamKey: 'parentCode',
  //     dataField: 'data',
  //     labelField: 'name',
  //     valueField: 'code',
  //     initFetchParams: {
  //       parentCode: '',
  //     },
  //     isLeaf: (record) => {
  //       return !(record.levelType < 3)
  //     },
  //   },
  // },
])
export default defineComponent({
  components: { TaButton, TaForm },
  setup() {
    const { createMessage } = useMessage()

    const [register, { setProps, setFieldsValue, updateSchema }] = useForm({
      labelWidth: 120,
      actionColOptions: {
        span: 24,
      },
      // disabled: true,
      showActionButtonGroup: true,
      fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']],
    })

    API__CENTER_INDUSTRY_TAG({}).then((res) => {
      const { success, data } = res
      if (success && data) {
        const result = data.map((option) => {
          const { applicationTags, technicalTags } = option
          const atags = applicationTags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            pid: tag.industryId,
            type: tag.type,
          }))
          const ttags = technicalTags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            pid: tag.industryId,
            type: tag.type,
          }))

          return {
            id: option.id,
            name: option.name,
            children: [...atags, ...ttags],
          }
        })

        // updateSchema({
        //   field: 'field00',
        //   componentProps: {
        //     options: result,
        //   },
        // })

        // setFieldsValue({
        //   field00: [
        //     {
        //       city: '130100',
        //       cityName: '石家庄市',
        //       district: '130104',
        //       districtName: '桥西区',
        //       province: '130000',
        //       provinceName: '河北省',
        //     },
        //   ],
        // })
      }
    })

    async function handleLoad() {
      const promiseFn = function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              field9: ['430000', '430100', '430102'],
              province: '湖南省',
              city: '长沙市',
              district: '岳麓区',
            })
          }, 1000)
        })
      }

      const item = await promiseFn()

      const { field9, province, city, district } = item as any
      await updateSchema({
        field: 'field9',
        componentProps: {
          displayRenderArray: [province, city, district],
        },
      })
      await setFieldsValue({
        field9,
      })
    }
    const testForm = ref()
    setTimeout(() => {
      schemas.value = [
        ...schemas.value,
        {
          field: 'field3',
          component: 'Input',
          label: '新增的',
          colProps: {
            span: 8,
          },
        },
      ]
      setTimeout(() => {
        // testForm.value.setFieldsValue({
        //   field1: 99,
        //   field2: 66.1256,
        //   field3: 99,
        // })
      }, 500)
    }, 2000)
    return {
      schemas,
      handleSubmit: (values) => {
        createMessage.success(`click search,values:${JSON.stringify(values)}`)
      },
      testForm,
      setProps,
      handleLoad,
    }
  },
})
</script>
