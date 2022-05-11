// import * as components from '@tav-ui/components'
// import type { App } from 'vue'

// const install = (app: App) => {
//   // 每个组件在写的时候都提供了install方法

//   // 有的是组件，有的可能是指令 xxx.install = () => { app.directive() }
//   // components.forEach((component) => app.use(component));

//   Object.entries(components).forEach(([name, component]) => {
//     // ts-ignore
//     app.component(name, component)
//   })
// }

// export default {
//   install,
// }

// export * from '@tav-ui/components'

import installer from './defaults'
export * from '@tav-ui/components'
export * from '@tav-ui/directives'
// export * from '@tav-ui/enums'
export * from '@tav-ui/hooks'
export * from '@tav-ui/settings'
export * from '@tav-ui/utils'
export { makeInstaller } from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer
