<script lang="ts">
// import {TimeLinePropsType } from '../../dist/types/'

import { defineComponent, h, reactive } from 'vue'
import type { TimeLinePropsType } from '../../../dist/types/components/timeLine/src/types'

export default defineComponent({
  name: 'TimeLineListTest',
  components: {
  },
  setup() {
    const state = reactive<TimeLinePropsType>({
      list: [
        {
          times: ['1111', '22222'],
          status: 'success',
          title: '测试一下啦',
          tags: [
            {
              label: 'tag1',
              color: '#999999',
            },
          ],
          description: ['dkdkdkd', 'sdkdkdiddi'],
        },
        {
          times: ['1111', '22222'],
          status: 'success',
          title: '测试一下啦',
          tags: [
            {
              label: 'tag1',
              color: '#999999',
            },
            {
              label: 'tag1',
              color: '#999999',
            },
          ],
          description: ['dkdkdkd', 'sdkdkdiddi'],
        },
      ],
    })
    const renderListItem = ({ item, index }) => {
      console.log(item, index)
      return h('div', {}, 'sksksk')
    }
    const loadingMore = () => {
      console.log('loadingMoreloadingMore')
    }
    return {
      state,
      renderListItem,
      loadingMore,
    }
  },
})
</script>

<template>
  <section class="test">
    <h2>TimeLineList默认使用</h2>
    <div class="components">
      <TaTimeline :list="state.list" :use-loading-more="true" @loadingMore="loadingMore" />
    </div>
    <h2>TimeLineList 自定义渲染内容使用</h2>
    <Button>sss</Button>
    <div class="components">
      <TaTimeline :list="state.list" :use-loading-more="true" :render-list-item="renderListItem">
        <template #loadMore>
          <div>dkdkdkdkdkdk</div>
        </template>
      </TaTimeline>
    </div>
  </section>
</template>

