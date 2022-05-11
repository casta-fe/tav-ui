import { ref, unref } from 'vue'
import { isFunction, isUnDef } from '@tav-ui/utils/is'
export type DirectionType = 'scrollTop' | 'scrollLeft'

export interface ScrollToParams {
  el: any
  to: number
  duration?: number
  direction?: DirectionType
  callback?: () => any
}

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b

  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}
const move = (el: HTMLElement, amount: number, direction: DirectionType) => {
  el[direction] = amount
}

const position = (el: HTMLElement, direction: DirectionType) => {
  return el[direction]
}
export function useScrollTo({
  el,
  to,
  duration = 500,
  direction = 'scrollTop',
  callback,
}: ScrollToParams) {
  const isActiveRef = ref(false)
  const start = position(el, direction)
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = isUnDef(duration) ? 500 : duration

  const animateScroll = function () {
    if (!unref(isActiveRef)) return

    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    move(el, val, direction)
    if (currentTime < duration && unref(isActiveRef)) requestAnimationFrame(animateScroll)
    else if (callback && isFunction(callback)) callback()
  }
  const run = () => {
    isActiveRef.value = true
    animateScroll()
  }

  const stop = () => {
    isActiveRef.value = false
  }

  return { start: run, stop }
}
