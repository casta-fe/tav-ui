<script lang="tsx">
import { computed, defineComponent, unref } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { getPopupContainer } from '@tav-ui/utils/basic'
import { getSlot } from '@tav-ui/utils/helper/tsxHelper'
import { isArray, isString } from '@tav-ui/utils/is'
import { basicHelpProps } from './types'
import type { CSSProperties } from 'vue'
export default defineComponent({
  name: 'TaBasicHelp',
  components: { Tooltip },
  props: basicHelpProps,
  setup(props, { slots }) {
    const prefixCls = 'ta-basic-help'

    const getTooltipStyle = computed(
      (): CSSProperties => ({ color: props.color, fontSize: props.fontSize })
    )

    const getOverlayStyle = computed((): CSSProperties => ({ maxWidth: props.maxWidth }))

    function renderTitle() {
      const textList = props.text

      if (isString(textList)) return <p>{textList}</p>

      if (isArray(textList)) {
        return textList.map((text, index) => {
          return (
            <p key={text}>
              <>
                {props.showIndex ? `${index + 1}. ` : ''}
                {text}
              </>
            </p>
          )
        })
      }
      return null
    }

    return () => {
      return (
        <Tooltip
          overlayClassName={`${prefixCls}__wrap`}
          title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
          autoAdjustOverflow={true}
          overlayStyle={unref(getOverlayStyle)}
          placement={props.placement as 'right'}
          getPopupContainer={() => getPopupContainer()}
        >
          <span class={prefixCls}>{getSlot(slots) || <InfoCircleOutlined />}</span>
        </Tooltip>
      )
    }
  },
})
</script>
