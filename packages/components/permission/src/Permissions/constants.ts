import { createId, createNS } from '../utils'

const ns = createNS('permissions')
export const DEFAULT_PERMISSIONS_CLASSNAME = ns.b()
export const DEFAULT_PERMISSIONS_ID = () => createId(DEFAULT_PERMISSIONS_CLASSNAME)
