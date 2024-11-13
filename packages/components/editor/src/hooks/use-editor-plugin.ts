import { type ComputedRef, computed, ref } from 'vue'
import sanitizeHtml from 'sanitize-html'
import { type UseRequestReturn } from '@tav-ui/components/file/src/hooks/use-request'
import { type EditorPluginImageUploadHandler, type EditorProps } from '../typings'
// import { type UseApiReturn } from './use-api'

// TODO: import katex for tinymce latex, see: https://stackoverflow.com/questions/76202508/how-to-add-a-custom-tinymce-plugin-with-vue3-nuxt-using-the-pluginmanager
// TODO: support markdown for tinymce, see: https://github.com/prathamVaidya/supercode-tinymce-plugin

export function useEditorPlugin(options: {
  mergedProps: ComputedRef<EditorProps>
  handleApi: UseRequestReturn['handleApi']
  apiResult: UseRequestReturn['result']
  // editorImageVars: Record<string, any>
  // uploadImageApiOptions: UseApiReturn['apiActions']['uploadImageApiOptions']
}) {
  const { mergedProps, handleApi, apiResult /*editorImageVars, uploadImageApiOptions*/ } = options

  /** 高级列表，see：https://www.tiny.cloud/docs/tinymce/5/advlist/ */
  const advlistPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/advlist'),
    name: 'advlist',
    options: {},
  }

  /** 锚点，see：https://www.tiny.cloud/docs/tinymce/5/anchor/ */
  const anchorPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/anchor'),
    name: 'anchor',
    options: {},
  }

  /** 自动链接，see：https://www.tiny.cloud/docs/tinymce/5/autolink/ */
  const autolinkPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/autolink'),
    name: 'autolink',
    options: {
      default_link_target: '_blank',
    },
  }

  /**
   * 编辑器高度自适应，see：https://www.tiny.cloud/docs/tinymce/5/autoresize/
   * 1. 引入此插件时，Init 里设置的 height 将失效
   */
  const autoresizePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/autoresize'),
    name: 'autoresize',
    options: {},
  }

  /** 自动存稿，see：https://www.tiny.cloud/docs/tinymce/5/autosave/ */
  const autosavePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/autosave'),
    name: 'autosave',
    options: {
      // autosave_restore_when_empty: true, // 如果为 true 打开/关闭 弹窗后会保留结果暂时的富文本编辑都是一次性的，暂时不开启
    },
  }

  /** 特殊字符，see：https://www.tiny.cloud/docs/tinymce/5/charmap/ */
  const charmapPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/charmap'),
    name: 'charmap',
    options: {},
  }

  /** 代码，see：https://www.tiny.cloud/docs/tinymce/5/code/ */
  const codePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/code'),
    name: 'code',
    options: {},
  }

  /** 代码示例，see：https://www.tiny.cloud/docs/tinymce/5/code/ */
  const codesamplePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/codesample'),
    name: 'codesample',
    options: {},
  }

  /** 文字方向，see：https://www.tiny.cloud/docs/tinymce/5/directionality/ */
  const directionalityPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/directionality'),
    name: 'directionality',
    options: {},
  }

  /** 表情，see：https://www.tiny.cloud/docs/tinymce/5/emoticons/ */
  const emoticonsPlugin: Record<string, any> = {
    setup: () => {
      // @ts-ignore
      import('tinymce/plugins/emoticons')
      // @ts-ignore
      import('tinymce/plugins/emoticons/js/emojis')
    },
    name: 'emoticons',
    options: {},
  }

  /** see：https://www.tiny.cloud/docs/tinymce/5/fullpage/ */
  const fullpagePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/fullpage'),
    name: 'fullpage',
    options: {},
  }

  /** 全屏，see：https://www.tiny.cloud/docs/tinymce/5/fullscreen/ */
  const fullscreenPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/fullscreen'),
    name: 'fullscreen',
    options: {},
  }

  /** 帮助，see：https://www.tiny.cloud/docs/tinymce/5/help/ */
  const helpPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/help'),
    name: 'help',
    options: {
      help_tabs: [
        'shortcuts',
        // "keyboardnav",
        // "plugins",
        // "versions"
      ],
    },
  }

  /** 分割线，see：https://www.tiny.cloud/docs/tinymce/5/hr/ */
  const hrPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/hr'),
    name: 'hr',
    options: {},
  }

  /** 图片，see：https://www.tiny.cloud/docs/tinymce/5/image/ */
  const imagePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/image'),
    name: 'image',
    options: {
      images_reuse_filename: true,
      images_upload_handler: (...args: any[]) =>
        editorPluginImageUploadHandler(
          mergedProps,
          handleApi,
          apiResult,
          // editorImageVars,
          // uploadImageApiOptions,
          args[0],
          args[1],
          args[2]
        ),
    },
  }
  /** 图片编辑，see：https://www.tiny.cloud/docs/tinymce/5/editimage/ */
  const imagetoolsPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/imagetools'),
    name: 'imagetools',
    options: {},
  }

  /** 导入 css，see：https://www.tiny.cloud/docs/tinymce/5/importcss/ */
  const importcssPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/importcss'),
    name: 'importcss',
    options: {},
  }

  /** 时间/日期，see：https://www.tiny.cloud/docs/tinymce/5/insertdatetime/ */
  const insertdatetimePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/insertdatetime'),
    name: 'insertdatetime',
    options: {},
  }

  /** 邮件模版标准 html 输出，see：https://www.tiny.cloud/docs/tinymce/5/legacyoutput/ */
  const legacyoutputPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/legacyoutput'),
    name: 'legacyoutput',
    options: {},
  }

  /** 超链接，see：https://www.tiny.cloud/docs/tinymce/5/link/ */
  const linkPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/link'),
    name: 'link',
    options: {
      default_link_target: '_blank',
    },
  }

  /** 列表，see：https://www.tiny.cloud/docs/tinymce/5/lists/ */
  const listsPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/lists'),
    name: 'lists',
    options: {},
  }

  /** 媒体，see：https://www.tiny.cloud/docs/tinymce/5/media/ */
  const mediaPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/media'),
    name: 'media',
    options: {},
  }

  /** 不间断空格，see：https://www.tiny.cloud/docs/tinymce/5/nonbreaking/ */
  const nonbreakingPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/nonbreaking'),
    name: 'nonbreaking',
    options: {},
  }

  /** 无法编辑控制，see：https://www.tiny.cloud/docs/tinymce/5/noneditable/ */
  const noneditablePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/noneditable'),
    name: 'noneditable',
    options: {},
  }

  /** 分页符，see：https://www.tiny.cloud/docs/tinymce/5/pagebreak/ */
  const pagebreakPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/pagebreak'),
    name: 'pagebreak',
    options: {},
  }

  /** 粘贴内容处理，see：https://www.tiny.cloud/docs/tinymce/5/paste/ */
  const pastePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/paste'),
    name: 'paste',
    options: {
      paste_block_drop: false,
      paste_filter_drop: false,
      // paste_as_text: true, // 如果只想保留文字需要开启
      paste_merge_formats: false,
      paste_preprocess: editorPluginPastePreprocessHandler,
    },
  }

  /** 预览，see：https://www.tiny.cloud/docs/tinymce/5/preview/ */
  const previewPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/preview'),
    name: 'preview',
    options: {},
  }

  /** 打印，see：https://www.tiny.cloud/docs/tinymce/5/print/ */
  const printPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/print'),
    name: 'print',
    options: {},
  }

  /** 快捷栏，see：https://www.tiny.cloud/docs/tinymce/5/quickbars/ */
  const quickbarsPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/quickbars'),
    name: 'quickbars',
    options: {
      quickbars_insert_toolbar: '',
      quickbars_selection_toolbar: 'formatselect bold italic | aligns blockquote',
      quickbars_image_toolbar: '', //TODO: ?
    },
  }

  /** 保存，see：https://www.tiny.cloud/docs/tinymce/5/save/ */
  const savePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/save'),
    name: 'save',
    options: {},
  }

  /** 查找/替换，see：https://www.tiny.cloud/docs/tinymce/5/searchreplace/ */
  const searchreplacePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/searchreplace'),
    name: 'searchreplace',
    options: {},
  }

  /**
   * 拼写检查，see：https://www.tiny.cloud/docs/tinymce/5/spellchecker/
   * 1. 暂不支持中文
   */
  const spellcheckerPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/spellchecker'),
    name: 'spellchecker',
    options: {},
  }

  /** 聚焦，see：https://www.tiny.cloud/docs/tinymce/5/tabfocus/ */
  const tabfocusPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/tabfocus'),
    name: 'tabfocus',
    options: {},
  }

  /** 表格，see：https://www.tiny.cloud/docs/tinymce/5/table/ */
  const tablePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/table'),
    name: 'table',
    options: {},
  }

  /** 模版，see：https://www.tiny.cloud/docs/tinymce/5/template/ */
  const templatePlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/template'),
    name: 'template',
    options: {},
  }

  /** md 支持，see：https://www.tiny.cloud/docs/tinymce/5/textpattern/ */
  const textpatternPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/textpattern'),
    name: 'textpattern',
    options: {},
  }

  /** 大纲，see：https://www.tiny.cloud/docs/tinymce/5/tableofcontents/ */
  const tocPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/toc'),
    name: 'toc',
    options: {},
  }

  /** 元素范围 see：https://www.tiny.cloud/docs/tinymce/5/visualblocks/ */
  const visualblocksPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/visualblocks'),
    name: 'visualblocks',
    options: {},
  }
  /** 可见字符，see：https://www.tiny.cloud/docs/tinymce/5/visualchars/ */
  const visualcharsPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/visualchars'),
    name: 'visualchars',
    options: {},
  }

  /** 字数统计，see：https://www.tiny.cloud/docs/tinymce/5/wordcount/ */
  const wordcountPlugin: Record<string, any> = {
    // @ts-ignore
    setup: () => import('tinymce/plugins/wordcount'),
    name: 'wordcount',
    options: {},
  }

  const plugins = [
    advlistPlugin,
    anchorPlugin,
    autolinkPlugin,
    autoresizePlugin,
    autosavePlugin,
    charmapPlugin,
    codePlugin,
    codesamplePlugin,
    directionalityPlugin,
    emoticonsPlugin,
    fullpagePlugin,
    fullscreenPlugin,
    helpPlugin,
    hrPlugin,
    imagePlugin,
    imagetoolsPlugin,
    importcssPlugin,
    insertdatetimePlugin,
    legacyoutputPlugin,
    linkPlugin,
    listsPlugin,
    mediaPlugin,
    nonbreakingPlugin,
    noneditablePlugin,
    pagebreakPlugin,
    pastePlugin,
    previewPlugin,
    printPlugin,
    quickbarsPlugin,
    savePlugin,
    searchreplacePlugin,
    spellcheckerPlugin,
    tabfocusPlugin,
    tablePlugin,
    templatePlugin,
    textpatternPlugin,
    tocPlugin,
    visualblocksPlugin,
    visualcharsPlugin,
    wordcountPlugin,
  ]

  const filterPluginNames = [
    'autoresize',
    'autosave',
    'charmap',
    'codesample',
    'emoticons',
    'fullpage',
    'help',
    'image',
    'imagetools',
    'importcss',
    'insertdatetime',
    'legacyoutput',
    'media',
    'print',
    'spellchecker',
    'tabfocus',
    'template',
    'toc',
    'wordcount',
  ]

  const usePlugins = plugins.filter((plugin) => !filterPluginNames.includes(plugin.name))

  const isLoaded = ref(false)
  function setupPlugins() {
    for (let i = 0; i < usePlugins.length; i++) {
      usePlugins[i].setup()
    }
    isLoaded.value = true
  }

  const pluginConfig = computed(() => {
    const imagePlugin = usePlugins.find((usePlugin) => usePlugin.name === 'image')
    if (imagePlugin) {
      imagePlugin.options = {
        ...imagePlugin.options,
        images_file_types: mergedProps.value.imageAccept,
      }
    }

    const imagetoolsPlugin = usePlugins.find((usePlugin) => usePlugin.name === 'imagetools')
    if (imagetoolsPlugin) {
      imagetoolsPlugin.options = {
        // ...imagetoolsPlugin.options,
        // ...(editorImageVars.urlPrefix
        //   ? {
        //       imagetools_cors_hosts: [
        //         'localhost.proxyman.io',
        //         editorImageVars.urlPrefix.split('//')[1],
        //       ],
        //       // imagetools_proxy: editorImageVars.urlPrefix,
        //     }
        //   : {}),
      }
    }

    const usePluginNames = usePlugins.map((usePlugin) => usePlugin.name).join(' ')
    const usePluginOptions = usePlugins.reduce((result, cur) => {
      if (cur.options && Object.keys(cur.options).length > 0) {
        result = {
          ...result,
          ...cur.options,
        }
      }
      return result
    }, {} as Record<string, any>)

    return {
      // plugins: isLoaded.value ? usePluginNames : undefined, // tinymce not support dynamic load plugin
      plugins: usePluginNames,
      pluginOptions: usePluginOptions,
    }
  })

  return {
    setupPlugins,
    pluginConfig,
  }
}

