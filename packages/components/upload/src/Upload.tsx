import { defineComponent, toRefs } from 'vue'
import { Upload } from 'ant-design-vue'
import { TaButton } from '@tav-ui/components/button'
import { HyperlinkForm, PreviewTable, TypeSelect } from './components'
import { Handler, hyperlinkFormRegister } from './main'
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

        {(slots.selectType && (
          <TypeSelect
            moduleCode={params.value.moduleCode}
            typeCodeArray={typeCodeArray.value}
            noDefaultValue={props.noDefaultValue}
            typeCodeRecord={handler.typeCodeRecord}
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
              <Upload
                fileList={[]}
                showUploadList={false}
                multiple={true}
                beforeUpload={handler.beforeUpload}
                customRequest={handler.customRequest}
                accept={accept.value}
              >
                <TaButton class="file" onClick={handler.preOpenChooseFile}>
                  <i class="ta-upload-btn-icon" />
                  上传文件
                </TaButton>
              </Upload>
              <TaButton
                class="hyperlink"
                onClick={() => {
                  handler.currentTypeCodeIsHyperlink.value =
                    !handler.currentTypeCodeIsHyperlink.value
                }}
              >
                {handler.currentTypeCodeIsHyperlink.value ? '隐藏超链接上传' : '上传超链接'}
              </TaButton>
            </div>
          ))}

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
            onRegister={hyperlinkFormRegister}
          />
        )}

        {(slots.tablePreview &&
          slots.tablePreview({
            loading: handler.loading.value,
            dataSource: handler.dataSource.value,
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
            />
          ))}
      </section>
    )
  },
})