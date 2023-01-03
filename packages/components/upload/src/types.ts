import type { Ref } from 'vue'
import type { TableProColumn } from '../../table-pro'
import type { Handler } from './main'

type Recordable<T = any> = Record<string, T>
type LabelValueOption<T = any, K = any> = { label: string; value: T } & Recordable<K>
type LabelValueOptions<T = any, K = any> = LabelValueOption<T, K>[]
type RequestFilterType = Recordable
type Fn<T = any, R = void> = (...args: T[]) => R
type PromiseFn<T = any, R = void> = Fn<T, Promise<R>>
type Result<T = any> = { data: T } & Recordable
type FileItemType = {
  /** @description 文件的实际id，根据此id和版本定位最新文件，非必传 */
  actualId?: string
  /** @description 文件地址，根据业务实际情况指定，必传不能为空 */
  address: string
  /**
   * Format: int32
   * @description 应用id，非必传
   */
  appId?: number
  /** @description 业务表实际id，非必传 */
  businessId?: string
  /** @description 业务key，由业务端拼接而成，如果不为空的话businessId一定也不饿能为空，非必传 */
  businessKey?: string
  createBy?: string
  /** @description 上传人 */
  createByName?: string
  /**
   * Format: date-time
   * @description 创建时间
   */
  createTime?: string
  /**
   * Format: int32
   * @description 0:未删除，1:已删除，必传不能为空
   */
  deleted: number
  /** @description 文件大小 */
  fileSize?: string
  /** @description 文件全称，包含后缀，必传不能为空 */
  fullName: string
  /** Format: int32 */
  hyperlink?: number
  /**
   * Format: int64
   * @description 主键主键，编辑时不能为空
   */
  id?: number
  /** @description 关联的模块code */
  moduleCode?: string
  /**
   * Format: int64
   * @description 关联的模块id，必传不能为空
   */
  moduleId: number
  /** @description 关联的模块名称 */
  moduleName?: string
  /** @description 文件名称（不包含后缀），必传不能为空 */
  name: string
  /**
   * Format: int64
   * @description 持续时间，如果为音视频文件不为空，非必传
   */
  runtime?: number
  /**
   * Format: int64
   * @description 文件大小，必传不能为空
   */
  size: number
  /**
   * Format: int32
   * @description 源文件下载标识 value = 1
   */
  sourceFileDownload?: number
  /** @description 文件后缀，必传不能为空 */
  suffix: string
  /**
   * Format: int64
   * @description 文件类型，关联f_type-id，必传不能为空
   */
  type: number
  /** @description 文件类型code */
  typeCode?: string
  /** @description 关联的文件类型名称 */
  typeName?: string
  /**
   * Format: int64
   * @description 版本号，默认为1，如果有更新则累加，必传不能为空
   */
  version: number
  /**
   * Format: int32
   * @description 水印文件下载标识 value = 2
   */
  watermarkFileDownload?: number
}

type QueryFileParamsType = {
  /** @description 业务businessId */
  businessId?: string
  /** @description 业务businessKey */
  businessKey?: string
  /**
   * Format: date-time
   * @description 结束时间
   */
  endTime?: string
  /**
   * Format: int64
   * @description 文件id
   */
  id?: number
  /** @description 模块code */
  moduleCode?: string
  /** @description 权限控制 0 默认不控制角色查询文件类型  1 控制角色查询文件类型 */
  permissionControl?: boolean
  /** @description 聚合查询框, 非必填 */
  searchValue?: string
  /**
   * Format: date-time
   * @description 开始时间
   */
  startTime?: string
  /** @description 类型code */
  typeCode?: string
}

/**
 * 组件内默认预览表格的props
 * @author mxs
 * @createDate ...
 * @updateDate 2022/01/24
 */
