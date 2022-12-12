import { MAX_ACTION_NUMBER } from '../const'
import type { ActionItem } from '../types/tableAction'

/**
 * @description 如果内容长度大于3，则修改为 xx.. 基于字体是12px的基础之下长度为32px。
 * @param actions
 * @param labelMaxLength
 * @returns
 */
export function limitActionLabel(actions: ActionItem[], labelMaxLength = 3) {
  return actions.map((action) => {
    const { label } = action
    if (label && label.length > labelMaxLength) {
      action.tooltip = label
      action.label = `${label.substring(0, 2)}..`
    }
    return action
  })
}

export function useColumnActionAutoWidth(actions: ActionItem[] | null) {
  if (!actions) return undefined

  const containDotTextWidth = 12 * 2 + 7.5
  const textWidth = (n: number) => 12 * n
  const dividerWidth = 17
  const padding = 10 * 3
  const moreBtnWidth = 13.5 + 10

  const getTotal = (_actions: ActionItem[]) => {
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
