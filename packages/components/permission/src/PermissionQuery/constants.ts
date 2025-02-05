import { createId, createNS } from '../utils'

const ns = createNS('permission-query')
export const DEFAULT_PERMISSIONQUERY_CLASSNAME = ns.b()
export const DEFAULT_PERMISSIONQUERY_ID = () => createId(DEFAULT_PERMISSIONQUERY_CLASSNAME)
