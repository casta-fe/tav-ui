<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import TaConfigProvider from '@tav-ui/components/config-provider'
import allUsers from './allUserList'
import { taUploadProvideData } from './components/TaUpload'

export default defineComponent({
  components: {
    TaConfigProvider,
  },
  setup() {
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
    }
  },
})
</script>

<template>
  <TaConfigProvider :permissions="state.permissions" :components="state.components">
    <!-- <div id="nav">
      <router-link to="/"> 首页 </router-link> |
      <router-link to="/test">测试 </router-link>
    </div>
    <br /> -->
    <router-view />
  </TaConfigProvider>
</template>
