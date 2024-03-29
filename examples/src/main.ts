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
import { setupI18n } from './locales/setupI18n'
// import { i18n } from './locales/setupI18n'
// console.log(TaVXETable)
// TaVXETable.setup({
//   i18n: (key, args) => i18n.global.t(key, args),
// })
const app = createApp(App)
app.use(router)
// app.use(TaUi)
await setupI18n(app)
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
if ('3003' === location.port) {
  app.mount('#app')
} else {
  Promise.race([toLogin(), new Promise((_, r) => setTimeout(r.bind(null, 'timeout'), 3000))])
    .catch((e) => {
      console.error(e)
    })
    .finally(() => {
      app.mount('#app')
    })
}