function editorPluginImageUploadHandler(
  mergedProps: ComputedRef<EditorProps>,
  handleApi: UseRequestReturn['handleApi'],
  apiResult: UseRequestReturn['result'],
  // editorImageVars: Record<string, any>,
  // uploadImageApiOptions: UseApiReturn['apiActions']['uploadImageApiOptions'],
  blobInfo: Parameters<EditorPluginImageUploadHandler>[0],
  success: Parameters<EditorPluginImageUploadHandler>[1],
  failure: Parameters<EditorPluginImageUploadHandler>[2]
): ReturnType<EditorPluginImageUploadHandler> {
  const file = blobInfo.blob() as unknown as File
  // const imageOptions = uploadImageApiOptions(mergedProps.value.apiParams, [file])
  const imageOptions = null
  if (!imageOptions) return
  // handleApi(imageOptions)
  //   .then(() => {
  //     const images = [...apiResult.value]
  //     const imageUrl = images[0].imageOriginUrl
  //       .replace(`\${${editorImageVars.urlPrefixProp}}`, editorImageVars.urlPrefix)
  //       .replace(`\${${editorImageVars.keyProp}}`, editorImageVars.key)

  //     success(imageUrl)
  //   })
  //   .catch((err: any) => {
  //     failure(err)
  //   })
}

function editorPluginPastePreprocessHandler(...args: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, pasteContentinfo] = args
  const result = sanitizeHtml(pasteContentinfo.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter(
      (at) => !['code', 'samp', 'ruby'].includes(at)
    ),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedTags.reduce((result, cur) => {
        if (cur === 'a') {
          result[cur] = ['href', 'name', 'target']
        } else {
          result[cur] = []
        }
        return result
      }, {} as any),
    },
    disallowedTagsMode: 'discard',
  })
  pasteContentinfo.content = result
}
