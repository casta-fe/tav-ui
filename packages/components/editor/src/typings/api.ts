export interface FileUploadImageResponseRecord {
  /** @description 等比压缩图 url */
  imageCompressUrl?: string
  /** @description 原图 url */
  imageOriginUrl?: string
  /** @description 缩略图 url */
  imageScaleUrl?: string
  originalWidth?: number
  originalHeight?: number

  alt?: string
}

export type FileUploadFileResponseRecord = string[]

export interface FileUploadImagePropResponse {
  /** @description 图片 key 的值 */
  key?: string
  /** @description 图片 key */
  keyProp?: string
  /** @description url 前缀值 */
  urlPrefix?: string
  /** @description url 前缀变量 key */
  urlPrefixProp?: string
}
