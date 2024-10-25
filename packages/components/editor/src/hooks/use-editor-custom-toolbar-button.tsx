import { type ComputedRef } from 'vue'
import { type Editor, type EditorProps } from '../typings'

export function useEditorCustomToolbarButton(options: { mergedProps: ComputedRef<EditorProps> }) {
  const { mergedProps } = options

  function createListsButton(editor: Editor) {
    editor.ui.registry.addMenuButton('lists', {
      // text: "列表",
      icon: 'toc',
      tooltip: '列表',
      fetch: (callback) => {
        callback([
          {
            type: 'menuitem',
            icon: 'ordered-list',
            text: '有序列表',
            onAction: () =>
              editor.execCommand('InsertOrderedList', false, {
                'list-style-type': 'decimal',
              }),
          },
          {
            type: 'menuitem',
            icon: 'unordered-list',
            text: '无序列表',
            onAction: () =>
              editor.execCommand('InsertUnorderedList', false, {
                'list-style-type': 'disc',
              }),
          },
        ])
      },
    })
  }

  function createAlignsButton(editor: Editor) {
    editor.ui.registry.addMenuButton('aligns', {
      // text: "对齐方式",
      icon: 'align-left',
      tooltip: '对齐方式',
      fetch: (callback) => {
        callback([
          {
            type: 'menuitem',
            icon: 'align-left',
            text: '左对齐',
            onAction: () => editor.execCommand('JustifyLeft'),
          },
          {
            type: 'menuitem',
            icon: 'align-center',
            text: '居中对齐',
            onAction: () => editor.execCommand('JustifyCenter'),
          },
          {
            type: 'menuitem',
            icon: 'align-right',
            text: '右对齐',
            onAction: () => editor.execCommand('JustifyRight'),
          },
          {
            type: 'menuitem',
            icon: 'align-justify',
            text: '俩端对齐',
            onAction: () => editor.execCommand('JustifyFull'),
          },
        ])
      },
    })
  }

  function createUploadimageButton(editor: Editor, handleClick?: (...args: any[]) => any) {
    editor.ui.registry.addButton('uploadimage', {
      // text: '上传图片',
      icon: 'image',
      tooltip: '插入图片',
      ...(handleClick
        ? {
            onAction: handleClick,
          }
        : {
            onAction: (...args: any[]) => {
              console.log('🚀 ~ createUploadimageButton ~ args:', args)
            },
          }),
    })
  }

  function createUploadlinkButton(editor: Editor, handleClick?: (...args: any[]) => any) {
    editor.ui.registry.addButton('uploadlink', {
      // text: '上传链接',
      icon: 'link',
      tooltip: '插入链接',
      ...(handleClick
        ? {
            onAction: handleClick,
          }
        : {
            onAction: (...args: any[]) => {
              console.log('🚀 ~ createUploadlinkButton ~ args:', args)
            },
          }),
    })
  }

  function createUploadfileButton(editor: Editor, handleClick?: (...args: any[]) => any) {
    editor.ui.registry.addButton('uploadfile', {
      // text: '上传链接',
      icon: 'new-document',
      tooltip: '插入附件',
      ...(handleClick
        ? {
            onAction: handleClick,
          }
        : {
            onAction: (...args: any[]) => {
              console.log('🚀 ~ createUploadfileButton ~ args:', args)
            },
          }),
    })
  }

  return {
    createListsButton,
    createAlignsButton,
    createUploadimageButton,
    createUploadlinkButton,
    createUploadfileButton,
  }
}
