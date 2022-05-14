/**
 * Configure and register global directives
 */
import { setupAutoFocusDirective } from './src/autoFocus'
import { setupClickOutsideDirective } from './src/clickOutside'
import { setupLoadingDirective } from './src/loading'
import { setupPermissionDirective } from './src/permission'
import type { App } from 'vue'

export function setupGlobDirectives(app: App) {
  setupAutoFocusDirective(app)
  setupClickOutsideDirective(app)
  setupPermissionDirective(app)
  setupLoadingDirective(app)
}

export { default as AutoFocusDirective } from './src/autoFocus'
export { default as ClickOutsideDirective } from './src/clickOutside'
export { default as LoadingDirective } from './src/loading'
export { default as PermissionDirective } from './src/permission'
export { default as RepeatClickDirective } from './src/repeatClick'
export { default as RippleDirective } from './src/ripple'
