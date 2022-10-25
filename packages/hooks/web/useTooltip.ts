import { onMounted, onUnmounted } from 'vue'
import { arrow, computePosition, flip, hide, offset, shift } from '@floating-ui/dom'
import { useThrottleFn } from '@vueuse/core'
import XEUtils from 'xe-utils'

const CLS = `ta-popper`

function createElement({ tagName = 'div', className = '' }) {
  const el = document.createElement(tagName)
  el.className = className
  return el
}

function createAntvTooltip(props: any) {
  const tooltipEl = createElement({
    className: `${CLS}`,
  })
  const contentEl = createElement({
    tagName: 'span',
    className: `${CLS}-content`,
  })
  contentEl.innerHTML = props.title ?? ''
  const arrowEl = createElement({
    className: `${CLS}-arrow`,
  })
  tooltipEl.appendChild(contentEl)
  tooltipEl.appendChild(arrowEl)
  return {
    tooltipEl,
    arrowEl,
  }
}

export const $Tooltip = (el: HTMLElement, props: any) => {
  if (!el) return

  const { tooltipEl, arrowEl } = createAntvTooltip(props)

  function update() {
    computePosition(el, tooltipEl, {
      placement: 'top-start',
      middleware: [hide(), offset(6), flip(), shift({ padding: 6 }), arrow({ element: arrowEl })],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltipEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      })

      const staticSide: any = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]]

      Object.assign(arrowEl.style, {
        // left: middlewareData.arrow?.x != null ? `${middlewareData.arrow?.x}px` : '',
        left: '10px',
        top: middlewareData.arrow?.y != null ? `${middlewareData.arrow?.y}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      })

      tooltipEl.dataset.popperPlacement = placement
    })
  }

  function showTooltip(newEl?: HTMLElement) {
    setTimeout(() => {
      document.body.appendChild(tooltipEl)
      newEl && (el = newEl)
      update()
    }, props.delay)
  }

  function hideTooltip() {
    setTimeout(() => {
      tooltipEl.remove()
    }, props.delay)
  }

  return {
    showTooltip,
    hideTooltip,
  }
}

export function useHideTooltips(instances) {
  if (!instances) return
  const browse = XEUtils.browse()
  // 监听全局事件
  const wheelName = browse.firefox ? 'DOMMouseScroll' : 'mousewheel'
  const listener = () => {
    for (const instance of instances.values()) {
      if (instance) instance?.hideTooltip()
    }
  }
  const handler = useThrottleFn(listener, 30)
  onMounted(() => {
    document.addEventListener(wheelName, handler)
  })

  onUnmounted(() => {
    document.removeEventListener(wheelName, handler)
  })
}
