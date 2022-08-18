/*
 * 更新文件组件，纯原生的上传
 */
import { defineComponent, ref, watch } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import type { BasicPropsType } from './types'
export default defineComponent({
  name: 'TaUpDateFile',
  components: {},
  props: {
    accept: {
      type: String as PropType<BasicPropsType['accept']>,
      default:
        '.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.gif,.bpm,.jpeg,.zip,.7z,.tar,.tar.gz,.tgz,.rar,.txt',
    },
    fileActualIds: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  etmis: ['updateSuccess'],
  setup(props, { emit }) {
    const config = useGlobalConfig('components')
    const { createMessage } = useMessage()
    const uploadRef = ref()
    const fileChange = (event) => {
      const updateApi = config.value.TaUpload.updateFile

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
        formData.append('fileActualIds', props.fileActualIds)
      }
      updateApi(formData).then((res) => {
        uploadRef.value.value = ''
        emit('updateSuccess', res.data)
      })
    }
    watch(
      () => props.fileActualIds,
      (ids) => {
        if (ids.length > 0) {
          console.log(ids)
          uploadRef.value.click()
        }
      }
    )
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
