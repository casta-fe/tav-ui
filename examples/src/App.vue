<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
import dayjs from 'dayjs'
import TaConfigProvider from '@tav-ui/components/config-provider'
import {
  API__SYSTEM_USER_TABLE_INFO_GET as columnsGetApi,
  API__SYSTEM_USER_TABLE_INFO_SET as columnsSetApi,
} from '@tav-ui/components/table-pro/src/data'
import allUsers from './allUserList'
import { taUploadProvideData } from './components/TaUpload'
import 'dayjs/locale/zh-cn'
import { useI18n } from './hooks/useI18n'
import { i18n } from './locales/setupI18n'
dayjs.locale('zh-cn')
export default defineComponent({
  components: {
    TaConfigProvider,
    ConfigProvider,
  },
  setup() {
    const { t } = useI18n()
    const state = reactive({
      appId: '10002',
      userInfo: {
        id: 1,
        name: 'admin',
        organizationId: 1,
        phone: '13999999999',
      },
      i18nFun: {
        t,
        i18n,
      },
      permissions: {},
      components: {
        TaUpload: taUploadProvideData,
        TaMemberSelect: {
          allUserList: allUsers.data.map((v) => {
            return { label: v.name, value: v.id, ...v }
          }),
        },
        // TaTablePro: {
        //   actionLabelLimit: 4,
        //   columnsGetApi,
        //   columnsSetApi,
        // },
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
      zhCN,
      state,
    }
  },
})
</script>

<template>
  <TaConfigProvider
    :app-id="state.appId"
    :user-info="state.userInfo"
    :permissions="state.permissions"
    :components="state.components"
    :i18n-fun="state.i18nFun"
  >
    <ConfigProvider :locale="zhCN">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </ConfigProvider>
  </TaConfigProvider>
</template>
