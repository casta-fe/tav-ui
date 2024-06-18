<template>
  <div class="ta-member-select-modal">
    <FormItemRest>
      <div class="member-box">
        <div v-if="tabActive === '1'" class="search-box">
          <Input v-model:value="keyword" :placeholder="tavI18n('Tav.member.11')" size="small">
            <template #suffix>
              <SearchOutlined />
            </template>
          </Input>
        </div>
        <Tabs v-model:activeKey="tabActive">
          <TabPane key="0" :tab="tavI18n('Tav.member.1')">
            <template v-if="propsData.multiple">
              <CheckboxGroup v-model:value="checkboxData">
                <Tree
                  :tree-data="orgTree"
                  block-node
                  :expanded-keys="orgExpandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  :selectable="false"
                  :load-data="getOrgUser"
                  :field-names="fieldNames"
                  @expand="onExpand"
                >
                  <template #title="item">
                    <!-- ant的bug 如果没查到会把他转成isleaf，但是 组织我们有不让选的 -->
                    <!-- {{ item.isLeaf }} == {{ item.leaf }} -->
                    <template v-if="item.isLeaf">
                      <Checkbox :value="item.userId" :disabled="item.disabled">
                        <firstLetter :value="item" />{{ item.name }}
                        <template v-if="item.status === 0">
                          ({{ tavI18n('Tav.member.4') }})
                        </template>
                      </Checkbox>
                    </template>
                    <template v-else> <i class="icon-select-org" /> {{ item.name }} </template>
                  </template>
                </Tree>
              </CheckboxGroup>
            </template>
            <template v-else>
              <RadioGroup v-model:value="radioData">
                <Tree
                  :tree-data="orgTree"
                  block-node
                  :expanded-keys="orgExpandedKeys"
                  :auto-expand-parent="autoExpandParent"
                  :selectable="false"
                  :load-data="getOrgUser"
                  :field-names="fieldNames"
                  @expand="onExpand"
                >
                  <template #title="item">
                    <template v-if="item.isLeaf && !item.leaf">
                      <Radio :value="item.userId" :disabled="item.disabled">
                        <firstLetter :value="item" /> {{ item.name }}
                        <template v-if="item.status === 0">
                          ({{ tavI18n('Tav.member.4') }})
                        </template>
                      </Radio>
                    </template>
                    <template v-else>
                      <i class="icon-select-org" />
                      {{ item.name }}
                    </template>
                  </template>
                </Tree>
              </RadioGroup>
            </template>
          </TabPane>
          <TabPane key="1" :tab="tavI18n('Tav.member.2')">
            <div v-if="keyword.length === 0" class="user-wrap">
              <div class="letter-list">
                <span
                  v-for="item in letterList"
                  :key="item.key"
                  :class="{ on: activeLetter == item.key }"
                  @click="letterClick(item.key)"
                  >{{ item.key }}</span
                >
              </div>
              <div id="userListRef" class="user-list">
                <template v-if="propsData.multiple">
                  <CheckboxGroup v-model:value="checkboxData">
                    <ul v-for="item in letterList" :key="item.key" :data-id="item.key">
                      <li :id="'letter-' + item.key">
                        <b>{{ item.key }}</b>
                      </li>
                      <li v-for="v in item.list" :key="v.id">
                        <Checkbox :value="v.id" :disabled="v.disabled">
                          <firstLetter :value="v" />{{ v.name }}
                          <template v-if="v.status === 0">
                            ({{ tavI18n('Tav.member.4') }})
                          </template>
                          <template v-if="repeatUserNames.includes(v.name)">
                            <span>（{{ v.phone }}）</span>
                          </template>
                        </Checkbox>
                        <p class="org-name">{{ getOrgName(v) }}</p>
                      </li>
                    </ul>
                  </CheckboxGroup>
                </template>
                <template v-else>
                  <RadioGroup v-model:value="radioData">
                    <ul v-for="item in letterList" :key="item.key" :data-id="item.key">
                      <li :id="'letter-' + item.key">
                        <b>{{ item.key }}</b>
                      </li>
                      <li v-for="v in item.list" :key="v.id">
                        <Radio :value="v.id" :disabled="v.disabled">
                          <firstLetter :value="v" />{{ v.name }}
                          <template v-if="v.status === 0">
                            ({{ tavI18n('Tav.member.4') }})
                          </template>
                          <template v-if="repeatUserNames.includes(v.name)">
                            <span>（{{ v.phone }}）</span>
                          </template>
                        </Radio>
                        <p class="org-name">{{ getOrgName(v) }}</p>
                      </li>
                    </ul>
                  </RadioGroup>
                </template>
              </div>
            </div>
            <div v-else class="user-wrap">
              <!-- {{ realUserList }} -->
              <template v-if="propsData.multiple">
                <CheckboxGroup v-model:value="checkboxData">
                  <ul>
                    <li v-for="v in realUserList" :key="v.id">
                      <Checkbox :value="v.id" :disabled="v.disabled">
                        <firstLetter :value="v" />{{ v.name }}
                        <template v-if="v.status === 0"> ({{ tavI18n('Tav.member.4') }}) </template>
                        <template v-if="repeatUserNames.includes(v.name)">
                          <span>（{{ v.phone }}）</span>
                        </template>
                      </Checkbox>
                      <p class="org-name">{{ getOrgName(v) }}</p>
                    </li>
                  </ul>
                </CheckboxGroup>
              </template>
              <template v-else>
                <RadioGroup v-model:value="radioData">
                  <ul>
                    <li v-for="v in realUserList" :key="v.id">
                      <Radio :value="v.id" :disabled="v.disabled">
                        <firstLetter :value="v" />{{ v.name }}
                        <template v-if="v.status === 0"> ({{ tavI18n('Tav.member.4') }}) </template>
                        <template v-if="repeatUserNames.includes(v.name)">
                          <span>（{{ v.phone }}）</span>
                        </template>
                      </Radio>
                      <p class="org-name">{{ getOrgName(v) }}</p>
                    </li>
                  </ul>
                </RadioGroup>
              </template>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div v-if="propsData.multiple" class="selected-box">
        <div class="select-hd">
          <div class="num">
            {{ tavI18n('Tav.member.5') }} {{ tagList.length }}
            {{ tavI18n('Tav.member.10') }}
          </div>
          <div class="ctrl">
            <Button type="link" @click="clearTag">{{ tavI18n('Tav.member.6') }}</Button>
          </div>
        </div>
        <div class="select-bd">
          <span v-for="item in tagList" :key="item.id" class="tag">
            {{ item.name }}
            <CloseCircleOutlined @click="removeTag(item.id)" />
          </span>
        </div>
      </div>
    </FormItemRest>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, reactive, ref, toRefs, watch } from 'vue'
