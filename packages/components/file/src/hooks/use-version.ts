import { type FileActionUploadApiResponseRecord } from '../typings'
import { type Keys } from '../utils'

export function useVersion(versionCalculateStrategy: 'latest' | 'all' = 'latest') {
  let versionCache: Partial<Record<string, FileActionUploadApiResponseRecord[]>> = {}

  function updateVersionCache(file: FileActionUploadApiResponseRecord) {
    // const file = JSON.parse(JSON.stringify(_file)) as unknown as FileActionUploadApiResponseRecord

    const existFile = versionCache[file.actualId!]?.find((el) => el.id === file.id)

    if (existFile) {
      /**
       * 文件名更新 || 超链接更新
       */
      if (existFile.name !== file.name || existFile.address !== file.address) {
        /**
         * ```ts
         * [v1File, v2File] as const
         * ```
         */
        const fileArr = versionCache[existFile.actualId!]

        if (fileArr) {
          const lastIndex = fileArr.length - 1

          fileArr[lastIndex] = file
        }
      }
      return
    }

    if (versionCalculateStrategy === 'latest') {
      if (versionCache[file.actualId!]) {
        if (
          file.version === 0 &&
          getVersionFileByActualId(file.actualId!)!.version === 1 &&
          !(
            getVersionFileByActualId(file.actualId!)!.businessId ||
            getVersionFileByActualId(file.actualId!)!.businessKey
          )
        ) {
          file.version = 1
        } else {
          file.version = versionCache[file.actualId!]![0].version + 1
        }
        versionCache[file.actualId!]![1] = file
      } else {
        versionCache[file.actualId!] = [file]
      }

      return
    }

    if (versionCache[file.actualId!]) {
      // 维护文件唯一性
      if (versionCache[file.actualId!]?.some((el) => file.id === el.id)) return

      versionCache[file.actualId!]!.push(file)
    } else {
      versionCache[file.actualId!] = [file]
    }
  }

  function cleanVersionCache() {
    versionCache = {}
  }

  function applyVersionCacheToDataSource(files: FileActionUploadApiResponseRecord[]) {
    const currentFileActualIdsSet = new Set<string>()

    for (const file of files) {
      updateVersionCache(file)

      currentFileActualIdsSet.add(file.actualId!)
    }

    for (const actualId in versionCache) {
      // 有删除操作时
      currentFileActualIdsSet.has(actualId) || Reflect.deleteProperty(versionCache, actualId)
    }

    return Object.keys(versionCache).map((k) => ({
      actualId: k,
      moduleCode: versionCache[k]![0].moduleCode,
      versionList: [versionCache[k]![1] || versionCache[k]![0]],
    }))
  }

  /**
   * @param actualId
   * @returns
   */
  function getVersionFilesByActualId(actualId: string) {
    return versionCache[actualId]
  }

  /**
   * 初始化时的文件
   * @param actualId
   * @returns
   */
  function getVersionFileByActualId(actualId: string) {
    return getVersionFilesByActualId(actualId)?.[0]
  }

  /**
   * 最后一次点击更新后的文件
   * @param actualId
   * @returns
   */
  function getLatestVersionFileByActualId(actualId: string) {
    return getVersionFilesByActualId(actualId)?.[1]
  }

  return {
    updateVersionCache,
    cleanVersionCache,
    applyVersionCacheToDataSource,
    getVersionFilesByActualId,
    getVersionFileByActualId,
    getLatestVersionFileByActualId,
  }
}

export type FileVersionStrategy = 'latest' | 'all'
export interface FileVersionCache {
  id: number
  name: string
  address: string
  typeCode: string
  version: number
  bizConsumed: boolean
}
export interface FileVersionCaches {
  actualId?: FileVersionCache[]
}

export class VersionCaches {
  static controller: VersionCaches
  static getInstance() {
    if (!this.controller) {
      this.controller = new VersionCaches()
    }
    return this.controller
  }

  private cacheKeys: string[] = [
    'id',
    'actualId',
    'name',
    'address',
    'typeCode',
    'version',
    // bizConsumed => businessId || businessKey 为 true 数据只做了上传并未被业务消费
    'bizConsumed',
  ]

  constructor(
    // public strategy: FileVersionStrategy = 'latest',
    public caches: { [key: string]: FileVersionCache[] | undefined } = {}
  ) {}

