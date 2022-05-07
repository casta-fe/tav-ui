<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { defineComponent } from '@vue/runtime-core'
import { ref } from 'vue'
// import { TaLoadingCreate } from '../../dist/index.esm.js'
import * as HelloWorld from './components/HelloWorld.vue'
// import TimeLineList from './components/TimeLineList.vue'

export default defineComponent({
  components: {
    HelloWorld,
    // TimeLineList
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
    const visible = ref(false)
    const modalOk = () => {
      alert('ok callback')
      visible.value = false
    }
    const modalCancel = () => {
      alert('cancel callback')
    }
    const modelOpen = () => {
      visible.value = true
    }
    return {
      modalOk,
      modalCancel,
      modelOpen,
      visible,
    }
  },
})
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <TaIcon color="red" :size="30" class="tg-icon-dropbox">
    Icon Test
  </TaIcon>
  <TaButton type="text" pre-icon="ant-design:plus-square-filled" pre-icon-color="#276dff">
    aaa
  </TaButton>
  <TaBasicArrow />
  <TaBasicHelp :text="['1','2']" />
  <br>
  <TaBasicTitle icon="ant-design:setting-filled" :help-message="['3','4']">
    basic title
  </TaBasicTitle>
  <!-- <TaLoading  :loading="true"></TaLoading> -->
  <TaButton type="danger" @click="modelOpen">
    打开弹窗
  </TaButton>
  <TaModal
    v-model:visible="visible"
    title="sksksk"
    @ok="modalOk"
    @cancel="modalCancel"
  >
    <div>ddkdkkdkd</div>
  </TaModal>
  <TimeLineList />
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
