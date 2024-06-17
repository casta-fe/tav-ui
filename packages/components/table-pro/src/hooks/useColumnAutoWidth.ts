import type { TableProActionItem } from '../typings'

// const DEFAULT_MAX_WIDTH = (17 * 2) + (10 * 2) + (12 * 2 + 4) * 3 // = 138 俩个分割线、俩个 padding、三个俩个字俩个点
const DEFAULT_LABEL_MAX_WIDTH = 12 * 2 + 3 * 2 // 12 字体大小，3 一个英文点
const DEFAULT_DIVIDER_WIDTH = 16 + 1
const DEFAULT_PADDING = 10
const DEFAULT_CONTENT_MAX_WIDTH = DEFAULT_LABEL_MAX_WIDTH * 3 + DEFAULT_DIVIDER_WIDTH * 2
const DEFAULT_CONTENT_MIN_WIDTH = DEFAULT_LABEL_MAX_WIDTH
const DEFAULT_MORE_BUTTON_WIDTH = 3 * 3

export function useCanvasCalcContent() {
  let canvas: HTMLCanvasElement | null = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  // const getComputedStyle = window.getComputedStyle
  // let bodyEl: HTMLElement | null = document.body
  // const DEFAULT_FONT = `${getComputedStyle(bodyEl).fontWeight} ${getComputedStyle(bodyEl).fontSize} ${getComputedStyle(bodyEl).fontFamily}`
  const DEFAULT_FONT = `normal 12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"`

  function calcContent(content: string, font: string = DEFAULT_FONT) {
    if (ctx) {
      ctx.font = font
      const { width = 0 } = ctx.measureText(content)
      return Math.ceil(width)
    }
    return 0
  }

  function clearCalcContentCanvas() {
    canvas?.remove()
    // ctx = null
    canvas = null
    // bodyEl = null
  }

  return {
    calcContent,
    clearCalcContentCanvas,
  }
}

export function isOverMaxWidth(
  actions: TableProActionItem[] | null,
  calcFn?: (...args: any) => number
) {
  if (!actions) return false

  const getTotal = (_actions: TableProActionItem[]) => {
    return _actions.reduce((total, action, idx) => {
      if (action.label) {
        total += calcFn ? calcFn(action.label) : 0
      } else {
        total += 0
      }

      if (idx !== _actions.length - 1) {
        total += DEFAULT_DIVIDER_WIDTH
      }
      return total
    }, 0)
  }

  return getTotal(actions) > DEFAULT_CONTENT_MAX_WIDTH
}

export function useColumnActionAutoWidth(
  actions: TableProActionItem[] | null,
  labelMaxLength: number,
  calcFn?: (...args: any) => number
) {
  if (!actions) return undefined

  const getTotal = (_actions: TableProActionItem[]) => {
    return _actions.reduce((total, action, idx) => {
      if (action.label) {
        total += calcFn ? calcFn(action.label) : 0
      } else {
        total += 0
      }

      if (idx !== _actions.length - 1) {
        total += DEFAULT_DIVIDER_WIDTH
      } else {
        total += DEFAULT_PADDING * 2
      }
      return total
    }, 0)
  }

  const handledActions = JSON.parse(JSON.stringify(actions))

  if (handledActions.length <= labelMaxLength) {
    const total = getTotal(handledActions)
    return total < DEFAULT_CONTENT_MIN_WIDTH + DEFAULT_PADDING * 2
      ? DEFAULT_CONTENT_MIN_WIDTH + DEFAULT_PADDING * 2
      : total
  } else {
    const contentActions = handledActions.slice(0, 2)
    let total = getTotal(contentActions)
    total += DEFAULT_MORE_BUTTON_WIDTH + DEFAULT_DIVIDER_WIDTH
    return total < DEFAULT_CONTENT_MIN_WIDTH + DEFAULT_PADDING * 2
      ? DEFAULT_CONTENT_MIN_WIDTH + DEFAULT_PADDING * 2
      : total
  }
}
