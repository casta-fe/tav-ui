<template>
  <div class="ta-member-select">
    <div v-if="!noSelect">
      <template v-if="type == 'user'">
        <Select
          ref="userSelectRef"
          v-model:value="selectedData[0]"
          show-search
          dropdown-class-name="ta-member-select-option"
          option-filter-prop="label"
          :allow-clear="allowClear"
          :options="userOptions"
          :max-tag-count="maxTagCount"
          :max-tag-placeholder="maxTagPlaceholder"
          :disabled="disabled"
          :placeholder="placeholder"
          :mode="multiple ? 'multiple' : undefined"
          :autofocus="autofocus"
          :default-open="defaultOpen"
          :get-popup-container="getPopupContainer"
          @dropdown-visible-change="userVisibleChange"
          @change="emitHandle"
          @blur="handleBlur"
        >
          <template #option="item">
            <div class="ta-member-select-option-item">
              <span>{{ item.label }} <template v-if="item.status === 0"> (已冻结) </template></span>
              <span>{{ item.sex == 1 ? '男' : '女' }}</span>
              <span>{{ item.phone }}</span>
            </div>
          </template>
          <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <div
              v-if="userList.length > 0"
              class="ta-member-select-option-more"
              @mousedown="(e) => e.preventDefault()"
              @click="userShowMore"
            >
              <a href="javascript:;">查看更多</a>
            </div>
          </template>
        </Select>
      </template>
      <template v-else>
        <TreeSelect
          v-model:value="selectedData[0]"
          dropdown-class-name="ta-member-select-tree"
          tree-node-filter-prop="title"
          show-search
          tree-icon
          :tree-default-expanded-keys="orgExpandedKey"
          :allow-clear="allowClear"
          :max-tag-count="maxTagCount"
          :max-tag-placeholder="maxTagPlaceholder"
          :disabled="disabled"
          :placeholder="placeholder"
          :multiple="multiple"
          :tree-data="orgList"
          :replace-fields="orgFileds"
          :autofocus="autofocus"
          :default-open="defaultOpen"
          :get-popup-container="getPopupContainer"
          @change="emitHandle"
        >
          <!-- :treeDefaultExpandedKeys="orgExpandedKey" -->
          <!-- 自己循环得递归，暂时不这样写 -->
          <!-- <TreeSelectNode v-for="item in orgList" :key="item.id">
          {{item.name}}
        </TreeSelectNode> -->
        </TreeSelect>
      </template>
    </div>
    <BasicModal
      :title="title"
      :width="850"
      :destroy-on-close="true"
      :get-container="getPopupContainer"
      @register="registerMemberModal"
    >
      <div style="min-height: 360px">
        <MemberModal v-if="modalIsShow" :selected-data="selectedData" @change="modalChange" />
      </div>

      <template #footer>
        <Button type="primary" @click="modalSubmit">确定</Button>
        <Button @click="hideModal">取消</Button>
      </template>
    </BasicModal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, provide, reactive, ref, toRefs, watch } from 'vue'
