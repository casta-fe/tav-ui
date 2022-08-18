import { computed, nextTick, ref, watch } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { isFunction } from '@tav-ui/utils'
import type { Ref } from 'vue'
import type { FormActionType } from '../../form'
import type { BasicPropsType, FileItemType, Fn, ProvideDataType, Recordable } from './types'

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
  private _relationBusinessId = false
  private _useFakeDelete = false
  private _controlInOuter = false

  /**
   * newest typeCode
   */
  private _typeCode = ref<string>()
  private _isLoading = ref(false)
  private _dataSource = ref<FileItemType[]>([])
  public currentTypeCodeIsHyperlink = ref(false)
  private _paramsName: string | undefined
  private _paramsAddress: string | undefined

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
    const apis = {
      queryFile: (this._provide.value?.queryFile ??
        this._props.queryFile) as ProvideDataType['queryFile'],
      removeFile: (this._provide.value?.removeFile ??
        this._props.removeFile) as ProvideDataType['removeFile'],
      uploadFile: (this._provide.value?.uploadFile ??
        this._props.uploadFile) as ProvideDataType['uploadFile'],
      updateFile: (this._provide.value?.updateFile ??
        this._props.updateFile) as ProvideDataType['updateFile'],
      uploadHyperlink: (this._provide.value?.uploadHyperlink ??
        this._props.uploadHyperlink) as ProvideDataType['uploadHyperlink'],
      download: (this._provide.value?.download ??
        this._props.download) as ProvideDataType['download'],
      updateFileNameAndAddress: (this._provide.value?.updateFileNameAndAddress ??
        this._props.updateFileNameAndAddress) as ProvideDataType['updateFileNameAndAddress'],
    }

    if (
      !(
        isFunction(apis.queryFile) &&
        // 当使用 useFakeDelete 时不需要传removeFile
        (this._useFakeDelete ? true : isFunction(apis.removeFile)) &&
        isFunction(apis.uploadFile) &&
        isFunction(apis.uploadHyperlink)
      )
    ) {
      throw new Error(
        '<queryFile, uploadFile, uploadHyperlink,typeCodeRecord, [removeFile]> 必须在TaUpload挂载前从app.vue注入, 或者传入同名props'
      )
    }

    return apis
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
      () => this._props.relationBusinessId,
      (val) => {
        this._relationBusinessId = val
      },
      {
        immediate: true,
      }
    )

    // 掉接口删除?
    watch(
      () => this._props.useFakeDelete,
      (val) => {
        this._useFakeDelete = val
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

    // 一些请求的参数
    watch(
      () => [
        this._props.params.id,
        this._props.params.endTime,
        this._props.params.typeCode,
        this._props.params.startTime,
        this._props.params.businessKey,
        this._props.params.searchValue,
      ],
      (
        [idVal, endTimeVal, typeCodeVal, startTimeVal, businessKeyVal, searchValueVal],
        [idPrev, endTimePrev, typeCodePrev, startTimePrev, businessKeyPrev, searchValuePrev]
      ) => {
        idVal !== idPrev && (this._params.id = idVal as number | undefined)

        endTimeVal !== endTimePrev && (this._params.endTime = endTimeVal as string | undefined)

        typeCodeVal !== typeCodePrev && (this._typeCode.value = typeCodeVal as string | undefined)

        startTimeVal !== startTimePrev &&
          (this._params.startTime = startTimeVal as string | undefined)

        businessKeyVal !== businessKeyPrev &&
          (this._params.businessKey = businessKeyVal as string | undefined)

        searchValueVal !== searchValuePrev &&
          (this._params.searchValue = searchValueVal as string | undefined)
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
  private throwResponse(newRecord: Recordable[]): void {
    this.emit('update:fileActualIds', this.getFileActualIds())
    this.emit('change', newRecord, this._uploadResponse)
  }
  /**
   * 更新一条数据
   * @param {Recordable} record
   * @memberof Handler
   **/
  updateItem = (record: FileItemType) => {
    const { actualId } = record
    // this._uploadResponse.length = 0
    const index = this._uploadResponse.findIndex((el) => el.actualId === actualId)
    this._uploadResponse.splice(index, 1, record)
    this.fillDataSource()
    console.log(this._uploadResponse)
  }
  /**
   * 删除一条数据
   * @param record 需要删除的文件信息
  /**
   *
   *
   * @param {Recordable} record
   * @memberof Handler
   */
  deleteItem = (record: Recordable) => {
    const { actualId } = record
    const index = this._uploadResponse.findIndex((el) => el.actualId === actualId)
    const newRecord = this._uploadResponse[index]

    const spliceData = () => {
      this._uploadResponse.splice(index, 1)
      this.fillDataSource()
      this.throwResponse([newRecord])
    }

    this._isLoading.value = true
    if (this._useFakeDelete) {
      spliceData()
      // 用户体验拉满😏
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

      this.throwResponse(response.data.result)
    }
    this.fillDataSource()
  }

  /**
   * 在弹窗关闭时调用
   */
  clearResponse(): void {
    this._uploadResponse = []
    this.fillDataSource()
    this._typeCode.value = this._props.params.typeCode
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
      if (!this._relationBusinessId && ['businessId', 'businessKey'].includes(k)) continue
      if (!this._params[k]) continue
      this._params[k] != undefined && formData.append(k, this._params[k])
    }
    // fillFormData end

    this._isLoading.value = true
    this.apis.uploadFile!(formData)
      .then(({ data: r }) => {
        this._uploadResponse.unshift(...r)
        this.throwResponse(r)
        nextTick(() => this.fillDataSource())
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
    if (!this._relationBusinessId) {
      Reflect.deleteProperty(payload, 'businessId')
      Reflect.deleteProperty(payload, 'businessKey')
    }
    this._isLoading.value = true
    this.apis.uploadHyperlink!(payload)
      .then(({ data: r }) => {
        this._uploadResponse.unshift(r)
        this.throwResponse([r])
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
