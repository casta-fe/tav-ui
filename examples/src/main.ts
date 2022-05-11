import { createApp } from 'vue'
import TgIcon from '@tav-ui/components/test-icon'
import {
  TaBasicArrow,
  TaBasicHelp,
  TaBasicTitle,
  TaButton,
  TaContainerCollapse,
  TaFileView,
  TaForm,
  TaIcon,
  TaInputNumberRange,
  TaLoading,
  TaModal,
  TaTable,
  TaTime,
  TaTimeLine,
} from '../../dist/index.esm.js'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import '@tav-ui/theme-chalk/src/index.less'

const app = createApp(App)
app.use(TgIcon)
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
app.use(TaForm)
app.use(TaContainerCollapse)
app.mount('#app')
