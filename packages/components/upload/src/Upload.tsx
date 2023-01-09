import { defineComponent, ref, toRefs, watch } from 'vue'
import { ButtonGroup, Upload } from 'ant-design-vue'
import { TaIcon } from '@tav-ui/components'
import { TaButton } from '@tav-ui/components/button'
import { HyperlinkForm, PreviewTable, TypeSelect } from './components'
import { Handler } from './main'
import type { PropType, Slot } from 'vue'
import type { BasicPropsType, LabelValueOptions, Recordable } from './types'

export default defineComponent({
  name: 'TaUpload',
  components: { PreviewTable },
  props: {
    title: String as PropType<BasicPropsType['title']>,
    typeCodeArray: {
      type: Array as PropType<BasicPropsType['typeCodeArray']>,
      default: () => [],
    },
    fileActualIds: Array as PropType<BasicPropsType['fileActualIds']>,
    params: {
      type: Object as PropType<BasicPropsType['params']>,
      required: true,
    },
    showSelect: {
      type: [Boolean, String] as PropType<BasicPropsType['showSelect']>,
      default: 'unset',
    },
    showTable: {
      type: Boolean as PropType<BasicPropsType['showTable']>,
      default: true,
    },
    showTitle: {
      type: [Boolean, String] as PropType<BasicPropsType['showTitle']>,
      default: 'unset',
    },
    showTableAction: {
      type: Object as PropType<BasicPropsType['showTableAction']>,
      default: () => ({}),
    },
    accept: {
      type: String as PropType<BasicPropsType['accept']>,
      default:
        '.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.gif,.bpm,.jpeg,.zip,.7z,.tar,.tar.gz,.tgz,.rar,.txt',
    },
    // maxSize: {
    //   type: Number as PropType<BasicPropsType["maxSize"]>,
    //   default: Infinity
    // },
    onChange: Function as PropType<BasicPropsType['onChange']>,
    readonly: {
      type: Boolean as PropType<BasicPropsType['readonly']>,
      default: false,
    },
    noDefaultValue: {
      type: Boolean as PropType<BasicPropsType['noDefaultValue']>,
      default: false,
    },
    controlInOuter: {
      type: Boolean as PropType<BasicPropsType['controlInOuter']>,
      default: false,
    },
    uploadResponse: Array as PropType<BasicPropsType['uploadResponse']>,
    showUploadBtn: {
      type: [Boolean, String] as PropType<BasicPropsType['showUploadBtn']>,
      default: 'unset',
    },
    showUploadHyperlinkBtn: {
      type: [Boolean, String] as PropType<BasicPropsType['showUploadHyperlinkBtn']>,
      default: 'unset',
    },
    canResize: {
      type: Boolean as PropType<BasicPropsType['canResize']>,
      default: false,
    },
    onClickName: Function as PropType<BasicPropsType['onClickName']>,
    customOptions: Array as PropType<BasicPropsType['customOptions']>,
    tableActionPermission: {
      type: Object as PropType<BasicPropsType['tableActionPermission']>,
      default: () => ({}),
    },
    typeCodeRecord: Object as PropType<BasicPropsType['typeCodeRecord']>,
    removeFile: Function as PropType<BasicPropsType['removeFile']>,
    queryFile: Function as PropType<BasicPropsType['queryFile']>,
    uploadFile: Function as PropType<BasicPropsType['uploadFile']>,
    uploadHyperlink: Function as PropType<BasicPropsType['uploadHyperlink']>,
    download: Function as PropType<BasicPropsType['download']>,
    updateFileNameAndAddress: Function as PropType<BasicPropsType['updateFileNameAndAddress']>,
    queryFileType: Function as PropType<BasicPropsType['queryFileType']>,
    uploadIcon: {
      type: String as PropType<BasicPropsType['uploadIcon']>,
      default: 'ant-design:upload-outlined',
    },
    onSelect: Function as PropType<BasicPropsType['onSelect']>,
    coverColumnTitle: Object as PropType<BasicPropsType['coverColumnTitle']>,
    hideColumnFields: Array as PropType<BasicPropsType['hideColumnFields']>,
    insertColumns: Array as PropType<BasicPropsType['insertColumns']>,
    nameColumnWidth: [Number, String] as PropType<BasicPropsType['nameColumnWidth']>,
    // eslint-disable-next-line vue/prop-name-casing
    AppId: [String, Number] as PropType<BasicPropsType['AppId']>,
    fileBranchIsShowDeleteAction: Function as PropType<
      BasicPropsType['fileBranchIsShowDeleteAction']
    >,
    maxCount: Number as PropType<BasicPropsType['maxCount']>,
    immediate: { type: Boolean as PropType<BasicPropsType['immediate']>, default: false },
    emptyState: { type: String as PropType<BasicPropsType['emptyState']>, default: 'normal' },
    queryFileTypeRecursion: {
      type: Boolean as PropType<BasicPropsType['queryFileTypeRecursion']>,
      default: false,
    },
    checkboxConfig: {
      type: Object as PropType<BasicPropsType['checkboxConfig']>,
      default: () => ({ enabled: false }),
    },
  },
  emits: ['update:fileActualIds', 'change', 'register'],
  setup(props, { emit, slots, expose }) {
    const { params, customOptions, typeCodeArray } = toRefs(props)

    const showTitle = ref(props.showTitle)
    const showSelect = ref(props.showSelect)
    const showUploadBtn = ref(props.showUploadBtn)
    const showUploadHyperlinkBtn = ref(props.showUploadHyperlinkBtn)
    const typeCodeOptions = ref((customOptions.value ?? []) as LabelValueOptions)
    const showWarnClass = ref(false)

    const uploadBtnRef = ref()

    function triggerWarn() {
      showWarnClass.value = true
      setTimeout(() => {
        showWarnClass.value = false
      }, 2400)
    }

    const handler = new Handler(props, emit)
    expose(Object.assign({ triggerWarn }, handler))
    emit('register', handler)

    watch(
      () => props,
      (v, p) => {
        if (v.readonly === p?.readonly) return

        if (v.readonly) {
          v.showTitle === 'unset' && (showTitle.value = false)
          v.showSelect === 'unset' && (showSelect.value = false)
          v.showUploadBtn === 'unset' && (showUploadBtn.value = false)
          v.showUploadHyperlinkBtn === 'unset' && (showUploadHyperlinkBtn.value = false)
        } else {
          v.showTitle === 'unset' && (showTitle.value = true)
          v.showSelect === 'unset' && (showSelect.value = true)
          v.showUploadBtn === 'unset' && (showUploadBtn.value = true)
          v.showUploadHyperlinkBtn === 'unset' &&
            (showUploadHyperlinkBtn.value = !!handler.apis.uploadHyperlink)
        }
      },
      { deep: true, immediate: true }
    )

    /**
     * 组件标题
     */
    const titleEl = () => {
      if (slots.title) {
        return slots.title({ showTitle })
      } else if (props.title) {
        return <div class="ta-upload-title">{props.title}</div>
      }
      return null
    }

    /**
     * 组件表格
     */
    const selectEl = () => {
      const selectProps = {
        customOptions: customOptions.value,
        moduleCode: params.value.moduleCode,
        typeCodeArray: typeCodeArray.value,
        noDefaultValue: props.noDefaultValue,
        selected: handler.typeCode.value,
        typeCodeRecord: handler.typeCodeRecord,
        'onUpdate:selected': (val) => {
          handler.typeCode.value = val
          handler.fillDataSource()
        },
        'onUpdate:options': (val) => {
          typeCodeOptions.value = val
        },
        onSelect: props.onSelect,
        queryFileType: handler.apis.queryFileType,
      }

      const ISelect = (_, { slots }: Recordable) => <TypeSelect {...selectProps} v-slots={slots} />

      if (slots.selectType) {
        return (
          <ISelect>
            {{
              default: ({ typeCodeOptions }) =>
                (slots.selectType as Slot)({
                  typeCodeOptions,
                  selectedValue: handler.typeCode.value,
                  selectedLabel: typeCodeOptions.find((el) => el.value === handler.typeCode.value)
                    ?.label,
                  ...selectProps,
                }),
            }}
          </ISelect>
        )
      } else {
        return ISelect(undefined, {})
      }
    }

    /**
     * 上传按钮表格
     */
    const uploadBtnEl = () => {
      const IButton = () =>
        slots.default ? (
          slots.default({ loading: handler.loading.value })
        ) : (
          <TaButton
            ref={uploadBtnRef}
            loading={handler.loading.value}
            class={{ file: true, 'warn-class': showWarnClass.value }}
            onClick={handler.preOpenChooseFile}
          >
            {/* <i class="ta-upload-btn-icon" /> */}
            <TaIcon icon={props.uploadIcon} />
            上传文件
          </TaButton>
        )

      const IUpload = () => (
        <Upload
          fileList={[]}
          multiple={true}
          accept={props.accept}
          showUploadList={false}
          beforeUpload={handler.beforeUpload}
          customRequest={handler.customRequest}
        >
          {IButton()}
        </Upload>
      )

      const HyperlinkBtn = () => (
        <TaButton
          class="hyperlink"
          onClick={() => {
            handler.currentTypeCodeIsHyperlink.value = !handler.currentTypeCodeIsHyperlink.value
          }}
        >
          {handler.currentTypeCodeIsHyperlink.value ? '隐藏超链接上传' : '上传超链接'}
        </TaButton>
      )

      if (slots.default) {
        return IUpload()
      } else {
        return (
          <div class="ta-upload-btn">
            <ButtonGroup>
              {slots.beforeButton?.({ loading: handler.loading.value })}
              {IUpload()}
              {slots.centerButton?.({ loading: handler.loading.value })}
              {showUploadHyperlinkBtn.value ? HyperlinkBtn() : null}
              {slots.afterButton?.({ loading: handler.loading.value })}
            </ButtonGroup>
          </div>
        )
      }
    }

    /**
     * 超链接
     */
    const uploadHyperlinkBtnEl = () => {
      if (props.showUploadHyperlinkBtn && handler.currentTypeCodeIsHyperlink.value) {
        return (
          <HyperlinkForm
            name={handler.paramsName}
            onUpdate:name={(v) => (handler.paramsName = v)}
            address={handler.paramsAddress}
            onUpdate:address={(v) => (handler.paramsAddress = v)}
            onChange={(success) => {
              if (success) {
                handler.hyperlinkUpload()
              }
            }}
            loading={handler.loading}
            onRegister={handler.hyperlinkFormRegister}
          />
        )
      }
      return null
    }

    /**
     * 组件表格
     */
    const tableEl = () => {
      const tableProps = {
        uploadBtnRef,
        parentProps: props,
        handler,
        dataSource: handler.dataSource.value,
        loading: handler.loading.value,
        readonly: props.readonly,
        onDelete: handler.deleteItem,
        showTableAction: props.showTableAction,
        onClickName: props.onClickName,
        canResize: props.canResize,
        tableActionPermission: props.tableActionPermission,
        customOptions: typeCodeOptions.value,
        download: handler.apis.download,
        updateFileNameAndAddress: handler.apis.updateFileNameAndAddress,
        coverColumnTitle: props.coverColumnTitle,
        hideColumnFields: props.hideColumnFields,
        insertColumns: props.insertColumns,
        nameColumnWidth: props.nameColumnWidth,
        moduleCode: params.value.moduleCode,
      }

      if (slots.tablePreview) {
        return slots.tablePreview(tableProps)
      } else {
        return props.showTable ? <PreviewTable {...tableProps} /> : null
      }
    }

    return () => (
      <section class="ta-upload">
        {showTitle.value ? titleEl() : null}

        <div class="ta-upload-btn-title">
          {showSelect.value ? selectEl() : null}
          {showUploadBtn.value ? uploadBtnEl() : null}
        </div>

        {uploadHyperlinkBtnEl()}

        {tableEl()}
      </section>
    )
  },
})
