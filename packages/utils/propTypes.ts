// import { createTypes } from 'vue-types'
// import type { CSSProperties, VNodeChild } from 'vue'
// import type { VueTypeValidableDef, VueTypesInterface } from 'vue-types'

// export type VueNode = VNodeChild | JSX.Element

// type PropTypes = VueTypesInterface & {
//   readonly style: VueTypeValidableDef<CSSProperties>
//   readonly VNodeChild: VueTypeValidableDef<VueNode>
//   // readonly trueBool: VueTypeValidableDef<boolean>;
// }

// const propTypes = createTypes({
//   func: undefined,
//   bool: undefined,
//   string: undefined,
//   number: undefined,
//   object: undefined,
//   integer: undefined,
// }) as PropTypes

// propTypes.extend([
//   {
//     name: 'style',
//     getter: true,
//     type: [String, Object],
//     default: undefined,
//   },
//   {
//     name: 'VNodeChild',
//     getter: true,
//     type: undefined,
//   },
// ])
// export { propTypes }

import { createTypes } from 'vue-types'
import type { CSSProperties, VNodeChild } from 'vue'
import type { VueTypeValidableDef, VueTypesInterface } from 'vue-types'

export type VueNode = VNodeChild | JSX.Element

type PropTypes = VueTypesInterface & {
  readonly looseBool: VueTypeValidableDef<boolean>
  readonly style: VueTypeValidableDef<CSSProperties>
  readonly VNodeChild: VueTypeValidableDef<VueNode>
}

const propTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  array: undefined,
  object: undefined,
  integer: undefined,
}) as PropTypes

propTypes.extend([
  {
    name: 'looseBool',
    getter: true,
    type: Boolean,
    default: undefined,
  },
  {
    name: 'style',
    getter: true,
    type: [String, Object],
    default: undefined,
  },
  {
    name: 'VNodeChild',
    getter: true,
    type: undefined,
  },
])

export function withUndefined<T extends { default?: any }>(type: T): T {
  type.default = undefined
  return type
}

export { propTypes }
