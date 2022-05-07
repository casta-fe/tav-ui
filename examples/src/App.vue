<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">
    Icon Test
  </TgIcon>
  <TaButton type="text" pre-icon="ant-design:plus-square-filled" pre-icon-color="#276dff">
    aaa
  </TaButton>
  <TaBasicArrow />
  <TaBasicHelp :text="['1','2']" />
  <br>
  <TaBasicTitle icon="ant-design:setting-filled" :help-message="['3','4']">
    basic title
  </TaBasicTitle>
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
