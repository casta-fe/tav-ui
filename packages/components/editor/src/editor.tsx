/* eslint-disable import/order */
import tinymce from 'tinymce/tinymce'
/** 常用 */
// 高级文本列表插件
import 'tinymce/plugins/advlist'
// 锚点插件
import 'tinymce/plugins/anchor'
// 自动创建超链接插件
import 'tinymce/plugins/autolink'
// 自动保存插件，存入ls，带恢复草稿功能
import 'tinymce/plugins/autosave'
// 设置展示的方向
import 'tinymce/plugins/directionality'
// 全屏插件
import 'tinymce/plugins/fullscreen'
// 水平分割线
import 'tinymce/plugins/hr'
// 插入当前日期时间
import 'tinymce/plugins/insertdatetime'
// 插入图片
import 'tinymce/plugins/image'
// 插入/编辑超链接
import 'tinymce/plugins/link'
// 有序列表和无序列表
import 'tinymce/plugins/lists'
// nonbreaking 插入不间断空格
import 'tinymce/plugins/nonbreaking'
// 不可编辑元素
import 'tinymce/plugins/noneditable'
// 插入分页符
import 'tinymce/plugins/pagebreak'
// 处理直接从word粘贴来的内容
import 'tinymce/plugins/paste'
// 预览
import 'tinymce/plugins/preview'
// 保存
import 'tinymce/plugins/save'
// 查询&替换
import 'tinymce/plugins/searchreplace'
// tab切入/切出tinymce
import 'tinymce/plugins/tabfocus'
// 创建内置模版
import 'tinymce/plugins/template'
// 字数统计
import 'tinymce/plugins/wordcount'
/** 不常用 */
// 表格插件
import 'tinymce/plugins/table'
// 插入html代码
import 'tinymce/plugins/code'
// 代码高亮
import 'tinymce/plugins/codesample'
// 插入编辑媒体插入H5的audio和video标签
import 'tinymce/plugins/media'
// 打印编辑区内容
import 'tinymce/plugins/print'
// 单词拼写检查
import 'tinymce/plugins/spellchecker'
// 快速排版工具，可以内置快捷键类似markdown
import 'tinymce/plugins/textpattern'
// 显示块元素范围
import 'tinymce/plugins/visualblocks'
// 显示不可见字符
import 'tinymce/plugins/visualchars'
// 主题
import 'tinymce/themes/silver'
// 皮肤样式
import 'tinymce/skins/content/default/content.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/ui/oxide/skin.min.css'
// 图表
import { onMountedOrActivated } from '@tav-ui/hooks/core/onMountedOrActivated'
import { onUnmountedOrDeactivated } from '@tav-ui/hooks/core/onUnmountedOrDeactivated'
import { isNumber } from '@tav-ui/utils/is'
import type { Editor, RawEditorSettings } from 'tinymce'
import 'tinymce/icons/default/icons'
import { computed, defineComponent, nextTick, reactive, ref, unref, watch } from 'vue'
import { CamelCaseToCls, ComponentName, buildComponentId, events } from './const'
import { handleI18n } from './i18n'
import { editorProps } from './types'

interface IState {
  id: string
  fullscreen: boolean
}

const ComponentPrefixCls = CamelCaseToCls(ComponentName)
const ComponentId = buildComponentId()
handleI18n(tinymce)