type PreviewTablePropType = {
  parentProps: BasicPropsType
  dataSource: Recordable[]
  showTableAction: BasicPropsType['showTableAction']
  tableActionPermission: BasicPropsType['tableActionPermission']
  loading?: boolean
  readonly: boolean
  showUploadBtn: boolean
  customOptions: BasicPropsType['customOptions']
}

type NeedHideElType = {
  hideSelect: boolean
  hideTable: boolean
}

type TypeSelectPropType = {
  moduleCode: string
  selected?: string
  typeCodeArray?: string[]
  noDefaultValue: boolean | Ref<boolean>
  customOptions?: BasicPropsType['customOptions']
}

interface IHandle {
  backfill(): Promise<void>
  realUpload(): void
  beforeUpload(file: File): void
  throwResponse(newRecord: Recordable[]): void
  customRequest(): void
  appendResultToTable(): void
}

/**
 * 默认列field
 */
type DefaultColumnFields =
  | 'fullName'
  | 'typeName'
  | 'fileSize'
  | 'createByName'
  | 'createTime'
  | 'version'
  | 'action'

/**
 * @author mxs
 * @name TaUploadBasciProps
 * @createDate 2022/01/12
 * @updateDate 2022/12/11
 */
type BasicPropsType = {
  /**
   * 默认加粗样式的标题
   */
  title?: string
  typeCodeArray?: string[]
  /**
   * 文件真实id(v-model双向绑定)
   */
  fileActualIds?: string[]
  /**
   * 请求文件列表 | 上传文件的参数
   */
  params: RequestFilterType
  /**
   * 默认的Title
   */
  showTitle: boolean | 'unset'
  /**
   * 默认的select选择框
   */
  showSelect: boolean | 'unset'
  /**
   * 默认的文件列表
   * @default true
   */
  showTable: boolean
  /**
   * 默认的文件列表的action列
   */
  showTableAction: {
    download?: boolean
    downloadWatermark?: boolean
    update?: boolean
    delete?: boolean
  }
  /**
   * ".doc,.docx,.xlsx..."
   */
  accept: string
  // /**
  //  * 单个文件的最大大小
  //  */
  // maxSize: number;
  /**
   * 文件上传成功和请求已有(之前上传的)文件列表成功时触发
   */
  onChange?: Fn<Recordable[], void>
  /**
   * 不显示默认文件列表的删除功能
   * @default false
   */
  readonly: boolean
  /**
   * 默认所有文件类型
   */
  noDefaultValue: boolean
  /**
   * 不自动回填和清空
   * ```typescript
   * import { TaUpload, useHandlerInOuter } from "/@/components/TaUpload";
   * const { register: uploadRegister, getHandler } = useHandlerInOuter();
   * ```
   */
  controlInOuter: boolean
  /**
   * emit("register")的代码提示
   */
  onRegister?: Fn<Handler, void>
  /**
   * 双向绑定文件真实id的代码提示
   */
  'onUpdate:fileActualIds'?: Fn<string[], void>
  /**
   * 回填传入列表数据就不再发起请求
   */
  uploadResponse?: FileItemType[]
  /**
   * 显示上传按钮(用于仅显示列表不上传的地方)
   * @default true
   */
  showUploadBtn: boolean | 'unset'
  /**
   * 显示超链接上传按钮
   * @default true
   */
  showUploadHyperlinkBtn: boolean | 'unset'
  /**
   * 点击文件名跳转...
   * @default undefined
   */
  onClickName?: Fn<Recordable, void>
  /**
   * 动态构建 TypeCode Options
   * @default undefined
   */
  customOptions?: LabelValueOptions<any, any>
  /**
   * 内部表格拓展属性
   * @default false
   */
  canResize: boolean
  /**
   * 默认的文件列表的action列配置权限
   * @default {}
   */
  tableActionPermission: {
    preview?: string
    download?: string
    delete?: string
  }
  /**
   * 文件上传组件的图标
   *
   * 同 `TaIcon` 组件的 `icon` props
   */
  uploadIcon: string
  /**
   * 文件类型 选择框 onSelect
   */
  onSelect?: Fn
  coverColumnTitle?: Partial<Record<DefaultColumnFields, string>>
  hideColumnFields?: DefaultColumnFields[]
  nameColumnWidth?: number | string
  insertColumns?: {
    /**
     * @default 'createTime'
     */
    position?: DefaultColumnFields
    /**
     * @default 'after'
     */
    beforeOrAfter?: 'before' | 'after'
    column: TableProColumn
  }[]
  AppId?: string | number
  fileBranchIsShowDeleteAction?: Fn<Recordable, boolean>
  /**
   * [最多上传多少个文件](./types.ts "组件被销毁前一直记录")
   */
  maxCount?: number
  /**
   * 操作直接调接口生效
   * @default true
   */
  immediate: boolean
  /**
   * 表格数据为空时展示方式
   */
  emptyState: 'none' | 'header' | 'normal'
  /**
   * 默认表格 `maxHeight` 属性
   */
  tableMaxHeight?: number
} & ProvideDataType

