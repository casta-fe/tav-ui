import type { FunctionArgs } from '@vueuse/core'
import { upperFirst } from 'lodash-es'

export interface ViewportOffsetResult {
  left: number
  top: number
  right: number
  bottom: number
  rightIncludeBody: number
  bottomIncludeBody: number
}

interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect)
    return 0

  return element.getBoundingClientRect()
}

function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls)
    return false
  if (cls.includes(' '))
    throw new Error('className should not contain space.')
  if (el.classList)
    return el.classList.contains(cls)
  else return ` ${el.className} `.includes(` ${cls} `)
}

/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
  if (!el)
    return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName)
      continue

    if (el.classList)
      el.classList.add(clsName)
    else if (!hasClass(el, clsName))
      curClass += ` ${clsName}`
  }
  if (!el.classList)
    el.className = curClass
}

/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls)
    return
  const classes = cls.split(' ')
  let curClass = ` ${el.className} `

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName)
      continue

    if (el.classList)
      el.classList.remove(clsName)
    else if (hasClass(el, clsName))
      curClass = curClass.replace(` ${clsName} `, ' ')
  }
  if (!el.classList)
    el.className = trim(curClass)
}
/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement
  const docScrollLeft = doc.scrollLeft
  const docScrollTop = doc.scrollTop
  const docClientLeft = doc.clientLeft
  const docClientTop = doc.clientTop

  const pageXOffset = window.pageXOffset
  const pageYOffset = window.pageYOffset

  const box = getBoundingClientRect(element)

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
  const offsetLeft = retLeft + pageXOffset
  const offsetTop = rectTop + pageYOffset

  const left = offsetLeft - scrollLeft
  const top = offsetTop - scrollTop

  const clientWidth = window.document.documentElement.clientWidth
  const clientHeight = window.document.documentElement.clientHeight
  return {
    left,
    top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left, // 包含自身
    bottomIncludeBody: clientHeight - top, // 包含自身
  }
}

export function hackCss(attr: string, value: string) {
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT']

  const styleObj: any = {}
  prefix.forEach((item) => {
    styleObj[`${item}${upperFirst(attr)}`] = value
  })
  return {
    ...styleObj,
    [attr]: value,
  }
}

/* istanbul ignore next */
export function on(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
): void {
  if (element && event && handler)
    element.addEventListener(event, handler, false)
}

/* istanbul ignore next */
export function off(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn,
): void {
  if (element && event && handler)
    element.removeEventListener(event, handler, false)
}

/* istanbul ignore next */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: any) {
    if (fn)
      fn.apply(this, args)

    off(el, event, listener)
  }
  on(el, event, listener)
}

export function useRafThrottle<T extends FunctionArgs>(fn: T): any {
  let locked = false
  return function (...args: any) {
    if (locked)
      return
    locked = true
    window.requestAnimationFrame(() => {
      // @ts-expect-error
      fn.apply(this, args)
      locked = false
    })
  }
}

export function parentsUntil(el, selector, filter): HTMLDivElement[] {
  const result: HTMLDivElement[] = []
  const matchesSelector
    = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector

  // match start from parent
  el = el.parentElement
  while (el && !matchesSelector.call(el, selector)) {
    if (!filter)
      result.push(el)
    else if (matchesSelector.call(el, filter))
      result.push(el)

    el = el.parentElement
  }
  return result
}

export function closest(el, selector): HTMLDivElement | null {
  const matchesSelector
    = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector

  while (el) {
    if (matchesSelector.call(el, selector))
      return el
    else el = el.parentElement
  }
  return null
}
