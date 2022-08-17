import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { Spin, Select as TaSelect } from 'ant-design-vue'
import { Input } from 'vxe-table'
import {
  TaButton,
  TaFileView,
  TaForm,
  TaTablePro,
  TaTableProAction,
  useForm,
} from '@tav-ui/components'
import { formatToDate } from '@tav-ui/utils'
import { getActionColumnMaxWidth, useFileTypeCode } from './hooks'
import UpdateFile from './UpdateFile'
import type {
  ITableProInstance,
  TableProActionItem,
  TableProColumn,
} from '@tav-ui/components/table-pro'
import type { PropType, Ref } from 'vue'
import type {
  BasicPropsType,
  FileItemType,
  PreviewTablePropType,
  PromiseFn,
  Recordable,
  Result,
  TypeSelectPropType,
} from './types'

const ADDRESS_PATTERN =
  /^((?<protocol>http|https|ftp):\/\/)?(?<hostname>[a-zA-Z0-9\u4e00-\u9fa5])+(?<dot>\.){1}(?<rootdomainPathQuery>[a-zA-Z0-9\u4e00-\u9fa5])+/
// eslint-disable-next-line vue/one-component-per-file
export const PreviewTable = defineComponent({
  props: {
    parentProps: {
      type: Object as PropType<any>,
    },
    dataSource: {
      type: Array as PropType<FileItemType[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
    showTableAction: {
      type: Object as PropType<PreviewTablePropType['showTableAction']>,
      required: true,
    },
    onClickName: Function,
    canResize: {
      type: Boolean,
      required: true,
    },
    tableActionPermission: {
      type: Object as PropType<PreviewTablePropType['tableActionPermission']>,
      required: true,
    },
    customOptions: Array as PropType<PreviewTablePropType['customOptions']>,
    download: Function,
    updateFileNameAndAddress: Function as PropType<PromiseFn>,
    typeCodeRecord: {
      type: Object,
      required: true,
    },
    coverColumnTitle: Object as PropType<BasicPropsType['coverColumnTitle']>,
    hideColumnFields: {
      type: Array as PropType<BasicPropsType['hideColumnFields']>,
      default: () => [],
    },
    insertColumns: Array as PropType<BasicPropsType['insertColumns']>,
    nameColumnWidth: { type: [Number, String], default: 300 },
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const taTableProInstanceRef = ref<ITableProInstance>()
    // init begin
    const { getOptionsByTypeCodes } = useFileTypeCode(props.typeCodeRecord)
    // init end

    const typeCodeArray = computed(() => props.dataSource.map((el) => el.typeCode))

    // const nameColumnWidthRef = ref<number>(300)
    const currentEditCellIsLoading = ref(false)
    let currentEditCell: null | Record<'rowIndex' | 'columnIndex', string | number> = null

    const typeCodeOptions = computed(
      // @ts-ignore
      () => props.customOptions ?? unref(getOptionsByTypeCodes(typeCodeArray.value))
    )
    const getActionColumn = computed<TableProColumn[]>(() => {
      if (
        props.showTableAction.preview === false &&
        props.showTableAction.download === false &&
        props.showTableAction.downloadWatermark === false &&
        props.showTableAction.delete === false
      )
        return []

      const labels: string[] = []

      // #region 配置显示的操作列
      if (props.showTableAction.preview !== false) labels.push('查看')
      if (props.showTableAction.download !== false) {
        if (props.showTableAction.downloadWatermark === false) labels.push('下载')
        else labels.push('下载源文件')
      }
      if (props.showTableAction.downloadWatermark !== false) labels.push('下载水印文件')
      if (props.showTableAction.delete !== false) labels.push('删除')
      // #endregion

      const columns: TableProColumn[] = [
        {
          title: props.coverColumnTitle?.fullName ?? '文件名称',
          field: 'fullName',
          visible: !props?.hideColumnFields!.includes('fullName'),
          width: props.nameColumnWidth,
          editRender: {},
          slots: {
            edit: ({ row, rowIndex, columnIndex }) => {
              currentEditCell = { rowIndex, columnIndex }

              return [
                <UpdateNameForm
                  row={row}
                  onEnter={() => {
                    taTableProInstanceRef.value?.instance.clearEdit()
                  }}
                  onChange={(payload) => {
                    if (
                      (row.hyperlink &&
                        payload.name === row.name &&
                        payload.address === row.address) ||
                      (!row.hyperlink && payload.name === row.name)
                    ) {
                      return
                    }

                    if (!props.updateFileNameAndAddress) {
                      console.warn('未传入 修改文件名的api: updateFileNameAndAddress')
                      return
                    }

                    currentEditCellIsLoading.value = true
                    props
                      .updateFileNameAndAddress(payload)
                      .then(() => {
                        row.name = payload.name
                        row.hyperlink
                          ? (row.address = payload.address)
                          : (row.fullName = `${payload.name}.${row.suffix}`)
                      })
                      .finally(() => (currentEditCellIsLoading.value = false))
                  }}
                />,
              ]
            },
            default: ({ row, rowIndex, columnIndex }) => {
              const res =
                row.hyperlink != 1
                  ? [
                      // 普通文件
                      <span>{row.fullName}</span>,
                    ]
                  : [
                      // 超链接
                      <span>{row.name}</span>,
                      <br />,
                      <a
                        onClick={() => {
                          window
                            .open(row.address.includes('//') ? row.address : `//${row.address}`)
                            ?.focus()
                          setTimeout(() => {
                            taTableProInstanceRef.value?.instance.clearEdit()
                          }, 0)
                        }}
                      >
                        {row.address}
                      </a>,
                    ]

              if (currentEditCellIsLoading.value) {
                if (currentEditCell) {
                  if (
                    rowIndex === currentEditCell.rowIndex &&
                    columnIndex === currentEditCell.columnIndex
                  ) {
                    res.unshift(<Spin size="small" />)
                  }
                }
              }

              return res
            },
          },
        },
        {
          title: props.coverColumnTitle?.typeName ?? '文件类型',
          field: 'typeName',
          visible: !props?.hideColumnFields!.includes('typeName'),
          minWidth: 100,
          customRender: ({ row: { typeCode } }) =>
            typeCodeOptions.value.find((el) => el.value === typeCode)?.label || typeCode,
        },
        {
          title: props.coverColumnTitle?.fileSize ?? '文件大小',
          field: 'fileSize',
          visible: !props?.hideColumnFields!.includes('fileSize'),
          minWidth: 100,
        },
        {
          title: props.coverColumnTitle?.createByName ?? '上传人',
          field: 'createByName',
          visible: !props?.hideColumnFields!.includes('createByName'),
        },
        {
          title: props.coverColumnTitle?.createTime ?? '更新时间',
          field: 'createTime',
          visible: !props?.hideColumnFields!.includes('createTime'),
          customRender: ({ row: { createTime } }) => formatToDate(createTime),
        },
        {
          width: getActionColumnMaxWidth(labels),
          fixed: 'right',
          title: props.coverColumnTitle?.action ?? '操作',
          field: 'action',
          visible: !props?.hideColumnFields!.includes('action'),
          align: 'center',
          customRender: ({ row }) => {
            return (
              <>
                <TaTableProAction actions={getActions(row)}>
                  <TaButton type="link">2222</TaButton>
                </TaTableProAction>
              </>
            )
          },
        },
      ]

      if (props.insertColumns?.length) {
        for (const columnItem of props.insertColumns) {
          if (!columnItem.column) continue

          const prevIndex = columns.findIndex(
            (el) => (columnItem.position ?? 'createTime') === el.field
          )
          if (-1 === prevIndex) continue

          if ('before' === columnItem.beforeOrAfter) {
            columns.splice(prevIndex, 0, columnItem.column)
          } else {
            // 默认after
            columns.splice(prevIndex + 1, 0, columnItem.column)
          }
        }
      }

      return columns
    })

    const getActions = (record) => {
      const actions: TableProActionItem[] = [
        {
          label: '查看',
          permission: props.tableActionPermission.preview,
          enabled: record.hyperlink === 1 ? false : props.showTableAction.preview ?? true,
          onClick() {
            if (record.hyperlink === 1) {
              window.open(record.address)?.focus()
              return
            }
            previewRecord.value = [record]
            showPreview.value = true
          },
        },
        {
          label: '更新',
          enabled: !props.readonly,
          // @ts-ignore
          onClick() {
            updateFileActualIds.value = [record.actualId]
            console.log('上传')
          },
        },
        {
          label: '查看历史',
          enabled: props.showTableAction.delete ?? !props.readonly,
          // @ts-ignore
          onClick() {
            console.log('查看历史')
          },
        },
      ]
      actions.push(
        {
          label: '下载水印文件',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
            ? false
            : props.readonly
            ? false
            : (props.showTableAction.downloadWatermark ?? true) && record.watermarkFileDownload),
          onClick() {
            props.download?.(record, undefined, true)
          },
        },
        {
          // 有下载水印文件 ? 区分 : 下载源文件显示为(下载)
          label: props.showTableAction.downloadWatermark === undefined ? '下载源文件' : '下载',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
            ? false
            : props.readonly
            ? false
            : (props.showTableAction.download ?? true) && record.sourceFileDownload),
          onClick() {
            props.download?.(record)
          },
        },
        {
          label: '删除',
          permission: props.tableActionPermission.delete,
          enabled: props.showTableAction.delete ?? !props.readonly,
          // @ts-ignore
          popConfirm: {
            title: '是否确认删除?',
            confirm: () => {
              emit('delete', record)
            },
          },
        }
      )
      return actions
    }

    const showPreview = ref(false)
    const previewRecord = ref<FileItemType[]>([])
    // 更新文件的回调
    const updateFileChange = (file) => {
      console.log(file)
      updateFileActualIds.value = []
    }
    // 更新的文件真实id
    let updateFileActualIds = ref([])
    return () => (
      <div class="ta-upload-preview-table">
        <UpdateFile
          accept={props.parentProps.accept}
          fileActualIds={updateFileActualIds.value}
          onUpdateSuccess={updateFileChange}
        ></UpdateFile>
        <TaTablePro
          ref={taTableProInstanceRef}
          // 传此api -> 可编辑
          editConfig={
            props.updateFileNameAndAddress && {
              // trigger: 'manual',
              trigger: 'click',
              mode: 'cell',
              // autoClear: false,
            }
          }
          pagerConfig={{ enabled: false }}
          showOperations={false}
          data={props.dataSource}
          loading={props.loading}
          columns={getActionColumn.value}
          fillInner={false}
          checkboxConfig={{ enabled: false }}
        />
        <TaFileView
          show={showPreview.value}
          onUpdate:show={(v) => (showPreview.value = v)}
          list={previewRecord.value as any}
        />
      </div>
    )
  },
})

