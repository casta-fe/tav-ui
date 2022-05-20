import { computed, defineComponent, reactive, ref, unref, watch } from 'vue'
import { useTimeoutFn } from '@tav-ui/hooks/core/useTimeout'
import { hackCss } from '@tav-ui/utils/domUtils'
import BasicDragVerify from './verify'
import { verifyRotateProps } from './types'
import type { DragVerifyActionType, MoveData } from './typing'

export default defineComponent({
  name: 'TaVerifyRotate',
  inheritAttrs: false,
  props: verifyRotateProps,
  emits: ['success', 'change', 'update:value'],
  setup(props, { emit, attrs, expose }) {
    const basicRef = ref<DragVerifyActionType | null>(null)
    const state = reactive({
      showTip: false,
      isPassing: false,
      imgStyle: {},
      randomRotate: 0,
      currentRotate: 0,
      toOrigin: false,
      startTime: 0,
      endTime: 0,
      draged: false,
    })

    watch(
      () => state.isPassing,
      (isPassing) => {
        if (isPassing) {
          const { startTime, endTime } = state
          const time = (endTime - startTime) / 1000
          emit('success', { isPassing, time: time.toFixed(1) })
          emit('change', isPassing)
          emit('update:value', isPassing)
        }
      }
    )

    const getImgWrapStyleRef = computed(() => {
      const { imgWrapStyle, imgWidth } = props
      return {
        width: `${imgWidth}px`,
        height: `${imgWidth}px`,
        ...imgWrapStyle,
      }
    })

    const getFactorRef = computed(() => {
      const { minDegree, maxDegree } = props
      if (minDegree === maxDegree) {
        return Math.floor(1 + Math.random() * 1) / 10 + 1
      }
      return 1
    })
    function handleStart() {
      state.startTime = new Date().getTime()
    }

    function handleDragBarMove(data: MoveData) {
      state.draged = true
      const { imgWidth, height, maxDegree } = props
      const { moveX } = data
      const currentRotate = Math.ceil(
        (moveX / (imgWidth! - parseInt(height as string))) * maxDegree! * unref(getFactorRef)
      )
      state.currentRotate = currentRotate
      state.imgStyle = hackCss('transform', `rotateZ(${state.randomRotate - currentRotate}deg)`)
    }

    function handleImgOnLoad() {
      const { minDegree, maxDegree } = props
      const ranRotate = Math.floor(minDegree! + Math.random() * (maxDegree! - minDegree!)) // 生成随机角度
      state.randomRotate = ranRotate
      state.imgStyle = hackCss('transform', `rotateZ(${ranRotate}deg)`)
    }

    function handleDragEnd() {
      const { randomRotate, currentRotate } = state
      const { diffDegree } = props

      if (Math.abs(randomRotate - currentRotate) >= (diffDegree || 20)) {
        state.imgStyle = hackCss('transform', `rotateZ(${randomRotate}deg)`)
        state.toOrigin = true
        useTimeoutFn(() => {
          state.toOrigin = false
          state.showTip = true
          //  时间与动画时间保持一致
        }, 300)
      } else {
        checkPass()
      }
      state.showTip = true
    }
    function checkPass() {
      state.isPassing = true
      state.endTime = new Date().getTime()
    }

    function resume() {
      state.showTip = false
      const basicEl = unref(basicRef)
      if (!basicEl) {
        return
      }
      state.isPassing = false

      basicEl.resume()
      handleImgOnLoad()
    }

    expose({ resume })

    // handleImgOnLoad();
    return () => {
      const { src } = props
      const { toOrigin, isPassing, startTime, endTime } = state
      const imgCls: string[] = []
      if (toOrigin) {
        imgCls.push('to-origin')
      }
      const time = (endTime - startTime) / 1000

      return (
        <div class="ir-dv">
          <div class={`ir-dv-img__wrap`} style={unref(getImgWrapStyleRef)}>
            <img
              src={src}
              onLoad={handleImgOnLoad}
              width={parseInt(props.width as string)}
              class={imgCls}
              style={state.imgStyle}
              onClick={() => {
                resume()
              }}
              alt="verify"
            />
            {state.showTip && (
              <span class={[`ir-dv-img__tip`, state.isPassing ? 'success' : 'error']}>
                {state.isPassing ? `验证校验成功，耗时${time.toFixed(1)}秒` : '验证失败！'}
              </span>
            )}
            {!state.showTip && !state.draged && (
              <span class={[`ir-dv-img__tip`, 'normal']}>{'点击图片可刷新'}</span>
            )}
          </div>
          <BasicDragVerify
            class={`ir-dv-drag__bar`}
            onMove={handleDragBarMove}
            onEnd={handleDragEnd}
            onStart={handleStart}
            ref={basicRef}
            {...{ ...attrs, ...props }}
            value={isPassing}
            isSlot={true}
          />
        </div>
      )
    }
  },
})
