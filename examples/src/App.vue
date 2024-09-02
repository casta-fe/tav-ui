<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
import dayjs from 'dayjs'
import TaConfigProvider from '@tav-ui/components/config-provider'
// import {
//   API__SYSTEM_USER_TABLE_INFO_GET as columnsGetApi,
//   API__SYSTEM_USER_TABLE_INFO_SET as columnsSetApi,
// } from '@tav-ui/components/table-pro/src/data'
import allUsers from './allUserList'
import orgTree from './orgTree'
import { taUploadProvideData } from './components/TaUpload'
import 'dayjs/locale/zh-cn'
import { useI18n } from './hooks/useI18n'
import { i18n } from './locales/setupI18n'
import {
  UserListApi,
  previewFile,
  previewWPSFile,
  queryFileByFileActualIds,
  queryFileLog,
  queryFilterFormFileType,
} from './components/TaUpload/provideData'
dayjs.locale('zh-cn')
export default defineComponent({
  components: {
    TaConfigProvider,
    ConfigProvider,
  },
  setup() {
    const { t } = useI18n()
    const orgApi = () =>
      new Promise((resolve) => {
        resolve(orgTree)
      })
    const state = reactive({
      appId: '10001',
      userInfo: {
        userId: 1,
        isAdmin: true,
        username: 'admin',
        realName: '系统管理员',
        phone: '13999999999',
        // userId: 108,
        // isAdmin: false,
        // username: '靳熙',
        // realName: '靳熙',
        // phone: '15029309050',
      },
      i18nFun: {
        t,
        i18n,
      },
      permissions: {},
      components: {
        TaUpload: taUploadProvideData,
        // tafile
        TaFileTypeSelect: {
          apiQueryFileType: taUploadProvideData.queryFileType,
        },
        TaFileActionUpload: {
          apiUploadFile: taUploadProvideData.uploadFile,
          apiUpdateFile: taUploadProvideData.updateFile,
        },
        TaFileActionUploadLink: {
          apiUploadFileLink: taUploadProvideData.uploadFileLink,
        },
        TaFileTable: {
          apiQueryFile: taUploadProvideData.queryFile,
          apiQueryFileList: taUploadProvideData.queryFileList,
          apiQueryFileByActualIds: queryFileByFileActualIds,
          apiQueryFilterFormFileType: queryFilterFormFileType,
          apiQueryFileHistory: taUploadProvideData.queryFileHistory,
          apiUpdateFileNameAndLink: taUploadProvideData.updateFileNameAndAddress,
          apiDeleteFile: taUploadProvideData.removeFile,
          apiPreviewFile: previewWPSFile,
          apiDownloadFile: taUploadProvideData.download,
          apiDownloadWaterMarkerFile: taUploadProvideData.downloadWaterMarker,
        },
        TaFileVersion: {
          apiQueryFileHistory: taUploadProvideData.queryFileHistory,
          apiPreviewFile: previewWPSFile,
          apiDownloadFile: taUploadProvideData.download,
          apiDownloadWaterMarkerFile: taUploadProvideData.downloadWaterMarker,
        },
        TaFilePreview: {
          apiPreviewFile: previewWPSFile,
        },
        TaFileLog: {
          apiQueryFileLog: queryFileLog,
        },
        TaFileCards: {
          apiQueryFileType: taUploadProvideData.queryFileType,
          apiQueryFileList: taUploadProvideData.queryFileList,
        },
        TaFileCard: {
          apiQueryFileList: taUploadProvideData.queryFileList,
          apiQueryFileHistory: taUploadProvideData.queryFileHistory,
          apiUpdateFileNameAndLink: taUploadProvideData.updateFileNameAndAddress,
          apiDeleteFile: taUploadProvideData.removeFile,
          apiPreviewFile: previewWPSFile,
          apiDownloadFile: taUploadProvideData.download,
          apiDownloadWaterMarkerFile: taUploadProvideData.downloadWaterMarker,
        },

        TaMemberSelect: {
          orgApi,
          allUserList: allUsers.data.map((v) => {
            return { label: v.name, value: v.id, ...v }
          }),
          userListApi: UserListApi,
        },
        // TaTablePro: {
        //   actionLabelLimit: 4,
        //   columnsGetApi,
        //   columnsSetApi,
        // },
        TaFileView: {
          previewFile,
          previewWPSFile,
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
      // state.components.TaFile.fileActionUpload = {
      //   ...state.components.TaFile.fileActionUpload,
      //   accpet: '*',
      // }
      // console.log(state)
    }, 3000)

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
