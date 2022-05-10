<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from 'vue';
import { defineComponent, reactive } from '@vue/runtime-core';
// import { TaLoadingCreate } from '../../dist/index.esm.js'
import * as HelloWorld from './components/HelloWorld.vue';
import TimeLineListPage from './components/timeLineList/index.vue';
import TimePage from './components/time/index.vue';
import InputNumberRangePage from './components/InputNumberRange/index.vue';
import FileViewPage from './components/FileView/index.vue';
import FormPage from './components/Form/index.vue';
import TreePage from './components/Tree/index.vue';
import ModalPage from './components/Modal/index.vue';

export default defineComponent({
  components: {
    HelloWorld,
    TimeLineListPage,
    TimePage,
    InputNumberRangePage,
    FileViewPage,
    FormPage,
    TreePage,
    ModalPage,
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
    return {};
  },
});
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <TaIcon color="red" :size="30" class="tg-icon-dropbox"> Icon Test </TaIcon>
  <TaButton type="text" pre-icon="ant-design:plus-square-filled" pre-icon-color="#276dff">
    aaa
  </TaButton>
  <TaBasicArrow />
  <TaBasicHelp :text="['1', '2']" />
  <br />
  <TaBasicTitle icon="ant-design:setting-filled" :help-message="['3', '4']">
    basic title
  </TaBasicTitle>
  <!-- <TaLoading  :loading="true"></TaLoading> -->

  <TimeLineListPage />
  <TimePage />
  <InputNumberRangePage />
  <FileViewPage />
  <TreePage />
  <ModalPage />
  <FormPage />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
