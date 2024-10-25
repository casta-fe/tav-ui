import { type ComputedRef, type Ref, computed } from 'vue'
import { type EditorProps } from '../typings'

export function useEditorStatusbar(options: { mergedProps: ComputedRef<EditorProps> }) {
  const { mergedProps } = options

  /** see: https://www.tiny.cloud/docs/tinymce/5/statusbar-configuration-options/ */
  const statusbarConfig = computed(() => {
    return {
      statusbar: true,
      statusbarOptions: {
        /** 左下角元素路径是否显示 */
        elementpath: false,
        /** 编辑器宽高是否可变，false|true|'both' */
        resize: 'both' as any,
      },
    }
  })

  function updateStatusbarStyle(e: any, editorMainElRef: Ref<HTMLDivElement | undefined>) {
    if (e.type === 'init') {
      const statusBarEl = editorMainElRef.value?.querySelector('.tox-statusbar') as
        | HTMLDivElement
        | undefined
        | null

      if (statusBarEl) {
        statusBarEl.style.position = 'absolute'
        statusBarEl.style.bottom = '0'
        statusBarEl.style.right = '0'
        statusBarEl.style.display = 'inline-block'
        statusBarEl.style.width = '20px'
        statusBarEl.style.height = '20px'
        statusBarEl.style.backgroundColor = 'transparent'
        statusBarEl.style.borderTop = 'none'
      }

      const statusBarResizeEl = statusBarEl?.querySelector('.tox-statusbar__resize-handle') as
        | HTMLDivElement
        | undefined
        | null

      if (statusBarResizeEl) {
        statusBarResizeEl.style.position = 'absolute'
        statusBarResizeEl.style.top = '50%'
        statusBarResizeEl.style.right = '50%'
        statusBarResizeEl.style.transform = 'translate(-50%, -50%)'
        statusBarResizeEl.style.padding = '0'
      }
    }
  }

  function addStatusbarAutosaveTip(e: any, editorMainElRef: Ref<HTMLDivElement | undefined>) {
    if (e.type === 'init') {
      const statusBarEl = editorMainElRef.value?.querySelector('.tox-statusbar')
      if (statusBarEl) {
        statusBarEl.insertAdjacentHTML(
          'afterbegin',
          `<div title="自动保存提示" data-alloy-tabstop="true" tabindex="-1" class="tox-statusbar__custom-autosave-tip"></div>`
        )
      }
    } else if (e.type === 'storedraft') {
      const statusBarAutosaveTipEl = editorMainElRef.value?.querySelector(
        '.tox-statusbar__custom-autosave-tip'
      )
      if (statusBarAutosaveTipEl) {
        statusBarAutosaveTipEl.innerHTML = `${new Date(
          Date.UTC(2012, 11, 12, 3, 0, 0)
        ).toLocaleString()} 自动保存成功!`
      }
    }
  }

  return {
    statusbarConfig,
    updateStatusbarStyle,
    addStatusbarAutosaveTip,
  }
}
