<template>
  <div
    v-if="imgList && imgList.length"
    :class="prefixCls"
    class="flex items-center mx-auto"
    :style="getWrapStyle"
  >
    <Badge v-if="simpleShow" :count="!showBadge || imgList.length == 1 ? 0 : imgList.length">
      <div class="img-div">
        <PreviewGroup>
          <template v-for="(img, index) in imgList" :key="img">
            <Image
              :width="size"
              :style="{
                display: index === 0 ? '' : 'none !important',
              }"
              :src="srcPrefix + img"
            />
          </template>
        </PreviewGroup>
      </div>
    </Badge>
    <PreviewGroup v-else>
      <template v-for="(img, index) in imgList" :key="img">
        <Image
          :width="size"
          :style="{ marginLeft: index === 0 ? 0 : margin }"
          :src="srcPrefix + img"
        />
      </template>
    </PreviewGroup>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Badge, Image } from 'ant-design-vue'
import { propTypes } from '@tav-ui/utils/propTypes'
import type { CSSProperties } from 'vue'

export default defineComponent({
  name: 'TableImage',
  components: { Image, PreviewGroup: Image.PreviewGroup, Badge },
  props: {
    imgList: propTypes.arrayOf(propTypes.string),
    size: propTypes.number.def(40),
    // 是否简单显示（只显示第一张图片）
    simpleShow: propTypes.bool,
    // 简单模式下是否显示图片数量的badge
    showBadge: propTypes.bool.def(true),
    // 图片间距
    margin: propTypes.number.def(4),
    // src前缀，将会附加在imgList中每一项之前
    srcPrefix: propTypes.string.def(''),
  },
  setup(props) {
    const getWrapStyle = computed((): CSSProperties => {
      const { size } = props
      const s = `${size}px`
      return { height: s, width: s }
    })

    const prefixCls = 'ta-basic-table-img'
    return { prefixCls, getWrapStyle }
  },
})
</script>
