/**
 * Configure and register global directives
 */
// import type { App } from "vue";
// import { setupAutoFocusDirective } from "./autoFocus";
// import { setupClickOutsideDirective } from "./clickOutside";
// import { setupLoadingDirective } from "./loading";
// import { setupPermissionDirective } from "./permission";

// export function setupGlobDirectives(app: App) {
//   setupAutoFocusDirective(app);
//   setupClickOutsideDirective(app);
//   setupPermissionDirective(app);
//   setupLoadingDirective(app);
// }

// export {default as rippleDirective} from "./src/ripple"
export { default as autoFocusDirective } from './src/autoFocus';
export { default as clickOutside } from './src/clickOutside';
export { default as loadingDirective } from './src/loading';
// export {default as authDirective} from "./src/permission"
// export {default as repeatDirective} from "./src/repeatClick"
