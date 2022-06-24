// @ts-nocheck
import { computed, defineComponent, unref } from 'vue'
import { TagsOutlined } from '@ant-design/icons-vue'
import { Tag, Tooltip } from 'ant-design-vue'
import Scrollbar from '@tav-ui/components/scrollbar'
import { isArray, isNumber, isObject, isString } from '@tav-ui/utils/is'
import { CamelCaseToCls, ComponentTagsName } from '../const'
import type { ScrollbarProps } from '@tav-ui/components/scrollbar'
import type { PropType } from 'vue'
import type { TableProTagsConfig } from '../typings'

const ComponentPrefixCls = CamelCaseToCls(ComponentTagsName)

const DEFAULT_CONFIG: TableProTagsConfig = {
  label: 'name',
  value: 'id',
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
  maxNum: {
    type: [Number, null] as PropType<number | null>,
    default: 2,
  },
  color: String,
  scroll: {
    type: Object as PropType<ScrollbarProps & { enabled: boolean }>,
    default: () => ({
      enabled: false,
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
        <Tag color={props.color} key={`${info[label]}-${info[value]}`} title={info[label]}>
          {getShortText(info[label])}
        </Tag>
      )
    }
    const getShortText = (text = '') => {
      return text.length > 6 ? `${text.slice(0, 5)}...` : text
    }
    const createTags = () => {
      const { label } = unref(getConfig)
      // 先整理数据，如果非数组、字符串、对象返回 “-”
      let tagList: Record<string, any>[] = []
      if (isString(props.data)) {
        tagList = props.data.split(',').map((v) => {
          return {
            [label]: v,
          }
        })
      } else if (isArray(props.data)) {
        tagList = [...props.data]
      } else if (isObject(props.data)) {
        tagList = [props.data]
      } else {
        return '-'
      }
      const maxNum = props.maxNum
      // maxNum为null或者大于tag数量，就全量展示，否则将多余的收起来
      if (maxNum === null || (isNumber(maxNum) && maxNum > tagList.length)) {
        return <>{tagList.map((v) => renderTag(v))}</>
      } else {
        const thisTags = [...tagList].splice(0, maxNum)
        return (
          <div class="tatable-tag-list">
            {thisTags.map((v) => renderTag(v))}
            {thisTags.length < tagList.length ? (
              <Tooltip
                overlayClassName="table-pro-tags-Tooltip"
                v-slots={{
                  title: () => {
                    return tagList.map((v) => renderTag(v))
                  },
                }}
              >
                <TagsOutlined />
              </Tooltip>
            ) : (
              ''
            )}
          </div>
        )
      }
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
