<script setup lang="ts">
import {
  computed,
  /*useAttrs, useSlots, */
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { TaFileUploadPreview } from '@tav-ui/components/file'
import { useRequest } from '@tav-ui/components/file/src/hooks/use-request'
import { useDisable } from '@tav-ui/components/file/src/hooks/use-disable'
import { useLoading } from '@tav-ui/components/file/src/hooks/use-loading'
import { type FileUploadApiResponseRecord } from '@tav-ui/components/file/src/components/FileUpload'
import {
  type Editor as EditorInstance,
  type EditorOptions,
  type EditorProps,
  editorEmits,
  editorProps,
} from './typings'
import { DEFAULT_EDITOR_CLASSNAME, DEFAULT_EDITOR_ID } from './consts'
import {
  useApi,
  useEditorCustomToolbarButton,
  useEditorIframeCommunication,
  useEditorMenubar,
  useEditorPlugin,
  useEditorStatusbar,
  useEditorToolbar,
  useGlobalConfigProps,
  useMergedProps,
} from './hooks'
import TaEditorCustomUploadimageModal, {
  type EditorCustomUploadimageModalInstance,
} from './components/CustomUploadimageModal'
// import TaEditorCustomUploadlinkModal, {
//   type EditorCustomUploadlinkModalInstance,
// } from './components/CustomUploadlinkModal'
import TaEditorCustomUploadfileModal, {
  type EditorCustomUploadfileModalInstance,
} from './components/CustomUploadfileModal'
// import { refreshUploadVars } from './utils'

//:============================================================:  tinymce core  :============================================================://
// eslint-disable-next-line import/order, import/no-duplicates
import tinymce from 'tinymce/tinymce'
// eslint-disable-next-line import/order
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver' // default theme
import 'tinymce/icons/default' // default icon
// 皮肤样式
// import 'tinymce/skins/content/default/content.min.css'
// 下面俩个文件 rollup 打包不识别手动移入 theme 中
// import 'tinymce/skins/ui/oxide/content.min.css'
// import 'tinymce/skins/ui/oxide/skin.min.css'
//:============================================================: tinymce plugin :============================================================://
import 'tinymce/plugins/advlist' // 高级列表
import 'tinymce/plugins/anchor' // 锚点
import 'tinymce/plugins/autolink' // 自动链接
// import 'tinymce/plugins/autoresize' // 编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
// import 'tinymce/plugins/autosave' // 自动存稿
// import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/code' // 编辑源码
// import 'tinymce/plugins/codesample' // 代码示例
import 'tinymce/plugins/directionality' // 文字方向
// import 'tinymce/plugins/emoticons' // 表情
// import 'tinymce/plugins/emoticons/js/emojis' // 表情依赖
// import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen' // 全屏
// import 'tinymce/plugins/help' // 帮助
import 'tinymce/plugins/hr' // 水平分割线
// import 'tinymce/plugins/image' // 插入图片
// import 'tinymce/plugins/imagetools' // 编辑图片
// import 'tinymce/plugins/importcss' // 引入css
// import 'tinymce/plugins/insertdatetime' // 插入日期时间
// import 'tinymce/plugins/legacyoutput'
import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/lists' // 列表插件
// import 'tinymce/plugins/media' // 插入编辑媒体
import 'tinymce/plugins/nonbreaking' // 插入不间断空格
// import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak' // 插入分页符
import 'tinymce/plugins/paste' // 处理直接从word粘贴来的内容
import 'tinymce/plugins/preview' // 预览
// import 'tinymce/plugins/print' // 打印
import 'tinymce/plugins/quickbars' // 快速工具栏
import 'tinymce/plugins/save' // 保存
import 'tinymce/plugins/searchreplace' // 查找替换
// import 'tinymce/plugins/spellchecker'
// import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table' // 表格
// import 'tinymce/plugins/template' // 内容模板
import 'tinymce/plugins/textpattern' // markdown 支持
// import 'tinymce/plugins/toc'
import 'tinymce/plugins/visualblocks' // 显示元素范围
import 'tinymce/plugins/visualchars' // 显示不可见字符
// import 'tinymce/plugins/wordcount' // 字数统计
import { handleI18n } from './utils'

defineOptions({
  name: 'TaEditor',
  inheritAttrs: false,
})

const props = defineProps(editorProps)
const emits = defineEmits(editorEmits)
// const slots = useSlots()
// const attrs = useAttrs()

const globalConfigProps = useGlobalConfigProps()
const mergedProps = useMergedProps<EditorProps>(globalConfigProps, props)

const { setDisable } = useDisable()
const { setLoading } = useLoading()
const {
  result: apiResult,
  error: apiError,
  handleApi,
} = useRequest({
  setDisable,
  setLoading,
})

const editorMainElRef = ref<HTMLDivElement>()
let editorInstanceRef: EditorInstance | null = null

const {
  apiActions: { previewFileApiOptions },
} = useApi({ mergedProps })
const { registryOuterChannel, registryInnerChannel } = useEditorIframeCommunication({ mergedProps })
const {
  createAlignsButton,
  createListsButton,
  createUploadimageButton /*createUploadlinkButton*/,
  createUploadfileButton,
} = useEditorCustomToolbarButton({ mergedProps })
const { menubarConfig } = useEditorMenubar({ mergedProps })
const { pluginConfig } = useEditorPlugin({
  mergedProps,
  handleApi,
  apiResult,
  // editorImageVars,
  // uploadImageApiOptions,
})
const { toolbarConfig } = useEditorToolbar({ mergedProps })
const { statusbarConfig, updateStatusbarStyle /*addStatusbarAutosaveTip*/ } = useEditorStatusbar({
  mergedProps,
})

const editorValue = computed({
  get() {
    return mergedProps.value.value
  },
  set(value) {
    emits('update:value', value)
  },
})

// 实时更新富文本内容的 uploadvars 会导致媒体资源闪烁且光标丢失，用户体验很差暂时不用此方案
// 该用将 uploadvars 绑定在 dom 元素的 data-* 上通过接口提交时手动替换
// watch(
//   () => mergedProps.value.uploadVarsJson,
//   (curuploadVarsJson, preuploadVarsJson) => {
//     if (
//       curuploadVarsJson &&
//       preuploadVarsJson &&
//       preuploadVarsJson !== '{}' &&
//       curuploadVarsJson !== preuploadVarsJson
//     ) {
//       if (
//         editorValue.value.length > 0 &&
//         (editorValue.value.includes('<img') || editorValue.value.includes('<span class="file"'))
//       ) {
//         editorValue.value = refreshUploadVars(
//           editorValue.value,
//           JSON.parse(curuploadVarsJson),
//           JSON.parse(preuploadVarsJson)
//         )
//       }
//     }
//   }
// )

const editorOptions = computed(() => {
  const options: EditorOptions = {
    //:============================================================:  tinymce 内部功能设置  :============================================================://
    skin: false,
    content_css: '',
    language: 'zh_CN',
    /** 编辑器相关 logo 是否显示 */
    branding: false,
    /** 关闭右上角广告信息 */
    promotion: false,
    body_class: 'ta-editor-content',
    /**
     * 注入到 iframe 中的样式
     * 第一块：自定义 iframe 样式
     * 第二块：为了保证富文本内容在页面上显示正常无差异，该样式取自 antd，必须与组件库中的 normailizecss 一致
     * 第三块：来自 tinymce/skins/content/default/content.min.css，外面包了层类名方便控制，针对于富文本内容的样式，theme-chalk/editor 下也放了相同的一份，需手动向小程序同步
     * 第四块：来自 tinymce/skins/ui/oxide/content.min.css 组件相关
     */
    content_style: `
    body{width:auto !important;height:auto !important;margin:16px 20px !important;}

    html, body {width: 100%;height: 100%;}input::-ms-clear, input::-ms-reveal {display: none;}*, *::before, *::after {box-sizing: border-box;}html {font-family: sans-serif;line-height: 1.15;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;-ms-overflow-style: scrollbar;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}body {margin: 0;color: rgba(0, 0, 0, 0.85);font-size: 14px;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';font-variant: tabular-nums;line-height: 1.5715;background-color: #fff;font-feature-settings: 'tnum';}[tabindex='-1']:focus {outline: none !important;}hr {box-sizing: content-box;height: 0;overflow: visible;}h1, h2, h3, h4, h5, h6 {margin-top: 0;margin-bottom: 0.5em;color: rgba(0, 0, 0, 0.85);font-weight: 500;}p {margin-top: 0;margin-bottom: 1em;}abbr[title], abbr[data-original-title] {text-decoration: underline;-webkit-text-decoration: underline dotted;text-decoration: underline dotted;border-bottom: 0;cursor: help;}address {margin-bottom: 1em;font-style: normal;line-height: inherit;}input[type='text'], input[type='password'], input[type='number'], textarea {-webkit-appearance: none;}ol, ul, dl {margin-top: 0;margin-bottom: 1em;}ol ol, ul ul, ol ul, ul ol {margin-bottom: 0;}dt {font-weight: 500;}dd {margin-bottom: 0.5em;margin-left: 0;}blockquote {margin: 0 0 1em;}dfn {font-style: italic;}b, strong {font-weight: bolder;}small {font-size: 80%;}sub, sup {position: relative;font-size: 75%;line-height: 0;vertical-align: baseline;}sub {bottom: -0.25em;}sup {top: -0.5em;}a {color: #1890ff;text-decoration: none;background-color: transparent;outline: none;cursor: pointer;transition: color 0.3s;-webkit-text-decoration-skip: objects;}a:hover, file-content:hover {color: #40a9ff;}a:active {color: #096dd9;}a:active, a:hover {text-decoration: none;outline: 0;}a:focus {text-decoration: none;outline: 0;}a[disabled] {color: rgba(0, 0, 0, 0.25);cursor: not-allowed;}pre, code, kbd, samp {font-size: 1em;font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;}pre {margin-top: 0;margin-bottom: 1em;overflow: auto;}figure {margin: 0 0 1em;}img {vertical-align: middle;border-style: none;}a, area, button, [role='button'], input:not([type='range']), label, select, summary, textarea {touch-action: manipulation;}table {border-collapse: collapse;}caption {padding-top: 0.75em;padding-bottom: 0.3em;color: rgba(0, 0, 0, 0.45);text-align: left;caption-side: bottom;}input, button, select, optgroup, textarea {margin: 0;color: inherit;font-size: inherit;font-family: inherit;line-height: inherit;}button, input {overflow: visible;}button, select {text-transform: none;}button, html [type='button'], [type='reset'], [type='submit'] {-webkit-appearance: button;}button::-moz-focus-inner, [type='button']::-moz-focus-inner, [type='reset']::-moz-focus-inner, [type='submit']::-moz-focus-inner {padding: 0;border-style: none;}input[type='radio'], input[type='checkbox'] {box-sizing: border-box;padding: 0;}input[type='date'], input[type='time'], input[type='datetime-local'], input[type='month'] {-webkit-appearance: listbox;}textarea {overflow: auto;resize: vertical;}fieldset {min-width: 0;margin: 0;padding: 0;border: 0;}legend {display: block;width: 100%;max-width: 100%;margin-bottom: 0.5em;padding: 0;color: inherit;font-size: 1.5em;line-height: inherit;white-space: normal;}progress {vertical-align: baseline;}[type='number']::-webkit-inner-spin-button, [type='number']::-webkit-outer-spin-button {height: auto;}[type='search'] {outline-offset: -2px;-webkit-appearance: none;}[type='search']::-webkit-search-cancel-button, [type='search']::-webkit-search-decoration {-webkit-appearance: none;}::-webkit-file-upload-button {font: inherit;-webkit-appearance: button;}output {display: inline-block;}summary {display: list-item;}template {display: none;}[hidden] {display: none !important;}mark {padding: 0.2em;background-color: #feffe6;}::-moz-selection {color: #fff;background: #1890ff;}::selection {color: #fff;background: #1890ff;}
      
    .ta-editor-content table {border-collapse: collapse;}.ta-editor-content table:not([cellpadding]) td, .ta-editor-content table:not([cellpadding]) th {padding: 0.4rem;}.ta-editor-content table[border]:not([border='0']):not([style*='border-width']) td, .ta-editor-content table[border]:not([border='0']):not([style*='border-width']) th {border-width: 1px;}.ta-editor-content table[border]:not([border='0']):not([style*='border-style']) td, .ta-editor-content table[border]:not([border='0']):not([style*='border-style']) th {border-style: solid;}.ta-editor-content table[border]:not([border='0']):not([style*='border-color']) td, .ta-editor-content table[border]:not([border='0']):not([style*='border-color']) th {border-color: #ccc;}.ta-editor-content figure {display: table;margin: 1rem auto;}.ta-editor-content figure figcaption {color: #999;display: block;margin-top: 0.25rem;text-align: center;}.ta-editor-content hr {border-color: #ccc;border-style: solid;border-width: 1px 0 0 0;}.ta-editor-content code {background-color: #e8e8e8;border-radius: 3px;padding: 0.1rem 0.2rem;}.ta-editor-content .mce-content-body:not([dir='rtl']) blockquote {border-left: 2px solid #ccc;margin-left: 1.5rem;padding-left: 1rem;}.ta-editor-content .mce-content-body[dir='rtl'] blockquote {border-right: 2px solid #ccc;margin-right: 1.5rem;padding-right: 1rem;}.ta-editor-content:not([dir='rtl']) blockquote {border-left: 2px solid #ccc;margin-left: 1.5rem;padding-left: 1rem;}.ta-editor-content[dir='rtl'] blockquote {border-right: 2px solid #ccc;margin-right: 1.5rem;padding-right: 1rem;}.ta-editor-content .file {display: inline-block;}.file-content {color: #1890ff;text-decoration: none;background-color: transparent;outline: none;cursor: pointer;transition: color 0.3s;-webkit-text-decoration-skip: objects;}.ta-editor-content .file-content:active, .ta-editor-content .file-content:hover {text-decoration: none;outline: 0;}.ta-editor-content .file-content:focus {text-decoration: none;outline: 0;}.ta-editor-content .file-content[disabled] {color: rgba(0, 0, 0, 0.25);cursor: not-allowed;}.ta-editor-content .file-icon {display: inline-block;width: 14px;height: 14px;margin: 0 4px;}.ta-editor-content .file-icon--doc {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDM4IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTEsIC0zMzYpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMSwgMzM2KSI+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNOS41LDI0IEwzOCwyNCBMMzgsMzAgQzM4LDMxLjEwNDU2OTUgMzcuMDU0ODIzNCwzMiAzNS44ODg4ODg5LDMyIEwxMS42MTExMTExLDMyIEMxMC40NDUxNzY2LDMyIDkuNSwzMS4xMDQ1Njk1IDkuNSwzMCBMOS41LDI0IFoiCiAgICAgICAgICAgIGZpbGw9IiMxRTNFOEMiCiAgICAgICAgICA+PC9wYXRoPgogICAgICAgICAgPHBvbHlnb24gZmlsbD0iIzJDNTlCNyIgcG9pbnRzPSI5LjUgMTYgMzggMTYgMzggMjQgOS41IDI0Ij48L3BvbHlnb24+CiAgICAgICAgICA8cG9seWdvbiBmaWxsPSIjNDM3QUNEIiBwb2ludHM9IjkuNSA4IDM4IDggMzggMTYgOS41IDE2Ij48L3BvbHlnb24+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMTEuNjExMTExMSwwIEwzNS44ODg4ODg5LDAgQzM3LjA1NDgyMzQsMCAzOCwwLjg5NTQzMDUgMzgsMiBMMzgsOCBMOS41LDggTDkuNSwyIEM5LjUsMC44OTU0MzA1IDEwLjQ0NTE3NjYsMCAxMS42MTExMTExLDAgWiIKICAgICAgICAgICAgZmlsbD0iIzVEQTNFOCIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMi4xMTExMTExMSw3IEwxNi44ODg4ODg5LDcgQzE4LjI5NjI5NjMsNyAxOSw3LjY2NjY2NjY3IDE5LDkgTDE5LDIzIEMxOSwyNC4zMzMzMzMzIDE4LjI5NjI5NjMsMjUgMTYuODg4ODg4OSwyNSBMMi4xMTExMTExMSwyNSBDMC43MDM3MDM3MDQsMjUgMCwyNC4zMzMzMzMzIDAsMjMgTDAsOSBDMCw3LjY2NjY2NjY3IDAuNzAzNzAzNzA0LDcgMi4xMTExMTExMSw3IFoiCiAgICAgICAgICAgIGZpbGw9IiMzMzY0QkYiCiAgICAgICAgICA+PC9wYXRoPgogICAgICAgICAgPHBvbHlnb24KICAgICAgICAgICAgZmlsbD0iI0ZGRkZGRiIKICAgICAgICAgICAgcG9pbnRzPSIyLjY3NTMwNTU2IDExLjA2OSA1LjQzMjQxNjY3IDIwLjkzMTUgNy40OTA3NSAyMC45MzE1IDkuNDM5MzA1NTYgMTQuMjkgOS41NTMzMDU1NiAxNC4yOSAxMS41MjI0NDQ0IDIwLjkzMTUgMTMuNTY2NTI3OCAyMC45MzE1IDE2LjMyNjgwNTYgMTEuMDY5IDE0LjA3NTMwNTYgMTEuMDY5IDEyLjQ2ODIyMjIgMTguMTE2NSAxMi4zNDk0NzIyIDE4LjExNjUgMTAuNDE2MjIyMiAxMS4wNjkgOC41NzU4NjExMSAxMS4wNjkgNi42NzkwMjc3OCAxOC4xMTY1IDYuNTYzNDQ0NDQgMTguMTE2NSA0Ljk0MzE2NjY3IDExLjA2OSIKICAgICAgICAgID48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9zdmc+');}.ta-editor-content .file-icon--image {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGgKICAgICAgZD0iTTMgM2EyIDIgMCAwIDEgMi0yaDkuNTg2YTEgMSAwIDAgMSAuNzA3LjI5M2w1LjQxNCA1LjQxNGExIDEgMCAwIDEgLjI5My43MDdWMjFhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWM1oiCiAgICAgIGZpbGw9IiNGRkM2MEEiCiAgICA+PC9wYXRoPgogICAgPHBhdGgKICAgICAgb3BhY2l0eT0iMC44IgogICAgICBkPSJNMTUgMS40ODNhLjIuMiAwIDAgMSAuMzQxLS4xNDJMMjAuNjYgNi42NmEuMi4yIDAgMCAxLS4xNDIuMzQxSDE3YTIgMiAwIDAgMS0yLTJWMS40ODNaIgogICAgICBmaWxsPSIjRDk5OTA0IgogICAgPjwvcGF0aD4KICAgIDxwYXRoCiAgICAgIGQ9Ik04LjM3MiAxMGExIDEgMCAwIDAtMSAxdi4xODJhMSAxIDAgMCAwIDEgMWguMTgxYTEgMSAwIDAgMCAxLTFWMTFhMSAxIDAgMCAwLTEtMWgtLjE4MVptOC4zMjMgMi43NmEuNi42IDAgMCAxIDEuMDQuNDA4VjE4LjVhLjUuNSAwIDAgMS0uNS41SDcuNDAxYS40LjQgMCAwIDEtLjMwNy0uNjU3bDIuOTI2LTMuNDlhMSAxIDAgMCAxIDEuNTMyIDBsMS41MjMgMS44MTYgMy42Mi0zLjkxWiIKICAgICAgZmlsbD0iI2ZmZiIKICAgID48L3BhdGg+CiAgPC9zdmc+');}.ta-editor-content .file-icon--pdf {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDM4IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoCiAgICAgICAgICBkPSJNMzAgMEwxMC42MTE3IDBDMTAuMTg0NiAtMi4wMjA1NmUtMDcgOS43NzQ4NSAwLjE2MDQyNiA5LjQ3MjY0IDAuNDQ2MDI5QzkuMTcwNDIgMC43MzE2MzMgOS4wMDA0MyAxLjExOTA1IDkgMS41MjMxNlY4SDM4TDMwIDBaIgogICAgICAgICAgZmlsbD0iI0ZFMzM0MyIKICAgICAgICAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICBvcGFjaXR5PSIwLjgiCiAgICAgICAgICBkPSJNMzAgMEwzOCA4SDMzLjJDMzIuMDc5OSA4IDMxLjUxOTggOCAzMS4wOTIgNy43ODIwMUMzMC43MTU3IDcuNTkwMjcgMzAuNDA5NyA3LjI4NDMxIDMwLjIxOCA2LjkwNzk4QzMwIDYuNDgwMTYgMzAgNS45MjAxMSAzMCA0LjhWMFoiCiAgICAgICAgICBmaWxsPSJ3aGl0ZSIKICAgICAgICAvPgogICAgICAgIDxwYXRoIGQ9Ik0zOCA4SDlWMTZIMzhWOFoiIGZpbGw9IiNFRTFBMkIiIC8+CiAgICAgICAgPHBhdGggZD0iTTM4IDE2SDlWMjRIMzhWMTZaIiBmaWxsPSIjREQwMDEyIiAvPgogICAgICAgIDxwYXRoCiAgICAgICAgICBkPSJNMzggMjRIOVYzMC40NzcxQzkuMDAwNDMgMzAuODgwOSA5LjE3MDIxIDMxLjI2OCA5LjQ3MjA5IDMxLjU1MzVDOS43NzM5NyAzMS44MzkgMTAuMTgzMyAzMS45OTk2IDEwLjYxMDIgMzJIMzYuMzg4MkMzNi44MTU3IDMyIDM3LjIyNTYgMzEuODM5NCAzNy41Mjc5IDMxLjU1MzVDMzcuODMwMiAzMS4yNjc2IDM4IDMwLjg3OTkgMzggMzAuNDc1NlYyNFoiCiAgICAgICAgICBmaWxsPSIjQ0IwMDExIgogICAgICAgIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgIG9wYWNpdHk9IjAuMiIKICAgICAgICAgIGQ9Ik0xNy4zMzI4IDcuMDAxNDlIOVYyNkgxNy4zMzI4QzE3Ljc3NDQgMjUuOTk5MiAxOC4xOTc3IDI1Ljg0MjEgMTguNTEwMSAyNS41NjNDMTguODIyNSAyNS4yODM5IDE4Ljk5ODcgMjQuOTA1NiAxOSAyNC41MTA3VjguNDkwNzhDMTguOTk5MSA4LjA5NTY0IDE4LjgyMzIgNy43MTY5MSAxOC41MTA3IDcuNDM3NTFDMTguMTk4MiA3LjE1ODEgMTcuNzc0NyA3LjAwMDc5IDE3LjMzMjggN1Y3LjAwMTQ5WiIKICAgICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgIGQ9Ik0xLjUwMDUgNy4wMDE1SDE2LjQ5OTVDMTYuODk3MiA3LjAwMTUgMTcuMjc4NiA3LjE1OTM4IDE3LjU2IDcuNDQwNDZDMTcuODQxMyA3LjcyMTUzIDE3Ljk5OTYgOC4xMDI4IDE4IDguNTAwNVYyMy40OTk1QzE4IDIzLjg5NzUgMTcuODQxOSAyNC4yNzkxIDE3LjU2MDUgMjQuNTYwNUMxNy4yNzkxIDI0Ljg0MTkgMTYuODk3NSAyNSAxNi40OTk1IDI1SDEuNDk5QzEuMTAxMyAyNC45OTk2IDAuNzIwMDMgMjQuODQxMyAwLjQzODk1NiAyNC41NkMwLjE1Nzg4MiAyNC4yNzg2IC0xLjg5NTMxZS0wNyAyMy44OTcyIDAgMjMuNDk5NUwwIDguNTAwNUMwIDguMTAyNTQgMC4xNTgwODggNy43MjA4OCAwLjQzOTQ4NiA3LjQzOTQ5QzAuNzIwODg1IDcuMTU4MDkgMS4xMDI1NCA3IDEuNTAwNSA3VjcuMDAxNVoiCiAgICAgICAgICBmaWxsPSIjREQwMDEyIgogICAgICAgIC8+CiAgICAgICAgPHBhdGgKICAgICAgICAgIGQ9Ik0xMy43MjY4IDE5LjE4OTVDMTIuNzUwMiAxOS4xMDgzIDExLjgxNDcgMTguNzYyOSAxMS4wNDE4IDE4LjExMjRDOS41NjU1OSAxOC40NDA0IDguMTIyNTMgMTguOTAyOCA2LjczMDczIDE5LjQ5MzdDNS42MTIwNyAyMS40ODQ1IDQuNTU0MTUgMjIuNSAzLjY1OTc4IDIyLjVDMy40NzY2MSAyMi41IDMuMjUyMzIgMjIuNDU4OSAzLjExMDI3IDIyLjM1ODFDMi43MDM3MyAyMi4xNzUyIDIuNSAyMS43NjkyIDIuNSAyMS4zODI4QzIuNSAyMS4wNTggMi41ODEzMSAyMC4xNDQzIDYuMDE4NiAxOC42NjEyQzYuODA1NTYgMTcuMjMyOCA3LjQ0NjE3IDE1LjcyODcgNy45MzA3IDE0LjE3MThDNy41MDM2MSAxMy4yOTkyIDYuNTQ3NTYgMTEuMTY2NSA3LjE5ODAxIDEwLjA4OTRDNy40MjIzIDkuNjgzNDIgNy44NDkzOSA5LjQ4MDg5IDguMzE2NjcgOS41MDE0MkM4LjY4MzAyIDkuNTAxNDIgOS4wNDkzNiA5LjY4MzQyIDkuMjUyMTYgOS45NjgwOUM5LjcxOTQ0IDEwLjYxNzcgOS42NzkyNSAxMS45OTkgOS4wNjg5OSAxNC4wM0M5LjY1NTEzIDE1LjExMSAxMC40MTA0IDE2LjA5MTUgMTEuMzA2MyAxNi45MzQ1QzEyLjA1ODYgMTYuNzkyNiAxMi44MzE1IDE2LjY5MTggMTMuNTgzOCAxNi42OTE4QzE1LjI5MjIgMTYuNzMyIDE1LjUzNyAxNy41MjM0IDE1LjQ5NTkgMTcuOTkxQzE1LjUzNjEgMTkuMTg5NSAxNC4zMzcxIDE5LjE4OTUgMTMuNzI2OCAxOS4xODk1Wk0zLjU3NzU0IDIxLjQ0MzVMMy42ODAzNCAyMS40MDMzQzQuMTg4NzQgMjEuMjIwNCA0LjU5NTI3IDIwLjg1NDUgNC44NzkzOCAyMC4zODc5QzQuMzMwNzkgMjAuNjExOSAzLjkwMzcgMjAuOTU3MiAzLjU3ODQ4IDIxLjQ0MzVIMy41Nzc1NFpNOC4zOTc5OCAxMC41Nzc2SDguMjk2MTFDOC4yNTU5MyAxMC41Nzc2IDguMTk0MjUgMTAuNTc3NiA4LjE1NDA2IDEwLjYxNzdDOC4wMTIwMSAxMS4yMjcyIDguMTEyOTQgMTEuODc3NyA4LjM3ODM1IDEyLjQ2NTdDOC41Nzc3NyAxMS44NTMxIDguNTg0NjIgMTEuMTk0MiA4LjM5Nzk4IDEwLjU3NzZaTTguNjQxOSAxNS44MTczTDguNjAxNzEgMTUuODk4NUw4LjU2MDU5IDE1Ljg1ODRDOC4yMzQ2MiAxNi42OTE3IDcuODc1MTUgMTcuNTExNSA3LjQ4MzA1IDE4LjMxNTlMNy41NjQzNiAxOC4yNzU3VjE4LjM1NjlDOC4zNyAxOC4wNjY1IDkuMTkxNTYgMTcuODIyMiAxMC4wMjUgMTcuNjI1Mkw5Ljk4NDg1IDE3LjU4NUgxMC4wODU4QzkuNTQ0MjQgMTcuMDQ3NiA5LjA2MDMyIDE2LjQ1NTEgOC42NDE5IDE1LjgxNzNaTTEzLjU4MzggMTcuNzQ3NEMxMy4yNTg2IDE3Ljc0NzQgMTIuOTc0NSAxNy43NDc0IDEyLjY0OTMgMTcuODI4NkMxMy4wMTQ3IDE4LjAxMTYgMTMuMzgxIDE4LjA3MTMgMTMuNzI2OCAxOC4xMTI0QzEzLjk2OTggMTguMTUzNSAxNC4yMzUyIDE4LjExMjQgMTQuNDU4NiAxOC4wMzEyQzE0LjQ1ODYgMTcuOTMwNCAxNC4zMTY1IDE3Ljc0NzQgMTMuNTgzOCAxNy43NDc0WiIKICAgICAgICAgIGZpbGw9IndoaXRlIgogICAgICAgIC8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L3N2Zz4=');}.ta-editor-content .file-icon--ppt {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDM4IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTEsIC00MDApIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMSwgNDAwKSI+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMzgsMTYgTDIxLjUsMTYgTDIxLjUsMCBDMjUuODc2MDcyMSwwIDMwLjA3MjkxMTYsMS42ODU3MDk0NSAzMy4xNjcyNjE5LDQuNjg2MjkxNSBDMzYuMjYxNjEyMSw3LjY4Njg3MzU2IDM4LDExLjc1NjUzNjIgMzgsMTYgTDM4LDE2IFoiCiAgICAgICAgICAgIGZpbGw9IiNGMDk1NzMiCiAgICAgICAgICA+PC9wYXRoPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgZD0iTTIxLjUsMCBMMjEuNSwxNiBMNSwxNiBDNSw3LjE2MzQ0NCAxMi4zODczMDE2LDAgMjEuNSwwIEwyMS41LDAgWiIKICAgICAgICAgICAgZmlsbD0iI0RENzQ1MSIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMzgsMTYgQzM4LDI0LjgzNjU1NiAzMC42MTI2OTg0LDMyIDIxLjUsMzIgQzEyLjM4NzMwMTYsMzIgNSwyNC44MzY1NTYgNSwxNiBMMzgsMTYgWiIKICAgICAgICAgICAgZmlsbD0iI0M0NUEzQiIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMiw3LjI3MjcyNzI3IEwxNiw3LjI3MjcyNzI3IEMxNy4zMzMzMzMzLDcuMjcyNzI3MjcgMTgsNy45MTkxOTE5MiAxOCw5LjIxMjEyMTIxIEwxOCwyMi43ODc4Nzg4IEMxOCwyNC4wODA4MDgxIDE3LjMzMzMzMzMsMjQuNzI3MjcyNyAxNiwyNC43MjcyNzI3IEwyLDI0LjcyNzI3MjcgQzAuNjY2NjY2NjY3LDI0LjcyNzI3MjcgMCwyNC4wODA4MDgxIDAsMjIuNzg3ODc4OCBMMCw5LjIxMjEyMTIxIEMwLDcuOTE5MTkxOTIgMC42NjY2NjY2NjcsNy4yNzI3MjcyNyAyLDcuMjcyNzI3MjcgWiIKICAgICAgICAgICAgZmlsbD0iI0I3NEEyQiIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNNi43NTksMjEuMDg1MDkwOSBMNC42OTM1LDIxLjA4NTA5MDkgTDQuNzAyLDExLjUxNTYyNjIgTDguODk1LDExLjUxNTYyNjIgQzkuNzEyODMwMTIsMTEuNTEzNzAxMSAxMC41MDU1Mzc3LDExLjc4OTU0MjkgMTEuMTM1NSwxMi4yOTUyNzI3IEMxMS44Njk2MzkyLDEyLjkyMDA0MzkgMTIuMjczODE5MSwxMy44MzI3MTEyIDEyLjIzNTUsMTQuNzc5MTUxNSBDMTIuMjczNDEzMywxNS43MjE0MzIxIDExLjg4MTg5NzksMTYuNjMyMTY5NSAxMS4xNjUsMTcuMjY5MzMzMyBDMTAuNTU3NjI5NiwxNy43OTAwMDY2IDkuNzc1Njc4NTksMTguMDc4NjYwNyA4Ljk2NSwxOC4wODE0NTQ1IEw2Ljc1OTUsMTguMDgxNDU0NSBMNi43NTk1LDIxLjA4NzUxNTIgTDYuNzU5LDIxLjA4NTA5MDkgWiBNNi43NTksMTMuMTA3ODc4OCBMNi43NTksMTYuNTA5MDkwOSBMOC40MzYsMTYuNTA5MDkwOSBDOC43NDg4NjM3OCwxNi41MDE5OTczIDkuMDU1ODIyNzQsMTYuNDI1MDExMyA5LjMzMywxNi4yODQxMjEyIEM5Ljg3NjA1ODIsMTUuOTg2NjQwNyAxMC4xOTAzODY5LDE1LjQwOTQyNzIgMTAuMTM3NSwxNC44MDY3ODc5IEMxMC4xOTAxMzA4LDE0LjIwNjYwNjUgOS44Nzc3MzM5MiwxMy42MzE2MDcgOS4zMzc1LDEzLjMzNDMwMyBDOS4wNTk5NjYzMywxMy4xOTE0ODQzIDguNzUxNjM3MDksMTMuMTE0MDgwMiA4LjQzNzUsMTMuMTA4MzYzNiBMNi43NTg1LDEzLjEwODM2MzYgTDYuNzU5LDEzLjEwNzg3ODggWiIKICAgICAgICAgICAgZmlsbD0iI0ZGRkZGRiIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9zdmc+');}.ta-editor-content .file-icon--xls {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDM4IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTEsIC00NjQpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMSwgNDY0KSI+CiAgICAgICAgICA8cG9seWdvbiBmaWxsPSIjMkQ1QjNBIiBwb2ludHM9IjkuNSAxNiAyMy43NSAxNiAyMy43NSAyNCA5LjUgMjQiPjwvcG9seWdvbj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0yMy43NSwxNiBMMzgsMTYgTDM4LDI0IEwyMy43NSwyNCBMMjMuNzUsMTYgWiBNOS41LDggTDIzLjc1LDggTDIzLjc1LDE2IEw5LjUsMTYgTDkuNSw4IFoiCiAgICAgICAgICAgIGZpbGw9IiMzODdBNDciCiAgICAgICAgICA+PC9wYXRoPgogICAgICAgICAgPHBvbHlnb24gZmlsbD0iIzRGQTE2QiIgcG9pbnRzPSIyMy43NSA4IDM4IDggMzggMTYgMjMuNzUgMTYiPjwvcG9seWdvbj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik05LjUsMjQgTDM4LDI0IEwzOCwzMCBDMzgsMzEuMTA0NTY5NSAzNy4wNTQ4MjM0LDMyIDM1Ljg4ODg4ODksMzIgTDExLjYxMTExMTEsMzIgQzEwLjQ0NTE3NjYsMzIgOS41LDMxLjEwNDU2OTUgOS41LDMwIEw5LjUsMjQgWiIKICAgICAgICAgICAgZmlsbD0iIzJENUIzQSIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMTEuNjExMTExMSwwIEwyMy43NSwwIEwyMy43NSw4IEw5LjUsOCBMOS41LDIgQzkuNSwwLjg5NTQzMDUgMTAuNDQ1MTc2NiwwIDExLjYxMTExMTEsMCBaIgogICAgICAgICAgICBmaWxsPSIjNEZBMTZCIgogICAgICAgICAgPjwvcGF0aD4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0yLjExMTExMTExLDcgTDE2Ljg4ODg4ODksNyBDMTguMjk2Mjk2Myw3IDE5LDcuNjY2NjY2NjcgMTksOSBMMTksMjMgQzE5LDI0LjMzMzMzMzMgMTguMjk2Mjk2MywyNSAxNi44ODg4ODg5LDI1IEwyLjExMTExMTExLDI1IEMwLjcwMzcwMzcwNCwyNSAwLDI0LjMzMzMzMzMgMCwyMyBMMCw5IEMwLDcuNjY2NjY2NjcgMC43MDM3MDM3MDQsNyAyLjExMTExMTExLDcgWiIKICAgICAgICAgICAgZmlsbD0iIzM1NzU0MSIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNMjMuNzUsMCBMMzUuODg4ODg4OSwwIEMzNy4wNTQ4MjM0LDAgMzgsMC44OTU0MzA1IDM4LDIgTDM4LDggTDIzLjc1LDggTDIzLjc1LDAgWiIKICAgICAgICAgICAgZmlsbD0iIzYzQzE4NyIKICAgICAgICAgID48L3BhdGg+CiAgICAgICAgICA8cG9seWdvbgogICAgICAgICAgICBmaWxsPSIjRkZGRkZGIgogICAgICAgICAgICBwb2ludHM9IjQuNzU0NzUgMTEuMDYzIDguMDUwMTk0NDQgMTUuOTQ4NSA0LjczNjI3Nzc4IDIwLjkzNyA3LjA5NTQ0NDQ0IDIwLjkzNyA5LjM2NDg4ODg5IDE3LjQ4MSA5LjQzOTMwNTU2IDE3LjQ4MSAxMS43MjYxNjY3IDIwLjkzNyAxNC4yMDY3MjIyIDIwLjkzNyAxMC44MzM2OTQ0IDE1Ljk0ODUgMTQuMjY0MjUgMTEuMDYzIDExLjgxOTU4MzMgMTEuMDYzIDkuNjIzNSAxNC42MTYgOS41Mjk1NTU1NiAxNC42MTYgNy4zMjIzODg4OSAxMS4wNjMiCiAgICAgICAgICA+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvc3ZnPg==');}.ta-editor-content .file-icon--link {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDM4IDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTEsIC0yNzIpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMSwgMjcyKSI+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICBkPSJNOS4xODcxMTU0NSw3LjM2MjcxMTkgTDkuMTg3MTE1NDUsNC44MjcxMTg2OSBDOS4xODY5MTIzMyw0LjY5NzQ0NjIzIDkuMjg5NTk1OTksNC41OTAyNTQ3NyA5LjQyMDkxOTI5LDQuNTgzMDUwODkgTDM1Ljg1NDUwNiw0LjU4MzA1MDg5IEMzNS45OTEyMjc5LDQuNTgzMDUwODkgMzYuMTAyMDYzLDQuNjkyMzIzNzcgMzYuMTAyMDYzLDQuODI3MTE4NjkgTDM2LjEwMjA2MywyMi4zMDUwODQ4IEMzNi4xMDIwNjMsMjIuNDMwOTUwMiAzNi4wNTEzNDgzLDIyLjU1MTY2MDUgMzUuOTYxMDc1NiwyMi42NDA2NjA5IEMzNS44NzA4MDMsMjIuNzI5NjYxMiAzNS43NDgzNjcsMjIuNzc5NjYxIDM1LjYyMDcwMjEsMjIuNzc5NjYxIEwzMC41NzMyODk5LDIyLjc3OTY2MSBMMzAuNTczMjg5OSwyNC42Nzc5NjYxIEwzNi4wNzQ1NTY2LDI0LjY3Nzk2NjEgQzM3LjEzNzk0OTYsMjQuNjc3OTY2MSAzOCwyMy44MjgwNjYgMzgsMjIuNzc5NjYxIEwzOCwxLjg5ODMwNTEzIEMzOCwwLjg0OTkwMDE4NiAzNy4xMzc5NDk2LDAgMzYuMDc0NTU2NiwwIEw5LjE4NzExNTQ1LDAgQzguMTM5NjI5MSwwIDcuMjg0MTE4MiwwLjgyNTE0MTc3NiA3LjI2MTY3MjEsMS44NTc2MjcxNyBMNy4yNjE2NzIxLDcuMzYyNzExOSBMOS4xODcxMTU0NSw3LjM2MjcxMTkgWiBNMzIuMDQ0ODc4OCwxLjU1OTMyMjA4IEMzMi4yMzIxNDIxLDEuMzg4MTEzNTkgMzIuNDc3MTY5OCwxLjI5MTQ4Mzk0IDMyLjczMjUzNzEsMS4yODgxMzU2MyBDMzIuOTg0NTEyNywxLjI4ODA5OTQzIDMzLjIyNjQ1OTcsMS4zODU0NjE0MSAzMy40MDY0NDIzLDEuNTU5MzIyMDggQzMzLjU4OTkxMTMsMS43Mzg3MzE1NiAzMy42OTM3Njg0LDEuOTgyNTI0OTUgMzMuNjk1MjU4OCwyLjIzNzI4ODE4IEMzMy42ODA4NTA0LDIuNzU1NDkyNTkgMzMuMjU4MTQ5OCwzLjE3MjIzNTQyIDMyLjczMjUzNzEsMy4xODY0NDA3MiBDMzIuMjAwODQwNiwzLjE4NjQ0MDcyIDMxLjc2OTgxNTQsMi43NjE0OTA2NiAzMS43Njk4MTU0LDIuMjM3Mjg4MTggQzMxLjc3MzIxMTYsMS45ODU1MjAxNiAzMS44NzEyMjI3LDEuNzQzOTQ2MDMgMzIuMDQ0ODc4OCwxLjU1OTMyMjA4IEwzMi4wNDQ4Nzg4LDEuNTU5MzIyMDggWiBNMjguMTkzOTkyLDEuNTU5MzIyMDggQzI4LjM4MTI1NTQsMS4zODgxMTM1OSAyOC42MjYyODMxLDEuMjkxNDgzOTQgMjguODgxNjUwNCwxLjI4ODEzNTYzIEMyOS4xMzM2MjYsMS4yODgwOTk0MyAyOS4zNzU1NzMsMS4zODU0NjE0MSAyOS41NTU1NTU2LDEuNTU5MzIyMDggQzI5LjczOTAyNDYsMS43Mzg3MzE1NiAyOS44NDI4ODE2LDEuOTgyNTI0OTUgMjkuODQ0MzcyMSwyLjIzNzI4ODE4IEMyOS44Mjk5NjM3LDIuNzU1NDkyNTkgMjkuNDA3MjYzMSwzLjE3MjIzNTQyIDI4Ljg4MTY1MDQsMy4xODY0NDA3MiBDMjguNjI2MzIwNywzLjE4NjQ0MDcyIDI4LjM4MTQ0ODcsMy4wODY0NDEwMSAyOC4yMDA5MDM0LDIuOTA4NDQwMzggQzI4LjAyMDM1OCwyLjczMDQzOTc1IDI3LjkxODkyODcsMi40ODkwMTkwOSAyNy45MTg5Mjg3LDIuMjM3Mjg4MTggQzI3LjkyMjMyNDksMS45ODU1MjAxNiAyOC4wMjAzMzU5LDEuNzQzOTQ2MDMgMjguMTkzOTkyLDEuNTU5MzIyMDggTDI4LjE5Mzk5MiwxLjU1OTMyMjA4IFogTTI0LjM0MzEwNTMsMS41NTkzMjIwOCBDMjQuNTMwMzY4NywxLjM4ODExMzU5IDI0Ljc3NTM5NjMsMS4yOTE0ODM5NCAyNS4wMzA3NjM3LDEuMjg4MTM1NjMgQzI1LjI4MjczOTMsMS4yODgwOTk0MyAyNS41MjQ2ODYzLDEuMzg1NDYxNDEgMjUuNzA0NjY4OCwxLjU1OTMyMjA4IEMyNS44ODgxMzc5LDEuNzM4NzMxNTYgMjUuOTkxOTk0OSwxLjk4MjUyNDk1IDI1Ljk5MzQ4NTMsMi4yMzcyODgxOCBDMjUuOTc5MDc3LDIuNzU1NDkyNTkgMjUuNTU2Mzc2NCwzLjE3MjIzNTQyIDI1LjAzMDc2MzcsMy4xODY0NDA3MiBDMjQuNDk5MDY3MiwzLjE4NjQ0MDcyIDI0LjA2ODA0MiwyLjc2MTQ5MDY2IDI0LjA2ODA0MiwyLjIzNzI4ODE4IEMyNC4wNjM4NjY3LDEuOTg5MDg1MzcgMjQuMTUxOTE3MSwxLjc0Nzk0ODAzIDI0LjMxNTU5OSwxLjU1OTMyMjA4IEwyNC4zNDMxMDUzLDEuNTU5MzIyMDggWiIKICAgICAgICAgICAgZmlsbD0iIzI3NkRGRiIKICAgICAgICAgICAgb3BhY2l0eT0iMC42IgogICAgICAgICAgPjwvcGF0aD4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0yNS42MDgzOTY3LDEzLjY0MDY3NzcgTDUuMjEyNDUwMjQsMTMuNjQwNjc3NyBDNC43OTc4NTYwMywxMy42NDA0MTI1IDQuNDAwOTgzMzgsMTMuODA2NDA2OSA0LjExMzA1NDc2LDE0LjEwMDUwNjkgQzMuODI1MTI2MTMsMTQuMzk0NjA2OCAzLjY3MDkwODI5LDE0Ljc5MTUxNDcgMy42ODU4NDg3MiwxNS4yIEwzLjY4NTg0ODcyLDI2Ljc5MzIyMDMgQzMuNjgyMTc5NTgsMjcuMTk0NzM3OCAzLjg0MTM5NjI1LDI3LjU4MTA1NDYgNC4xMjgwODgyMiwyNy44NjYyNTIyIEM0LjQxNDc4MDE5LDI4LjE1MTQ0OTggNC44MDUxNzYxNSwyOC4zMTE4NjQ0IDUuMjEyNDUwMjQsMjguMzExODY0NCBMMjUuNjA4Mzk2NywyOC4zMTE4NjQ0IEMyNi40NTM3MzUyLDI4LjMwNDQyMjggMjcuMTM1MDMxOSwyNy42MjY2Nzc1IDI3LjEzNDk5ODIsMjYuNzkzMjIwMyBMMjcuMTM0OTk4MiwxNS4yIEMyNy4xNDYwODY2LDE0Ljc5MjU3MTMgMjYuOTkwNTk3OCwxNC4zOTc4NDgzIDI2LjcwMzQ5NzIsMTQuMTA0NTk0MSBDMjYuNDE2Mzk2NSwxMy44MTEzMzk4IDI2LjAyMTc4MzYsMTMuNjQ0MTcwNCAyNS42MDgzOTY3LDEzLjY0MDY3NzcgTDI1LjYwODM5NjcsMTMuNjQwNjc3NyBaIgogICAgICAgICAgICBmaWxsPSIjRDBFMEZGIgogICAgICAgICAgPjwvcGF0aD4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0yOC44ODE2NTA0LDcuMzIyMDMzNzggTDEuOTI1NDQzMzYsNy4zMjIwMzM3OCBDMC44ODMxNjg4NjUsNy4zMjE2MTQ0MyAwLjAyOTc3OTE4NjksOC4xMzg5MzcwNiAwLDkuMTY2MTAxNzMgTDAsMzAuMTQyMzcyOSBDMC4wMjk2MDkxNzcxLDMxLjE3MTc4NDIgMC44ODA5MTkxOCwzMS45OTMxMTAxIDEuOTI1NDQzMzYsMzIgTDI4Ljg4MTY1MDQsMzIgQzI5Ljk0NTA0MzQsMzIgMzAuODA3MDkzNywzMS4xNTAwOTk5IDMwLjgwNzA5MzcsMzAuMTAxNjk0OSBMMzAuODA3MDkzNyw5LjIyMDMzOTAyIEMzMC44MDcwOTM3LDguMTcxOTM0MDcgMjkuOTQ1MDQzNCw3LjMyMjAzMzc4IDI4Ljg4MTY1MDQsNy4zMjIwMzM3OCBaIE0yNC44MjQ0NjYyLDguODgxMzU1OTcgQzI1LjAwNjQ0MDUsOC43MDA0NzI4NSAyNS4yNTM3MTkyLDguNTk4MDc5NjIgMjUuNTEyMTI0NSw4LjU5NjYxMDIxIEMyNi4wNDM4MjEsOC41OTY2MTAyMSAyNi40NzQ4NDYyLDkuMDIxNTYwMjcgMjYuNDc0ODQ2Miw5LjU0NTc2Mjc1IEMyNi40NzQ4NDYyLDEwLjA2OTk2NTIgMjYuMDQzODIxLDEwLjQ5NDkxNTMgMjUuNTEyMTI0NSwxMC40OTQ5MTUzIEMyNC45ODA0MjgsMTAuNDk0OTE1MyAyNC41NDk0MDI4LDEwLjA2OTk2NTIgMjQuNTQ5NDAyOCw5LjU0NTc2Mjc1IEMyNC41NDkzNjYxLDkuMjk3MzM4NjMgMjQuNjQ4MTIsOS4wNTg4MDE3NyAyNC44MjQ0NjYyLDguODgxMzU1OTcgTDI0LjgyNDQ2NjIsOC44ODEzNTU5NyBaIE0yMC45ODczMzI2LDguODgxMzU1OTcgQzIxLjI5NDY5Myw4LjU5MzM2NTM0IDIxLjc1ODU0MDQsOC41NDEzNTU0MyAyMi4xMjM2NDU3LDguNzUzOTQ0MzYgQzIyLjQ4ODc1MSw4Ljk2NjUzMzMgMjIuNjY2NDk5Myw5LjM5MjEyMzUzIDIyLjU1OTA4NTgsOS43OTY1MzY3MSBDMjIuNDUxNjcyMiwxMC4yMDA5NDk5IDIyLjA4NTE2NzIsMTAuNDg2MDMwNyAyMS42NjEyMzc4LDEwLjQ5NDkxNTMgQzIxLjEyOTU0MTMsMTAuNDk0OTE1MyAyMC42OTg1MDc3LDEwLjA2OTk2NTIgMjAuNjk4NTA3Nyw5LjU0NTc2Mjc1IEMyMC42OTc0MjgsOS4yOTQ0NDEzIDIwLjgwMTk4OTEsOS4wNTM5MDQzIDIwLjk4NzMzMjYsOC44ODEzNTU5NyBMMjAuOTg3MzMyNiw4Ljg4MTM1NTk3IFogTTE3LjEzNjQ0NTksOC44ODEzNTU5NyBDMTcuNDQzODA2Myw4LjU5MzM2NTM0IDE3LjkwNzY1MzcsOC41NDEzNTU0MyAxOC4yNzI3NTksOC43NTM5NDQzNiBDMTguNjM3ODY0Myw4Ljk2NjUzMzMgMTguODE1NjEyNiw5LjM5MjEyMzUzIDE4LjcwODE5OSw5Ljc5NjUzNjcxIEMxOC42MDA3ODU1LDEwLjIwMDk0OTkgMTguMjM0MjgwNSwxMC40ODYwMzA3IDE3LjgxMDM1MTEsMTAuNDk0OTE1MyBDMTcuMjc4NjU0NiwxMC40OTQ5MTUzIDE2Ljg0NzYyMSwxMC4wNjk5NjUyIDE2Ljg0NzYyMSw5LjU0NTc2Mjc1IEMxNi44NDY1NDEzLDkuMjk0NDQxMyAxNi45NTExMDI0LDkuMDUzOTA0MyAxNy4xMzY0NDU5LDguODgxMzU1OTcgTDE3LjEzNjQ0NTksOC44ODEzNTU5NyBaIE0yOC44ODE2NTA0LDI0LjY1MDg0NzUgTDI4Ljg4MTY1MDQsMjkuNjI3MTE4NiBDMjguODgxNjUwNCwyOS44ODkyMTk5IDI4LjY2NjEzNzgsMzAuMTAxNjk0OSAyOC40MDAyODk1LDMwLjEwMTY5NDkgTDIuNDA2ODA0MiwzMC4xMDE2OTQ5IEMyLjI3OTEzOTM3LDMwLjEwMTY5NDkgMi4xNTY3MDMzNSwzMC4wNTE2OTUxIDIuMDY2NDMwNjgsMjkuOTYyNjk0NyBDMS45NzYxNTgwMiwyOS44NzM2OTQ0IDEuOTI1NDQzMDYsMjkuNzUyOTg0MSAxLjkyNTQ0MzA2LDI5LjYyNzExODYgTDEuOTI1NDQzMDYsMTIuMTM1NTkzMyBDMS45MjU0NDMwNiwxMi4wMDU5MjA4IDIuMDI3OTIzOSwxMS44OTg3MjkzIDIuMTU5MjQ3MiwxMS44OTE1MjU1IEwyOC42MzQwOTM0LDExLjg5MTUyNTUgQzI4Ljc3MDgxNTMsMTEuODkxNTI1NSAyOC44ODE2NTA0LDEyLjAwMDc5ODMgMjguODgxNjUwNCwxMi4xMzU1OTMzIEwyOC44ODE2NTA0LDI0LjY1MDg0NzUgTDI4Ljg4MTY1MDQsMjQuNjUwODQ3NSBaIgogICAgICAgICAgICBmaWxsPSIjMjc2REZGIgogICAgICAgICAgPjwvcGF0aD4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik0xNS44OTg2NjA5LDE4LjAwNjc3OTcgTDE1Ljg5ODY2MDksMTYuMzUyNTQyNCBDMTYuMDQ5OTQ1NywxNS42NDc0NTc3IDE2LjY0MTMzMTksMTYuMDgxMzU2IDE2LjY0MTMzMTksMTYuMDgxMzU2IEwyMC43NjcyODE5LDE5LjU2NjEwMTcgQzIxLjY3NDk5MSwyMC4xNzYyNzEyIDIwLjgzNjA0NzgsMjAuNjM3Mjg4MiAyMC44MzYwNDc4LDIwLjYzNzI4ODIgTDE2LjgwNjM2OTksMjQuMDk0OTE1MyBDMTUuOTk0OTMzLDI0LjY3Nzk2NjEgMTUuOTM5OTIwNCwyMy43ODMwNTA5IDE1LjkzOTkyMDQsMjMuNzgzMDUwOSBMMTUuOTM5OTIwNCwyMi4xNjk0OTE1IEMxMS44MTM5NzAzLDIwLjkwODQ3NDYgMTAuMTc3MzQzNSwyNS45NjYxMDE3IDEwLjE3NzM0MzUsMjUuOTY2MTAxNyBDMTAuMDEyMzA1NSwyNi4yMzcyODgxIDkuOTI5Nzg2NDYsMjUuOTY2MTAxNyA5LjkyOTc4NjQ2LDI1Ljk2NjEwMTcgQzguMzQ4MTcyMjgsMTguMzg2NDQwNyAxNS45Mzk5MjA0LDE4LjAwNjc3OTcgMTUuOTM5OTIwNCwxOC4wMDY3Nzk3IEwxNS44OTg2NjA5LDE4LjAwNjc3OTcgWiIKICAgICAgICAgICAgZmlsbD0iIzI3NkRGRiIKICAgICAgICAgICAgb3BhY2l0eT0iMC42IgogICAgICAgICAgPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L3N2Zz4=');}.ta-editor-content .file-icon--unknown {background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGRlZnM+CiAgICAgIDxwYXRoCiAgICAgICAgZD0iTTEuNSAwaDE0LjA4NmExIDEgMCAwMS43MDcuMjkzbDUuNDE0IDUuNDE0YTEgMSAwIDAxLjI5My43MDdWMjYuNWExLjUgMS41IDAgMDEtMS41IDEuNWgtMTlBMS41IDEuNSAwIDAxMCAyNi41di0yNUExLjUgMS41IDAgMDExLjUgMHoiCiAgICAgICAgaWQ9Imljb25fZmlsZV91bmtub3dfbm9yX3N2Z19fYSIKICAgICAgPjwvcGF0aD4KICAgICAgPHBhdGgKICAgICAgICBkPSJNMTYuMjkzLjI5M2w1LjQxNCA1LjQxNEExIDEgMCAwMTIxLjkxIDZIMTcuNUExLjUgMS41IDAgMDExNiA0LjVWLjA5YTEgMSAwIDAxLjI5My4yMDN6IgogICAgICAgIGlkPSJpY29uX2ZpbGVfdW5rbm93X25vcl9zdmdfX2IiCiAgICAgID48L3BhdGg+CiAgICA8L2RlZnM+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1IDIpIj4KICAgICAgICA8dXNlIGZpbGw9IiM5Q0EzQUQiIHhsaW5rSHJlZj0iI2ljb25fZmlsZV91bmtub3dfbm9yX3N2Z19fYSI+PC91c2U+CiAgICAgICAgPHVzZSBmaWxsPSIjNjQ2QTczIiB4bGlua0hyZWY9IiNpY29uX2ZpbGVfdW5rbm93X25vcl9zdmdfX2IiPjwvdXNlPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGQ9Ik03LjY0OSAxMC43MDNoMTYuNjQ4VjI3LjM1SDcuNjV6Ij48L3BhdGg+CiAgICAgIDxwYXRoCiAgICAgICAgZD0iTTE2LjE2IDEyLjIxNmMxLjIzNiAwIDIuMjMuMzU2IDIuOTg3IDEuMDczLjcyLjY4MSAxLjA4MSAxLjYwMiAxLjA4MSAyLjc0OWEzLjY2IDMuNjYgMCAwMS0uNzYgMi4yNTVjLS4yMDkuMjY2LS42NzYuNzItMS41MTggMS40ODItLjQyLjM2Ny0uNjYxLjYxOC0uODQ5LjkzNy0uMjUuNDMtLjM3MS44Ny0uMzcxIDEuMzYxdi41NDlhLjE5LjE5IDAgMDEtLjE5LjE4OWgtMS4xNTRhLjE5LjE5IDAgMDEtLjE4OS0uMTl2LS41NDhjMC0uNTguMTIxLTEuMTIuMzU5LTEuNTk0LjI4OC0uNjE4LjgzNS0xLjI0NyAxLjcyLTIuMDIuNTYtLjU2LjczMy0uNzQuODU0LS44OTEuMzgtLjQ4OC41NjYtLjk3OC41NjYtMS40OTIgMC0uNzU0LS4yMjEtMS4zNTUtLjY0NS0xLjc5Ni0uNDQ0LS40NDUtMS4wODgtLjY2NC0xLjk0Ny0uNjY0LS45NjMgMC0xLjY2NC4zMTQtMi4xNDIuOTUtLjM3OC40NzQtLjU5LjktLjYzIDEuNzEzYTkuNDI1IDkuNDI1IDAgMDAtLjAwNi4yOS4xOS4xOSAwIDAxLS4xOS4xODhoLTEuMTM1YS4xOS4xOSAwIDAxLS4xODktLjE5MWMuMDAxLS4xNS4wMDMtLjI0OC4wMDUtLjI5Ni4wNTItMS4xNzcuNDExLTEuOTIzIDEuMDgtMi43MDIuNzg3LS45MDcgMS44NzUtMS4zNTIgMy4yNjMtMS4zNTJ6bS0uNzU1IDEyLjEwOGgxLjEzNmEuMTkuMTkgMCAwMS4xODkuMTl2MS4xMzVhLjE5LjE5IDAgMDEtLjE5LjE4OWgtMS4xMzVhLjE5LjE5IDAgMDEtLjE4OS0uMTl2LTEuMTM0YS4xOS4xOSAwIDAxLjE5LS4xOXoiCiAgICAgICAgZmlsbD0iI2NjYyIKICAgICAgICBmaWxsLXJ1bGU9Im5vbnplcm8iCiAgICAgID48L3BhdGg+CiAgICA8L2c+CiAgPC9zdmc+');}

    .mce-content-body .mce-item-anchor{background:transparent url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'8'%20height%3D'12'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'M0%200L8%200%208%2012%204.09117821%209%200%2012z'%2F%3E%3C%2Fsvg%3E%0A") no-repeat center;cursor:default;display:inline-block;height:12px!important;padding:0 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;user-select:all;width:8px!important}.mce-content-body .mce-item-anchor[data-mce-selected]{outline-offset:1px}.tox-comments-visible .tox-comment{background-color:#fff0b7}.tox-comments-visible .tox-comment--active{background-color:#ffe168}.tox-checklist>li:not(.tox-checklist--hidden){list-style:none;margin:.25em 0}.tox-checklist>li:not(.tox-checklist--hidden)::before{content:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cg%20id%3D%22checklist-unchecked%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20id%3D%22Rectangle%22%20width%3D%2215%22%20height%3D%2215%22%20x%3D%22.5%22%20y%3D%22.5%22%20fill-rule%3D%22nonzero%22%20stroke%3D%22%234C4C4C%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%0A");cursor:pointer;height:1em;margin-left:-1.5em;margin-top:.125em;position:absolute;width:1em}.tox-checklist li:not(.tox-checklist--hidden).tox-checklist--checked::before{content:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cg%20id%3D%22checklist-checked%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20id%3D%22Rectangle%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%234099FF%22%20fill-rule%3D%22nonzero%22%20rx%3D%222%22%2F%3E%3Cpath%20id%3D%22Path%22%20fill%3D%22%23FFF%22%20fill-rule%3D%22nonzero%22%20d%3D%22M11.5703186%2C3.14417309%20C11.8516238%2C2.73724603%2012.4164781%2C2.62829933%2012.83558%2C2.89774797%20C13.260121%2C3.17069355%2013.3759736%2C3.72932262%2013.0909105%2C4.14168582%20L7.7580587%2C11.8560195%20C7.43776896%2C12.3193404%206.76483983%2C12.3852142%206.35607322%2C11.9948725%20L3.02491697%2C8.8138662%20C2.66090143%2C8.46625845%202.65798871%2C7.89594698%203.01850234%2C7.54483354%20C3.373942%2C7.19866177%203.94940006%2C7.19592841%204.30829608%2C7.5386474%20L6.85276923%2C9.9684299%20L11.5703186%2C3.14417309%20Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%0A")}[dir=rtl] .tox-checklist>li:not(.tox-checklist--hidden)::before{margin-left:0;margin-right:-1.5em}code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;tab-size:4;-webkit-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#dd4a68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}.mce-content-body{overflow-wrap:break-word;word-wrap:break-word}.mce-content-body .mce-visual-caret{background-color:#000;background-color:currentColor;position:absolute}.mce-content-body .mce-visual-caret-hidden{display:none}.mce-content-body [data-mce-caret]{left:-1000px;margin:0;padding:0;position:absolute;right:auto;top:0}.mce-content-body .mce-offscreen-selection{left:-2000000px;max-width:1000000px;position:absolute}.mce-content-body [contentEditable=false]{cursor:default}.mce-content-body [contentEditable=true]{cursor:text}.tox-cursor-format-painter{cursor:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%0A%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23000%22%20fill-rule%3D%22nonzero%22%20d%3D%22M15%2C6%20C15%2C5.45%2014.55%2C5%2014%2C5%20L6%2C5%20C5.45%2C5%205%2C5.45%205%2C6%20L5%2C10%20C5%2C10.55%205.45%2C11%206%2C11%20L14%2C11%20C14.55%2C11%2015%2C10.55%2015%2C10%20L15%2C9%20L16%2C9%20L16%2C12%20L9%2C12%20L9%2C19%20C9%2C19.55%209.45%2C20%2010%2C20%20L11%2C20%20C11.55%2C20%2012%2C19.55%2012%2C19%20L12%2C14%20L18%2C14%20L18%2C7%20L15%2C7%20L15%2C6%20Z%22%2F%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23000%22%20fill-rule%3D%22nonzero%22%20d%3D%22M1%2C1%20L8.25%2C1%20C8.66421356%2C1%209%2C1.33578644%209%2C1.75%20L9%2C1.75%20C9%2C2.16421356%208.66421356%2C2.5%208.25%2C2.5%20L2.5%2C2.5%20L2.5%2C8.25%20C2.5%2C8.66421356%202.16421356%2C9%201.75%2C9%20L1.75%2C9%20C1.33578644%2C9%201%2C8.66421356%201%2C8.25%20L1%2C1%20Z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A"),default}.mce-content-body figure.align-left{float:left}.mce-content-body figure.align-right{float:right}.mce-content-body figure.image.align-center{display:table;margin-left:auto;margin-right:auto}.mce-preview-object{border:1px solid gray;display:inline-block;line-height:0;margin:0 2px 0 2px;position:relative}.mce-preview-object .mce-shim{background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);height:100%;left:0;position:absolute;top:0;width:100%}.mce-preview-object[data-mce-selected="2"] .mce-shim{display:none}.mce-object{background:transparent url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%3E%3Cpath%20d%3D%22M4%203h16a1%201%200%200%201%201%201v16a1%201%200%200%201-1%201H4a1%201%200%200%201-1-1V4a1%201%200%200%201%201-1zm1%202v14h14V5H5zm4.79%202.565l5.64%204.028a.5.5%200%200%201%200%20.814l-5.64%204.028a.5.5%200%200%201-.79-.407V7.972a.5.5%200%200%201%20.79-.407z%22%2F%3E%3C%2Fsvg%3E%0A") no-repeat center;border:1px dashed #aaa}.mce-pagebreak{border:1px dashed #aaa;cursor:default;display:block;height:5px;margin-top:15px;page-break-before:always;width:100%}@media print{.mce-pagebreak{border:0}}.tiny-pageembed .mce-shim{background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);height:100%;left:0;position:absolute;top:0;width:100%}.tiny-pageembed[data-mce-selected="2"] .mce-shim{display:none}.tiny-pageembed{display:inline-block;position:relative}.tiny-pageembed--16by9,.tiny-pageembed--1by1,.tiny-pageembed--21by9,.tiny-pageembed--4by3{display:block;overflow:hidden;padding:0;position:relative;width:100%}.tiny-pageembed--21by9{padding-top:42.857143%}.tiny-pageembed--16by9{padding-top:56.25%}.tiny-pageembed--4by3{padding-top:75%}.tiny-pageembed--1by1{padding-top:100%}.tiny-pageembed--16by9 iframe,.tiny-pageembed--1by1 iframe,.tiny-pageembed--21by9 iframe,.tiny-pageembed--4by3 iframe{border:0;height:100%;left:0;position:absolute;top:0;width:100%}.mce-content-body[data-mce-placeholder]{position:relative}.mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before{color:#bfbfbf;content:attr(data-mce-placeholder);position:absolute}.mce-content-body:not([dir=rtl])[data-mce-placeholder]:not(.mce-visualblocks)::before{left:1px}.mce-content-body[dir=rtl][data-mce-placeholder]:not(.mce-visualblocks)::before{right:1px}.mce-content-body div.mce-resizehandle{background-color:#4099ff;border-color:#4099ff;border-style:solid;border-width:1px;box-sizing:border-box;height:10px;position:absolute;width:10px;z-index:1298}.mce-content-body div.mce-resizehandle:hover{background-color:#4099ff}.mce-content-body div.mce-resizehandle:nth-of-type(1){cursor:nwse-resize}.mce-content-body div.mce-resizehandle:nth-of-type(2){cursor:nesw-resize}.mce-content-body div.mce-resizehandle:nth-of-type(3){cursor:nwse-resize}.mce-content-body div.mce-resizehandle:nth-of-type(4){cursor:nesw-resize}.mce-content-body .mce-resize-backdrop{z-index:10000}.mce-content-body .mce-clonedresizable{cursor:default;opacity:.5;outline:1px dashed #000;position:absolute;z-index:10001}.mce-content-body .mce-clonedresizable.mce-resizetable-columns td,.mce-content-body .mce-clonedresizable.mce-resizetable-columns th{border:0}.mce-content-body .mce-resize-helper{background:#555;background:rgba(0,0,0,.75);border:1px;border-radius:3px;color:#fff;display:none;font-family:sans-serif;font-size:12px;line-height:14px;margin:5px 10px;padding:5px;position:absolute;white-space:nowrap;z-index:10002}.tox-rtc-user-selection{position:relative}.tox-rtc-user-cursor{bottom:0;cursor:default;position:absolute;top:0;width:2px}.tox-rtc-user-cursor::before{background-color:inherit;border-radius:50%;content:'';display:block;height:8px;position:absolute;right:-3px;top:-3px;width:8px}.tox-rtc-user-cursor:hover::after{background-color:inherit;border-radius:100px;box-sizing:border-box;color:#fff;content:attr(data-user);display:block;font-size:12px;font-weight:700;left:-5px;min-height:8px;min-width:8px;padding:0 12px;position:absolute;top:-11px;white-space:nowrap;z-index:1000}.tox-rtc-user-selection--1 .tox-rtc-user-cursor{background-color:#2dc26b}.tox-rtc-user-selection--2 .tox-rtc-user-cursor{background-color:#e03e2d}.tox-rtc-user-selection--3 .tox-rtc-user-cursor{background-color:#f1c40f}.tox-rtc-user-selection--4 .tox-rtc-user-cursor{background-color:#3598db}.tox-rtc-user-selection--5 .tox-rtc-user-cursor{background-color:#b96ad9}.tox-rtc-user-selection--6 .tox-rtc-user-cursor{background-color:#e67e23}.tox-rtc-user-selection--7 .tox-rtc-user-cursor{background-color:#aaa69d}.tox-rtc-user-selection--8 .tox-rtc-user-cursor{background-color:#f368e0}.tox-rtc-remote-image{background:#eaeaea url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2236%22%20height%3D%2212%22%20viewBox%3D%220%200%2036%2012%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Ccircle%20cx%3D%226%22%20cy%3D%226%22%20r%3D%223%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%20.2)%22%3E%0A%20%20%20%20%3Canimate%20attributeName%3D%22r%22%20values%3D%223%3B5%3B3%22%20calcMode%3D%22linear%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20%2F%3E%0A%20%20%3C%2Fcircle%3E%0A%20%20%3Ccircle%20cx%3D%2218%22%20cy%3D%226%22%20r%3D%223%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%20.2)%22%3E%0A%20%20%20%20%3Canimate%20attributeName%3D%22r%22%20values%3D%223%3B5%3B3%22%20calcMode%3D%22linear%22%20begin%3D%22.33s%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20%2F%3E%0A%20%20%3C%2Fcircle%3E%0A%20%20%3Ccircle%20cx%3D%2230%22%20cy%3D%226%22%20r%3D%223%22%20fill%3D%22rgba(0%2C%200%2C%200%2C%20.2)%22%3E%0A%20%20%20%20%3Canimate%20attributeName%3D%22r%22%20values%3D%223%3B5%3B3%22%20calcMode%3D%22linear%22%20begin%3D%22.66s%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20%2F%3E%0A%20%20%3C%2Fcircle%3E%0A%3C%2Fsvg%3E%0A") no-repeat center center;border:1px solid #ccc;min-height:240px;min-width:320px}.mce-match-marker{background:#aaa;color:#fff}.mce-match-marker-selected{background:#39f;color:#fff}.mce-match-marker-selected::-moz-selection{background:#39f;color:#fff}.mce-match-marker-selected::selection{background:#39f;color:#fff}.mce-content-body audio[data-mce-selected],.mce-content-body embed[data-mce-selected],.mce-content-body img[data-mce-selected],.mce-content-body object[data-mce-selected],.mce-content-body table[data-mce-selected],.mce-content-body video[data-mce-selected]{outline:3px solid #b4d7ff}.mce-content-body hr[data-mce-selected]{outline:3px solid #b4d7ff;outline-offset:1px}.mce-content-body [contentEditable=false] [contentEditable=true]:focus{outline:3px solid #b4d7ff}.mce-content-body [contentEditable=false] [contentEditable=true]:hover{outline:3px solid #b4d7ff}.mce-content-body [contentEditable=false][data-mce-selected]{cursor:not-allowed;outline:3px solid #b4d7ff}.mce-content-body.mce-content-readonly [contentEditable=true]:focus,.mce-content-body.mce-content-readonly [contentEditable=true]:hover{outline:0}.mce-content-body [data-mce-selected=inline-boundary]{background-color:#b4d7ff}.mce-content-body .mce-edit-focus{outline:3px solid #b4d7ff}.mce-content-body td[data-mce-selected],.mce-content-body th[data-mce-selected]{position:relative}.mce-content-body td[data-mce-selected]::-moz-selection,.mce-content-body th[data-mce-selected]::-moz-selection{background:0 0}.mce-content-body td[data-mce-selected]::selection,.mce-content-body th[data-mce-selected]::selection{background:0 0}.mce-content-body td[data-mce-selected] *,.mce-content-body th[data-mce-selected] *{outline:0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mce-content-body td[data-mce-selected]::after,.mce-content-body th[data-mce-selected]::after{background-color:rgba(180,215,255,.7);border:1px solid rgba(180,215,255,.7);bottom:-1px;content:'';left:-1px;mix-blend-mode:multiply;position:absolute;right:-1px;top:-1px}@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){.mce-content-body td[data-mce-selected]::after,.mce-content-body th[data-mce-selected]::after{border-color:rgba(0,84,180,.7)}}.mce-content-body img::-moz-selection{background:0 0}.mce-content-body img::selection{background:0 0}.ephox-snooker-resizer-bar{background-color:#b4d7ff;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ephox-snooker-resizer-cols{cursor:col-resize}.ephox-snooker-resizer-rows{cursor:row-resize}.ephox-snooker-resizer-bar.ephox-snooker-resizer-bar-dragging{opacity:1}.mce-spellchecker-word{background-image:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'4'%20height%3D'4'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20stroke%3D'%23ff0000'%20fill%3D'none'%20stroke-linecap%3D'round'%20stroke-opacity%3D'.75'%20d%3D'M0%203L2%201%204%203'%2F%3E%3C%2Fsvg%3E%0A");background-position:0 calc(100% + 1px);background-repeat:repeat-x;background-size:auto 6px;cursor:default;height:2rem}.mce-spellchecker-grammar{background-image:url("data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'4'%20height%3D'4'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20stroke%3D'%2300A835'%20fill%3D'none'%20stroke-linecap%3D'round'%20d%3D'M0%203L2%201%204%203'%2F%3E%3C%2Fsvg%3E%0A");background-position:0 calc(100% + 1px);background-repeat:repeat-x;background-size:auto 6px;cursor:default}.mce-toc{border:1px solid gray}.mce-toc h2{margin:4px}.mce-toc li{list-style-type:none}.mce-item-table:not([border]),.mce-item-table:not([border]) caption,.mce-item-table:not([border]) td,.mce-item-table:not([border]) th,.mce-item-table[border="0"],.mce-item-table[border="0"] caption,.mce-item-table[border="0"] td,.mce-item-table[border="0"] th,table[style*="border-width: 0px"],table[style*="border-width: 0px"] caption,table[style*="border-width: 0px"] td,table[style*="border-width: 0px"] th{border:1px dashed #bbb}.mce-visualblocks address,.mce-visualblocks article,.mce-visualblocks aside,.mce-visualblocks blockquote,.mce-visualblocks div:not([data-mce-bogus]),.mce-visualblocks dl,.mce-visualblocks figcaption,.mce-visualblocks figure,.mce-visualblocks h1,.mce-visualblocks h2,.mce-visualblocks h3,.mce-visualblocks h4,.mce-visualblocks h5,.mce-visualblocks h6,.mce-visualblocks hgroup,.mce-visualblocks ol,.mce-visualblocks p,.mce-visualblocks pre,.mce-visualblocks section,.mce-visualblocks ul{background-repeat:no-repeat;border:1px dashed #bbb;margin-left:3px;padding-top:10px}.mce-visualblocks p{background-image:url(data:image/gif;base64,R0lGODlhCQAJAJEAAAAAAP///7u7u////yH5BAEAAAMALAAAAAAJAAkAAAIQnG+CqCN/mlyvsRUpThG6AgA7)}.mce-visualblocks h1{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIABALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybGu1JuxHoAfRNRW3TWXyF2YiRUAOw==)}.mce-visualblocks h2{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8Hybbx4oOuqgTynJd6bGlWg3DkJzoaUAAAOw==)}.mce-visualblocks h3{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIZjI8Hybbx4oOuqgTynJf2Ln2NOHpQpmhAAQA7)}.mce-visualblocks h4{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8HybbxInR0zqeAdhtJlXwV1oCll2HaWgAAOw==)}.mce-visualblocks h5{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8HybbxIoiuwjane4iq5GlW05GgIkIZUAAAOw==)}.mce-visualblocks h6{background-image:url(data:image/gif;base64,R0lGODlhDgAKAIABALu7u////yH5BAEAAAEALAAAAAAOAAoAAAIajI8HybbxIoiuwjan04jep1iZ1XRlAo5bVgAAOw==)}.mce-visualblocks div:not([data-mce-bogus]){background-image:url(data:image/gif;base64,R0lGODlhEgAKAIABALu7u////yH5BAEAAAEALAAAAAASAAoAAAIfjI9poI0cgDywrhuxfbrzDEbQM2Ei5aRjmoySW4pAAQA7)}.mce-visualblocks section{background-image:url(data:image/gif;base64,R0lGODlhKAAKAIABALu7u////yH5BAEAAAEALAAAAAAoAAoAAAI5jI+pywcNY3sBWHdNrplytD2ellDeSVbp+GmWqaDqDMepc8t17Y4vBsK5hDyJMcI6KkuYU+jpjLoKADs=)}.mce-visualblocks article{background-image:url(data:image/gif;base64,R0lGODlhKgAKAIABALu7u////yH5BAEAAAEALAAAAAAqAAoAAAI6jI+pywkNY3wG0GBvrsd2tXGYSGnfiF7ikpXemTpOiJScasYoDJJrjsG9gkCJ0ag6KhmaIe3pjDYBBQA7)}.mce-visualblocks blockquote{background-image:url(data:image/gif;base64,R0lGODlhPgAKAIABALu7u////yH5BAEAAAEALAAAAAA+AAoAAAJPjI+py+0Knpz0xQDyuUhvfoGgIX5iSKZYgq5uNL5q69asZ8s5rrf0yZmpNkJZzFesBTu8TOlDVAabUyatguVhWduud3EyiUk45xhTTgMBBQA7)}.mce-visualblocks address{background-image:url(data:image/gif;base64,R0lGODlhLQAKAIABALu7u////yH5BAEAAAEALAAAAAAtAAoAAAI/jI+pywwNozSP1gDyyZcjb3UaRpXkWaXmZW4OqKLhBmLs+K263DkJK7OJeifh7FicKD9A1/IpGdKkyFpNmCkAADs=)}.mce-visualblocks pre{background-image:url(data:image/gif;base64,R0lGODlhFQAKAIABALu7uwAAACH5BAEAAAEALAAAAAAVAAoAAAIjjI+ZoN0cgDwSmnpz1NCueYERhnibZVKLNnbOq8IvKpJtVQAAOw==)}.mce-visualblocks figure{background-image:url(data:image/gif;base64,R0lGODlhJAAKAIAAALu7u////yH5BAEAAAEALAAAAAAkAAoAAAI0jI+py+2fwAHUSFvD3RlvG4HIp4nX5JFSpnZUJ6LlrM52OE7uSWosBHScgkSZj7dDKnWAAgA7)}.mce-visualblocks figcaption{border:1px dashed #bbb}.mce-visualblocks hgroup{background-image:url(data:image/gif;base64,R0lGODlhJwAKAIABALu7uwAAACH5BAEAAAEALAAAAAAnAAoAAAI3jI+pywYNI3uB0gpsRtt5fFnfNZaVSYJil4Wo03Hv6Z62uOCgiXH1kZIIJ8NiIxRrAZNMZAtQAAA7)}.mce-visualblocks aside{background-image:url(data:image/gif;base64,R0lGODlhHgAKAIABAKqqqv///yH5BAEAAAEALAAAAAAeAAoAAAItjI+pG8APjZOTzgtqy7I3f1yehmQcFY4WKZbqByutmW4aHUd6vfcVbgudgpYCADs=)}.mce-visualblocks ul{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIAAALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybGuYnqUVSjvw26DzzXiqIDlVwAAOw==)}.mce-visualblocks ol{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIABALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybH6HHt0qourxC6CvzXieHyeWQAAOw==)}.mce-visualblocks dl{background-image:url(data:image/gif;base64,R0lGODlhDQAKAIABALu7u////yH5BAEAAAEALAAAAAANAAoAAAIXjI8GybEOnmOvUoWznTqeuEjNSCqeGRUAOw==)}.mce-visualblocks:not([dir=rtl]) address,.mce-visualblocks:not([dir=rtl]) article,.mce-visualblocks:not([dir=rtl]) aside,.mce-visualblocks:not([dir=rtl]) blockquote,.mce-visualblocks:not([dir=rtl]) div:not([data-mce-bogus]),.mce-visualblocks:not([dir=rtl]) dl,.mce-visualblocks:not([dir=rtl]) figcaption,.mce-visualblocks:not([dir=rtl]) figure,.mce-visualblocks:not([dir=rtl]) h1,.mce-visualblocks:not([dir=rtl]) h2,.mce-visualblocks:not([dir=rtl]) h3,.mce-visualblocks:not([dir=rtl]) h4,.mce-visualblocks:not([dir=rtl]) h5,.mce-visualblocks:not([dir=rtl]) h6,.mce-visualblocks:not([dir=rtl]) hgroup,.mce-visualblocks:not([dir=rtl]) ol,.mce-visualblocks:not([dir=rtl]) p,.mce-visualblocks:not([dir=rtl]) pre,.mce-visualblocks:not([dir=rtl]) section,.mce-visualblocks:not([dir=rtl]) ul{margin-left:3px}.mce-visualblocks[dir=rtl] address,.mce-visualblocks[dir=rtl] article,.mce-visualblocks[dir=rtl] aside,.mce-visualblocks[dir=rtl] blockquote,.mce-visualblocks[dir=rtl] div:not([data-mce-bogus]),.mce-visualblocks[dir=rtl] dl,.mce-visualblocks[dir=rtl] figcaption,.mce-visualblocks[dir=rtl] figure,.mce-visualblocks[dir=rtl] h1,.mce-visualblocks[dir=rtl] h2,.mce-visualblocks[dir=rtl] h3,.mce-visualblocks[dir=rtl] h4,.mce-visualblocks[dir=rtl] h5,.mce-visualblocks[dir=rtl] h6,.mce-visualblocks[dir=rtl] hgroup,.mce-visualblocks[dir=rtl] ol,.mce-visualblocks[dir=rtl] p,.mce-visualblocks[dir=rtl] pre,.mce-visualblocks[dir=rtl] section,.mce-visualblocks[dir=rtl] ul{background-position-x:right;margin-right:3px}.mce-nbsp,.mce-shy{background:#aaa}.mce-shy::after{content:'-'}body{font-family:sans-serif}table{border-collapse:collapse}
    `,
    /** 字体大小设置，暂不允许用户设置字体大小 */
    font_size_formats: `12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px`,
    /** 字体设置，暂不允许用户设置；此设置必须与 content_style 中 font-family 一致 */
    font_family_formats: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    /** 行高配置，暂不允许用户设置行高 */
    line_height_formats: `0.5 1 1.2 1.5 1.75 2 2.5 3 4 5`,
    /** 设置 formatselect 选项 */
    block_formats: `Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3;`,
    /** 不显示右键菜单 */
    // contextmenu: false,
    /** 撤销与重做缓存次数 */
    custom_undo_redo_levels: 20,
    /** 编辑器内部弹窗是否允许脱拽 */
    draggable_modal: false,
    /** 引入 autoresize 插件时，此属性失效 */
    width: mergedProps.value.width,
    /** 引入 autoresize 插件时，此属性失效 */
    height: mergedProps.value.height,
    placeholder: mergedProps.value.placeholder,
    object_resizing: 'img',
    /** 放过 span 内联事件 */
    extended_valid_elements: 'span[class|onclick],i[class]',
    // resize_img_proportional: true,
    //:============================================================:  tinymce 内部功能设置  :============================================================://

    //:============================================================:  tinymce 插件（plugin）  :============================================================://
    /** 插件配置，与上方引入插件一一对应 */
    plugins: pluginConfig.value.plugins,
    ...(pluginConfig.value.pluginOptions ? pluginConfig.value.pluginOptions : {}),
    //:============================================================:  tinymce 插件（plugin）  :============================================================://

    //:============================================================:  tinymce 顶部菜单栏（menubar）  :============================================================://
    menubar: menubarConfig.value.menubar,
    //:============================================================:  tinymce 顶部菜单栏（menubar）  :============================================================://

    //:============================================================:  tinymce 顶部工具栏（toolbar）  :============================================================://
    toolbar: toolbarConfig.value.toolbar,
    ...(toolbarConfig.value.toolbarOptions ? toolbarConfig.value.toolbarOptions : {}),
    //:============================================================:  tinymce 顶部工具栏（toolbar）  :============================================================://

    //:============================================================:  tinymce 底部状态栏（statusbar）  :============================================================://
    statusbar: statusbarConfig.value.statusbar,
    ...(statusbarConfig.value.statusbarOptions ? statusbarConfig.value.statusbarOptions : {}),
    //:============================================================:  tinymce 底部状态栏（statusbar）  :============================================================://

    setup(editor) {
      editorInstanceRef = editor

      createAlignsButton(editor)
      createListsButton(editor)
      createUploadimageButton(editor, handleCustomUploadimageButtonClick)
      // createUploadlinkButton(editor, handleCustomUploadlinkButtonClick)
      createUploadfileButton(editor, handleCustomUploadfileButtonClick)

      /** 监听编辑器事件 */
      editor.on('storedraft init blur click dblclick focus change keydown', (e) => {
        updateStatusbarStyle(e, editorMainElRef)
        // addStatusbarAutosaveTip(e, editorMainElRef)

        const content = editorInstanceRef?.getContent() ?? undefined
        e.target.value = content
        if (e.type === 'init') {
          registryOuterChannel(editor, handleViewBtnClick)
          registryInnerChannel(editor)
          emits('init', e)
        } else if (e.type === 'blur') {
          emits('blur', e)
        } else if (e.type === 'click') {
          emits('click', e)
        } else if (e.type === 'dblclick') {
          emits('dblclick', e)
        } else if (e.type === 'focus') {
          emits('focus', e)
        } else if (e.type === 'change') {
          emits('change', e)
        }
      })
    },
  }

  return options
})

// 预览处理
const previewVisible = ref(false)
const previewFile = ref<FileUploadApiResponseRecord>({ url: '', name: '', suffix: '' })
async function handleViewBtnClick(row: FileUploadApiResponseRecord) {
  const { url, name, suffix } = row
  if (row.url) {
    previewVisible.value = !previewVisible.value

    if (mergedProps.value.apiPreviewFile) {
      const options = previewFileApiOptions(row)
      if (!options) {
        return
      }

      await handleApi(options)
      if (!apiError.value) {
        previewFile.value = { ...previewFile.value, url, name, suffix }

        const supportWPS = !!apiResult.value.wps
        previewFile.value.previewSupportWPS = supportWPS
        if (supportWPS) {
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
            wpsAppId,
          } = apiResult.value

          const options = {
            officeType,
            fileId,
            appId: wpsAppId,
            token,
            suffix,
            fileName,
            ...(fileSize ? { fileSize } : {}),
            ...(createByName ? { userName: createByName } : {}),
            ...(createTime ? { time: `${new Date(createTime).getTime()}` } : {}),
            watermarker: watermark,
            /** 前端自定义参数 from: 'desktop'|'mobile'，用来区分 pc/小程序 */
            from: 'desktop',
          }

          const params = [] as string[]
          for (const [k, v] of Object.entries(options)) {
            params.push(`${k}=${v}`)
          }

          previewFile.value.previewUrl = `${pageUrl}/wps-file-view/?${encodeURIComponent(
            params.join('&').replace(' ', '%20').replace('+', '%2B')
          )}`
        } else {
          previewFile.value.previewUrl = apiResult.value.onlineUrl
        }
      } else {
        return
      }
    } else {
      previewFile.value = { ...previewFile.value, url, name, suffix }
      return row
    }
  }
}

