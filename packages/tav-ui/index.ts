// import { WIcon,WButton } from "@tav-ui/components";
import * as components from '@tav-ui/components'
import type { App } from 'vue'
import TaLoadingCreate from '@tav-ui/components/loading/src/loading-methods'
// const components = [WIcon,WButton];

const install = (app: App) => {
  // 每个组件在写的时候都提供了install方法

  // 有的是组件，有的可能是指令 xxx.install = () => { app.directive() }
  // components.forEach((component) => app.use(component));

  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
}

// use: app.use(WPlus)
export default {
  install,
}
export { TaLoadingCreate }
// use: import { WIcon } from 'tav-ui
export * from '@tav-ui/components'
