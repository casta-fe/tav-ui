<script lang="ts">
import { computed, defineComponent, nextTick, reactive, toRefs, watch } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { Modal, Spin } from 'ant-design-vue'
import download from '@tav-ui/utils/file/TaDownload'
// import { useMessage } from '../../useMessage'
import { fileViewProps } from './types'
import type { FileViewItemType } from './types'
export default defineComponent({
  name: 'TaFileView',
  components: {
    Modal,
    Spin,
    LeftOutlined,
    RightOutlined,
  },
  props: fileViewProps,
  emits: ['update:show'],
  setup(props, { emit }) {
    // const { createMessage } = useMessage()
    const state = reactive({
      index: props.index,
      filePath: '',
      showModal: props.show,
      pageLoading: false,
    })
    // const ignoreList = ['zip', 'tar', '7z']
    const loadFileTypes = {
      office: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      audio: ['mp3', 'mp3', 'wav', 'rm', 'rpm'],
      pic: ['gif', 'jpeg', 'jpg', 'png'],
      video: ['mpeg', 'mpg', 'avi', 'movie'],
      text: ['txt'],
    }
    const currentFile = computed((): FileViewItemType => props.list[state.index])
    const fileType = computed(() => {
      let type = ''
      const suffix = currentFile.value?.suffix
      if (suffix) {
        for (const item in loadFileTypes) {
          if (loadFileTypes[item].some((v) => suffix == v)) {
            type = item
            break
          }
        }
      }
      return type
    })
    const loadIframeHandle = () => {
      const iframeEle = window.document.getElementById('fileIframe')
      if (iframeEle) {
        // iframeEle.onload = (data) => {
        //   let iframeWindow = iframeEle.contentWindow;
        //   let removeNode = iframeWindow.document.getElementById("HeaderTopBars");
        //   console.log(iframeWindow);
        //   console.log(removeNode);
        // };
      }
    }
    const afterCloseHandle = () => {
      emit('update:show', false)
    }
    const getFile = () => {
      // 防止多次请求
      const id = currentFile.value?.fileId || currentFile.value?.id
      if (state.pageLoading || !id || fileType.value == '') return

      state.filePath = ''
      state.pageLoading = true
      props
        .fileApi(id)
        .then((res) => {
          state.pageLoading = false
          state.filePath = res.data
          loadIframeHandle()
        })
        .catch(() => {
          // console.log(err);
          state.pageLoading = false
          setTimeout(afterCloseHandle, 1000)
          // state.pageLoading = false;
        })
    }

    const goPrev = () => {
      if (state.index > 0) {
        state.index--
        nextTick(() => {
          getFile()
        })
      }
    }
    const goNext = () => {
      if (state.index < props.list.length - 1) {
        state.index++
        nextTick(() => {
          getFile()
        })
      }
    }
    const downloadFile = () => {
      download(currentFile.value)
    }
    watch(
      () => props.show,
      (newData) => {
        // if (ignoreList.includes(currentFile.value.suffix)) {
        //   createMessage.warning("暂不支持该文件预览");
        //   return;
        // }
        state.showModal = newData
        state.index = props.index
        if (newData) {
          nextTick(() => {
            getFile()
          })
        } else {
          state.filePath = ''
        }
      }
    )
    watch(
      () => currentFile.value,
      () => {
        nextTick(() => {
          getFile()
        })
        // console.log("文件改变");
      }
    )
    return {
      ...toRefs(state),
      currentFile,
      fileType,
      downloadFile,
      goPrev,
      goNext,
      afterCloseHandle,
    }
  },
})
</script>

<template>
  <Modal
    v-model:visible="showModal"
    :destroy-on-close="true"
    :footer="null"
    width="100%"
    :after-close="afterCloseHandle"
    wrap-class-name="file-view-modal"
  >
    <template #title>
      <!-- <div class="file-view-action">
        <Button type="text" @click="downloadFile">下载</Button>
      </div>
      <span class="file-view-num">{{ index + 1 }}/{{ list.length }}</span> -->
      <span class="file-view-title"
        >{{ filePath }}{{ currentFile.name + '.' + currentFile.suffix }}</span
      >
    </template>
    <template v-if="list.length > 1">
      <div class="file-view-modal-prev" @click="goPrev">
        <a href="javascript:;"><LeftOutlined /></a>
      </div>
      <div class="file-view-modal-next" @click="goNext">
        <a href="javascript:;"><RightOutlined /></a>
      </div>
    </template>
    <Spin :spinning="pageLoading" size="default" tip="文件请求中，请稍后">
      <div class="file-view-content">
        <template v-if="fileType === 'office'">
          <iframe id="fileIframe" :src="filePath" frameborder="0" />
        </template>
        <template v-if="fileType === 'audio'">
          <audio :src="filePath" />
        </template>
        <template v-if="fileType === 'video'">
          <video :src="filePath" />
        </template>
        <template v-if="fileType === 'mpeg'">
          <iframe id="fileIframe" :src="filePath" frameborder="0" />
        </template>
        <template v-if="fileType === 'pic'"> <img :src="filePath" alt="" /> </template>
        <template v-if="fileType === 'text'">
          <div class="text-page">
            <iframe id="fileIframe" :src="filePath" frameborder="0" />
          </div>
        </template>
        <template v-if="fileType === ''">
          <div class="empty">暂不支持该格式预览 {{ fileType }}</div>
        </template>
      </div>
    </Spin>
  </Modal>
</template>
