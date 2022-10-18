import { type PropType, defineComponent, ref } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import type { BasicPropsType } from '../types'

export const UpdateFile = defineComponent({
  name: 'TaUpDateFile',
  props: {
    parentProps: {
      type: Object as PropType<BasicPropsType>,
    },
    accept: {
      type: String as PropType<BasicPropsType['accept']>,
      default:
        '.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.gif,.bpm,.jpeg,.zip,.7z,.tar,.tar.gz,.tgz,.rar,.txt',
    },
    onUpdateFail: Function,
    onUpdateSuccess: Function,
    readonly: {
      type: Boolean,
    },
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
      updateApi(formData, props.parentProps?.AppId)
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