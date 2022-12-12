import { limitActionLabel } from '../components/action'
import { MAX_ACTION_NUMBER } from '../const'
import type { TableProActionItem } from '../typings'

export function useColumnActionAutoWidth(actions: TableProActionItem[] | null) {
  if (!actions) return undefined

  const containDotTextWidth = 12 * 2 + 7.5
  const textWidth = (n: number) => 12 * n
  const dividerWidth = 17
  const padding = 10 * 3
  const moreBtnWidth = 13.5 + 10

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

  const handledActions = limitActionLabel(JSON.parse(JSON.stringify(actions)))
  if (handledActions.length <= MAX_ACTION_NUMBER) {
    const total = getTotal(handledActions)
    return total
  } else {
    const contentActions = handledActions.slice(0, 2)
    let total = getTotal(contentActions)
    total += moreBtnWidth
    return total
  }
}
