import { type PropType, defineComponent, ref } from 'vue'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { tavI18n } from '@tav-ui/locales'
import type { BasicPropsType, Recordable } from '../types'

export const UpdateFile = defineComponent({
  name: 'TaUpDateFile',
  props: {
    parentProps: {
      type: Object as PropType<BasicPropsType>,
      default: () => {
        return {}
      },
    },
    accept: {
      type: String as PropType<BasicPropsType['accept']>,
      // .tar,.tar.gz,.tgz,.rar,zip,.7z,去掉压缩包 // .bpm,.txt
      default: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.gif,.jpeg,.jpg,.png,',
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
    const uploadFile = config.value?.TaUpload?.uploadFile
    let fileActualIds = ''
    let rawFile: Recordable = {}

    const fileChange = async (event) => {
      const files = event.target.files
      const { beforeUpload } = props.parentProps

      if (beforeUpload && !(await beforeUpload(files))) {
        uploadRef.value.value = ''
        return
      }

      const formData = new FormData()
      let updateFlag = true

      /**
       * ***新上传文件***
       *
       * 返回值: upload 接口 version==1, updateFile 接口 version==0
       *
       * 调用上传接口 && 未绑定 id/key -> 新上传文件
       */
      const isAdd = 1 === rawFile.version && !(rawFile.businessId || rawFile.businessKey)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size / 1024 / 1024 > 1024) {
          updateFlag = false
          createMessage.warn(
            `${file.name}:${Math.floor(file.size / 1024 / 1024)}MB${tavI18n(
              'Tav.common.greater'
            )}1GB`
          )
        }
        // const regexpStr = `[\\\\/:*?"<>|]`
        // const fileRegexp = new RegExp(regexpStr, 'g')
        // if (fileRegexp.test(file.name)) {
        //   createMessage.warn(`${file.name} ${tavI18n('Tav.file.upload.5')}${regexpStr}`)
        //   return false
        // }
        if (!updateFlag) {
          return
        }
        formData.append('files', file)
        isAdd || formData.append('fileActualIds', fileActualIds)
      }

      if (isAdd) {
        formData.append('typeCode', rawFile.typeCode)
        formData.append('moduleCode', rawFile.moduleCode)

        uploadFile(formData, props.parentProps?.AppId)
          .then((res) => {
            createMessage.success(tavI18n('Tav.file.message.8'))
            uploadRef.value.value = ''
            emit('updateSuccess', res.data[0], fileActualIds)
          })
          .catch((err) => {
            uploadRef.value.value = ''
            emit('updateFail', err)
          })

        return
      }

      updateApi(formData, props.parentProps?.AppId, props.parentProps?.immediate)
        .then((res) => {
          createMessage.success(tavI18n('Tav.file.message.8'))
          uploadRef.value.value = ''
          emit('updateSuccess', res.data[0], fileActualIds)
        })
        .catch((err) => {
          uploadRef.value.value = ''
          emit('updateFail', err)
        })
    }
    const showFilePicker = (file) => {
      rawFile = file

      fileActualIds = file.actualId
      uploadRef.value.click()
    }
    expose({ showFilePicker })
    return () => (
      <div style="position: absolute; z-index: -999;opacity: 0;">
        <input
          // multiple
          ref={uploadRef}
          type="file"
          accept={props.accept}
          onChange={fileChange.bind(this)}
        />
      </div>
    )
  },
})
