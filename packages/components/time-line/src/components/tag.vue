<script lang="tsx">
import { defineComponent } from 'vue'
import { Tag, Tooltip } from 'ant-design-vue'
import { timeLineTagProps } from '../types'
export default defineComponent({
  name: 'TgTagLabel',
  components: {
    Tag,
    Tooltip,
  },
  props: timeLineTagProps,
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { label, color } = props
    // || tooltip tooltip
    return () =>
      label && label.length > 20 ? (
        <Tooltip title={label}>
          <Tag color={color}>{`${label?.slice(0, 20)}...`}</Tag>
        </Tooltip>
      ) : (
        <Tag color={color}>{label}</Tag>
      )
  },
})
</script>
