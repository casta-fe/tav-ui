import { useNamespace } from '@tav-ui/utils/namespace'
import { nanoid } from '@tav-ui/utils/uuid'

export function createNS(name: string) {
  return useNamespace(name)
}

export function createId(className: string) {
  return `${className}-${nanoid()}`
}
