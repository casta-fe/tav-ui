<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { TaLoadingCreate } from '../../dist/index.esm.js'
import { defineComponent, reactive } from 'vue'
import * as components from '@tav-ui/components'
import TaConfigProvider from '@tav-ui/components/config-provider'
// import TimeLineListPage from './components/timeLineList/index.vue'
// import TimePage from './components/time/index.vue'
// import InputNumberRangePage from './components/InputNumberRange/index.vue'
// import FileViewPage from './components/FileView/index.vue'
// import FormPage from './components/Form/index.vue'
// import TreePage from './components/Tree/index.vue'
// import ModalPage from './components/Modal/index.vue'
// import FollewPage from './components/Follow/index.vue'
// import BasicTablePage from './components/table/Basic.vue'
import { TaModal, useModal } from '@tav-ui/components/modal'
import { TaButton } from '@tav-ui/components/button'
import { TaUpload, taUploadProvideData } from './components/TaUpload'
// import SearchableApiSelect from './components/SearchableApiSelect.vue'
import TablePro from './components/TablePro/test'
import allUsers from './allUserList'
console.log(components)
export default defineComponent({
  components: {
    TaConfigProvider,
    TablePro,
    TaModal,
    TaButton,
    TaUpload,
    // SearchableApiSelect,
    // TimeLineListPage,
    // TimePage,
    // InputNumberRangePage,
    // FileViewPage,
    // FormPage,
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
          allUserList: allUsers.data,
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
  <TaConfigProvider :permissions="state.permissions" :components="state.components">
    <!-- <FormPage /> -->
    <TaUpload />
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
    <SearchableApiSelect />
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
  </TaConfigProvider>
</template>
