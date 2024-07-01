import { tavI18n } from '@tav-ui/locales'
import { getPopupContainer } from '@tav-ui/utils/basic'
import type { ExtractPropTypes, PropType } from 'vue'
export interface UserOrgs {
  organizationId: number
  organizationName: string
  userId: number
  userName: string
  type: string
}
export interface UserItem {
  id: string
  fullCharts: string
  name: string
  phone: string
  sex: number
  status: number
  disabled: boolean
  ifShow: boolean
  userOrgs: UserOrgs[]
}
export interface Options extends UserItem {
  label: string
  value: string
}

export type TypeItems = 'user' | 'org'
export interface LetterItemList extends UserItem {
  id: string
  name: string
  checked: boolean
}
export interface letterItem {
  key: string
  list: LetterItemList[]
}

/* 
@ TypeItems: 类型 user|org 默认user
*/
/**
 * @interface memberSelectProps
 * @TypeItems 类型 user|org 默认user
 * @userListApi 请求用户的列表
 * @userListParams 请求用户的参数
 * @options 用户下拉列表，如果传入了就不再调用接口
 * @noSelect 不显示下拉，需要手动调用 组件的showModal()
 * @noOrg 不显示组织选择
 * @multiple 是否多选
 * @ignoreUser 忽略的用户id列表
 * @isIgnoreFrozen 是否忽略冻结的用户
 */
export const memberSelectProps = {
  // 选中的值
  value: {
    type: [String, Number, Array],
    default: null,
  },
  options: {
    type: Array as PropType<UserItem[]>,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
  // 弹窗标题
  title: {
    type: String,
    default: tavI18n('Tav.member.3'),
  },
  // 类型，可用选项 user, org
  type: {
    type: String as PropType<TypeItems>,
    default: 'user',
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 忽略用户列表
  ignoreUser: {
    type: Array,
    default: [],
  },
  // 是否忽略已冻结用户
  ignoreFrozenUser: {
    type: Boolean,
    default: true,
  },
  // 请求用户列表的api，某些情况下不是使用所有用户,暂时不用
  userListApi: {
    type: Function as PropType<(...arg) => Promise<any>>,
    // default: TaMemberSelectApi.value.userListApi,
  },
  orgApi: {
    type: Function as PropType<(...arg) => Promise<any>>,
    // default: TaMemberSelectApi.value.orgApi,
  },
  userListParams: {
    type: Object,
  },

  // 不显示组织
  noOrg: {
    type: Boolean,
    default: false,
  },
  // 不显示下拉
  noSelect: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: tavI18n('Tav.common.chooseText'),
  },
  // 下拉框最大tag树
  maxTagCount: {
    type: Number,
    default: 3,
  },
  // 下拉框tag的placeholder
  maxTagPlaceholder: {
    type: String,
  },
  allowClear: {
    type: Boolean,
    default: false,
  },
  getPopupContainer: {
    type: Function,
    getPopupContainer,
  },
  useDisabledUser: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
  },
  codeField: {
    type: String,
  },
  formValues: {
    type: Object,
  },
  change: {
    type: Function,
  },
  modalSubmit: {
    type: Function,
  },
  treeCheckStrictly: {
    type: Boolean,
    default: false,
  },
}

export type MemberSelectProps = ExtractPropTypes<typeof memberSelectProps>
