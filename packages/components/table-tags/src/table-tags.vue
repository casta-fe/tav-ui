<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-05 10:13:24
-->
<template>
  <div class="tatable-tag-list">
    <Tag
      v-for="(item, index) in baseTags"
      :key="'tatable-tag-' + index"
      :color="item.color || 'default'"
      class="ta-table-tag"
      :title="item.text"
    >
      <slot name="tagContent" :data="item">
        <span>{{ noShort ? item.text : getShortText(item.text) }}</span>
      </slot>
    </Tag>
    <template v-if="moreTags.length > 0">
      <Tooltip>
        <TagsOutlined />
        <template #title>
          <Tag
            v-for="(item, index) in allTags"
            :key="'tatable-tag--tooltip' + index"
            :color="item.color || 'default'"
            class="ta-table-tag"
          >
            <slot name="tagContent" :data="item"> {{ item.text }}</slot>
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
  name: 'TaTableTags',
  components: { Tag, Tooltip, TagsOutlined },
  props: tableTagsProps,
  setup(props) {
    const state = reactive({
      allTags: [] as Tags,
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
              color: '',
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
      state.allTags = [...allTags]
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
    const getShortText = (text: string) => {
      return text?.length > 6 ? `${text.slice(0, 5)}...` : text
    }
    return { ...toRefs(state), getShortText }
  },
})
</script>
