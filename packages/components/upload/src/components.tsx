import { computed, defineComponent, nextTick, reactive, ref, unref, watch } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { Popover, Spin, Select as TaSelect } from 'ant-design-vue'
import { Input } from 'vxe-table'
import {
  TaButton,
  TaFileView,
  TaForm,
  TaTablePro,
  TaTableProAction,
  useForm,
} from '@tav-ui/components'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { getActionColumnMaxWidth, useFileTypeCode } from './hooks'
import type { PropType, Ref } from 'vue'
import type {
  ITableProInstance,
  TableProActionItem,
  TableProColumn,
} from '@tav-ui/components/table-pro'
import type { Handler } from './main'
import type {
  BasicPropsType,
  FileItemType,
  PreviewTablePropType,
  PromiseFn,
  Recordable,
  Result,
  TypeSelectPropType,
} from './types'

/*
 * 更新文件组件，纯原生的上传
 */

const ADDRESS_PATTERN =
  /^((?<protocol>http|https|ftp):\/\/)?(?<hostname>[a-zA-Z0-9\u4e00-\u9fa5])+(?<dot>\.){1}(?<rootdomainPathQuery>[a-zA-Z0-9\u4e00-\u9fa5])+/
// eslint-disable-next-line vue/one-component-per-file
export const PreviewTable = defineComponent({
  props: {
    parentProps: {
      type: Object as PropType<BasicPropsType>,
    },
    handler: {
      type: Object as PropType<Handler>,
      required: true,
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
    moduleCode: { type: String, required: true },
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const hasBranch = computed(() => typeof props.handler?.apis.updateFile === 'function')
    const taTableProInstanceRef = ref<ITableProInstance>()
    // init begin
    const { getOptionsByTypeCodes } = useFileTypeCode(props.typeCodeRecord)
    // init end

    const typeCodeArray = computed(() => props.dataSource.map((el) => el.typeCode))

    // const nameColumnWidthRef = ref<number>(300)
    const currentEditCellIsLoading = ref(false)
    let currentEditCell: null | Record<'rowIndex' | 'columnIndex', string | number> = null

    const fetchedTypeCodeArray = ref([] as any[])
    watch(
      () => props.moduleCode,
      (moduleCode) => {
        moduleCode &&
          props.handler?.apis.queryFileType?.([moduleCode]).then(({ data }) => {
            fetchedTypeCodeArray.value = data
          })
      },
      { immediate: true }
    )
    const typeCodeOptions = computed(() => {
      // @ts-ignore
      const options = props.customOptions ?? unref(getOptionsByTypeCodes(typeCodeArray.value))

      if (!options.length) {
        return fetchedTypeCodeArray.value.map((typeItem) => ({
          ...typeItem,
          label: typeItem.name,
          value: typeItem.code,
        }))
      }

      for (const typeItem of fetchedTypeCodeArray.value)
        options.some((el) => el.value == typeItem.code) ||
          options.push({
            ...typeItem,
            label: typeItem.name,
            value: typeItem.code,
          })

      return options
    })
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
            typeCodeOptions.value?.find((el) => el.value === typeCode)?.label || typeCode,
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
          title: props.coverColumnTitle?.version ?? '版本',
          field: 'version',
          visible: !props?.hideColumnFields!.includes('version') && hasBranch.value,
          minWidth: 100,
          customRender: ({ row }) => {
            return (
              <>
                {row.hyperlink === 0 ? (
                  <FileBranch
                    tableActionPermission={props.tableActionPermission}
                    showTableAction={props.showTableAction}
                    download={props.download}
                    file={row}
                  />
                ) : (
                  ''
                )}
              </>
            )
          },
        },
        {
          title: props.coverColumnTitle?.createTime ?? '更新时间',
          field: 'createTime',
          minWidth: 150,
          visible: !props?.hideColumnFields!.includes('createTime'),
          // customRender: ({ row: { createTime } }) => formatToDate(createTime),
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
                <TaTableProAction actions={getActions(row)} />
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
          enabled: !!(record.hyperlink === 1
            ? false
            : props.readonly
            ? false
            : (hasBranch.value && props.showTableAction.update) ?? true),
          // @ts-ignore
          onClick() {
            updateFileRef.value.showFilePicker(record)
            // console.log('上传')
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
    const updateFileRef = ref()
    const updateFileChange = (record) => {
      if (props.handler && props.handler.updateItem) {
        props.handler.updateItem(record)
      }
    }
    return () => (
      <div class="ta-upload-preview-table">
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
        <UpdateFile
          ref={updateFileRef}
          accept={props.parentProps?.accept || ''}
          onUpdateSuccess={updateFileChange}
        ></UpdateFile>
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
    queryFileType: Function as PropType<
      PromiseFn<any, Result<(Recordable & { code: string; name: string })[]>>
    >,
    onSelect: Function,
  },
  emits: ['update:selected'],
  setup(props, { emit, slots }) {
    // init begin
    const { mergeOptions } = useFileTypeCode(props.typeCodeRecord as Recordable)
    // init end
    const typeCodeArray = computed(() => props.typeCodeArray)

    // 此角色有的fileTypeCode
    const fetchedTypeCodeArray = ref<(Recordable & { code: string; name: string })[]>()

    // 从字典中取 TypeCode 选项的对应关系
    const localTypeCodeOptions = computed(() => {
      const options = props.customOptions ?? mergeOptions(props.moduleCode, typeCodeArray.value)
      /**
       * 未注入文件类型控制接口 -> 不需要控制 -> 所有文件类型
       */
      if (!props.queryFileType) {
        return options
      }
      if (fetchedTypeCodeArray.value) {
        if (!options.length) {
          return fetchedTypeCodeArray.value.map((typeItem) => ({
            ...typeItem,
            label: typeItem.name,
            value: typeItem.code,
          }))
        }

        for (const typeItem of fetchedTypeCodeArray.value) {
          if (!options.some((el) => el.value == typeItem.code)) {
            options.push({
              ...typeItem,
              label: typeItem.name,
              value: typeItem.code,
            })
          }
        }
        return options
      }
      return []
    })

    /**
     * ***仅组件初始化时给予默认值***
     */
    const isInit = ref(true)
    const defaultValue = computed(() => {
      if (unref(props.noDefaultValue) || !isInit.value) {
        return props.selected || undefined
      } else {
        return props.selected &&
          localTypeCodeOptions.value.some((el) => props.selected === el.value)
          ? props.selected
          : localTypeCodeOptions.value[0]?.value
      }
    })

    watch(
      () => props.moduleCode,
      (moduleCode) => {
        if (!(moduleCode && props.queryFileType)) {
          emit('update:selected', defaultValue.value)
          isInit.value = false

          return
        }

        props
          .queryFileType([moduleCode])
          .then(({ data }) => {
            isInit.value = true
            fetchedTypeCodeArray.value = data
            if (!unref(props.noDefaultValue) && defaultValue.value !== props.selected) {
              emit('update:selected', defaultValue.value)
            }
          })
          .finally(() => (isInit.value = false))
      },
      { immediate: true }
    )

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

// eslint-disable-next-line vue/one-component-per-file
export const UpdateFile = defineComponent({
  name: 'TaUpDateFile',
  props: {
    accept: {
      type: String as PropType<BasicPropsType['accept']>,
      default:
        '.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.gif,.bpm,.jpeg,.zip,.7z,.tar,.tar.gz,.tgz,.rar,.txt',
    },
    onUpdateFail: Function,
    onUpdateSuccess: Function,
  },
  etmis: ['updateSuccess'],
  setup(props, { emit, expose }) {
    const config = useGlobalConfig('components')
    const { createMessage } = useMessage()
    const uploadRef = ref()
    const updateApi = config.value?.TaUpload?.updateFile
    let fileActualIds = ''

    const fileChange = (event) => {
      const files = event.target.files
      const formData = new FormData()
      let updateFlag = true
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size / 1024 / 1024 > 1024) {
          updateFlag = false
          createMessage.warn(`${file.name}:${Math.floor(file.size / 1024 / 1024)}MB大于1GB`)
        }
        if (!updateFlag) {
          return
        }
        formData.append('files', file)
        formData.append('fileActualIds', fileActualIds)
      }
      updateApi(formData)
        .then((res) => {
          createMessage.success('更新成功')
          uploadRef.value.value = ''
          emit('updateSuccess', res.data[0])
        })
        .catch((err) => {
          uploadRef.value.value = ''
          emit('updateFail', err)
        })
    }
    const showFilePicker = (file) => {
      fileActualIds = file.actualId
      uploadRef.value.click()
    }
    expose({ showFilePicker })
    return () => (
      <div style="position: absolute; z-index: -999;opacity: 0;">
        <input
          multiple
          ref={uploadRef}
          type="file"
          accept={props.accept}
          onChange={fileChange.bind(this)}
        />
      </div>
    )
  },
})
// eslint-disable-next-line vue/one-component-per-file
export const FileBranch = defineComponent({
  name: 'TaFileBranch',
  props: {
    file: {
      type: Object as PropType<FileItemType>,
      required: true,
    },
    tableActionPermission: {
      type: Object as PropType<PreviewTablePropType['tableActionPermission']>,
      required: true,
    },
    showTableAction: {
      type: Object as PropType<PreviewTablePropType['showTableAction']>,
      required: true,
    },
    download: Function,
  },
  setup(props) {
    const loading = ref(true)
    const dataSource = ref([])
    // 文件预览
    const showPreview = ref(false)
    const previewRecord = ref<FileItemType[]>([])
    const columns: TableProColumn[] = [
      {
        title: '版本',
        field: 'version',
        minWidth: 50,
        customRender: ({ row }) => {
          return <>v{row.version}</>
        },
      },
      {
        title: '文件名称',
        field: 'fullName',
        customRender: ({ row }) => {
          return <>{row.hyperlink === 0 ? row.fullName : row.name}</>
        },
      },
      {
        title: '文件大小',
        field: 'fileSize',
        minWidth: 100,
      },
      {
        title: '上传人',
        field: 'createByName',
      },

      {
        title: '更新时间',
        field: 'createTime',
        minWidth: 150,
        // customRender: ({ row: { createTime } }) => formatToDate(createTime),
      },
      {
        width: '240px',
        fixed: 'right',
        title: '操作',
        field: 'action',
        align: 'center',
        customRender: ({ row }) => {
          return (
            <>
              <TaTableProAction actions={getActions(row)} />
            </>
          )
        },
      },
    ]

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
          label: '下载水印文件',
          permission: props.tableActionPermission.download,
          enabled: !!(record.hyperlink === 1
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
            : (props.showTableAction.download ?? true) && record.sourceFileDownload),
          onClick() {
            props.download?.(record)
          },
        },
      ]
      return actions
    }
    const getData = () => {
      const config = useGlobalConfig('components')
      const queryFileHistory = config.value?.TaUpload?.queryFileHistory
      queryFileHistory({ fileActualIds: [props.file.actualId] })
        .then((res) => {
          dataSource.value = res.data
          loading.value = false
          nextTick(() => {
            popVisible.value = true
          })
        })
        .catch(() => {
          loading.value = false
        })
    }
    const popVisible = ref(false)
    const showPopover = () => {
      loading.value = true
      getData()
    }
    const hidePopover = () => {
      popVisible.value = false
    }

    return () => (
      <>
        <Popover trigger="click" destroyTooltipOnHide visible={popVisible.value}>
          {{
            title: () => (
              <div class="file-branch-title">
                <div class="file-branch-name">{props.file.fullName || props.file.name}</div>
                <div class="file-branch-action" onClick={hidePopover}>
                  <TaButton type="text">
                    <CloseOutlined />
                  </TaButton>
                </div>
              </div>
            ),
            content: () => (
              <div style="width:800px; height:400px">
                <TaTablePro
                  pagerConfig={{ enabled: false }}
                  showOperations={false}
                  data={dataSource.value}
                  loading={loading.value}
                  columns={columns}
                  fillInner={false}
                  // maxHeight={Infinity}
                  checkboxConfig={{ enabled: false }}
                />
              </div>
            ),
            default: () => (
              <TaButton style="min-width:0" type="link" onClick={showPopover}>
                v{props.file.version}
              </TaButton>
            ),
          }}
        </Popover>

        <TaFileView
          show={showPreview.value}
          onUpdate:show={(v) => (showPreview.value = v)}
          list={previewRecord.value as any}
        />
      </>
    )
  },
})
