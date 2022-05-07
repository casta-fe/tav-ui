<script lang="tsx">
import type { CSSProperties, PropType } from 'vue'
import { computed, defineComponent, unref } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { isArray, isString } from '@tav-ui/utils/is'
import { getSlot } from '@tav-ui/utils/helper/tsxHelper'
import { getPopupContainer } from '@tav-ui/utils/basic'
import { basicHelpProps } from './types'
export default defineComponent({
  name: 'TaBasicHelp',
  components: { Tooltip },
  props: basicHelpProps,
  setup(props, { slots }) {
    const prefixCls = 'ta-basic-help'

    const getTooltipStyle = computed(
      (): CSSProperties => ({ color: props.color, fontSize: props.fontSize }),
    )

    const getOverlayStyle = computed((): CSSProperties => ({ maxWidth: props.maxWidth }))

    function renderTitle() {
      const textList = props.text

      if (isString(textList))
        return <p>{textList}</p>

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

    // eslint-disable-next-line react/display-name
    return () => {
      return (
        <Tooltip
          overlayClassName={`${prefixCls}__wrap`}
          title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
          autoAdjustOverflow={true}
          overlayStyle={unref(getOverlayStyle)}
          // eslint-disable-next-line react/prop-types
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