const editorCustomUploadimageModalRef = ref<EditorCustomUploadimageModalInstance>()
const editorCustomUploadimageModalVisible = ref(false)
function handleCustomUploadimageButtonClick() {
  editorCustomUploadimageModalVisible.value = true
  editorInstanceRef?.focus() // 清空按钮选中状态
}
function handleEditorCustomUploadimageModalClose(...args: any[]) {
  const uploadimageModalTabsValue = args[0] as Record<string, any>
  for (const [, v] of Object.entries(uploadimageModalTabsValue)) {
    if (v && v[0] && v[0].url) {
      v.forEach((uploadedImage: FileUploadApiResponseRecord & { [key: string]: any }) => {
        editorInstanceRef?.undoManager?.transact?.(() =>
          editorInstanceRef?.insertContent(
            `<p><span class="file file-image" data-uploadvarsjson='${uploadedImage.uploadVarsJson}'><img class="file-content file-image__content" src="${uploadedImage.url}" width="${uploadedImage.originalWidth}" height="${uploadedImage.originalHeight}" /></span></p>`
          )
        )
      })

      editorInstanceRef?.insertContent('<p></p>')
      // editorInstanceRef?.selection.setCursorLocation()
      editorInstanceRef?.nodeChanged()
    }
  }

  setTimeout(() => {
    editorInstanceRef?.focus() // 等待 modal 关闭后 focus
  }, 300)
}

