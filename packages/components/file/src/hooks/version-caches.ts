import { type FileActionUploadApiResponseRecord, type FileMode } from '../typings'
import { type Keys } from '../utils'

export type FileVersionStrategy = 'latest' | 'all'
export type FileVersionCache = FileActionUploadApiResponseRecord
export interface FileVersionCaches {
  actualId?: FileVersionCache[]
}

// // 调用 updatefile 接口返回数据 version 为 0
// version === 0
// // 数据已被业务消费
// businessId || businessKey

/**
 * 编辑/立即更新模式需要向后端提供双向绑定的 fileactualids
 *
 * 1. 编辑模式数据结构：(为了后端管理文件版本)
 * [{
 *    actualId: '',
 *    moduleCode: '',
 *    versionList: [{
 *      ...file
 *    }]
 * }]
 *
 * 2. 立即更新模式数据结构：
 * [file.actualId]
 *
 * 其中当组件进入编辑/立即更新模式后，数据初始化完成先组建数据结构：
 * [{ actualId: '' }]
 * 编辑模式下，当用户进入行编辑前/打开version弹窗前/点击更新按钮前，请求 filehistorylist 将数据维护至 versionlist 中此时打开 version 弹窗直接从缓存取数据即可
 *
 * 3. 缓存载入的时机是在编辑/立即更新模式下 queryfile/queryfilelist，后端返回的数据中每条数据为 verions:1 接口返回后调用 createAllFileCaches
 *
 * 4. 文件版本列表数据载入的时机是在编辑/立即更新模式下第一次点击该行中版本/更新按钮会请求 querfilehstory 将其载入缓存，详情查看 filetable.vue 中的 beforeReadFileCaches
 *
 * 5. 删除该行文件数据缓存的时机是在编辑/立即更新模式下点击删除按钮后触发，调用 deleteFileCaches
 */
export class VersionCaches {
  static controller: VersionCaches
  static getInstance() {
    if (!this.controller) {
      this.controller = new VersionCaches()
    }
    return this.controller
  }

  private filterCacheKeys: string[] = ['__id']

  constructor(
    // public strategy: FileVersionStrategy = 'latest',
    public caches: { [key: string]: FileVersionCache[] | undefined } = {},
    /** 控制版本个数只增一次 */
    public actualidCaches: Set<string> = new Set<string>()
  ) {}

  createAllFileCaches(files: FileActionUploadApiResponseRecord[], mode?: FileMode) {
    if (mode === 'update' || mode === 'updateInstantly') {
      files.forEach((_file) => {
        const file = this.serialize(_file)
        this.caches[file.actualId!] = [file]
      })
    }
  }

  createFileCaches(
    _file: FileActionUploadApiResponseRecord,
    _histories: FileActionUploadApiResponseRecord[]
  ) {
    const file = this.serialize(_file)
    const histories = this.serialize(_histories)
    histories.pop() // 最后一条数据即当前行数据，已经在初始化时放入缓存所以这里不需要
    this.caches[file.actualId!] = [
      ...histories.map((history) => this.buildCache(history)),
      ...(this.caches[file.actualId!] || [file]),
    ]
    return this.caches[file.actualId!]
  }

  /**
   * 这里需要注意的是编辑模式下更新文件（接口返回的数据）版本只加一次
   * 立即更新模式下不论是本地上传还是接口返回的文件数据每次更新版本都会加一次
   * @param updatedFile
   * @returns
   */
  createFileCache(updatedFile: FileActionUploadApiResponseRecord, mode?: FileMode) {
    const file = this.serialize(updatedFile)
    if (mode !== 'updateInstantly' && this.actualidCaches.has(file.actualId!)) {
      this.updateFileCaches(updatedFile)
      return
    }

    this.actualidCaches.add(file.actualId!)
    this.updateFileCacheVersion(file)
  }

  readFileCaches(actualId: string) {
    return this.caches[actualId]
  }

  /** 按照后端要求的数据结构返回 */
  getCaches() {
    return Object.keys(this.caches).map((k) => ({
      actualId: k,
      moduleCode: this.caches[k]![0].moduleCode,
      versionList: this.caches[k]!,
    }))
  }

  updateFileCaches(updatedFile: FileActionUploadApiResponseRecord) {
    const fileCaches = this.readFileCaches(updatedFile.actualId!)
    if (!fileCaches) return

    const latestVersionFileCache = this.readFileCacheLatestVersion(updatedFile.actualId!)
    if (!latestVersionFileCache) return

    this.caches[updatedFile.actualId!]!.pop()
    this.caches[updatedFile.actualId!] = [
      ...this.caches[updatedFile.actualId!]!,
      { ...updatedFile, version: latestVersionFileCache.version },
    ]
  }

  /**
   * 文件删除成功后删除该文件的缓存
   * @param actualId
   * @returns
   */
  deleteFileCaches(actualId: string) {
    const fileCaches = this.readFileCaches(actualId)
    if (!fileCaches) return

    this.actualidCaches.delete(actualId)
    Reflect.deleteProperty(this.caches, actualId)
  }

  /**
   * 清空所有缓存
   */
  deleteAllFileCaches() {
    this.actualidCaches.clear()
    this.caches = {}
  }

  /**
   * 后端返回的 history 数组中的数据按照版本号由小到大排列
   * 最后一条数据即最新版本
   * @param actualId
   * @returns
   */
  readFileCacheLatestVersion(actualId: string) {
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
    const latestVersionFileCache = this.readFileCacheLatestVersion(updatedFile.actualId!)
    if (!latestVersionFileCache) return

    const cacheFile = this.buildCache(updatedFile)
    if (this.caches[updatedFile.actualId!]) {
      cacheFile.version = latestVersionFileCache.version + 1
      this.caches[updatedFile.actualId!] = [...this.caches[updatedFile.actualId!]!, cacheFile]
    } else {
      this.caches[updatedFile.actualId!] = [cacheFile]
    }
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
      if (!this.filterCacheKeys.includes(k) && !_cache[k]) {
        _cache[k] = file[k as unknown as Keys<keyof FileActionUploadApiResponseRecord>]
      }
      return _cache
    }, {} as any) as unknown as FileVersionCache
    return cache
  }

  serialize<T>(data: T) {
    return JSON.parse(JSON.stringify(data)) as T
  }
}

export const VersionCachesController = VersionCaches.getInstance()
