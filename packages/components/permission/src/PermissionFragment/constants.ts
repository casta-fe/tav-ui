import { createId, createNS } from '../utils'

const ns = createNS('permission-fragment')
export const DEFAULT_PERMISSIONFRAGMENT_CLASSNAME = ns.b()
export const DEFAULT_PERMISSIONFRAGMENT_ID = () => createId(DEFAULT_PERMISSIONFRAGMENT_CLASSNAME)
