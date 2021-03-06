import { computed, defineComponent, ref, unref } from 'vue'
import { Select as TaSelect } from 'ant-design-vue'
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
import type { TableProActionItem, TableProColumn } from '@tav-ui/components/table-pro'
// import type { VxeGridProps } from 'vxe-table'
import type { PropType, Ref } from 'vue'
import type {
  FileItemType,
  PreviewTablePropType,
  PromiseFn,
  Recordable,
  Result,
  TypeSelectPropType,
} from './types'

// eslint-disable-next-line vue/one-component-per-file
export const PreviewTable = defineComponent({
  props: {
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
    typeCodeRecord: {
      type: Object,
      required: true,
    },
  },
  emits: ['delete'],
  setup(props, { emit }) {
    // init begin
    const { getOptionsByTypeCodes } = useFileTypeCode(props.typeCodeRecord)
    // init end

    const typeCodeArray = computed(() => props.dataSource.map((el) => el.typeCode))
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

      // #region ????????????????????????
      if (props.showTableAction.preview !== false) labels.push('??????')
      if (props.showTableAction.download !== false) {
        if (props.showTableAction.downloadWatermark === false) labels.push('??????')
        else labels.push('???????????????')
      }
      if (props.showTableAction.downloadWatermark !== false) labels.push('??????????????????')
      if (props.showTableAction.delete !== false) labels.push('??????')
      // #endregion

      return [
        {
          title: '????????????',
          field: 'fullName',
          slots: {
            default: ({ row: record }) => [
              <>
                {record.hyperlink != 1 ? (
                  // ????????????
                  <span>{record.fullName}</span>
                ) : (
                  // ?????????
                  <>
                    <span>{record.name}</span>
                    <br />
                    <a
                      onClick={() => {
                        window
                          .open(
                            record.address.includes('//') ? record.address : `//${record.address}`
                          )
                          ?.focus()
                      }}
                    >
                      {record.address}
                    </a>
                  </>
                )}
              </>,
            ],
          },
          // customRender: ({ row: record }) => (
          //   <>
          //     {record.hyperlink != 1 ? (
          //       // ????????????
          //       <span>{record.fullName}</span>
          //     ) : (
          //       // ?????????
          //       <>
          //         <span>{record.name}</span>
          //         <br />
          //         <a
          //           onClick={() => {
          //             window
          //               .open(
          //                 record.address.includes('//') ? record.address : `//${record.address}`
          //               )
          //               ?.focus()
          //           }}
          //         >
          //           {record.address}
          //         </a>
          //       </>
          //     )}
          //   </>
          // ),
        },
        {
          title: '????????????',
          field: 'typeName',
          minWidth: 100,
          slots: {
            default: ({ row: { typeCode } }) => [
              typeCodeOptions.value.find((el) => el.value === typeCode)?.label || typeCode,
            ],
          },
          // customRender: ({ row: { typeCode } }) =>
          //   typeCodeOptions.value.find((el) => el.value === typeCode)?.label || typeCode,
        },
        {
          title: '????????????',
          field: 'fileSize',
          minWidth: 100,
        },
        { title: '?????????', field: 'createByName' },
        {
          title: '????????????',
          field: 'createTime',
          slots: {
            default: ({ row: { createTime } }) => [formatToDate(createTime)],
          },
          // customRender: ({ row: { createTime } }) => formatToDate(createTime),
        },
        {
          width: getActionColumnMaxWidth(labels),
          fixed: 'right',
          title: '??????',
          field: 'action',
          align: 'center',
          slots: {
            default: ({ row }) => [<TaTableProAction actions={getActions(row)} />],
          },
          // customRender: ({ row }) => <TaTableProAction actions={getActions(row)} />,
        },
      ]
    })

    const getActions = (record) => {
      const actions: TableProActionItem[] = [
        {
          label: '??????',
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
          label: '??????????????????',
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
      ]
      actions.push(
        {
          // ????????????????????? ? ?????? : ????????????????????????(??????)
          label: props.showTableAction.downloadWatermark === undefined ? '???????????????' : '??????',
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
          label: '??????',
          permission: props.tableActionPermission.delete,
          enabled: props.showTableAction.delete ?? !props.readonly,
          // @ts-ignore
          popConfirm: {
            title: '???????????????????',
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

    return () => (
      <div class="ta-upload-preview-table">
        <TaTablePro
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

    // ???????????????fileTypeCode
    const fetchedTypeCodeArray = ref<string[]>()

    // ??????????????? TypeCode ?????????????????????
    const localTypeCodeOptions = computed(() => {
      const options = props.customOptions ?? mergeOptions(moduleCode.value, typeCodeArray.value)
      /**
       * ????????????????????????????????? -> ??????????????? -> ??????????????????
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
     * ***????????????????????????????????????***
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
          placeholder="?????????????????????"
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
          label: '?????????',
          required: true,
          component: 'Input',
          colProps: { span: 10 },
          componentProps: {
            maxLength: 100,
          },
        },
        {
          field: 'address',
          label: '????????????',
          component: 'Input',
          colProps: { span: 10 },
          rules: [
            {
              required: true,
            },
            {
              pattern:
                /^((?<protocol>http|https|ftp):\/\/)?(?<hostname>[a-zA-Z0-9\u4e00-\u9fa5])+(?<dot>\.){1}(?<rootdomainPathQuery>[a-zA-Z0-9\u4e00-\u9fa5])+/,
              message: '????????????????????????',
            },
          ],
          componentProps: {
            maxLength: 400,
          },
        },
        {
          field: 'btn',
          label: '???',
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
                    // if (addressPS[0] === "?????????") {
                    //   tmpAddressPS[0] = "";
                    // }
                    // if (addressPS[1] === "?????????") {
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
              ????????????
            </TaButton>
          ),
        }}
      </TaForm>
    )
  },
})
