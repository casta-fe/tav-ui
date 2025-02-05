import { createId, createNS } from '../utils'

const ns = createNS('permission-data-query')
export const DEFAULT_PERMISSIONDATAQUERY_CLASSNAME = ns.b()
export const DEFAULT_PERMISSIONDATAQUERY_ID = () => createId(DEFAULT_PERMISSIONDATAQUERY_CLASSNAME)
