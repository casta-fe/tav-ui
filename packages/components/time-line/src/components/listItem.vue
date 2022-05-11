<script lang="tsx">
import { defineComponent } from 'vue'
import { ListItem } from 'ant-design-vue'
import { timeLineItemProps } from '../types'
import TagLabel from './tag.vue'
export default defineComponent({
  name: 'TimeLineItemDefault',
  components: {
    ListItem,
    TagLabel,
  },
  props: timeLineItemProps,
  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const listItemData = props.itemData
    return () => (
      <ListItem>
        <div class={`ta-timeline-list-item ta-timeline-list-item--${listItemData?.status}`}>
          <div class="time">
            {listItemData?.times &&
              listItemData?.times.map((time) => {
                return (
                  <div class="time-line" key={`${time}`}>
                    {time}
                  </div>
                )
              })}
          </div>
          <div class="step">
            <span class="step__icon"></span>
          </div>
          <div class="content">
            <div class="title">
              <span>{listItemData?.title}</span>
              <div class="tags">
                {listItemData?.tags &&
                  listItemData?.tags.map((tag, index) => {
                    return <TagLabel key={index} {...tag}></TagLabel>
                  })}
              </div>
            </div>
            <div class="description">
              {listItemData?.description &&
                listItemData?.description.map((desc) => {
                  return <p key={desc}>{{ desc }}</p>
                })}
            </div>
          </div>
        </div>
      </ListItem>
    )
  },
})
</script>
