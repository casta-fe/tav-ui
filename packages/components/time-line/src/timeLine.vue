<script lang="tsx">
import { defineComponent } from 'vue'
import { Button, List, ListItem, Tag, Tooltip } from 'ant-design-vue'
import TimeLineItemDefault from './components/listItem.vue'
import { timeLineListEmits, timeLineProps } from './types'
// import { timeLineProps } from "./types";

export default defineComponent({
  name: 'TaTimeline',
  components: { List, ListItem, Button, Tag, Tooltip },
  inheritAttrs: false,
  props: timeLineProps,
  emits: timeLineListEmits,
  setup(props, { emit, slots }) {
    const handleLoadingMore = () => {
      emit('loadingMore')
    }
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { list, useLoadingMore } = props
    const renderItem = ({ item, index }) => {
      if (props.renderListItem) return props.renderListItem({ item, index })
      else return <TimeLineItemDefault itemData={item}></TimeLineItemDefault>
    }
    return () => (
      <List
        class="ta-timeline-list"
        item-layout="horizontal"
        data-source={list}
        renderItem={renderItem}
      >
        {useLoadingMore ? (
          slots.loadMore ? (
            slots.loadMore()
          ) : (
            <div class="ta-timeline-list-loading-more">
              {/* postIcon="ant-design:cloud-download-outlined" */}
              <Button onClick={handleLoadingMore}>加载更多</Button>
            </div>
          )
        ) : (
          ''
        )}
      </List>
    )
  },
})
</script>
