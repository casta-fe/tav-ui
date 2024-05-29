import { defineComponent, reactive } from 'vue'
import { Input } from 'vxe-table'
import { TaForm, useForm } from '@tav-ui/components'
import { tavI18n } from '@tav-ui/locales'
import { ADDRESS_PATTERN } from './config'
import type { PropType } from 'vue'
import type { FileItemType } from '../types'

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
              message: tavI18n('Tav.file.message.7'),
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
          //@ts-ignore
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
