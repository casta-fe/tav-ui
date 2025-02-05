import { type FileActionUploadProps } from '../components/FileActionUpload/types'
import { type FileTableProps } from '../components/FileTable'
import {
  type FileActionUploadApiResponseRecord,
  type FileTypeSelectApiResponseRecord,
} from '../typings'

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

// 判断文件是本地(上传/自己造的dataSource)还是来源于接口
export function validateFileFromLocal(row?: FileActionUploadApiResponseRecord) {
  return row && !row.businessId && !row.businessKey
}

// 判断 versionlist 中数据是否有从接口来的数据
export function validateVersionCachesHasApiFile(cache?: FileActionUploadApiResponseRecord[]) {
  if (!cache) return

  return !!cache.find((c) => !validateFileFromLocal(c))
}

// 判断 versionlist 中数据是否有从本地上传的数据
export function validateVersionCachesHasLocalFile(cache?: FileActionUploadApiResponseRecord[]) {
  if (!cache) return

  return !!cache.find((c) => validateFileFromLocal(c))
}

// 判断 datasource 是否为 actualids 字符串数组
export function validateDataSourceIsStringArray(dataSource: FileTableProps['dataSource']) {
  return (
    dataSource && Array.isArray(dataSource) && dataSource[0] && typeof dataSource[0] === 'string'
  )
}

// 判断 datasource 是否为 actualids 对象数组
export function validateDataSourceIsObjectArray(
  dataSource: FileTableProps['dataSource'],
  key = 'versionList'
) {
  return (
    dataSource &&
    Array.isArray(dataSource) &&
    dataSource[0] &&
    typeof dataSource[0] !== 'string' &&
    Reflect.has(dataSource[0], key)
  )
}

// 判断 datasource 是否为 actualids 数据结构
export function validateDataSourceIsActualIdsData(
  dataSource: FileTableProps['dataSource'],
  key = 'versionList'
) {
  return (
    validateDataSourceIsStringArray(dataSource) || validateDataSourceIsObjectArray(dataSource, key)
  )
}
