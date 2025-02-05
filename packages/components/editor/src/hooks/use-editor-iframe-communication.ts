import { type ComputedRef } from 'vue'
import { type EditorProps } from '../typings'

export function useEditorIframeCommunication(options: { mergedProps: ComputedRef<EditorProps> }) {
  const { mergedProps } = options

  function registryOuterChannel(editor: any, callback: (...args: any[]) => any) {
    editor.contentWindow.addEventListener('message', (e: MessageEvent) => {
      const messageDataJson = e.data
      const { eventType, data } = JSON.parse(messageDataJson) ?? {}

      if (eventType === 'preview:file-office') {
        data && callback(data)
      }
    })
  }

  function registryInnerChannel(editor: any) {
    const scriptId = editor.dom.uniqueId()
    const scriptEl = editor.dom.create(
      'script',
      {
        id: scriptId,
        type: 'text/javascript',
      },
      `
        // utils
        function closest(el, selector) {
          const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
          while (el) {
            if (matchesSelector.call(el, selector)) {
              return el;
            } else {
              el = el.parentElement;
            }
          }
          return null;
        }
        
        // listen wrapper el click
        const editorContentEl = document.querySelector('.ta-editor-content')
        if (editorContentEl) {
          editorContentEl.addEventListener('click', (e) => {
            const targetEl = e.target
            handleFileOfficeClick(targetEl)
          })
        }

        function handleFileOfficeClick(targetEl) {
          const fileOfficeElClassnames = ['file-office', 'file-office__icon', 'file-office__content']
          if(targetEl && targetEl.className && fileOfficeElClassnames.some(cls => targetEl.className.includes(cls))) {
            const fileOfficeEl = closest(targetEl, '.file.file-office')
            if(fileOfficeEl) {
              const uploadvarsjson = fileOfficeEl.dataset.uploadvarsjson
              const previewjson = fileOfficeEl.dataset.previewjson
              if(previewjson) {
                const previewInfo = Object.assign(JSON.parse(previewjson), {uploadVarsJson: uploadvarsjson})
                previewInfo && window.postMessage(JSON.stringify({ eventType: 'preview:file-office', data: previewInfo }), window.location.origin)
              }
            }
          }
        }
      `
    )
    editor.getDoc().getElementsByTagName('head')[0].appendChild(scriptEl)
  }

  return {
    registryInnerChannel,
    registryOuterChannel,
  }
}
