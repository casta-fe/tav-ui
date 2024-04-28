import { type Ref, defineComponent, unref } from 'vue'
import { TaButton, TaForm, useForm } from '@tav-ui/components'
import { tavI18n } from '@tav-ui/locales'
import { ADDRESS_PATTERN } from './config'
import type { PropType } from 'vue'

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
          label: tavI18n('Tav.file.columns.1'),
          required: true,
          component: 'Input',
          colProps: { span: 10 },
          componentProps: {
            maxLength: 100,
          },
        },
        {
          field: 'address',
          label: tavI18n('Tav.file.columns.9'),
          component: 'Input',
          colProps: { span: 10 },
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
              {tavI18n('Tav.file.upload.3')}
            </TaButton>
          ),
        }}
      </TaForm>
    )
  },
})
