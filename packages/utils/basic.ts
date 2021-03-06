import { unref } from 'vue'
import { isObject } from './is'

declare type TargetContext = '_self' | '_blank'
declare type Recordable<T = any> = Record<string, T>

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target)
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])

  return src
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).forEach((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase()
}

export function kebabCaseToCamelCase(text) {
  return text.replace(/-\w/g, clearAndUpper)
}

export function kebabCaseToPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper)
}

export function numberToCNText(number) {
  const data = {
    0: '???',
    1: '???',
    2: '???',
    3: '???',
    4: '???',
    5: '???',
    6: '???',
    7: '???',
    8: '???',
    9: '???',
  }

  return data[`${number}`]
}

/**
 * ??????????????? a.b.c ?????????????????? obj ?????? c
 * @param obj
 * @param path
 * @param returnType value ???????????????????????????????????????????????????????????????
 * @returns
 */
export function getPropByPath(obj, path, returnType = 'all') {
  let tempObj = JSON.parse(JSON.stringify(obj))
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj) break
    const key = keyArr[i]
    if (key in tempObj) tempObj = tempObj[key]
    else break
  }

  const result = {
    o: tempObj,
    k: keyArr[i],
    v: tempObj && tempObj[keyArr[i]] ? tempObj[keyArr[i]] : null,
  }

  if (returnType === 'value') return result.v
  else return result
}
