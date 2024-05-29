<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs, watch } from 'vue'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { Button, Image, Modal, Spin } from 'ant-design-vue'
//@ts-ignore
import WebOfficeSDK from '@tav-ui/utils/web-office-sdk'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { download } from '@tav-ui/utils/file/_download'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { tavI18n } from '@tav-ui/locales'
import { fileViewProps } from './types'
import type { FileViewItemType } from './types'
import type { Ref } from 'vue'
import type { Nullable } from '../../modal/src/types'

async function handlePreview(fileId: string, token: string, officeType: string) {
  const WebOfficeSDKInstance = (WebOfficeSDK as any).init({
    officeType,
    appId: 'SX20240514VODTXS',
    // fileId: '66870',
    fileId,
    token,
    mode: 'simple',
    mount: '.file-view-content',
  })

  function toggleDocumentMap(app: any, active = false) {
    let activeInstance: any = null

    if (app.ActiveDocument && app.ActiveDocument.ActiveWindow) {
      activeInstance = app.ActiveDocument.ActiveWindow
    } else if (app.ActivePDF) {
      activeInstance = app.ActivePDF
    }

    if (activeInstance && activeInstance.DocumentMap) {
      activeInstance.DocumentMap = active
    }
  }

  if (WebOfficeSDKInstance && WebOfficeSDKInstance.ready) {
    await WebOfficeSDKInstance.ready()
    const app = WebOfficeSDKInstance.Application
    toggleDocumentMap(app, true)
  }
}

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

    const ignoreList = ['zip', 'tar', '7z']
    const loadFileTypes = {
      office: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      audio: ['mp3', 'mp3', 'wav', 'rm', 'rpm'],
      pic: ['gif', 'jpeg', 'jpg', 'png'],
      video: ['mpeg', 'mpg', 'avi', 'movie'],
      text: ['txt'],
    }
    const currentFile = computed((): FileViewItemType => props.list[state.index] || {})
    const fileType = computed(() => {
      let type: Nullable<string> = null
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
    const getFile = (cb?) => {
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
        .then((res) => {
          state.pageLoading = false
          state.supportWPS = !!res.data.wps
          cb && cb()
          if (state.supportWPS) {
            nextTick(() => {
              handlePreview(res.data.fileId, res.data.token, res.data.officeType)
            })
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
          getFile(() => {
            state.showModal = newData
            state.index = props.index
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
    wrap-class-name="file-view-modal"
  >
    <template #title>
      <!-- <div class="file-view-action">
        <Button type="text" @click="downloadFile">下载</Button>
      </div>
      <span class="file-view-num">{{ index + 1 }}/{{ list.length }}</span> -->
      <Button type="text" @click="() => (showModal = !showModal)">
        <template #icon><CloseOutlined /></template>
        {{ tavI18n('Tav.common.closeText') }}
      </Button>
      <div class="line line--vertical" />
      <div class="file-view-title">
        <template v-if="fileType === 'office' && currentFile?.suffix.startsWith('doc')">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z"
              fill="#336DF4"
            />
            <path
              opacity="0.7"
              d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z"
              fill="#0442D2"
            />
            <path
              d="m12.004 12.25-1.474 5.456a.152.152 0 0 1-.147.112h-.868a.152.152 0 0 1-.146-.11l-2-7.06a.152.152 0 0 1 .146-.193h.871c.07 0 .13.046.147.113l1.423 5.504 1.478-5.505a.152.152 0 0 1 .146-.112h.849c.069 0 .129.046.147.112l1.468 5.503 1.422-5.502a.152.152 0 0 1 .147-.113h.871a.152.152 0 0 1 .146.193l-2 7.06a.152.152 0 0 1-.145.11h-.869a.152.152 0 0 1-.146-.112l-1.466-5.457Z"
              fill="#fff"
            />
          </svg>
        </template>
        <template v-if="fileType === 'office' && currentFile?.suffix.startsWith('xls')">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z"
              fill="#35BD4B"
            />
            <path
              opacity="0.9"
              d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z"
              fill="#32A645"
            />
            <path
              d="M8.547 9.91h1.091c.049 0 .094.023.122.063l2.098 3.041 2.11-3.041a.147.147 0 0 1 .121-.064h1.092a.147.147 0 0 1 .12.233l-2.733 3.834 2.95 4.155a.147.147 0 0 1-.12.233h-1.092a.147.147 0 0 1-.121-.064l-2.327-3.363L9.543 18.3a.147.147 0 0 1-.122.064H8.33a.147.147 0 0 1-.12-.232l2.928-4.156-2.71-3.835a.147.147 0 0 1 .12-.232Z"
              fill="#fff"
            />
          </svg>
        </template>
        <template v-if="fileType === 'office' && currentFile?.suffix.startsWith('ppt')">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z"
              fill="#FF811A"
            />
            <path
              opacity="0.5"
              d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z"
              fill="#C25705"
            />
            <path
              d="M10.383 18.495V14.91h1.702c.409 0 .816-.036 1.22-.108a3.484 3.484 0 0 0 1.11-.386 2.3 2.3 0 0 0 .814-.77c.212-.329.316-.742.316-1.236a3.3 3.3 0 0 0-.132-.937 1.95 1.95 0 0 0-.478-.815c-.23-.236-.538-.42-.923-.552-.381-.131-.86-.196-1.435-.196H9.414a.141.141 0 0 0-.142.141v8.445c0 .078.064.142.142.142h.828a.141.141 0 0 0 .14-.142Zm2.735-4.622a6.67 6.67 0 0 1-1.01.069h-1.725v-3.066h1.966c.746 0 1.282.13 1.608.38.318.245.478.605.478 1.094 0 .339-.054.608-.158.809-.104.2-.25.355-.44.47-.194.119-.433.2-.719.244Z"
              fill="#fff"
            />
          </svg>
        </template>
        <template v-if="fileType === 'office' && currentFile?.suffix.startsWith('pdf')">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3a2 2 0 0 1 2-2h9.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3Z"
              fill="#F54A45"
            />
            <path
              d="M15 1.483a.2.2 0 0 1 .341-.142L20.66 6.66a.2.2 0 0 1-.142.341H17a2 2 0 0 1-2-2V1.483Z"
              fill="#C02A26"
            />
            <path
              d="M17.55 15.551c-.247-.29-.756-.432-1.555-.432-.464 0-1.104.012-1.747.107-1.755-1.265-2.167-2.625-2.167-2.625s.3-.753.319-1.982c.012-.777-.111-1.357-.425-1.606a.883.883 0 0 0-.524-.195.7.7 0 0 0-.413.13c-.913.658.084 3.762.11 3.845a27.6 27.6 0 0 1-1.531 3.125c-.182.316-.182.322-.304.466 0 0-1.597.792-2.347 1.67-.423.497-.437.838-.414 1.093.036.307.427.58.82.58l.048-.001c.4-.024.844-.134 1.339-.602.358-.339.76-1.258 1.278-2.158 1.485-.417 2.792-.713 3.887-.883.803.427 1.998.91 2.811.91.273 0 .493-.056.653-.164.191-.13.272-.29.323-.589.05-.298-.02-.525-.16-.689Zm-1.745.467c.742 0 1.143.131 1.35.241.063.034.11.067.142.094-.058.045-.172.102-.379.102-.342 0-.792-.145-1.34-.433.077-.002.153-.004.227-.004Zm-4.26-6.542.002-.003c.116.085.17.684.16 1.031-.016.466-.019.646-.078.933-.158-.597-.17-1.67-.083-1.961Zm.037 4.36c.362.596.82 1.2 1.338 1.66-1.01.217-1.847.415-2.45.626a18.647 18.647 0 0 0 1.112-2.285ZM7.51 18.885c.092-.134.341-.396.974-.902-.34.782-.721.902-1.075 1.09.026-.061.06-.126.101-.188Z"
              fill="#fff"
            />
          </svg>
        </template>
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
            <span class="file-author other">{{ currentFile?.createByName }}</span>
            <span class="file-date other">{{ currentFile?.createTime }}</span>
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
        <template v-if="!supportWPS">
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
