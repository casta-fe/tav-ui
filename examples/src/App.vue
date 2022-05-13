<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import { TaLoadingCreate } from '../../dist/index.esm.js'
import { defineComponent, reactive } from 'vue'
import * as components from '@tav-ui/components'
// import TimeLineListPage from './components/timeLineList/index.vue'
// import TimePage from './components/time/index.vue'
// import InputNumberRangePage from './components/InputNumberRange/index.vue'
// import FileViewPage from './components/FileView/index.vue'
// import FormPage from './components/Form/index.vue'
// import TreePage from './components/Tree/index.vue'
// import ModalPage from './components/Modal/index.vue'
// import FollewPage from './components/Follow/index.vue'
// import BasicTablePage from './components/table/Basic.vue'
export default defineComponent({
  components: {
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
    console.log(components)
    const state = reactive({
      permissions: {},
      components: {},
    })
    setTimeout(() => {
      state.permissions = {
        aa: {
          ifShow: true,
          apiUrl: 'xxx',
        },
      }
      state.components = {
        TaUpload: {
          defaultApi: '123',
        },
      }
      console.log(state)
    }, 1000)
    return {
      state,
    }
  },
})
</script>

<template>
  <TaConfigProvider :permissions="state.permissions" :components="state.components">
    <TaButton type="primary" pre-icon="ant-design:plus-square-filled" pre-icon-color="#276dff">
      aaa
    </TaButton>
    <TaBasicArrow />
    <TaBasicHelp :text="['1', '2']" />
    <br />
    <TaBasicTitle icon="ant-design:setting-filled" :help-message="['3', '4']">
      basic title
    </TaBasicTitle>
    <!-- <TaLoading  :loading="true"></TaLoading> -->

    <!-- <TimeLineListPage />
  <TimePage />
  <InputNumberRangePage />
  <FileViewPage />
  <TreePage />
  <ModalPage />
  <FormPage />
  <BasicTablePage /> -->
  </TaConfigProvider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
</style>
