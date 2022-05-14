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
