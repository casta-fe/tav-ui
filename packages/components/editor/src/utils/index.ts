import { type FileUploadImagePropResponse } from '../typings'

export * from './i18n'

/**
 * 将文件 url 中的占位符转为具体的值
 * @param content
 * @param vars
 * @returns
 */
export function replaceFileUrlVarsToValue(content: string, vars?: FileUploadImagePropResponse) {
  if (vars && vars.key && vars.keyProp && vars.urlPrefix && vars.urlPrefixProp) {
    return (
      content
        //@ts-ignore
        .replaceAll(`\${${vars.keyProp}}`, vars.key)
        //@ts-ignore
        .replaceAll(`\${${vars.urlPrefixProp}}`, vars.urlPrefix)
    )
  }

  return content
}

/**
 * 将文件 url 中的具体的值转为占位符
 * @param content
 * @param vars
 * @returns
 */
export function replaceFileUrlValueToVars(content: string, vars?: FileUploadImagePropResponse) {
  if (vars && vars.key && vars.keyProp && vars.urlPrefix && vars.urlPrefixProp) {
    return (
      content
        //@ts-ignore
        .replaceAll(vars.key, `\${${vars.keyProp}}`)
        //@ts-ignore
        .replaceAll(vars.urlPrefix, `\${${vars.urlPrefixProp}}`)
    )
  }

  return content
}

/**
 * 更新文件 url 中的具体的值
 * @param content
 * @param vars
 * @returns
 */
export function refreshUploadVars(
  content: string,
  curvars: FileUploadImagePropResponse,
  prevars: FileUploadImagePropResponse
) {
  if (
    curvars.key &&
    curvars.keyProp &&
    curvars.urlPrefix &&
    curvars.urlPrefixProp &&
    prevars.key &&
    prevars.keyProp &&
    prevars.urlPrefix &&
    prevars.urlPrefixProp
  ) {
    return (
      content
        //@ts-ignore
        .replaceAll(prevars.key, curvars.key)
        //@ts-ignore
        .replaceAll(prevars.urlPrefix, curvars.urlPrefix)
    )
  }

  return content
}

/**
 * 更新富文本内容区的媒体资源 dom data-* 信息，并将文件 url 中的占位符转为具体的值
 * 一般用于需要回显富文本内容的操作如：编辑
 * @param content
 * @param vars
 * @returns
 */
export function replaceEditorMediaFileUrlVarsToValue(
  content: string,
  vars?: FileUploadImagePropResponse
) {
  if (vars && vars.key && vars.keyProp && vars.urlPrefix && vars.urlPrefixProp) {
    let _content = ''
    let el: HTMLDivElement | null = document.createElement('div')
    el.innerHTML = content
    const contentEl = el.querySelector('.ta-editor-content')
    if (contentEl) {
      el.innerHTML = contentEl.innerHTML
    }
    const medias = [
      ...Array.from(el.querySelectorAll('.file.file-image')),
      ...Array.from(el.querySelectorAll('.file.file-office')),
    ]
    medias.forEach((media: any) => {
      const uploadVars = JSON.parse(media.dataset.uploadvarsjson)
      media.outerHTML = refreshUploadVars(
        replaceFileUrlVarsToValue(media.outerHTML, uploadVars).replace(
          media.dataset.uploadvarsjson,
          JSON.stringify(vars)
        ),
        vars,
        uploadVars
      )
    })
    _content = el.innerHTML
    el = null

    return _content ?? content
  }
  return content
}

/**
 * 更新富文本内容区的媒体资源 dom data-* 信息，并将文件 url 中的具体的值转为占位符
 * 一般用于需要需要向后台提交的操作如：新增
 * @param content
 * @param vars
 * @returns
 */
export function replaceEditorMediaFileUrlValueToVars(
  content: string,
  vars?: FileUploadImagePropResponse
) {
  if (vars && vars.key && vars.keyProp && vars.urlPrefix && vars.urlPrefixProp) {
    let _content = ''
    let el: HTMLDivElement | null = document.createElement('div')
    el.classList.add('ta-editor-content')
    el.innerHTML = content
    const medias = [
      ...Array.from(el.querySelectorAll('img.file-image')),
      ...Array.from(el.querySelectorAll('span.file-office')),
    ]
    medias.forEach((media: any) => {
      const uploadVars = JSON.parse(media.dataset.uploadvarsjson)
      media.outerHTML = replaceFileUrlValueToVars(media.outerHTML, uploadVars).replace(
        media.dataset.uploadvarsjson,
        JSON.stringify(vars)
      )
    })
    _content = el.outerHTML
    el = null

    return _content ?? content
  }
  return content
}
