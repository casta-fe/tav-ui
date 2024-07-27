import { type FileActionUploadProps } from '../components/FileActionUpload/types'

// 文件名是否通过空白字符校验
export function validateUploadFileEmptyName(name: string) {
  if (!name || !name.trim() || !name.includes('.')) return false

  const fileName = name.split('.')[0]
  return fileName && fileName.trim() !== '' ? true : false
}

// 文件名是否通过非法字符校验
export function validateUploadFileName(
  name: string,
  nameRegExp: FileActionUploadProps['nameRegExp']
) {
  return !nameRegExp.test(name) ? true : false
}

// 文件是否通过类型校验
export function validateUploadFileExt(name: string, accept: FileActionUploadProps['accept']) {
  const exts = accept.split(',')
  return exts.some((ext) => name.endsWith(ext)) ? true : false
}

// 文件是否通过大小校验
export function validateUploadFileSize(file: any, sizeRange: FileActionUploadProps['sizeRange']) {
  const [minSize, maxSize] = sizeRange

  let minSizeValidateResult = true
  let maxSizeValidateResult = true

  if (minSize) {
    if (file.size >= minSize) {
      minSizeValidateResult = true
    } else {
      minSizeValidateResult = false
    }
  }

  if (maxSize) {
    if (file.size <= maxSize) {
      maxSizeValidateResult = true
    } else {
      maxSizeValidateResult = false
    }
  }

  return minSizeValidateResult && maxSizeValidateResult ? true : false
}

// 文件是否通过最大数量校验
export function validateUploadFileMaxCount(
  fileCount: number,
  maxCount: FileActionUploadProps['maxCount']
) {
  return fileCount <= maxCount ? true : false
}

// 上传时 typecode 校验
export function validateUploadFileTypeCode(
  typeCode: FileActionUploadProps['apiParams']['typeCode']
) {
  return typeCode ? true : false
}