// eslint-disable-next-line vue/one-component-per-file
export const TypeSelect = defineComponent({
  props: {
    moduleCode: String as PropType<TypeSelectPropType['moduleCode']>,
    typeCodeArray: Array as PropType<TypeSelectPropType['typeCodeArray']>,
    selected: String as PropType<TypeSelectPropType['selected']>,
    noDefaultValue: [Boolean, Object] as PropType<TypeSelectPropType['noDefaultValue']>,
    customOptions: Array as PropType<TypeSelectPropType['customOptions']>,
    typeCodeRecord: {
      type: Object,
      required: true,
    },
    queryFileType: Function as PropType<PromiseFn<any, Result<{ code: string }[]>>>,
    onSelect: Function,
  },
  emits: ['update:selected'],
  setup(props, { emit, slots }) {
    // init begin
    const { mergeOptions } = useFileTypeCode(props.typeCodeRecord as Recordable)
    // init end
    const moduleCode = computed(() => props.moduleCode)
    const typeCodeArray = computed(() => props.typeCodeArray)

    if (!moduleCode.value) return null

    // 此角色有的fileTypeCode
    const fetchedTypeCodeArray = ref<string[]>()

    // 从字典中取 TypeCode 选项的对应关系
    const localTypeCodeOptions = computed(() => {
      const options = props.customOptions ?? mergeOptions(moduleCode.value, typeCodeArray.value)
      /**
       * 未注入文件类型控制接口 -> 不需要控制 -> 所有文件类型
       */
      if (!props.queryFileType) {
        return options
      }
      if (fetchedTypeCodeArray.value) {
        // @ts-ignore
        return options.filter((el) => fetchedTypeCodeArray.value!.includes(el.value))
      }
      return []
    })

    /**
     * ***仅组件初始化时给予默认值***
     */
    let isInit = true
    const defaultValue = computed(() => {
      if (unref(props.noDefaultValue) || !isInit) {
        return props.selected || undefined
      } else {
        return props.selected &&
          localTypeCodeOptions.value.some((el) => props.selected === el.value)
          ? props.selected
          : localTypeCodeOptions.value[0]?.value
      }
    })

    props
      .queryFileType?.([moduleCode.value])
      .then(({ data }) => {
        fetchedTypeCodeArray.value = data.map((el) => el.code!)
        if (!unref(props.noDefaultValue) && defaultValue.value !== props.selected) {
          emit('update:selected', defaultValue.value)
        }
      })
      .finally(() => (isInit = false)) ||
      (() => {
        emit('update:selected', defaultValue.value)
        isInit = false
      })()

    return () =>
      (slots.default &&
        slots.default({
          typeCodeOptions: localTypeCodeOptions.value,
          selected: defaultValue.value,
        })) || (
        <TaSelect
          value={defaultValue.value}
          style="width: 200px"
          options={localTypeCodeOptions.value}
          onSelect={(value, option) => {
            props.onSelect?.(value, option)
            emit('update:selected', value, option)
          }}
          placeholder="请选择文件类型"
          allowClear={true}
          onClear={() => {
            emit('update:selected', undefined)
          }}
        />
      )
  },
})

