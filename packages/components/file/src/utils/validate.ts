import { isArray, isObject } from '@tav-ui/utils/is'
import { type ApiParams, type FileInjectedProps } from '../typings'
import { type FileType } from '../components/FileActionUpload/types'

// 文件名是否通过空白字符校验
export function validateUploadFileEmptyName(name: string) {
  if (!name || !name.trim() || !name.includes('.')) return false

  const fileName = name.split('.')[0]
  return fileName && fileName.trim() !== '' ? true : false
}

// 文件名是否通过非法字符校验
export function validateUploadFileName(name: string, nameRegExp: FileInjectedProps['nameRegExp']) {
  return !nameRegExp.test(name) ? true : false
}

// 文件是否通过大小校验
export function validateUploadFileSize(file: FileType, sizeRange: FileInjectedProps['sizeRange']) {
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
  maxCount: FileInjectedProps['maxCount']
) {
  return fileCount <= maxCount ? true : false
}

// 上传时 typecodes 校验
export function validateUploadFileTypeCodes(typeCodes: ApiParams['typeCodes']) {
  return typeCodes && typeCodes.length > 0 ? true : false
}

// 校验参数
export function validateApiParams(options: {
  apiName: string
  params: Record<string, any>
  validateEmptyArray?: boolean
  validateEmptyObject?: boolean
}) {
  const { apiName, params, validateEmptyArray, validateEmptyObject } = options
  const errors: string[] = []

  for (const [k, v] of Object.entries(params)) {
    if (!v) {
      if (validateEmptyArray && isArray(v) && v.length === 0) {
        errors.push(`${k} ([])`)
      }
      if (validateEmptyObject && isObject(v) && Object.keys(v).length === 0) {
        errors.push(`${k} ({})`)
      }
      errors.push(k)
    }
  }

  return errors.length === 0 ? null : `${apiName} params: ${errors.join('、')} not pass validate.`
}