export default defineComponent({
  name: ComponentName,
  inheritAttrs: false,
  props: editorProps,
  emits: ['change', 'update:modelValue', 'inited', 'init-error'],
  setup(props, { emit, attrs }) {
    const wrapperRef = ref<HTMLElement | null>(null)
    const editorRef = ref<HTMLElement | null>(null)
    const editorInstance = ref<Editor | null>(null)
    const state = reactive<IState>({
      id: ComponentId,
      fullscreen: false,
    })

    // // 皮肤
    // const skin = computed(() => {
    //   return props.theme === 'light' ? 'oxide' : 'oxide-dark'
    // })

    // 语言
    const lang = computed(() => {
      return ['zh_CN', 'en'].includes(props.lang) ? props.lang : 'zh_CN'
    })

    // // 是否只读
    // const disabled = computed(() => {
    //   const { options } = props
    //   const getdDisabled = options && Reflect.get(options, 'readonly')
    //   const editor = unref(editorInstance)
    //   if (editor) {
    //     editor.setMode(getdDisabled ? 'readonly' : 'design')
    //   }
    //   return getdDisabled ?? false
    // })

    watch(
      () => attrs.disabled,
      () => {
        const editor = unref(editorInstance)
        if (!editor) {
          return
        }
        editor.setMode(attrs.disabled ? 'readonly' : 'design')
      }
    )

    // 初始化属性设置
    const initOptions = computed<RawEditorSettings>(() => {
      const { height, options, toolbar, plugins } = props

      return {
        selector: `#${state.id}`,
        height,
        toolbar,
        plugins,
        menubar: 'file edit insert view format table',
        branding: false,
        default_link_target: '_blank',
        link_title: false,
        object_resizing: false,
        auto_focus: true,
        language: unref(lang),
        images_upload_url: 'postAcceptor.php',
        images_upload_handler(blobInfo, success, failure) {
          setTimeout(() => {
            console.log(blobInfo, success, failure)
          }, 2000)
        },
        ...options,
        setup(editor: Editor) {
          editorInstance.value = editor
          editor.on('init', (e) => initSetup(e))
        },
      }
    })

    // 初始化 ediotr
    const initEditor = () => {
      const el = unref(editorRef)
      if (el) {
        el.style.visibility = ''
      }

      tinymce
        .init(unref(initOptions))
        .then((editor) => {
          emit('inited', editor)
        })
        .catch((err) => {
          emit('init-error', err)
        })
    }

    // 绑定 model
    const bindModelHandlers = (editor: any) => {
      const modelEvents = attrs.modelEvents ? attrs.modelEvents : null
      const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents
      const setValue = (editor: Record<string, any>, val: string, prevVal?: string) => {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val)
        }
      }

      watch(
        () => props.modelValue,
        (val: string, prevVal: string) => {
          setValue(editor, val, prevVal)
        }
      )

      watch(
        () => props.value,
        (val: string, prevVal: string) => {
          setValue(editor, val, prevVal)
        },
        {
          immediate: true,
        }
      )

      editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
        const content = editor.getContent({ format: attrs.outputFormat })
        emit('update:modelValue', content)
        emit('change', content)
      })

      editor.on('FullscreenStateChanged', (e) => {
        state.fullscreen = e.state
      })
    }

    // 绑定事件
    const bindHandlers = (initEvent: Event, listeners: any, editor: any): void => {
      const isValidKey = (key: string) => events.indexOf(key) !== -1
      Object.keys(listeners)
        .filter(isValidKey)
        .forEach((key: string) => {
          const handler = listeners[key]
          if (typeof handler === 'function') {
            if (key === 'onInit') {
              handler(initEvent, editor)
            } else {
              editor.on(key.substring(2), (e: any) => handler(e, editor))
            }
          }
        })
    }

    // 初始化处理
    const initSetup = (e) => {
      const editor = unref(editorInstance)
      if (!editor) {
        return
      }
      const value = props.modelValue || ''

      editor.setContent(value)
      bindModelHandlers(editor)
      bindHandlers(e, attrs, unref(editorInstance))
    }

    // wrapper 类名处理
    const getWrapperClass = computed(() => {
      return [`${ComponentPrefixCls}-wrapper`]
    })
    // wrapper 样式
    const getWrapperStyle = computed(() => {
      const getWidth = () => {
        const width = props.width
        if (isNumber(width)) {
          return `${width}px`
        }
        return width
      }

      return {
        width: getWidth(),
      }
    })

    // editor 类名处理
    const getClass = computed(() => {
      return [`${ComponentPrefixCls}`]
    })
    // editor 样式
    const getStyle = computed<any>(() => {
      return {
        visibility: 'hidden',
      }
    })

    // 销毁处理
    const destory = () => {
      if (tinymce) {
        tinymce.remove(unref(initOptions).selector!)
      }
    }

    onMountedOrActivated(() => {
      if (!unref(initOptions).inline) {
        state.id = ComponentId
      }
      nextTick(() => {
        setTimeout(() => {
          initEditor()
        }, 300)
      })
    })

    onUnmountedOrDeactivated(() => {
      destory()
    })

    return () => {
      return (
        <div ref={wrapperRef} class={unref(getWrapperClass)} style={unref(getWrapperStyle)}>
          {unref(initOptions).inline ? (
            <div>Not support.</div>
          ) : (
            <textarea
              ref={editorRef}
              id={state.id}
              class={unref(getClass)}
              style={unref(getStyle)}
            />
          )}
        </div>
      )
    }
  },
})