// eslint-disable-next-line vue/one-component-per-file
export const HyperlinkForm = defineComponent({
  name: 'HyperlinkForm',
  components: { TaForm },
  props: {
    name: String,
    address: String,
    loading: {
      type: [Boolean, Object] as PropType<boolean | Ref<boolean>>,
      default: false,
    },
  },
  emits: ['update:name', 'update:address', 'change', 'register'],
  setup(props, { emit }) {
    // const addressPS = ["http://", ".com"];
    const [formRegister, { validate, getFieldsValue, resetFields }] = useForm({
      layout: 'vertical',
      // labelWidth: 80,
      showResetButton: false,
      showSubmitButton: false,
      // showAdvancedButton: false,
      showActionButtonGroup: false,
      rowProps: { gutter: 16 },
      schemas: [
        {
          field: 'name',
          label: '文件名',
          required: true,
          component: 'Input',
          colProps: { span: 10 },
          componentProps: {
            maxLength: 100,
          },
        },
        {
          field: 'address',
          label: '链接地址',
          component: 'Input',
          colProps: { span: 10 },
          rules: [
            {
              required: true,
            },
            {
              pattern: ADDRESS_PATTERN,
              message: '请输入正确的链接',
            },
          ],
          componentProps: {
            maxLength: 400,
          },
        },
        {
          field: 'btn',
          label: '　',
          component: 'Input',
          slot: 'submitBtn',
          colProps: { span: 4 },
        },
      ],
    })

    emit('register', { resetFields })

    return () => (
      <TaForm
        class="ta-upload-hyperlink-form"
        onRegister={formRegister}
        // style={{
        //   border: "1px solid red",
        //   display: "inline-block",
        //   width: "calc(100% - 216px)",
        //   marginLeft: "16px"
        // }}
      >
        {{
          submitBtn: () => (
            <TaButton
              class="ta-upload-btn-submit"
              loading={unref(props.loading)}
              onClick={() => {
                validate()
                  .then(() => {
                    const { name, address } = getFieldsValue()
                    emit('update:name', name)
                    // const tmpAddressPS = addressPS.slice();
                    // if (addressPS[0] === "自定义") {
                    //   tmpAddressPS[0] = "";
                    // }
                    // if (addressPS[1] === "自定义") {
                    //   tmpAddressPS[1] = "";
                    // }
                    emit('update:address', address)
                    emit('change', true)
                  })
                  .catch(() => {
                    emit('change', false)
                  })
              }}
            >
              {/* <UploadOutlined /> */}
              <i class="ta-upload-btn-icon" />
              上传链接
            </TaButton>
          ),
        }}
      </TaForm>
    )
  },
})

