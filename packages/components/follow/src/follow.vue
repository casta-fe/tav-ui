<!--
 * @Author: huyb
 * @Descripttion: 关注组件
 * @Date: 2021-12-09 14:13:36
-->
<template>
  <TaButton class="basic-follow" type="link" :loading="loading" @click="changFollwStatus">
    <span class="follow-comp">
      <i :class="`ta-icon ta-icon--m ta-icon--follow${isFollow ? '-active' : ''}`" />
      <span v-if="isFollow" class="active"> 已关注 </span>
      <span v-else>关注</span>
    </span>
  </TaButton>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { TaButton } from '../../button'
import { followProps } from './types'
//  1 企业 2投资项目 3退出项目 4基金 5 投资人
export default defineComponent({
  name: 'TaFollow',
  components: {
    TaButton,
  },
  props: followProps,
  emits: ['update:show'],
  setup(props) {
    const { createMessage } = useMessage()
    const state = reactive({
      loading: false,
      isFollow: false,
    })
    const getFollwStatus = () => {
      if (props.initStatusApi && typeof props.initStatusApi === 'function') {
        props.initStatusApi(props.id).then((res) => {
          state.isFollow = res.data ? !!res.data.status : false
        })
      } else {
        console.log('warning!,props.initStatusApi缺少或者不是function')
      }
    }
    const changFollwStatus = () => {
      state.loading = true
      if (props.updateStatusApi && typeof props.updateStatusApi === 'function') {
        props
          .updateStatusApi({ followId: props.id, type: props.type })
          .then(() => {
            const msg = state.isFollow ? '取消成功' : '关注成功'
            state.isFollow = !state.isFollow
            createMessage.success(msg)
          })
          .finally(() => {
            state.loading = false
          })
      } else {
        console.log('warning!,props.updateStatusApi缺少或者不是function')
      }
    }
    getFollwStatus()
    watch(
      () => props.id,
      (newValue) => {
        if (newValue) {
          getFollwStatus()
        }
      }
    )
    return {
      ...toRefs(state),
      getFollwStatus,
      changFollwStatus,
    }
  },
})
</script>
