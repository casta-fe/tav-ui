import { computed, nextTick, ref, watch } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { isFunction } from '@tav-ui/utils'
import { useFileFormatter } from './hooks'
import type { Ref } from 'vue'
import type { FormActionType } from '../../form'
import type {
  BasicPropsType,
  ChangeType,
  FileItemType,
  Fn,
  ProvideDataType,
  Recordable,
} from './types'

// global variable beginRegion
const { createMessage } = useMessage()
// global variable endRegion

class Handler {
  private emit: Fn

  private _hyperlinkFormMethods: Partial<FormActionType> = {}

  private _props!: BasicPropsType

  private _provide = computed<undefined | ProvideDataType>(
    () => (useGlobalConfig('components') as Ref<Record<string, any>>).value?.TaUpload
  )

  private set props(v: BasicPropsType) {
    this._props = v

    const { params, /* maxSize */ controlInOuter } = v

    // this._fileMaxSize = maxSize;
    this._controlInOuter = controlInOuter
    this._typeCode.value = params.typeCode
    watch(
      () => this._props.uploadResponse,
      (v) => {
        this.uploadResponse = v

        if (!this._props.showTable) return
        this.throwResponse(v!, 'init')
      },
      {
        immediate: true,
      }
    )

    // 千万不要干扰🙏
    for (const key in params) {
      this._params[key] = params[key]
    }
  }

  private _params: BasicPropsType['params'] = {}
  private _showTable = true
  // private _fileMaxSize;
  private _refFileList: File[] = []
  private _uploadResponse: FileItemType[] = []
  private _refFileListPushEnd = false
  private _immediate = false
  private _controlInOuter = false
  private _fileFormatter = useFileFormatter()

  /**
   * newest typeCode
   */
  private _typeCode = ref<string>()
  private _isLoading = ref(false)
  private _dataSource = ref<FileItemType[]>([])
  public currentTypeCodeIsHyperlink = ref(false)
  private _paramsName: string | undefined
  private _paramsAddress: string | undefined
  private _apis: ProvideDataType = {}
  public currentUpload = null as null | Promise<any> | FileItemType[]

  //// getter begin
  get dataSource() {
    return this._dataSource
  }
  get typeCode() {
    return this._typeCode
  }
  get loading() {
    return this._isLoading
  }

  get typeCodeRecord() {
    return this._props.typeCodeRecord ?? this._provide.value?.typeCodeRecord ?? {}
  }

  get apis() {
    if (!this._apis.queryFile) {
      const apis: Partial<ProvideDataType> = {
        queryFile: (this._props.queryFile ??
          this._provide.value?.queryFile) as ProvideDataType['queryFile'],
        removeFile: (this._props.removeFile ??
          this._provide.value?.removeFile) as ProvideDataType['removeFile'],
        uploadFile: (this._props.uploadFile ??
          this._provide.value?.uploadFile) as ProvideDataType['uploadFile'],
        updateFile: (this._props.updateFile ??
          this._provide.value?.updateFile) as ProvideDataType['updateFile'],
        uploadHyperlink: (this._props.uploadHyperlink ??
          this._provide.value?.uploadHyperlink) as ProvideDataType['uploadHyperlink'],
        download: (this._props.download ??
          this._provide.value?.download) as ProvideDataType['download'],
        updateFileNameAndAddress: (this._props.updateFileNameAndAddress ??
          this._provide.value
            ?.updateFileNameAndAddress) as ProvideDataType['updateFileNameAndAddress'],
        updateFileType: (this._props.updateFileType ??
          this._provide.value?.updateFileType) as ProvideDataType['updateFileType'],
        queryFileType: (this._props.queryFileType ??
          this._provide.value?.queryFileType) as ProvideDataType['queryFileType'],
      }
      for (const key in apis) {
        this._apis[key] =
          apis[key] && isFunction(apis[key])
            ? (...args: any[]) => apis[key](...args, this._props.AppId)
            : undefined
      }
      if (
        !(isFunction(apis.queryFile) &&
        // 当使用 false === immediate 时不需要传removeFile
        (this._immediate ? isFunction(apis.removeFile) : true) &&
        isFunction(apis.uploadFile) &&
        (this._props.showUploadHyperlinkBtn === 'unset' ||
          false === this._props.showUploadHyperlinkBtn)
          ? true
          : isFunction(apis.uploadHyperlink))
      ) {
        throw new Error(
          '<queryFile, uploadFile, uploadHyperlink,typeCodeRecord, [removeFile]> 必须在TaUpload挂载前从app.vue注入, 或者传入同名props'
        )
      }
    }
    return this._apis
  }