// eslint-disable-next-line vue/one-component-per-file
export const UpdateNameForm = defineComponent({
  // @ts-ignore
  props: {
    row: { type: Object as PropType<FileItemType>, required: true },
    onChange: Function,
    onEnter: Function,
  },
  setup(props) {
    const state = reactive({
      name: props.row.name,
      address: props.row.address,
    })

    const throwResult = () => {
      const payload = {
        id: props.row.id,
      } as Partial<FileItemType>

      payload.name = state.name
      props.row.hyperlink && (payload.address = state.address)

      return props.onChange?.(payload)
    }

    const [formRegister] = useForm({
      layout: 'vertical',
      // labelWidth: 80,
      showResetButton: false,
      showSubmitButton: false,
      // showAdvancedButton: false,
      showActionButtonGroup: false,
      rowProps: { gutter: 16 },
      schemas: [
        {
          field: 'name',
          label: '',
          required: true,
          component: 'Input',
          defaultValue: state.name,
          colProps: { span: 12 },
          componentProps: {
            maxLength: 100,
            onPressEnter: ({ code }) => {
              'Enter' === code && props.onEnter?.()
            },
            onBlur: throwResult,
            onChange(e: { target: { value: string } }) {
              state.name = e.target.value
            },
          },
        },
        {
          field: 'address',
          label: '',
          component: 'Input',
          defaultValue: state.address,
          colProps: { span: 12 },
          rules: [
            {
              required: true,
            },
            {
              pattern: ADDRESS_PATTERN,
              message: '请输入正确的链接',
            },
          ],
          componentProps: {
            maxLength: 400,
            onPressEnter: ({ code }) => {
              'Enter' === code && props.onEnter?.()
            },
            onBlur: throwResult,
            onChange(e: { target: { value: string } }) {
              const value = e.target.value

              ADDRESS_PATTERN.test(value) && (state.address = value)
            },
          },
        },
      ],
    })

    return () => [
      props.row.hyperlink != 1 ? (
        // 普通文件
        <Input
          onKeydown={({ $event: { code } }) => {
            'Enter' === code && props.onEnter?.()
          }}
          style={{
            display: 'inline-block',
            width: 'calc(100% - 22px)',
          }}
          onChange={({ value }) => {
            state.name = value
          }}
          onBlur={throwResult}
          modelValue={state.name}
        />
      ) : (
        // form 在此处, 只用于给用户提示, 不用于取值
        <TaForm class="upload-inline-form" onRegister={formRegister} />
        // 超链接
        // <>
        //   <Input
        //     style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        //     onChange={({ value }) => {
        //       state.name = value
        //       row.name = value
        //     }}
        //     defaultValue={row.name}
        //   />
        //   {/* <br /> */}
        //   <Input
        //     style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '16px' }}
        //     onChange={({ value }) => {
        //       state.address = value
        //       row.address = value
        //     }}
        //     defaultValue={row.address}
        //   />
        // </>
      ),
    ]
  },
})
