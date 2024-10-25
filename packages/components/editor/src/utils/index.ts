import { type FileUploadImagePropResponse } from '../typings'

export * from './i18n'

/**
 * 将文件 url 中的占位符转为具体的值
 * @param content
 * @param vars
 * @returns
 */
export function replaceEditorUrlVarsToValue(content: string, vars?: FileUploadImagePropResponse) {
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
export function replaceEditorUrlValueToVars(content: string, vars?: FileUploadImagePropResponse) {
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