/**
 * 从App.vue注入的全局 数据/配置项/api接口
 */
type ProvideDataType = {
  // 删除文件接口
  removeFile?: PromiseFn
  // 查询文件接口
  queryFile?: (parame: {
    filter: QueryFileParamsType
    model: {
      dir?: string
      /** Format: int32 */
      limit?: number
      /** Format: int32 */
      page?: number
      sort?: string
    }
  }) => Promise<Result<{ result: FileItemType[] }>>
  // 上传文件接口
  uploadFile?: (formData: FormData) => Promise<Result<FileItemType[]>>
  // 更新文件
  updateFile?: (formData: FormData) => Promise<Result<FileItemType[]>>
  // 上传超链接接口
  uploadHyperlink?: (payload: {
    typeCode: string
    name: string | undefined
    address: string | undefined
  }) => Promise<Result<FileItemType>>
  // 文件下载方法
  download?: (file: FileItemType, ...args: any[]) => void
  updateFileNameAndAddress?: (
    file: Pick<FileItemType, 'id' | 'name' | 'address'>,
    ...args: any[]
  ) => Promise<void>
  /**
   * 更新文件类型(可编辑单元格中的选择框)
   */
  updateFileType?: (id: string | number, typeCode: string) => Promise<void>
  typeCodeRecord?: Recordable<LabelValueOptions>
  queryFileType?: PromiseFn<
    string[],
    Result<
      Recordable &
        {
          name: string
          code: string

          // appId?: number
          // id?: number
          // moduleId?: number
          // parentId?: number
          // remark?: string
          // seq?: number
          // sid?: string
        }[]
    >
  >
}

/**
 * 有默认值的props
 * @author mxs
 * @createDate  2022/01/22
 * @updateDate  2022/03/09
 */
type HasDefaultPropType =
  | 'accept'
  // | "maxSize"
  | 'readonly'
  | 'readonly'
  | 'canResize'
  | 'showTable'
  | 'showSelect'
  | 'showUploadBtn'
  | 'controlInOuter'
  | 'noDefaultValue'
  | 'showTableAction'
  | 'tableActionPermission'

/**
 * 外部非必传的props
 * @author mxs
 * @createDate 2022/...
 * @updateDate 2022/01/22
 */
type OmitHasDefaultPropType<T = HasDefaultPropType> = Partial<BasicPropsType> &
  Omit<BasicPropsType, T extends string | number | symbol ? T : ''>

type ChangeType = 'init' | 'upload' | 'delete' | 'update'

export type {
  Fn,
  Result,
  IHandle,
  PromiseFn,
  ChangeType,
  Recordable,
  FileItemType,
  BasicPropsType,
  NeedHideElType,
  ProvideDataType,
  LabelValueOption,
  LabelValueOptions,
  TypeSelectPropType,
  PreviewTablePropType,
  OmitHasDefaultPropType,
}
