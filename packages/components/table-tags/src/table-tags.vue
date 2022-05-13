<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-05 10:13:24
-->
<template>
  <div class="tatable-tag-list">
    <Tag v-for="(item, index) in baseTags" :key="index" class="ta-table-tag" :title="item.text">
      <span>{{ noShort ? item.text : getShortText(item.text) }}</span>
    </Tag>
    <template v-if="moreTags.length > 0">
      <Tooltip>
        <TagsOutlined />
        <template #title>
          <Tag v-for="(item, index) in tags" :key="index" class="ta-table-tag">
            {{ item.text }}
          </Tag>
        </template>
      </Tooltip>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue'
import { TagsOutlined } from '@ant-design/icons-vue'
import { Tag, Tooltip } from 'ant-design-vue'
import { type Tags, tableTagsProps } from './types'
export default defineComponent({
  components: { Tag, Tooltip, TagsOutlined },
  props: tableTagsProps,
  setup(props) {
    const state = reactive({
      tags: [] as Tags,
      baseTags: [] as Tags,
      moreTags: [] as Tags,
    })
    const getAllTags = (): Tags => {
      if (!props.tags) {
        return []
      }
      let result: Tags = []
      if (typeof props.tags == 'string') {
        const list = props.tags.split(',')
        list.forEach((v) => {
          if (v && v !== 'null') {
            result.push({
              type: 'default',
              text: v,
            })
          }
        })
      } else {
        result = [...props.tags] as Tags
      }
      return result
    }
    const pageInit = () => {
      const allTags = getAllTags()
      state.tags = [...allTags]
      const maxNum = props.maxNum
      if (allTags.length < maxNum) {
        state.baseTags = allTags
        state.moreTags = []
      } else {
        state.baseTags = allTags.splice(0, maxNum - 1)
        state.moreTags = allTags
      }
    }
    onMounted(() => {
      pageInit()
      watch(
        () => props.tags,
        (val) => val && val.length && pageInit()
      )
    })
    const getShortText = (text) => {
      return text.length > 6 ? `${text.slice(0, 5)}...` : text
    }
    return { ...toRefs(state), getShortText }
  },
})
</script>
