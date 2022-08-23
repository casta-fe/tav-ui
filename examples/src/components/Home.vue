<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { TaLoadingCreate } from '../../dist/index.esm.js'
// import TaConfigProvider from '@tav-ui/components/config-provider'
import { defineComponent, onMounted, reactive } from 'vue'
// import TimeLineListPage from './timeLineList/index.vue'
// import TimePage from './time/index.vue'
// import InputNumberRangePage from './InputNumberRange/index.vue'
// import FileViewPage from './FileView/index.vue'
// import TreePage from './Tree/index.vue'
// import ModalPage from './Modal/index.vue'
// import FollewPage from './Follow/index.vue'
// import BasicTablePage from './table/Basic.vue'
import { TaButton } from '@tav-ui/components/button'
import { TaModal, useModal } from '@tav-ui/components/modal'
import allUsers from '../allUserList'
import FormPage from './Form/index.vue'
import { TaUpload, taUploadProvideData } from './TaUpload'
import SearchableApiSelect from './SearchableApiSelect.vue'
import TablePro from './TablePro/test'

export default defineComponent({
  name: 'Home',
  components: {
    // TaConfigProvider,
    TablePro,
    TaModal,
    TaButton,
    TaUpload,
    SearchableApiSelect,
    // TimeLineListPage,
    // TimePage,
    // InputNumberRangePage,
    // FileViewPage,
    FormPage,
    // TreePage,
    // ModalPage,
    // BasicTablePage,
    // FollewPage,
  },
  setup() {
    // 函数方式调用loading
    // TaLoadingCreate(
    //   {
    //     tip: '正在加载页面 😉',
    //     size: 'large',
    //     loading: true,
    //     absolute: false,
    //   },
    //   document.body,
    // )
    // console.log(components)
    const [ModalRegister, { openModal: OpenModal, closeModal: CloseModal }] = useModal()
    const state = reactive({
      permissions: {},
      components: {
        TaUpload: taUploadProvideData,
        TaMemberSelect: {
          allUserList: allUsers.data.map((v) => {
            return { label: v.name, value: v.id, ...v }
          }),
        },
      },
    })
    setTimeout(() => {
      state.permissions = {
        aa: {
          ifShow: true,
          apiUrl: 'xxx',
        },
      }
      console.log(state)
    }, 1000)

    onMounted(() => {
      // const { setWatermark } = useWatermark({ color: 'red', size: { width: 320, height: 150 } })
      // setWatermark('系统管理员9999')
    })

    return {
      state,
      ModalRegister,
      OpenModal,
      CloseModal,
    }
  },
})
</script>

<template>
  <!-- <TaConfigProvider :permissions="state.permissions" :components="state.components"> -->
  <FormPage />
  <TaUpload />
  <SearchableApiSelect />
  <TablePro />
  <TaModal
    :height="500"
    title="新增"
    :width="864"
    :destroy-on-close="true"
    @register="ModalRegister"
  >
    <TablePro />
    <template #footer>
      <TaButton type="primary">确定</TaButton>
      <TaButton type="default" @click="CloseModal">取消</TaButton>
    </template>
  </TaModal>
  <TaButton type="default" @click="OpenModal">测试modalTable</TaButton>
  <!-- <TaButton type="primary" pre-icon="ant-design:plus-square-filled" pre-icon-color="#276dff">
      aaa
    </TaButton>
    <TaBasicArrow />
    <TaBasicHelp :text="['1', '2']" />
    <br />
    <TaBasicTitle icon="ant-design:setting-filled" :help-message="['3', '4']">
      basic title
    </TaBasicTitle>
    <TaUpload />
    <TaLoading  :loading="true"></TaLoading>
    <TimeLineListPage /> -->
  <!-- 
  <TimePage />
  <InputNumberRangePage />
  <FileViewPage />
  <TreePage />
  <ModalPage />
  <FormPage />
  <BasicTablePage /> -->
  <!-- </TaConfigProvider> -->
</template>