  get getFileFormatter() {
    return this._fileFormatter
  }

  //// getter end

  //// setter begin
  public set paramsName(v: string) {
    this._paramsName = v
  }
  public set paramsAddress(v: string) {
    this._paramsAddress = v
  }

  public set uploadResponse(v: FileItemType[] | undefined) {
    this._uploadResponse = v ?? []
    this.fillDataSource()
  }

  //// setter begin

  /**
   * 构造函数.
   * @param props BasicPropsType
   */
  constructor(props: BasicPropsType, instanceEmit) {
    this.emit = instanceEmit
    this.props = props

    // 动态控制默认的表格显示与否
    watch(
      () => this._props.showTable,
      (val) => {
        this._showTable = val
      },
      {
        immediate: true,
      }
    )

    // 动态控制上传同时携带businessId
    watch(
      () => this._props.immediate,
      (val) => {
        this._immediate = val
      },
      {
        immediate: true,
      }
    )

    // 用businessId控制回填与清空
    watch(
      () => this._props.params.businessId,
      (val) => {
        this._params.businessId = val
        // 外部控制 -> 不请求,不自动清除
        if (this._controlInOuter) return
        if (undefined === val) {
          this.clearResponse()
          return
        }
        // 传入文件列表 -> 不请求
        if (this._props.uploadResponse) return
        this.backfill()
      },
      {
        immediate: true,
      }
    )

    // 用 businessKey 控制回填与清空
    watch(
      () => this._props.params.businessKey,
      (val) => {
        this._params.businessKey = val
        // 外部控制 -> 不请求,不自动清除
        if (this._controlInOuter) return
        if (undefined === val) {
          this.clearResponse()
          return
        }
        // 传入文件列表 -> 不请求
        if (this._props.uploadResponse) return
        this.backfill()
      },
      {
        immediate: true,
      }
    )

    // 一些请求的参数
    watch(
      () =>
        [
          this._props.params.id,
          this._props.params.endTime,
          this._props.params.typeCode,
          this._props.params.startTime,
          this._props.params.moduleCode,
          this._props.params.businessKey,
          this._props.params.searchValue,
        ] as const,
      (
        [
          idVal,
          endTimeVal,
          typeCodeVal,
          startTimeVal,
          moduleCodeVal,
          businessKeyVal,
          searchValueVal,
        ],
        [
          idPrev,
          endTimePrev,
          typeCodePrev,
          startTimePrev,
          moduleCodePrev,
          businessKeyPrev,
          searchValuePrev,
        ]
      ) => {
        idVal !== idPrev && (this._params.id = idVal)

        endTimeVal !== endTimePrev && (this._params.endTime = endTimeVal)

        typeCodeVal !== typeCodePrev && (this._typeCode.value = typeCodeVal)

        startTimeVal !== startTimePrev && (this._params.startTime = startTimeVal)

        businessKeyVal !== businessKeyPrev && (this._params.businessKey = businessKeyVal)

        moduleCodeVal !== moduleCodePrev && (this._params.moduleCode = moduleCodeVal)

        searchValueVal !== searchValuePrev && (this._params.searchValue = searchValueVal)
      }
    )
  }