// const editorCustomUploadlinkModalRef = ref<EditorCustomUploadlinkModalInstance>()
// const editorCustomUploadlinkModalVisible = ref(false)
// function handleCustomUploadlinkButtonClick() {
//   editorCustomUploadlinkModalVisible.value = true
//   editorInstanceRef?.focus()
// }
// function handleEditorCustomUploadlinkModalClose(...args: any[]) {
//   const uploadlinkModalValue = args[0] as Record<string, any>
//   if (uploadlinkModalValue.url) {
//     editorInstanceRef?.undoManager?.transact?.(() =>
//       editorInstanceRef?.insertContent(
//         `<a href="${uploadlinkModalValue.url}" ${
//           uploadlinkModalValue.urlLocation === '0' ? `target="_blank" rel="noopener"` : ''
//         }>${uploadlinkModalValue.title ?? uploadlinkModalValue.url}</a>`
//       )
//     )
//     // editorInstanceRef?.selection.setCursorLocation()
//     editorInstanceRef?.nodeChanged()
//   }

//   setTimeout(() => {
//     editorInstanceRef?.focus()
//   }, 300)
// }

const editorCustomUploadfileModalRef = ref<EditorCustomUploadfileModalInstance>()
const editorCustomUploadfileModalVisible = ref(false)
function handleCustomUploadfileButtonClick() {
  editorCustomUploadfileModalVisible.value = true
  editorInstanceRef?.focus() // 清空按钮选中状态
}
function handleEditorCustomUploadfileModalClose(...args: any[]) {
  const uploadfileModalTabsValue = args[0] as Record<string, any>
  for (const [, v] of Object.entries(uploadfileModalTabsValue)) {
    if (v && v[0] && v[0].url) {
      v.forEach((uploadedFile: FileUploadApiResponseRecord & { [key: string]: any }) => {
        const { name, suffix, url } = uploadedFile
        editorInstanceRef?.undoManager?.transact?.(() =>
          editorInstanceRef?.insertContent(
            // 点击下载
            // `<span class="file file-office" data-uploadvarsjson='${uploadedFile.uploadVarsJson}' title="${uploadedFile.name}" onclick="async function handleDownload() { const response = await fetch('${uploadedFile.url}'); if (!response.ok) { return; } const blob = await response.blob(); const dataUrl = await window.URL.createObjectURL(blob); const aEl = document.createElement('a'); aEl.href = dataUrl; aEl.download = '${uploadedFile.name}'; aEl.click(); window.URL.revokeObjectURL(dataUrl); aEl.remove();} handleDownload();"><i class="file-icon file-icon--${uploadedFile.suffix}"></i><span class="file-content">${uploadedFile.name}</span></span>`

            // 点击预览
            `<p><span class="file file-office" data-uploadvarsjson='${
              uploadedFile.uploadVarsJson
            }' data-previewjson='${JSON.stringify({ name, suffix, url })}' title="${
              uploadedFile.name
            }"><i class="file-icon file-office__icon file-icon--${
              uploadedFile.suffix
            }"></i><span class="file-content file-office__content">${
              uploadedFile.name
            }</span></span></p>`
          )
        )
      })

      editorInstanceRef?.insertContent('<p></p>')
      // editorInstanceRef?.selection.setCursorLocation()
      editorInstanceRef?.nodeChanged()
    }
  }

  setTimeout(() => {
    editorInstanceRef?.focus() // 等待 modal 关闭后 focus
  }, 300)
}

