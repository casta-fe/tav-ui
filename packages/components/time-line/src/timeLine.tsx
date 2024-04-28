import { defineComponent } from 'vue'
import { Button, List, ListItem, Tag, Tooltip } from 'ant-design-vue'
import { tavI18n } from '@tav-ui/locales'
import TimeLineItemDefault from './components/listItem'
import { timeLineListEmits, timeLineProps } from './types'
// import { timeLineProps } from "./types";

export default defineComponent({
  name: 'TaTimeLine',
  components: { List, ListItem, Button, Tag, Tooltip },
  inheritAttrs: false,
  props: timeLineProps,
  emits: timeLineListEmits,
  setup(props, { emit, slots }) {
    const handleLoadingMore = () => {
      emit('loadingMore')
    }
    // eslint-disable-next-line vue/no-setup-props-destructure
    const renderItem = ({ item, index }) => {
      if (props.renderListItem) return props.renderListItem({ item, index })
      else return <TimeLineItemDefault itemData={item}></TimeLineItemDefault>
    }
    return () => (
      <List
        class="ta-timeline-list"
        item-layout="horizontal"
        data-source={props.list}
        renderItem={renderItem}
      >
        {props.useLoadingMore ? (
          slots.loadMore ? (
            slots.loadMore()
          ) : (
            <div class="ta-timeline-list-loading-more">
              {/* postIcon="ant-design:cloud-download-outlined" */}
              <Button onClick={handleLoadingMore}>{tavI18n('Tav.common.loadMoreText')}</Button>
            </div>
          )
        ) : (
          ''
        )}
      </List>
    )
  },
})
