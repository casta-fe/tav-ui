import { onBeforeUnmount } from 'vue'

export type KeepScrollType = Partial<{
  scrollEl: HTMLElement
  getScrollTop: () => number
  setScrollTop: (scrollTop: number) => void
}>

export function useKeepScroll(keepScrollOpt: KeepScrollType) {
  if (!keepScrollOpt.scrollEl && (!keepScrollOpt.getScrollTop || !keepScrollOpt.setScrollTop))
    throw new Error('invalid params!')

  let scrollTop = 0

  const getScrollTop =
    keepScrollOpt.getScrollTop ??
    function () {
      return keepScrollOpt.scrollEl!.scrollTop
    }

  const setScrollTop =
    keepScrollOpt.setScrollTop ??
    function (value) {
      keepScrollOpt.scrollEl!.scrollTop = value
    }

  function onScroll() {
    scrollTop = getScrollTop()
  }
  setScrollTop(scrollTop)
  // 暂时注释升级后会无限循环
  // onActivated(() => {
  //   setScrollTop(scrollTop)
  // })

  if (keepScrollOpt.scrollEl) {
    keepScrollOpt.scrollEl.addEventListener('scroll', onScroll)

    onBeforeUnmount(() => {
      keepScrollOpt.scrollEl?.removeEventListener('scroll', onScroll)
    })
  }

  return { onScroll }
}
