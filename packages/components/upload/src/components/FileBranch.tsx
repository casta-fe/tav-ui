import { computed, defineComponent, nextTick, ref } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { Popover } from 'ant-design-vue'
import { TaButton, TaFileView, TaModal, TaTablePro, TaTableProAction } from '@tav-ui/components'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
// import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { DEFAULT_LINE_HEIGTH } from '@tav-ui/components/table-pro/src/const'
import { tavI18n } from '@tav-ui/locales'
import type { PropType, Ref } from 'vue'
import type { TableProActionItem, TableProColumn } from '@tav-ui/components/table-pro'
import type {
  BasicPropsType,
  FileItemType,
  PreviewTablePropType,
  PromiseFn,
  Recordable,
} from '../types'

export const FileBranch = defineComponent({
  name: 'TaFileBranch',
  props: {
    parentProps: {
      type: Object as PropType<BasicPropsType>,
    },
    file: {
      type: Object as PropType<FileItemType>,
      required: true,
    },
    showTableAction: {
      type: Object as PropType<PreviewTablePropType['showTableAction']>,
      required: true,
    },
    download: Function,
    isShowDeleteAction: Function as PropType<
      PreviewTablePropType['parentProps']['fileBranchIsShowDeleteAction']
    >,
    getPopupContainer: Function as PropType<({ parentElement: Element }) => Element>,
    onShowPopover: Function,
    width: { type: String, default: '840px' },
    getAppendNewestFile: Function as PropType<() => Recordable>,
    permissionControl: Number,
  },
  setup(props, { expose }) {
    // const { createMessage } = useMessage()
    const config = useGlobalConfig('components') as Ref<{
      TaUpload?: { queryFileHistory?: PromiseFn<any, Recordable>; removeFileById?: PromiseFn }
    }>
    const { queryFileHistory /* removeFileById */ } = config.value?.TaUpload ?? {}

    const loading = ref(true)
    const dataSource = ref([] as any[])
    const computedTableHeight = computed(() => {
      // 表格显示的行数(加上表头一行)
      let lineCount = dataSource.value.length + 1

      if (lineCount > 8) {
        return '400px'
      }

      if (lineCount < 5) {
        lineCount++
      }

      return `${DEFAULT_LINE_HEIGTH * lineCount}px`
    })
    // 文件预览
    const showPreview = ref(false)
    const previewRecord = ref<FileItemType[]>([])
    const columns: TableProColumn[] = [
      {
        title: tavI18n('Tav.file.columns.4'),
        field: 'version',
        minWidth: 100,
        customRender: ({ row }) => {
          return <>v{row.version}</>
        },
      },
      {
        title: tavI18n('Tav.file.columns.1'),
        field: 'fullName',
        customRender: ({ row }) => {
          return <>{row.hyperlink === 0 ? row.fullName : row.name}</>
        },
      },
      {
        title: tavI18n('Tav.file.columns.3'),
        field: 'fileSize',
        minWidth: 100,
      },
      {
        title: tavI18n('Tav.file.columns.5'),
        field: 'createByName',
      },

      {
        title: tavI18n('Tav.file.columns.8'),
        field: 'createTime',
        minWidth: 150,
        // customRender: ({ row: { createTime } }) => formatToDate(createTime),
      },
      {
        // width: 240,
        fixed: 'right',
        title: tavI18n('Tav.common.actions'),
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

    const getActions = (record: any) => {
      const actions: TableProActionItem[] = [
        {
          label: tavI18n('Tav.file.actions.1'),
          enabled: record.hyperlink !== 1,
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
          label: tavI18n('Tav.file.actions.4'),
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
          enabled: !!(record.hyperlink === 1
            ? false
            : (props.showTableAction.download ?? true) && record.sourceFileDownload),
          onClick() {
            props.download?.(record, undefined, undefined)
          },
        },
        // {
        //   label: '删除',
        //   permission: props.tableActionPermission.delete,
        //   enabled: !!(
        //     (props.showTableAction.delete ?? true) &&
        //     // @ts-ignore
        //     record.version !== dataSource.value[dataSource.value.length - 1].version &&
        //     props.isShowDeleteAction?.(record)
        //   ),
        //   // @ts-ignore
        //   popConfirm: {
        //     title: '是否确认删除?',
        //     confirm: () => {
        //       removeFileById?.(record.id, props.parentProps?.AppId).then(() => {
        //         createMessage.success('删除成功')
        //         getData()
        //       })
        //     },
        //   },
        // },
      ]
      return actions
    }
    const getData = () => {
      if (!queryFileHistory) {
        console.warn('请在APP.vue注入 queryFileHistory')
        return
      }

      queryFileHistory(
        { fileActualIds: [props.file.actualId], permissionControl: props.permissionControl },
        props.parentProps?.AppId
      )
        .then((res) => {
          let newestFile: undefined | Recordable = undefined

          if (
            (newestFile = props.getAppendNewestFile?.()) &&
            !res.data.some((el: any) => el.id === newestFile?.id)
          ) {
            res.data.push({
              ...newestFile,
              version: res.data[0] ? res.data[0].version + res.data.length : 1,
            })
          }
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
      if (popVisible.value) return
      props.onShowPopover?.()
      loading.value = true
      getData()
    }
    const hidePopover = () => {
      popVisible.value = false
    }

    expose({ hidePopover })

    return () => (
      <>
        <TaButton style="min-width:0" type="link" onClick={showPopover}>
          v{props.file.version}
        </TaButton>
        <TaModal
          visible={popVisible.value}
          title={`123`}
          width={800}
          wrapClassName={`ta-upload-file-branch-modal`}
          destroyOnClose={true}
          maskClosable={false}
          onVisible-change={(isOpen: boolean) => {
            if (!isOpen) {
              hidePopover()
            }
          }}
          getContainer={props.getPopupContainer as any}
        >
          {{
            title: () => (
              <div class="file-branch-title">
                <div class="file-branch-name">{props.file.fullName || props.file.name}</div>
                {/* <div class="file-branch-action" onClick={hidePopover}>
                  <TaButton type="text">
                    <CloseOutlined />
                  </TaButton>
                </div> */}
              </div>
            ),
            default: () => (
              <div
                style={{
                  // width: props.width,
                  height: computedTableHeight.value,
                }}
              >
                {/* {JSON.stringify(dataSource.value)} */}
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
            footer: () => null,
          }}
        </TaModal>

        <TaFileView
          AppId={props.parentProps?.AppId}
          show={showPreview.value}
          onUpdate:show={(v: any) => (showPreview.value = v)}
          list={previewRecord.value as any}
        />
      </>
    )
  },
})