  /**
   * 如多个文件正在上传或上传列表(变量)已清空 -> 不发请求
   */
  private isInvalidRequest = () => this._refFileListPushEnd || this._refFileList.length === 0
  /**
   * 提取文件真实id
   */
  private getFileActualIds = () => this._uploadResponse.map((el) => el.actualId)

  /**
   * 返回编辑后的文件列表数据格式
   * ```js
   * [
   *    {
   *        moduleCode: "...",
   *        versionList: [
   *          file1,...
   *        ]
   *    }
   * ]
   * ```
   * @returns
   */
  getResult = () => this._fileFormatter.formatToApi(this._uploadResponse)

  getPropsOrProvide<T extends keyof BasicPropsType>(propName: T): BasicPropsType[T] {
    // @ts-ignore
    return this._props[propName] ?? this._provide.value?.[propName]
  }

  /**
   * 将列表数据填到表格上
   */
  fillDataSource = () => {
    if (!this._showTable) {
      return
    }
    this._dataSource.value = []
    this._dataSource.value.push(...this._uploadResponse)
    // this._dataSource.value = !this._typeCode.value
    //   ? this._uploadResponse
    //   : this._uploadResponse.filter((a) => a.typeCode == this._typeCode.value);
  }

  /**
   * 请求文件列表成功和上传成功时触发
   * @param newRecord 新上传成功的文件
   */
  private throwResponse(newRecord: Recordable[], type: ChangeType): void {
    this.emit(
      'update:fileActualIds',
      !this._props.immediate && (this._params.businessId || this._params.businessKey)
        ? this.getResult()
        : this.getFileActualIds()
    )
    this.emit('change', newRecord, this._uploadResponse, type)
  }
  /**
   * 更新一条数据
   * @param {Recordable} record
   * @memberof Handler
   **/
  updateItem = (record: FileItemType, oldFileActualIds: string) => {
    // const { actualId } = record
    const index = this._uploadResponse.findIndex((el) => el.actualId === oldFileActualIds)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const oldRecord = this._uploadResponse.splice(index, 1, record)[0]
    // this._fileFormatter.upadteVersion(oldRecord)
    this._fileFormatter.upadteVersion(record)
    this.fillDataSource()
    this.throwResponse([{ ...record, version: oldRecord.version + 1 }], 'update')
  }
  /**
   * 删除一条数据
   * @param {Recordable} record 需要删除的文件信息
   * @memberof Handler
   */
  deleteItem = (record: Recordable) => {
    const { actualId } = record
    const index = this._uploadResponse.findIndex((el) => el.actualId === actualId)
    const newRecord = this._uploadResponse[index]

    const spliceData = () => {
      this._uploadResponse.splice(index, 1)
      this.fillDataSource()
      this.throwResponse([newRecord], 'delete')
    }

    this._isLoading.value = true
    if (!this._immediate) {
      spliceData()
      setTimeout(() => {
        this._isLoading.value = false
      }, 300)
      return
    }
    this.apis.removeFile!(actualId)
      .then(() => {
        spliceData()
      })
      .catch(() => {
        createMessage.warn('删除失败!')
      })
      .finally(() => (this._isLoading.value = false))
  }

  // 根据params请求数据
  async backfill() {
    if (!this._showTable) return

    if (this._params.businessId || this._params.businessKey) {
      // 回填||切换select 清空
      this.clearResponse()
      this._isLoading.value = true

      const response = await this.apis.queryFile!({
        filter: {
          ...this._params,
          typeCode: undefined, // 本地切换类型
        },
        model: {
          page: 1,
          limit: 50,
        },
      }).finally(() => (this._isLoading.value = false))
      this._uploadResponse.push(...response.data.result)
      this._fileFormatter.formatToApi(this._uploadResponse)

      this.throwResponse(response.data.result, 'init')
    }
    this.fillDataSource()
  }

