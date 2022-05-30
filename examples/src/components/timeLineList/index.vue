<script lang="ts">
import { defineComponent, h, reactive } from 'vue'
import { TaTimeLine } from '@tav-ui/components'
import type { TimeLinePropsType } from '../../../../dist/types/components/timeLine/src/types'
export default defineComponent({
  name: 'TimeLineListTest',
  components: { TaTimeLine },
  setup() {
    const state = reactive<TimeLinePropsType>({
      loading: true,
      list: [
        {
          times: ['2022-05-30', '18:10:00'],
          status: 'continue',
          tags: [{ label: '发起审核', color: '#FFC400' }],
          description: ['发起人：梁策(测试)', '审核意见：123'],
          title: '项目终止审核',
        },
        {
          times: ['2022-05-27', '16:46:09'],
          status: 'success',
          tags: [
            { label: '审核通过', color: '#2CC8B2' },
            { label: '1级审核通过', color: '#2CC8B2' },
          ],
          description: [],
          title: '时间排期审核',
        },
        {
          times: ['2022-05-27', '16:45:17'],
          status: 'continue',
          tags: [{ label: '发起审核', color: '#FFC400' }],
          description: ['发起人：系统管理员'],
          title: '时间排期审核',
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
    setTimeout(() => {
      state.loading = false
    }, 3000)
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
      {{ state.loading }}loadingloadingloading
      <TaTimeLine
        :list="state.list"
        :use-loading-more="state.loading"
        @loading-more="loadingMore"
      />
    </div>
    <h2>TimeLineList 自定义渲染内容使用</h2>
    <div class="components">
      <TaTimeLine :list="state.list" :use-loading-more="true" :render-list-item="renderListItem">
        <template #loadMore>
          <div>dkdkdkdkdkdk</div>
        </template>
      </TaTimeLine>
    </div>
  </section>
</template>
