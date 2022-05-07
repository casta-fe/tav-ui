import { createApp } from 'vue'
import TgIcon from '@tav-ui/components/test-icon'
import { TaBasicArrow, TaBasicHelp, TaBasicTitle, TaButton } from '../../dist/index.esm.js'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import '@tav-ui/theme-chalk/src/index.less'

const app = createApp(App)
app.use(TgIcon)
app.use(TaButton)
app.use(TaBasicTitle)
app.use(TaBasicArrow)
app.use(TaBasicHelp)
app.mount('#app')