  /**
   * 在弹窗关闭时调用
   */
  clearResponse(): void {
    this.uploadResponse = []
    this._props.params.typeCode && (this._typeCode.value = this._props.params.typeCode)
    this.throwResponse([], 'delete')
  }

  /**
   * 多个文件依次push到文件列表(变量)
   * @param file 一个文件
   */
  beforeUpload = (file: File) => {
    this._refFileList.push(file)
  }

  /**
   * 将多个文件组合在一起发送上传请求
   */
  customRequest = () => {
    if (this.isInvalidRequest()) return
    const sizeOverflowFiles = this._refFileList.filter((file) => file.size / 1024 / 1024 > 1024)
    if (sizeOverflowFiles.length > 0) {
      createMessage.warn(
        `文件过大: ${sizeOverflowFiles
          .map((file) => `${file.name}:${Math.floor(file.size / 1024 / 1024)}MB`)
          .join()}大于1GB`
      )
      this.resetFileList()
      return
    }
    if (
      this._props.maxCount &&
      this._uploadResponse.length + this._refFileList.length > this._props.maxCount
    ) {
      createMessage.warn(`文件最多上传 ${this._props.maxCount}个`)
      this.resetFileList()
      return
    }
    this._refFileListPushEnd = true
    this.realUpload()
  }

  private resetFileList = () => {
    this._refFileList = []
    this._refFileListPushEnd = false
    this._isLoading.value = false
  }

  /**
   * 真正的上传请求
   */
  private realUpload = () => {
    // 非更新时候 typecode必传
    if (!this._typeCode.value) {
      createMessage.warn('请选择文件类型')
      this.resetFileList()
      return
    }

    // fillFormData begin
    const formData = new FormData()
    this._refFileList.forEach((el) => {
      formData.append('files', el)
    })
    this._params.typeCode = this._typeCode.value
    // 将参数塞到formData里面去
    for (const k in this._params) {
      if (!this._immediate && ['businessId', 'businessKey'].includes(k)) continue
      if (!this._params[k]) continue
      this._params[k] != undefined && formData.append(k, this._params[k])
    }
    // fillFormData end

    this._isLoading.value = true
    this.currentUpload = this.apis.uploadFile!(formData)
      .then(({ data: r }) => {
        this._uploadResponse.unshift(...r)
        this.throwResponse(r, 'upload')
        nextTick(() => this.fillDataSource())
        r.forEach((el) => {
          this._fileFormatter.upadteVersion(el)
        })

        createMessage.success('上传成功')
      })
      .catch(() => {
        // createMessage.error("上传失败");
      })
      .finally(() => {
        this.resetFileList()
      })
  }

  hyperlinkFormRegister = (methods: Partial<FormActionType>) => {
    this._hyperlinkFormMethods = methods
  }

  /**
   * 超链接上传
   */
  hyperlinkUpload() {
    if (!this._typeCode.value) {
      createMessage.warn('请选择文件类型')
      this.resetFileList()
      return
    }
    const payload = {
      ...this._params,
      typeCode: this._typeCode.value,
      name: this._paramsName,
      address: this._paramsAddress,
    }
    if (!this._immediate) {
      Reflect.deleteProperty(payload, 'businessId')
      Reflect.deleteProperty(payload, 'businessKey')
    }
    this._isLoading.value = true
    this.apis.uploadHyperlink!(payload)
      .then(({ data: r }) => {
        this._uploadResponse.unshift(r)
        this._fileFormatter.upadteVersion(r)
        this.throwResponse([r], 'upload')
        nextTick(() => this.fillDataSource())
        createMessage.success('上传成功')
      })
      .catch(() => {
        // createMessage.error("上传失败");
      })
      .finally(() => {
        this._hyperlinkFormMethods.resetFields?.()
        this._isLoading.value = false
      })
  }

  preOpenChooseFile = (e: MouseEvent) => {
    if (!this._typeCode.value) {
      createMessage.warn('请先选择文件类型')
      e.stopPropagation()
    }
  }
}

export { Handler }
