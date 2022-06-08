import { computed, defineComponent, unref } from 'vue'
import { Tag } from 'ant-design-vue'
import Scrollbar from '@tav-ui/components/scrollbar'
import { isArray, isObject, isString } from '@tav-ui/utils/is'
import { CamelCaseToCls, ComponentTagsName } from '../const'
import type { ScrollbarProps } from '@tav-ui/components/scrollbar'
import type { PropType } from 'vue'
import type { TableProTagsConfig } from '../typings'

const ComponentPrefixCls = CamelCaseToCls(ComponentTagsName)

const DEFAULT_CONFIG: TableProTagsConfig = {
  label: 'id',
  value: 'name',
}

const props = {
  data: {
    type: [Array, Object, String, null, undefined] as PropType<
      Record<string, any>[] | Record<string, any> | string | null | undefined
    >,
    required: true,
  },
  tagConfig: {
    type: Object as PropType<Partial<TableProTagsConfig>>,
  },
  scroll: {
    type: Object as PropType<ScrollbarProps & { enabled: boolean }>,
    default: () => ({
      enabled: true,
    }),
  },
}

export default defineComponent({
  name: ComponentTagsName,
  props,
  setup(props) {
    const getConfig = computed(() => Object.assign({}, DEFAULT_CONFIG, props.tagConfig))

    const renderTag = (info: Record<string, any>) => {
      const { label, value, color, style } = unref(getConfig)
      return (
        <Tag color={color} style={{ ...style }} key={`${info[label!]}-${info[value!]}`}>
          {info[label!]}
        </Tag>
      )
    }

    const createTags = () => {
      const { label } = unref(getConfig)
      if (isArray(props.data)) {
        return <div>{props.data.map((v) => renderTag(v))}</div>
      } else if (isObject(props.data)) {
        return renderTag(props.data)
      } else if (isString(props.data)) {
        return renderTag({
          [label!]: props.data,
        })
      }
      return '-'
    }

    return () => {
      return props.scroll.enabled ? (
        <Scrollbar {...props.scroll} containerClass={`${ComponentPrefixCls}-scroll-container`}>
          {{
            default: () => <div class={`${ComponentPrefixCls}`}>{createTags()}</div>,
          }}
        </Scrollbar>
      ) : (
        <div class={`${ComponentPrefixCls}`}>{createTags()}</div>
      )
    }
  },
})
