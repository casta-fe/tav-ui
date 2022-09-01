import { createApp } from 'vue'
import { toLogin } from '@tav-ui/components/table-pro/src/data'
import { router } from './router'
// import {
//   TaBasicArrow,
//   TaBasicHelp,
//   TaBasicTitle,
//   TaButton,
//   TaContainerCollapse,
//   TaFileView,
//   TaForm,
//   TaIcon,
//   TaInputNumberRange,
//   TaLoading,
//   TaModal,
//   TaTime,
//   TaTimeLine,
// } from '../../dist/tav-ui/dist/index.full.mjs'
// import TaUi from '../../dist/tav-ui/es/index.mjs'
import 'ant-design-vue/dist/antd.less'
import '@tav-ui/theme-chalk/src/index.less'
import 'virtual:windi.css'
import App from './App.vue'
import 'vxe-table/lib/style.css'
// eslint-disable-next-line import/order
import { TaVXETable } from '@tav-ui/components/table-pro'

const app = createApp(App)
app.use(router)
// app.use(TaUi)
app.use(TaVXETable)
// app.use(TaIcon)
// app.use(TaButton)
// app.use(TaBasicTitle)
// app.use(TaBasicArrow)
// app.use(TaBasicHelp)
// app.use(TaLoading)
// app.use(TaModal)
// app.use(TaTimeLine)
// app.use(TaTime)
// app.use(TaInputNumberRange)
// app.use(TaFileView)
// app.use(TaForm)
// app.use(TaContainerCollapse)

toLogin().finally(() => {
  app.mount('#app')
})
