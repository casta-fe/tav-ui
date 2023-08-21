import { nextTick } from 'vue'
import { isNullOrUnDef } from '@tav-ui/utils'
import type { App, ObjectDirective } from 'vue'
// 根据el获取input
const getInput = (el: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null =>
  el instanceof HTMLInputElement ? el : el.querySelector('input') || el.querySelector('textarea')

const AutoFocusDirective: ObjectDirective = {
  mounted: async (el: HTMLInputElement | HTMLTextAreaElement, { arg }) => {
    // 为了防止数据未及时更新。
    await nextTick()
    // 对于非文本框聚焦（使用了 contenteditable ）的直接聚焦即可 加上兼容InputNumber值为0选中全部
    const relEle = arg ? el : getInput(el)
    if (!isNullOrUnDef(relEle)) {
      relEle.focus()
      const className = relEle.getAttribute('class')
      const value = relEle.value
      if (!Number.isNaN(value) && className && className.indexOf('number-input') > -1) {
        relEle?.setSelectionRange(0, 1000)
      }
    }
  },
}

export function setupAutoFocusDirective(app: App) {
  app.directive('autoFocus', AutoFocusDirective)
}

export default AutoFocusDirective