import {
  Checkbox,
  CheckboxGroup,
  FormItemRest,
  Input,
  Radio,
  RadioGroup,
  TabPane,
  Tabs,
  Tree,
} from 'ant-design-vue'
import pinyin from 'js-pinyin'
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { countBy, pickBy, sortBy } from 'lodash-es'
import Button from '@tav-ui/components/button'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { tavI18n } from '@tav-ui/locales'
import FirstLetter from './first-letter.vue'
import type { UserItem, letterItem } from '../types'

const { createConfirm } = useMessage()
export default defineComponent({
  components: {
    Tree,
    Button,
    Tabs,
    Input,
    TabPane,
    CheckboxGroup,
    Checkbox,
    RadioGroup,
    Radio,
    FirstLetter,
    FormItemRest,
    SearchOutlined,
    CloseCircleOutlined,
  },
  props: {
    selectedData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const propsData = inject('propsData') as any
    const userList = inject('userList') as any
    const orgList = inject('orgList') as any
    const orgTree = ref<any[]>([])
    const state = reactive({
      fieldNames: {
        title: 'name',
        value: 'id',
        key: 'id',
      },
      keyword: '',
      orgExpandedKeys: [] as any[],
      autoExpandParent: true,
      tabActive: '1', //tab切换默认栏
      checkboxData: [] as any[],
      radioData: '' as any,
      letterList: [] as letterItem[], //用户列表的字母顺序表
      listenScroll: true, //是否监听滚动，点击时候要设置为false
      activeLetter: '', //当前选中的字母
    })
    const repeatUserNames = ref<string[]>([])
    const realUserList = computed(() => {
      return userList.value.filter(
        (v: UserItem) => v.name.includes(state.keyword) || v.fullCharts.includes(state.keyword)
      )
    })
    // 多选时候右侧展示的列表
    const tagList = computed((): any[] => {
      return userList.value.filter((item: any) => state.checkboxData.some((v) => v === item.id))
    })
    // 是否显示组织的tab,如果传入了options 就不显示org？这个很奇怪 不过先留着
    const hideOrgTabs = computed(() => {
      return propsData.value.noOrg || !!propsData.value.options
    })
    // 移除已选中的用户
    const removeTag = (id): void => {
      const data = state.checkboxData
      const index = data.findIndex((v) => v == id)
      data.splice(index, 1)
    }
    // 清空已选中的列表
    const clearTag = (): void => {
      createConfirm({
        iconType: 'warning',
        content: tavI18n('Tav.member.7'),
        onOk() {
          state.checkboxData = []
        },
      })
    }
    // 获取全部用户首字母，并将其分类
    const userDataRest = () => {
      const list: letterItem[] = []

      userList.value.forEach((v: any) => {
        const chart = pinyin.getCamelChars(v.name)[0]
        const upperChart = chart.toUpperCase()
        // 如果列表中有了就往他的list中插入
        Reflect.has(v, 'disabled') ||
          (v.disabled = propsData.value.useDisabledUser
            ? false
            : propsData.value.ignoreFrozenUser
            ? v.status === 0
            : false)
        const item = list.find((v) => v.key === upperChart)
        if (item) {
          item.list.push(v)
        } else {
          list.push({
            key: upperChart,
            list: [v],
          })
        }
      })
      state.letterList = sortBy(list, 'key')
      if (state.letterList.length > 0) {
        state.activeLetter = state.letterList[0].key
      }
    }
    // 点击字母滚动到对应的位置
    const letterClick = (key: string) => {
      state.listenScroll = false
      const dom = document.getElementById(`letter-${key}`)
      const userListRef = document.getElementById('userListRef')
      if (dom && userListRef) {
        userListRef.scrollTop = dom?.offsetTop - 60 || 0
        state.activeLetter = key
        // 延迟运行监听滚动
        setTimeout(() => {
          state.listenScroll = true
        }, 500)
      }
    }

    // 部门树加载用户
    const getOrgUser = (treeNode: any) => {
      return new Promise((resolve) => {
        const oldData = treeNode.dataRef.children
        // if (oldData.length == 0) {
        //   resolve(null)
        //   return
        // }
        const children = userList.value
          .filter((v: any) => v.userOrgs?.some((v: any) => v.organizationId == treeNode.id))
          .map((user: any) => {
            const obj = { ...user }
            obj.isLeaf = true
            //  用户id可能和组织id冲突，所以加个类型区分下
            obj.userId = user.id
            obj.id = `name-${user.id}`
            // 忽略列表中的用户需要禁止选中
            obj.disabled = propsData.useDisabledUser
              ? false
              : propsData.value.ignoreUser.includes(user.userId) || user.status === 0
            return obj
          })
        treeNode.dataRef.children = deWeightThree([...oldData, ...children])
        orgTree.value = [...orgTree.value]
        resolve(null)
      })
    }
    // 数据去重
    const deWeightThree = (arr: any[]) => {
      const map = new Map()
      for (const item of arr) {
        if (!map.has(item.id)) {
          map.set(item.name, item)
        }
      }
      return [...map.values()]
    }
    const openFirstOrg = () => {
      // 默认打开第一个节点，并获取他下面的用户
      // 如果当前打开的就是第一个就不执行后面的
      if (orgTree.value.length === 0) {
        console.log(orgList)
        orgTree.value = orgList?.value[0].children || []
      }
    }
    // 监听滚动 设置当前选中的字母
    const listenerUserScroll = (): void => {
      const userListRef: HTMLElement | null = document.getElementById('userListRef')
      if (userListRef) {
        userListRef.addEventListener('scroll', () => {
          if (state.listenScroll) {
            const ulList = userListRef?.childNodes[0].childNodes as NodeListOf<HTMLElement>
            if (ulList) {
              ulList.forEach((v: HTMLElement) => {
                // if(v.offsetTop>0&&)
                if (v.nodeName == 'UL') {
                  if (userListRef) {
                    const dis = v.offsetTop - userListRef.scrollTop
                    if (dis > 0 && dis < 100) {
                      state.activeLetter = v.getAttribute('data-id') || ''
                    }
                  }
                }
              })
            }
          }
        })
      }
    }
    const onExpand = (keys: string[]) => {
      state.orgExpandedKeys = keys
      state.autoExpandParent = false
    }
    const getOrgName = (user: UserItem) => {
      return user.userOrgs?.map((v) => v.organizationName).join('，')
    }
    watch(
      () => state.checkboxData,
      (val) => {
        emit('change', val)
      }
    )
    watch(
      () => state.radioData,
      (val) => {
        emit('change', val)
      }
    )
    watch(
      () => state.tabActive,
      (a) => {
        if (a == '0') {
          openFirstOrg()
        }
      }
    )
    watch(
      () => userList.value.length,
      () => {
        pageInit()
      }
    )
    const getRepeatUserNames = () => {
      const counts = countBy(userList.value, 'name')
      const duplicates = pickBy(counts, (count) => count > 1)
      repeatUserNames.value = Object.keys(duplicates) as string[]
    }
    const pageInit = (): void => {
      const data: any[] = props.selectedData
      if (propsData.value.multiple) {
        state.checkboxData = [...data[0]]
      } else {
        if (data.length > 0) {
          state.radioData = data[0]
        }
      }
      getRepeatUserNames()
      if (propsData.value.type == 'user') {
        userDataRest()
      }
    }
    onMounted(() => {
      pageInit()
      listenerUserScroll()
    })
    return {
      ...toRefs(state),
      tavI18n,
      repeatUserNames,
      getOrgName,
      hideOrgTabs,
      propsData,
      userList,
      orgTree,
      tagList,
      realUserList,
      getOrgUser,
      removeTag,
      clearTag,
      onExpand,
      letterClick,
    }
  },
})
</script>
