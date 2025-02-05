import { createId, createNS } from '../utils'

const ns = createNS('table-permission-data-query')
export const DEFAULT_TABLEPERMISSIONDATAQUERY_CLASSNAME = ns.b()
export const DEFAULT_TABLEPERMISSIONDATAQUERY_ID = () =>
  createId(DEFAULT_TABLEPERMISSIONDATAQUERY_CLASSNAME)
