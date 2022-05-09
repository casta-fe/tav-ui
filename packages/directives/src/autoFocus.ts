import type { App, ObjectDirective } from 'vue'
import { nextTick } from 'vue'
// 根据el获取input
const getInput = (el: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null =>
  el instanceof HTMLInputElement ? el : el.querySelector('input') || el.querySelector('textarea')

const AutoFocusDirective: ObjectDirective = {
  mounted: async (el: HTMLElement, { arg }) => {
    // 为了防止数据未及时更新。
    await nextTick()
    // 对于非文本框聚焦（使用了 contenteditable ）的直接聚焦即可
    if (arg)
      el.focus?.()
    else getInput(el)?.focus()
  },
}

export function setupAutoFocusDirective(app: App) {
  app.directive('autoFocus', AutoFocusDirective)
}

export default AutoFocusDirective