import { Select, TreeSelect } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import Button from '@tav-ui/components/button'
import BasicModal from '@tav-ui/components/modal'
import { useModal } from '@tav-ui/components/modal/src/hooks/useModal'
import { useGlobalConfig } from '@tav-ui/hooks/global/useGlobalConfig'
import MemberModal from './components/member-modal.vue'
import { memberSelectProps } from './types'
import type { Ref } from 'vue'
import type { Options, UserItem } from './types'
export default defineComponent({
  name: 'TaMemberSelect',
  components: {
    VNodes: (_, { attrs }) => {
      return attrs.vnodes
    },
    BasicModal,
    MemberModal,
    Button,
    Select,
    TreeSelect,
  },
  props: memberSelectProps,
  emits: ['change', 'update:value', 'blur'],
  setup(props, { emit }) {
    const userSelectRef = ref<any>(null)
    const state = reactive({
      modalIsShow: false,
      count: 0,
      selectedData: [] as any[], //组件里面选中的数据
      catchData: [] as any[],
      userList: [] as UserItem[],
      orgList: [] as any, //组织树下用的数据
      orgExpandedKey: [] as any[], //默认展开的数据
      orgFileds: {
        children: 'children',
        title: 'name',
        key: 'id',
        value: 'id',
      },
    })
    provide(
      'propsData',
      computed(() => props)
    )
    provide(
      'userList',
      computed(() => state.userList)
    )
    provide(
      'orgList',
      computed(() => state.orgList)
    )
    const globalConfig = useGlobalConfig('components') as Ref<Record<string, any>>
    const orgApi = globalConfig.value?.TaMemberSelect?.orgApi || props.orgApi
    const allUserList = globalConfig.value?.TaMemberSelect?.allUserList || []
    const userListApi = props.userListApi || globalConfig.value?.TaMemberSelect?.userListApi
    const userOptions = computed(() => {
      const list: Options[] = []
      state.userList.forEach((v) => {
        // 非ignoreUser的用户才能选择
        list.push({
          label: v.name,
          value: v.id,
          phone: v.phone,
          status: v.status,
          disabled: v.disabled, //已冻结（离职）的不能选
          sex: v.sex,
        })
      })
      return list
    })
    const [registerMemberModal, { openModal: openMemberModal, closeModal: closeMemberModal }] =
      useModal()

    const showModal = () => {
      // 如果是用户选择器，打开弹窗时候 也请求下组织列表，可以根据组织选择用户
      if (props.type == 'user') {
        getUserList(2)
        if (!props.noOrg) {
          getOrgList()
        }
      }
      if (props.type == 'org') {
        getOrgList()
      }
      if (userSelectRef.value) {
        userSelectRef.value.blur()
      }
      // 某些情况下直接拉起弹窗，那么就需要重置下数据和请求用户列表
      setBaseData()
      //  延迟出现，防止互相覆盖
      openMemberModal()
      state.modalIsShow = true
    }
    const hideModal = () => {
      state.modalIsShow = false
      nextTick(() => {
        closeMemberModal()
      })
    }

    // 这块是用户基础数据，更多选项里面也有用
    const getTrueUserList = (userList = [] as UserItem[]) => {
      const list: UserItem[] = userList
        .map((v) => {
          // 非ignoreUser的用户才能选择
          const obj = { ...v }
          if (!Reflect.has(obj, 'disabled') && !props.ignoreUser.includes(obj.id)) {
            obj.disabled = props.ignoreFrozenUser ? obj.status === 0 : false
          }
          return obj
        })
        .sort((a) => {
          return a.disabled ? 1 : -1
        })
      return list
    }
    // 获取用户数据
    const getUserList = (type) => {
      // console.log(type)
      state.count++
      // console.log(type, state.count)
      if (Array.isArray(props.options)) {
        // 将其处理成 人员的数据格式
        // let data = JSON.parse(JSON.stringify(props.options));
        state.userList = getTrueUserList(props.options)
      } else {
        userListApi({
          ...props.userListParams,
        }).then((res) => {
          state.userList = getTrueUserList(res.data)
        })
      }
      checkUserIsExist()
    }
    // 获取组织数据
    const getOrgList = (): void => {
      orgApi({}).then((res) => {
        state.orgList = res.data
      })
    }
    // 弹窗里面的数据变化
    const modalChange = (value) => {
      state.catchData = value
    }
    // 弹窗下面的确定事件
    const modalSubmit = (): void => {
      const data = state.catchData
      const submit = () => {
        // 多选第一位为数组，单选第一位为字符串
        state.selectedData[0] = data
        emitHandle()
        hideModal()
      }
      if (props.modalSubmit) {
        props.modalSubmit(data, submit)
      } else {
        submit()
      }
    }
    const emitHandle = (): void => {
      const userMap = allUserList.filter((v) => {
        if (props.multiple) {
          return state.selectedData[0].includes(v.id)
        } else {
          return state.selectedData[0] == v.id
        }
      })
      emit('update:value', state.selectedData[0])
      emit('change', state.selectedData[0], userMap)
    }

    const handleBlur = () => {
      emit('blur', state.selectedData[0])
    }

    // 将传入的value保存为组件使用的数据
    const setBaseData = (): void => {
      if (props.multiple) {
        if (!Array.isArray(props.value)) {
          console.warn('多选默认值请传入数组')
          state.selectedData = [[]]
        } else {
          state.selectedData = [[...props.value]]
          checkUserIsExist()
        }
      } else {
        state.selectedData = props.value ? [props.value] : [null]
        checkUserIsExist()
      }
    }
    // 检查用户在当前的用户列表中是否存在，不存在就去全部用户列表中匹配，匹配到后塞到现有用户列表中去
    const checkUserIsExist = () => {
      if (props.multiple) {
        state.selectedData[0].forEach((userId) => {
          getUserItem(userId)
        })
      } else {
        getUserItem(state.selectedData[0])
      }
      function getUserItem(userId) {
        // 如果当前用户列表中查不到该用户就在所用用户中去匹配，匹配到后插入当当前用户列表中
        if (!state.userList.some((v) => v.id === userId)) {
          const item = allUserList.find((v) => v.id === userId)
          if (item) {
            state.userList.push(item)
          }
        }
      }
    }

    // 下拉列表中的查看更多点击事件
    const userShowMore = () => {
      setTimeout(() => {
        showModal()
      }, 200)
    }
    const userVisibleChange = () => {
      // if (v) {
      // }
    }
    const orgVisibleChange = () => {
      // console.log(v);
    }

    watch(
      () => state.orgList,
      (newData) => {
        if (props.multiple) {
          state.orgExpandedKey =
            state.selectedData[0].length > 0 ? state.selectedData[0] : [newData[0].id]
        } else {
          state.orgExpandedKey = state.selectedData[0] ? state.selectedData : [newData[0].id]
        }
      },
      {
        deep: true,
      }
    )
    watch(
      () => props.ignoreUser,
      (a, b) => {
        if (!isEqual(a, b)) {
          getUserList(4)
        }
      }
    )
    watch(
      () => props.options,
      (data) => {
        if (data) {
          getUserList(5)
        }
      },
      {
        deep: true,
      }
    )
    watch(
      () => props.value,
      () => {
        // 组件绑定的是 selectedData第一位
        setBaseData()
      }
    )
    // 页面初始化
    const pageInit = (): void => {
      setBaseData()
      if (props.type == 'user') {
        // 如果默认不显示select就不请求用户
        if (props.noSelect) {
          return
        }
        getUserList(1)
      } else {
        getOrgList()
      }
    }
    pageInit()
    return {
      userSelectRef,
      ...toRefs(state),
      userOptions,
      userShowMore,
      userVisibleChange,
      orgVisibleChange,
      showModal,
      hideModal,
      modalChange,
      modalSubmit,
      emitHandle,
      handleBlur,
      registerMemberModal,
    }
  },
})
</script>
