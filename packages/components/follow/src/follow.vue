<!--
 * @Author: huyb
 * @Descripttion: 关注组件
 * @Date: 2021-12-09 14:13:36
-->
<template>
  <TaButton class="basic-follow" type="link" :loading="loading" @click="changFollwStatus">
    <i :class="`basic-follow-icon basic-follow-icon${isFollow ? '-active' : ''}`" />
    <span v-if="isFollow" class="active"> {{ tavI18n('Tav.follow.1') }} </span>
    <span v-else>{{ tavI18n('Tav.follow.2') }}</span>
  </TaButton>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { tavI18n } from '@tav-ui/locales'
import { TaButton } from '../../button'
import { followProps } from './types'
import type { Ref } from 'vue'
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
    const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
    const state = reactive({
      loading: false,
      isFollow: false,
    })
    const getFollwStatus = () => {
      if (globalConfig.value && globalConfig.value.TaFollow) {
        globalConfig.value.TaFollow.getFollwStatus(props.id).then((res) => {
          state.isFollow = res.data ? !!res.data.status : false
        })
      }
    }
    const changFollwStatus = () => {
      state.loading = true
      if (globalConfig.value && globalConfig.value.TaFollow) {
        globalConfig.value.TaFollow.updateFollowStatus({ followId: props.id, type: props.type })
          .then(() => {
            const msg = state.isFollow ? tavI18n('Tav.follow.3') : tavI18n('Tav.follow.4')
            state.isFollow = !state.isFollow
            createMessage.success(msg)
          })
          .finally(() => {
            state.loading = false
          })
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
      tavI18n,
      getFollwStatus,
      changFollwStatus,
    }
  },
})
</script>
