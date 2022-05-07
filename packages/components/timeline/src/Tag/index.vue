<script lang="tsx">
import { defineComponent } from 'vue'
import { Tag, Tooltip } from 'ant-design-vue'
import { TagProps } from './indexProps'
export default defineComponent({
  /* eslint-disable-next-line react/display-name */
  name: 'TgTagLabel',
  components: {
    Tag,
    Tooltip,
  },
  props: TagProps,
  setup(props) {
    const { label, color } = props
    // || tooltip tooltip
    return () => (
      (label && label.length > 20)
        ? <Tooltip title={label}>
            <Tag color={color}>
                {`${label?.slice(0, 20)}...` }
            </Tag>
        </Tooltip>
        : <Tag color={color}>
            {label}
        </Tag>
    )
  },
})
</script>
