import { defineComponent, toRefs } from 'vue'
import { ButtonGroup, Upload } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { TaIcon } from '@tav-ui/components'
import { HyperlinkForm, PreviewTable, TypeSelect } from './components'
import { Handler } from './main'
import type { PropType, Slot } from 'vue'
import type { BasicPropsType } from './types'

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
      type: Boolean as PropType<BasicPropsType['showSelect']>,
      default: true,
    },
    relationBusinessId: {
      type: Boolean as PropType<BasicPropsType['relationBusinessId']>,
      default: false,
    },
    showTable: {
      type: Boolean as PropType<BasicPropsType['showTable']>,
      default: true,
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
    useFakeDelete: {
      type: Boolean as PropType<BasicPropsType['useFakeDelete']>,
      default: true,
    },
    uploadResponse: Array as PropType<BasicPropsType['uploadResponse']>,
    showUploadBtn: {
      type: Boolean as PropType<BasicPropsType['showUploadBtn']>,
      default: true,
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
    uploadIcon: {
      type: String as PropType<BasicPropsType['uploadIcon']>,
      default: 'ant-design:upload-outlined',
    },
    onSelect: Function as PropType<BasicPropsType['onSelect']>,
    insertColumns: Array as PropType<BasicPropsType['insertColumns']>,
    nameColumnWidth: [Number, String] as PropType<BasicPropsType['nameColumnWidth']>,
  },
  emits: ['update:fileActualIds', 'change', 'register'],
  setup(props, { emit, slots, expose }) {
    const {
      title,
      accept,
      params,
      readonly,
      showTable,
      showSelect,
      customOptions,
      typeCodeArray,
      showUploadBtn,
    } = toRefs(props)

    const handler = new Handler(props, emit)
    expose(handler)
    emit('register', handler)

    return () => (
      <section class="ta-upload">
        {(slots.title && slots.title()) ||
          (title.value && <div class="ta-upload-title">{title.value}</div>)}

        <div class="ta-upload-btn-title">
          {(slots.selectType && (
            <TypeSelect
              moduleCode={params.value.moduleCode}
              typeCodeArray={typeCodeArray.value}
              noDefaultValue={props.noDefaultValue}
              typeCodeRecord={handler.typeCodeRecord}
              onSelect={props.onSelect}
            >
              {{
                default: ({ typeCodeOptions }) =>
                  (slots.selectType as Slot)({
                    typeCodeOptions,
                    selectedValue: handler.typeCode.value,
                    selectedLabel: typeCodeOptions.find((el) => el.value === handler.typeCode.value)
                      ?.label,
                  }),
              }}
            </TypeSelect>
          )) || (
            <>
              {showSelect.value && !readonly.value && (
                <TypeSelect
                  customOptions={customOptions.value}
                  moduleCode={params.value.moduleCode}
                  typeCodeArray={typeCodeArray.value}
                  noDefaultValue={props.noDefaultValue}
                  selected={handler.typeCode.value}
                  typeCodeRecord={handler.typeCodeRecord}
                  onUpdate:selected={(val) => {
                    handler.typeCode.value = val
                    handler.fillDataSource()
                  }}
                  onSelect={props.onSelect}
                />
              )}
            </>
          )}

          {showUploadBtn.value &&
            !readonly.value &&
            ((slots.default && (
              <Upload
                fileList={[]}
                showUploadList={false}
                multiple={true}
                beforeUpload={handler.beforeUpload}
                customRequest={handler.customRequest}
                accept={accept.value}
              >
                {slots.default({ loading: handler.loading.value })}
              </Upload>
            )) || (
              <div class="ta-upload-btn">
                <ButtonGroup>
                  {slots.beforeButton?.({ loading: handler.loading.value })}
                  <Upload
                    fileList={[]}
                    showUploadList={false}
                    multiple={true}
                    beforeUpload={handler.beforeUpload}
                    customRequest={handler.customRequest}
                    accept={accept.value}
                  >
                    <TaButton
                      loading={handler.loading.value}
                      class="file"
                      onClick={handler.preOpenChooseFile}
                    >
                      {/* <i class="ta-upload-btn-icon" /> */}
                      <TaIcon icon={props.uploadIcon} />
                      上传文件
                    </TaButton>
                  </Upload>
                  {slots.centerButton?.({ loading: handler.loading.value })}
                  <TaButton
                    class="hyperlink"
                    onClick={() => {
                      handler.currentTypeCodeIsHyperlink.value =
                        !handler.currentTypeCodeIsHyperlink.value
                    }}
                  >
                    {handler.currentTypeCodeIsHyperlink.value ? '隐藏超链接上传' : '上传超链接'}
                  </TaButton>
                  {slots.afterButton?.({ loading: handler.loading.value })}
                </ButtonGroup>
              </div>
            ))}
        </div>

        {/* 超链接 */}
        {handler.currentTypeCodeIsHyperlink.value && (
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
        )}

        {(slots.tablePreview &&
          slots.tablePreview({
            typeCodeRecord: handler.typeCodeRecord,
            dataSource: handler.dataSource.value,
            loading: handler.loading.value,
            readonly: readonly.value,
            onDelete: handler.deleteItem,
            showTableAction: props.showTableAction,
            onClickName: props.onClickName,
            canResize: props.canResize,
            tableActionPermission: props.tableActionPermission,
            customOptions: customOptions.value,
            download: handler.apis.download,
            updateFileNameAndAddress: handler.apis.updateFileNameAndAddress,
            insertColumns: props.insertColumns,
            nameColumnWidth: props.nameColumnWidth,
          })) ||
          (showTable.value && (
            <PreviewTable
              typeCodeRecord={handler.typeCodeRecord}
              dataSource={handler.dataSource.value}
              loading={handler.loading.value}
              readonly={readonly.value}
              onDelete={handler.deleteItem}
              showTableAction={props.showTableAction}
              onClickName={props.onClickName}
              canResize={props.canResize}
              tableActionPermission={props.tableActionPermission}
              customOptions={customOptions.value}
              download={handler.apis.download}
              updateFileNameAndAddress={handler.apis.updateFileNameAndAddress}
              insertColumns={props.insertColumns}
              nameColumnWidth={props.nameColumnWidth}
            />
          ))}
      </section>
    )
  },
})
