import { getCurrentInstance, onBeforeUnmount, ref, shallowRef, unref } from 'vue'
import { useRafThrottle } from '@tav-ui/utils/domUtils'
import { addResizeListener, removeResizeListener } from '@tav-ui/utils/event'
import { isDef } from '@tav-ui/utils/is'
import type { Ref } from 'vue'

const domSymbol = Symbol('watermark-dom')
const DEFAULT_FILL_STYLE = 'rgba(0, 0, 0, 0.1)'
const DEFAULT_WATER_MARKER_SIZE = {
  width: 300,
  height: 240,
}

export function useWatermark({
  appendEl = ref(document.body) as Ref<HTMLElement | null>,
  color = DEFAULT_FILL_STYLE,
  size = DEFAULT_WATER_MARKER_SIZE,
}) {
  const id = domSymbol.toString()
  const watermarkEl = shallowRef<HTMLElement>()

  const func = useRafThrottle(() => {
    const el = unref(appendEl)
    if (!el) return
    const { clientHeight: height, clientWidth: width } = el
    updateWatermark({ height, width })
  })

  const clear = () => {
    const domId = unref(watermarkEl)
    watermarkEl.value = undefined
    const el = unref(appendEl)
    if (!el) return
    domId && el.removeChild(domId)
    removeResizeListener(el, func)
  }

  function createBase64(str: string) {
    const can = document.createElement('canvas')
    // const height = 160;
    const { width, height } = size
    Object.assign(can, { width, height })

    const cans = can.getContext('2d')
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120)
      cans.font = '15px Vedana'
      cans.fillStyle = color || 'rgba(0, 0, 0, 0.1)'
      cans.textAlign = 'left'
      cans.textBaseline = 'middle'
      cans.fillText(str, width / 20, height)
    }
    return can.toDataURL('image/png')
  }

  function updateWatermark(
    options: {
      width?: number
      height?: number
      str?: string
    } = {}
  ) {
    const el = unref(watermarkEl)
    if (!el) return
    if (isDef(options.width)) {
      // el.style.width = `${options.width}px`;
      el.style.width = `100%`
    }
    if (isDef(options.height)) {
      // el.style.height = `${options.height}px`;
      el.style.height = `100%`
    }
    if (isDef(options.str)) {
      el.style.background = `url(${createBase64(options.str)}) left top repeat`
    }
  }

  const createWatermark = (str: string) => {
    if (unref(watermarkEl)) {
      updateWatermark({ str })
      return id
    }
    const div = document.createElement('div')
    watermarkEl.value = div
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'absolute'
    div.style.zIndex = '100000'
    // div.style.zIndex = "10";
    const el = unref(appendEl)
    if (!el) return id
    const { clientHeight: height, clientWidth: width } = el
    updateWatermark({ str, width, height })
    el.appendChild(div)
    return id
  }

  function setWatermark(str: string) {
    createWatermark(str)
    addResizeListener(document.documentElement, func)
    const instance = getCurrentInstance()
    if (instance) {
      onBeforeUnmount(() => {
        clear()
      })
    }
  }

  return { setWatermark, clear }
}
