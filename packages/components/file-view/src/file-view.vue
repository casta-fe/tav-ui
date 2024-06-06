<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs, watch } from 'vue'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { Button, Image, Modal, Spin } from 'ant-design-vue'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { download } from '@tav-ui/utils/file/_download'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { tavI18n } from '@tav-ui/locales'
import { fileViewProps } from './types'
import type { FileViewItemType } from './types'
import type { Ref } from 'vue'
import type { Nullable } from '../../modal/src/types'

export default defineComponent({
  name: 'TaFileView',
  components: {
    Modal,
    Spin,
    LeftOutlined,
    RightOutlined,
    Button,
    CloseOutlined,
    Image,
  },
  props: fileViewProps,
  emits: ['update:show'],
  setup(props, { emit }) {
    const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
    const { createMessage } = useMessage()
    const state = reactive({
      index: props.index,
      filePath: '',
      showModal: false,
      pageLoading: false,
      supportWPS: false,
    })
    const fileViewContentElRef = ref<HTMLElement | null>(null)

    const _ignoreList = ['zip', 'tar', '7z']
    const loadFileTypes = {
      office: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      audio: ['mp3', 'mp3', 'wav', 'rm', 'rpm'],
      pic: ['gif', 'jpeg', 'jpg', 'png'],
      video: ['mpeg', 'mpg', 'avi', 'movie'],
      text: ['txt'],
    }
    const ignoreList = [
      ..._ignoreList,
      ...loadFileTypes['audio'],
      ...loadFileTypes['video'],
      ...loadFileTypes['txt'],
    ]
    const currentFile = computed((): FileViewItemType => props.list[state.index] || {})
    const fileType = computed(() => {
      let type: Nullable<string> = null
      const suffix = currentFile.value?.suffix
      if (suffix) {
        for (const item in loadFileTypes) {
          //@ts-ignore
          if ((loadFileTypes[item] as any).some((v: any) => suffix == v)) {
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
    const getFile = (cb?: any) => {
      if (!globalConfig.value || !globalConfig.value.TaFileView) {
        afterCloseHandle()
        return
      }
      // 防止多次请求
      const id = currentFile.value?.fileId || currentFile.value?.id
      if (state.pageLoading || !id || fileType.value == '') {
        afterCloseHandle()
        return
      }

      state.filePath = ''
      state.pageLoading = true
      // const previewFile = globalConfig.value.TaFileView.previewFile
      const previewWPSFile = globalConfig.value.TaFileView.previewWPSFile
      console.log(currentFile.value)

      previewWPSFile(id, props.AppId)
        .then((res: any) => {
          state.pageLoading = false
          state.supportWPS = !!res?.data?.wps
          cb && cb()
          if (state.supportWPS) {
            const {
              createByName,
              createTime,
              fileId,
              fileName,
              fileSize,
              officeType,
              pageUrl,
              suffix,
              token,
              watermark,
            } = res.data

            const options = {
              officeType,
              fileId,
              token,
              suffix,
              fileName,
              fileSize,
              userName: createByName,
              time: `${new Date(createTime).getTime()}`,
              watermarker: watermark,
              from: 'desktop',
            }

            state.filePath = `${pageUrl}/wps-file-view/?${encodeURIComponent(
              new URLSearchParams({ ...options }) as unknown as string
            )}`
          } else {
            state.filePath = res.data.onlineUrl
            // previewFile(id, props.AppId)
            //   .then((_res) => {
            //     state.pageLoading = false
            //     state.filePath = _res.data
            //     loadIframeHandle()
            //     cb && cb()
            //   })
            //   .catch(() => {
            //     // console.log(err);
            //     state.pageLoading = false
            //     setTimeout(afterCloseHandle, 1000)
            //     // state.pageLoading = false;
            //   })
          }
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
        if (newData && ignoreList.includes(currentFile.value.suffix)) {
          createMessage.warning(tavI18n('Tav.file.message.1'))
          afterCloseHandle()
          return
        }
        if (newData) {
          state.index = props.index
          getFile(() => {
            state.showModal = newData
          })
        } else {
          afterCloseHandle()
          state.filePath = ''
        }
      }
    )
    // watch(
    //   () => currentFile.value,
    //   () => {
    //     nextTick(() => {
    //       getFile()
    //     })
    //     // console.log("文件改变");
    //   }
    // )
    return {
      ...toRefs(state),
      fileViewContentElRef,
      tavI18n,
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
    :wrap-class-name="`file-view-modal ${supportWPS ? 'hide-modal-header' : ''}`"
  >
    <template #title>
      <!-- <div class="file-view-action">
        <Button type="text" @click="downloadFile">下载</Button>
      </div>
      <span class="file-view-num">{{ index + 1 }}/{{ list.length }}</span> -->
      <Button type="text" class="file-view-close-btn" @click="() => (showModal = !showModal)">
        <template #icon><CloseOutlined /></template>
        {{ tavI18n('Tav.common.closeText') }}
      </Button>
      <div class="line line--vertical" />
      <div class="file-view-title">
        <template v-if="fileType === 'pic'">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z"
              fill="#FFC60A"
            />
            <path
              opacity="0.8"
              d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z"
              fill="#D99904"
            />
            <path
              d="M8.372 10a1 1 0 0 0-1 1v.182a1 1 0 0 0 1 1h.181a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-.181Zm8.323 2.76a.6.6 0 0 1 1.04.408V18.5a.5.5 0 0 1-.5.5H7.401a.4.4 0 0 1-.307-.657l2.926-3.49a1 1 0 0 1 1.532 0l1.523 1.816 3.62-3.91Z"
              fill="#fff"
            />
          </svg>
        </template>
        <!-- <template v-if="fileType === 'audio'">
          <svg width="1em" height="1em" viewBox="0 0 24 24"><defs><path d="M1.5 0h14.086a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V26.5a1.5 1.5 0 01-1.5 1.5h-19A1.5 1.5 0 010 26.5v-25A1.5 1.5 0 011.5 0z" id="icon_file_audio_nor_svg__a"></path><path d="M16.293.293l5.414 5.414A1 1 0 0121.91 6H17.5A1.5 1.5 0 0116 4.5V.09a1 1 0 01.293.203z" id="icon_file_audio_nor_svg__b"></path></defs><g fill="none" fill-rule="evenodd"><g transform="translate(5 2)"><use fill="#34C724" xlink:href="#icon_file_audio_nor_svg__a"></use><use fill="#2EA121" xlink:href="#icon_file_audio_nor_svg__b"></use></g><path d="M7.649 10.703h16.648V27.35H7.65z"></path><path d="M15.566 11.947l.076.01 4.687 1.1c.158.037.275.17.29.332l.193 1.974a.378.378 0 01-.458.406l-3.787-.835a.151.151 0 00-.183.162l.764 8.012a.51.51 0 01-.043.246 3.026 3.026 0 01-6.05-.127 3.027 3.027 0 014.864-2.405l-.74-8.463a.378.378 0 01.463-.402z" fill="#FFF"></path></g></svg>
        </template>
        <template v-if="fileType === 'video'">
          <svg width="1em" height="1em" viewBox="0 0 24 24"><defs><path d="M1.5 0h14.086a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V26.5a1.5 1.5 0 01-1.5 1.5h-19A1.5 1.5 0 010 26.5v-25A1.5 1.5 0 011.5 0z" id="icon_file_video_nor_svg__a"></path><path d="M16.293.293l5.414 5.414A1 1 0 0121.91 6H17.5A1.5 1.5 0 0116 4.5V.09a1 1 0 01.293.203z" id="icon_file_video_nor_svg__b"></path></defs><g fill="none" fill-rule="evenodd"><g transform="translate(5 2)"><use fill="#3370FF" xlink:href="#icon_file_video_nor_svg__a"></use><use fill="#245BDB" xlink:href="#icon_file_video_nor_svg__b"></use></g><path d="M7 11h16.649v16.649H7z"></path><path d="M10.757 15h7.486c.383 0 .7.285.75.654l.007.103v7.486c0 .383-.285.7-.654.75l-.103.007h-7.486a.757.757 0 01-.75-.654L10 23.243v-7.486c0-.383.285-.7.654-.75l.103-.007h7.486zm11.819 1.792a.568.568 0 01.075.282v4.854a.568.568 0 01-.85.493l-1.799-1.028v-3.784l1.8-1.028a.568.568 0 01.774.211zM13.1 16.5h-1.2a.4.4 0 00-.4.4v1.2c0 .22.18.4.4.4h1.2a.4.4 0 00.4-.4v-1.2a.4.4 0 00-.4-.4z" fill="#FFF"></path></g></svg>
        </template>
        <template v-if="fileType === 'text'">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z" fill="#336DF4"></path><path opacity="0.7" d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z" fill="#0442D2"></path><path d="M12.546 10.727v7.5a.136.136 0 0 1-.137.136h-.818a.136.136 0 0 1-.136-.136v-7.5h-3.41a.136.136 0 0 1-.136-.136v-.818c0-.076.061-.137.137-.137h7.909c.075 0 .136.061.136.137v.818a.136.136 0 0 1-.136.136h-3.41Z" fill="#fff"></path></svg>
        </template> -->
        <div class="file-view-title-content">
          <div class="ant-row">
            <span class="file-name main">{{ currentFile?.name + '.' + currentFile?.suffix }}</span>
          </div>
          <div class="ant-row">
            <span class="file-size other">{{ currentFile?.fileSize }}</span>
            <span class="user-name other">{{ currentFile?.createByName }}</span>
            <span class="time other">{{ currentFile?.createTime }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-if="list.length > 1">
      <div class="file-view-modal-prev" @click="goPrev">
        <a href="javascript:;"><LeftOutlined /></a>
      </div>
      <div class="file-view-modal-next" @click="goNext">
        <a href="javascript:;"><RightOutlined /></a>
      </div>
    </template>
    <Spin :spinning="pageLoading" size="default" :tip="tavI18n('Tav.file.message.1')">
      <div ref="fileViewContentElRef" class="file-view-content">
        <template v-if="supportWPS">
          <iframe id="wps-file-view" :src="filePath" frameborder="0" />
        </template>
        <template v-else>
          <!-- <template v-if="fileType === 'office'">
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
          </template> -->
          <template v-if="fileType === 'pic'">
            <!-- <img :src="filePath" alt="" /> -->
            <Image
              :style="{ display: 'none' }"
              :src="filePath"
              :preview="{ visible: true, getContainer: fileViewContentElRef }"
            />
          </template>
          <!-- <template v-if="fileType === 'text'">
            <div class="text-page">
              <iframe id="fileIframe" :src="filePath" frameborder="0" />
            </div>
          </template> -->
          <template v-if="fileType === ''">
            <div class="empty">{{ tavI18n('Tav.file.message.1') }} {{ fileType }}</div>
          </template>
        </template>
      </div>
    </Spin>
  </Modal>
</template>
