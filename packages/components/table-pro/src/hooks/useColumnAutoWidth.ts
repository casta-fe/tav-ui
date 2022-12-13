import { limitActionLabel } from '../components/action'
import { MAX_ACTION_NUMBER } from '../const'
import type { TableProActionItem } from '../typings'

const containDotTextWidth = 12 * 2 + 7.5
const textWidth = (n: number) => 12 * n
const dividerWidth = 17
const padding = 10 * 3 // 多乘一个避免vxetable手动添加tooltip时自动截断
const moreBtnWidth = 13.5 + 10
const maxWidth = containDotTextWidth * 3 + dividerWidth * 2
const minWidth = 60

export function isOverMaxWidth(actions: TableProActionItem[] | null) {
  if (!actions) return false

  const getTotal = (_actions: TableProActionItem[]) => {
    return _actions.reduce((total, action, idx) => {
      if (action.label) {
        total += textWidth(action.label.length)
      } else {
        total += 0
      }

      if (idx !== _actions.length - 1) {
        total += dividerWidth
      }
      return total
    }, 0)
  }

  const result = getTotal(actions) > maxWidth
  return result
}

export function useColumnActionAutoWidth(actions: TableProActionItem[] | null, handleLimit = true) {
  if (!actions) return undefined

  const getTotal = (_actions: TableProActionItem[]) => {
    return _actions.reduce((total, action, idx) => {
      if (action.label) {
        if (action.label.includes('..')) {
          total += containDotTextWidth
        } else {
          total += textWidth(action.label.length)
        }
      } else {
        total += 0
      }

      if (idx !== _actions.length - 1) {
        total += dividerWidth
      } else {
        total += padding
      }
      return total
    }, 0)
  }

  const handledActions = handleLimit
    ? limitActionLabel(JSON.parse(JSON.stringify(actions)))
    : JSON.parse(JSON.stringify(actions))
  if (handledActions.length <= MAX_ACTION_NUMBER) {
    const total = getTotal(handledActions)
    return total < minWidth ? minWidth : total
  } else {
    const contentActions = handledActions.slice(0, 2)
    let total = getTotal(contentActions)
    total += moreBtnWidth
    return total < minWidth ? minWidth : total
  }
}