  /**
   * 表格行编辑前、version 列弹窗出现前、update 按钮点击前
   * 需要将该行（file）数据的 history 数据存入缓存，并返回
   * @param _row
   * @param _histories
   */
  createFileCaches(
    _file: FileActionUploadApiResponseRecord,
    _histories: FileActionUploadApiResponseRecord[]
  ) {
    if (!this.isCachesEmpty()) {
      const fileCaches = this.readFileCaches(_file.actualId!)
      if (fileCaches) return fileCaches
    }

    const file = this.serialize(_file)
    const histories = this.serialize(_histories)
    this.caches[file.actualId!] = histories.map((history) => this.buildCache(history))
    return this.caches[file.actualId!]
  }

  /**
   * 行编辑成功后、update 按钮请求成功后将返回的数据进行缓存
   * @param updatedFile
   * @returns
   */
  createFileCache(updatedFile: FileActionUploadApiResponseRecord) {
    const file = this.serialize(updatedFile)
    this.updateFileCacheVersion(file)
  }

  readFileCaches(actualId: string) {
    return this.caches[actualId]
  }

  updateFileCaches(_file: FileActionUploadApiResponseRecord) {
    const fileCaches = this.readFileCaches(_file.actualId!)
    if (!fileCaches) return

    const file = this.serialize(_file)
  }

  /**
   * 文件删除成功后删除该文件的缓存
   * @param actualId
   * @returns
   */
  deleteFileCaches(actualId: string) {
    const fileCaches = this.readFileCaches(actualId)
    if (!fileCaches) return

    this.caches[actualId] = undefined
  }

  /**
   * 清空所有缓存
   */
  deleteAllFileCaches() {
    this.caches = {}
  }

  /**
   * 后端返回的 history 数组中的数据按照版本号由小到大排列
   * 最后一条数据即最新版本
   * @param actualId
   * @returns
   */
  readFileCachesLatestVersion(actualId: string) {
    const fileCaches = this.readFileCaches(actualId)
    if (!fileCaches) return

    return fileCaches.at(-1)
  }

  /**
   * 更新缓存中的版本号
   * @param updatedFile
   * @returns
   */
  updateFileCacheVersion(updatedFile: FileActionUploadApiResponseRecord) {
    const latestVersionFile = this.readFileCachesLatestVersion(updatedFile.actualId!)
    if (!latestVersionFile) return

    const cacheFile = this.buildCache(updatedFile)
    if (this.caches[updatedFile.actualId!]) {
      if (
        // 调用 updatefile 接口返回数据 version 为 0
        updatedFile.version === 0 &&
        // 文件上传组件传递给接口处理后 version 为 1
        latestVersionFile.version === 1 &&
        !latestVersionFile.bizConsumed
      ) {
        /**
         * 1. 如果当前数据为 updatefile 接口返回
         * 2. 缓存中版本最大的数据为接口返回
         * 3. 缓存中版本最大的数据未被业务消费
         */
        cacheFile.version = 1
      } else {
        cacheFile.version = latestVersionFile.version + 1
      }
      this.caches[updatedFile.actualId!] = [...this.caches[updatedFile.actualId!]!, cacheFile]
    } else {
      this.caches[updatedFile.actualId!] = [cacheFile]
    }

    // TODO: 更新表格version列中的版本号
  }

  /**
   * 表格行编辑前、version 列弹窗出现前、update 按钮点击前需要先判断缓存是否为空
   * 如果为空则请求该文件的 filehistory 进行缓存
   * 如果不为空则什么都不做
   * @returns
   */
  isCachesEmpty() {
    return !this.caches || Object.keys(this.caches).length === 0
  }

  /**
   * 保留缓存需要的属性
   * @param file
   * @returns
   */
  buildCache(file: FileActionUploadApiResponseRecord) {
    const cache = Object.keys(file).reduce((_cache: any, k: string) => {
      if (this.cacheKeys.includes(k) && !_cache[k]) {
        _cache[k] = file[k as unknown as Keys<keyof FileActionUploadApiResponseRecord>]
      }
      return cache
    }, {} as any) as unknown as FileVersionCache
    cache['bizConsumed'] = !!(file.businessId || file.businessKey)
    return cache
  }

  serialize<T>(data: T) {
    return JSON.parse(JSON.stringify(data)) as T
  }
}

export const VersionCachesController = VersionCaches.getInstance()