async function setup() {
  await tinymce.init({})
}

function cleanup() {
  tinymce.remove()
}

onBeforeMount(() => {
  handleI18n(tinymce)
})

onMounted(async () => {
  await setup()
})

onBeforeUnmount(() => {
  cleanup()
})

defineExpose({})
</script>

<template>
  <section :id="`${DEFAULT_EDITOR_ID}_wrapper`" :class="`${DEFAULT_EDITOR_CLASSNAME}-wrapper`">
    <!-- <section :class="`${DEFAULT_EDITOR_CLASSNAME}-header`"></section> -->

    <section ref="editorMainElRef" :class="`${DEFAULT_EDITOR_CLASSNAME}-main`">
      <Editor
        :id="mergedProps.id || DEFAULT_EDITOR_ID"
        v-model="editorValue"
        :init="editorOptions"
        :readonly="mergedProps.readonly"
      />
      <TaEditorCustomUploadimageModal
        ref="editorCustomUploadimageModalRef"
        v-model:visible="editorCustomUploadimageModalVisible"
        @close="handleEditorCustomUploadimageModalClose"
      />
      <!-- <TaEditorCustomUploadlinkModal
        ref="editorCustomUploadlinkModalRef"
        v-model:visible="editorCustomUploadlinkModalVisible"
        @close="handleEditorCustomUploadlinkModalClose"
      /> -->
      <TaEditorCustomUploadfileModal
        ref="editorCustomUploadfileModalRef"
        v-model:visible="editorCustomUploadfileModalVisible"
        @close="handleEditorCustomUploadfileModalClose"
      />
    </section>

    <!-- <section :class="`${DEFAULT_EDITOR_CLASSNAME}-footer`"></section> -->

    <TaFileUploadPreview v-model:visible="previewVisible" :file="previewFile" />
  </section>
</template>
