// import { type ComputedRef, type Ref, computed } from 'vue'
// import { isBoolean } from '@tav-ui/utils'
// import {
//   type FileTableCustomActionConfig,
//   type FileTableInstance,
//   type FileCardProps,
// } from '../types'
// import { type GlobalConfigFileProps } from '../../typings'

// export function defaultRulesBuilder(dataSource: any) {
//   return dataSource && dataSource.length > 0
// }

// export function useRules(options: {
//   mergedProps: ComputedRef<GlobalConfigFileProps & FileCardProps>
// }) {
//   const { mergedProps } = options

//   return computed(() => {
//     const rules = mergedProps.value.rules

//     const customActionConfigWithNull = {
//       enabled: false,
//     }

//     const customActionConfigWithDefault = () => {
//       if (isBoolean(rules)) {
//         if (rules) {
//           return defaultRulesBuilder()
//         } else {
//           return { ...customActionConfigWithNull }
//         }
//       } else {
//         let result = defaultRulesBuilder()
//         result = rules(result)
//         return result
//       }
//     }

//     if (mergedProps.value.mode === 'read') {
//       if (mergedProps.value.dataSource) {
//         console.warn(
//           '[tavui TaFileTable] "customActionConfig" not working in mode "read" combine with "dataSource"'
//         )
//         return { ...customActionConfigWithNull }
//       } else {
//         return customActionConfigWithDefault()
//       }
//     } else if (mergedProps.value.mode === 'create') {
//       if (mergedProps.value.dataSource) {
//         console.warn(
//           '[tavui TaFileTable] "customActionConfig" not working in mode "create" combine with "dataSource"'
//         )
//         return { ...customActionConfigWithNull }
//       } else {
//         console.warn(
//           '[tavui TaFileTable] "customActionConfig" not working in mode "create" combine with "api"'
//         )
//         return { ...customActionConfigWithNull }
//       }
//     } else if (mergedProps.value.mode === 'update') {
//       if (mergedProps.value.dataSource) {
//         console.warn(
//           '[tavui TaFileTable] "customActionConfig" not working in mode "read" combine with "dataSource"'
//         )
//         return { ...customActionConfigWithNull }
//       } else {
//         return customActionConfigWithDefault()
//       }
//     } else {
//       if (mergedProps.value.dataSource) {
//         console.warn(
//           '[tavui TaFileTable] "customActionConfig" not working in mode "read" combine with "dataSource"'
//         )
//         return { ...customActionConfigWithNull }
//       } else {
//         return customActionConfigWithDefault()
//       }
//     }
//   })
// }
