import { createApp } from 'vue'
import TaIcon from '@tav-ui/components/test-icon'
import { TaBasicArrow, TaBasicHelp, TaBasicTitle, TaButton, TaFileView, TaInputNumberRange, TaLoading, TaModal, TaTime, TaTimeLine } from '../../dist/index.esm.js'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import '@tav-ui/theme-chalk/src/index.less'

const app = createApp(App)
app.use(TaIcon)
app.use(TaButton)
app.use(TaBasicTitle)
app.use(TaBasicArrow)
app.use(TaBasicHelp)
app.use(TaLoading)
app.use(TaModal)
app.use(TaTimeLine)
app.use(TaTime)
app.use(TaInputNumberRange)
app.use(TaFileView)

app.mount('#app')
