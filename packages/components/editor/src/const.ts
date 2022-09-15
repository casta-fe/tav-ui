import { buildUUID } from '@tav-ui/utils/uuid'

export const APP_KEY = 'ujavidp2edwb216e9acz3cyngh7ie97dipu0h16ja354dbpv'
export const ComponentName = 'TaEditor'
export const ComponentEmptyName = `${ComponentName}Empty`

/**
 * 示例：TaTablePro => ta-table-pro
 * @param name
 * @returns
 */
export function CamelCaseToCls(name: string) {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .slice(1)
}

export function buildComponentId() {
  const uuid = buildUUID()
  return `${ComponentName}-${uuid}`
}

// Any plugins you want to setting has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/
// colorpicker/contextmenu/textcolor plugin is now built in to the core editor, please remove it from your editor configuration

export const plugins = [
  'advlist anchor autolink autosave code codesample directionality fullscreen hr insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus template textpattern visualblocks visualchars wordcount image',
]

export const toolbar = [
  'fontsizeselect lineheight searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample hr bullist numlist link preview anchor pagebreak insertdatetime image media forecolor backcolor fullscreen',
]

export const events = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid',
]
