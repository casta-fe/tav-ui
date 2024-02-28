import { createApp } from 'vue'
import { toLogin } from '@tav-ui/components/table-pro/src/data'
import 'ant-design-vue/dist/antd.less'
import '@tav-ui/theme-chalk/src/index.less'
import 'virtual:windi.css'
import App from './App.vue'
import 'vxe-table/lib/style.css'
// eslint-disable-next-line import/order
import { TaVXETable } from '@tav-ui/components/table-pro'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.use(TaVXETable)
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
