import { nextTick, unref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps } from '../types/table'

interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}
type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

export function useTableFullHeight(
  propsRef: ComputedRef<BasicTableProps>,
  tableElRef: Ref<ComponentRef>
) {
  const { fullHeight } = unref(propsRef)
  if (!fullHeight) return

  let headEl: HTMLElement | null
  let bodyEl: HTMLElement | null
  let contentEl: HTMLElement | null
  async function calcTableHeight() {
    await nextTick()
    const table = unref(tableElRef)
    if (!table) return
    const tableEl: HTMLElement = table.$el
    if (!tableEl) return

    if (!bodyEl) {
      bodyEl = tableEl.querySelector('.ant-table-body')
      if (!bodyEl) return
    }

    headEl = tableEl.querySelector('.ant-table-thead')

    if (!headEl) return
    // const { height: headHeight } = headEl.getBoundingClientRect();
    // const { height: bodyHeight } = bodyEl.getBoundingClientRect();
    // const { height: contentHeight } = contentEl.getBoundingClientRect();
    // console.log(contentHeight, "sksksks");
    // hack: 高度4
    //兼容
    // if (dataObj?.result?.length > 0) {
    //   // headHeight - 4
    //   bodyEl.style.maxHeight = `${contentHeight - headHeight}px`;
    //   // bodyEl.style.maxHeight = `${bodyHeight - headHeight - 4}px`;
    // } else {
    //   bodyEl.style.maxHeight = `${
    //     contentHeight - headHeight > 170 ? contentHeight - headHeight : 170
    //   }px`;
    // }
    bodyEl.style.minHeight = `${170}px`
  }

  calcTableHeight()
}
