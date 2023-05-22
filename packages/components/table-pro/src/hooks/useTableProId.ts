import { unref } from 'vue'

export function getTableProId(router: any, id: string) {
  const { currentRoute } = router
  const { name } = unref(currentRoute) || {}
  if (!name) {
    console.warn(`setTableProId has error. Not find current route['name'].`)
    return null
  } else {
    return `${name}__${id}`
  }
}
