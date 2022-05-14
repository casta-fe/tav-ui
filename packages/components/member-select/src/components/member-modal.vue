<template>
  <div class="ta-member-select-modal">
    <div class="member-box">
      <Tabs v-model:activeKey="tabActive">
        <TabPane v-if="!hideOrgTabs" key="0" tab="部门">
          <template v-if="propsData.multiple">
            <CheckboxGroup v-model:value="checkboxData">
              <Tree
                :tree-data="orgList"
                block-node
                :expanded-keys="orgExpandedKeys"
                :auto-expand-parent="autoExpandParent"
                :selectable="false"
                :load-data="getOrgUser"
                :replace-fields="replaceFields"
                @expand="onExpand"
              >
                <template #title="item">
                  <template v-if="item.isLeaf">
                    <Checkbox :value="item.id" :disabled="item.disabled">
                      <firstLetter :value="item" />{{ item.name }}
                      <template v-if="item.status === 0"> (已冻结) </template>
                    </Checkbox>
                  </template>
                  <template v-else>
                    <i v-if="item.type == 1" class="icon-select-company" />
                    <i v-if="item.type == 2" class="icon-select-org" />
                    <i v-if="item.type == 3" class="icon-select-group" />
                    {{ item.name }}
                  </template>
                </template>
              </Tree>
            </CheckboxGroup>
          </template>
          <template v-else>
            <RadioGroup v-model:value="radioData">
              <Tree
                :tree-data="orgList"
                block-node
                :expanded-keys="orgExpandedKeys"
                :auto-expand-parent="autoExpandParent"
                :selectable="false"
                :load-data="getOrgUser"
                :replace-fields="replaceFields"
                @expand="onExpand"
              >
                <template #title="item">
                  <template v-if="item.isLeaf">
                    <Radio :value="item.id" :disabled="item.disabled">
                      <firstLetter :value="item" /> {{ item.name }}
                      <template v-if="item.status === 0"> (已冻结) </template>
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
        <TabPane key="1" tab="成员">
          <div class="user-wrap">
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
                        <template v-if="v.status === 0"> (已冻结) </template>
                      </Checkbox>
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
                        <template v-if="v.status === 0"> (已冻结) </template>
                      </Radio>
                    </li>
                  </ul>
                </RadioGroup>
              </template>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div v-if="propsData.multiple" class="selected-box">
      <div class="select-hd">
        <div class="num">已选中 {{ tagList.length }} 个</div>
        <div class="ctrl"><Button type="primary" @click="clearTag">清空选择</Button></div>
      </div>
      <div class="select-bd">
        <span v-for="item in tagList" :key="item.id" class="tag">
          {{ item.name }}
          <CloseCircleOutlined @click="removeTag" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, reactive, toRefs, watch } from 'vue'
import { Checkbox, CheckboxGroup, Radio, RadioGroup, TabPane, Tabs, Tree } from 'ant-design-vue'
import pinyin from 'js-pinyin'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import Button from '@tav-ui/components/button'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import FirstLetter from './first-letter.vue'
import type { LetterItemList, letterItem } from '../types'

const { createConfirm } = useMessage()
export default defineComponent({
  components: {
    Tree,
    Button,
    Tabs,
    TabPane,
    CheckboxGroup,
    Checkbox,
    RadioGroup,
    Radio,
    FirstLetter,
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
    console.log(orgList)
    const state = reactive({
      replaceFields: {
        title: 'name',
        value: 'id',
        key: 'id',
      },
      orgExpandedKeys: [] as any[],
      autoExpandParent: true,
      tabActive: '1', //tab切换默认栏
      checkboxData: [] as any[],
      radioData: '' as any,
      letterList: [] as letterItem[], //用户列表的字母顺序表
      listenScroll: true, //是否监听滚动，点击时候要设置为false
      activeLetter: '', //当前选中的字母
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
        content: '确定清空选中的用户？',
        onOk() {
          state.checkboxData = []
        },
      })
    }
    // 获取全部用户首字母，并将其分类
    const userDataRest = () => {
      const letterObj = {}
      userList.value.forEach((v: any) => {
        const chart = pinyin.getCamelChars(v.name)[0]
        const upperChart = chart.toUpperCase()
        if (!letterObj[upperChart]) {
          letterObj[upperChart] = [v]
        } else {
          letterObj[upperChart].push(v)
        }
      })
      state.letterList = Object.keys(letterObj)
        .sort()
        .map((v) => {
          return {
            key: v,
            list: letterObj[v] as LetterItemList[],
          }
        })
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
        // let { start } = useScrollTo({
        //   el: userListRef,
        //   to: dom?.offsetTop - 60 || 0,
        //   duration: 50,
        //   direction: "scrollTop"
        // });
        // start();
      }
    }

    // 部门树加载用户
    const getOrgUser = (treeNode: any) => {
      return new Promise((resolve) => {
        const oldData = [...treeNode.dataRef.children]
        if (oldData.length == 0) {
          console.log('没数据')
        }
        const children = userList.value
          .filter((v: any) => v.organizationId == treeNode.eventKey)
          .map((v: any) => {
            v.isLeaf = true
            // 忽略列表中的用户需要禁止选中
            // v.disabled = propsData.value.ignoreUser.includes(v.id);
            return v
          })
        treeNode.dataRef.children = deWeightThree([...oldData, ...children])
        resolve(null)
      })
    }
    // 数据去重
    const deWeightThree = (arr) => {
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
      const firstOrg = orgList.value[0]
      if (firstOrg) {
        state.orgExpandedKeys = [firstOrg.id]
        const children = userList.value
          .filter((v: any) => v.organizationId == firstOrg.id)
          .map((v: any) => {
            v.isLeaf = true
            return v
          })
        firstOrg.children = [...firstOrg.children, ...children]
      }
    }
    // 监听滚动 设置当前选中的字母
    const listenerUserScroll = (): void => {
      const userListRef: HTMLElement | null = document.getElementById('userListRef')
      if (userListRef) {
        userListRef.addEventListener('scroll', () => {
          console.log(state.listenScroll)
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
    watch(
      () => orgList.value,
      (newData) => {
        if (newData.length > 0) {
          openFirstOrg()
        }
      }
    )
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
    onMounted(() => {
      listenerUserScroll()
    })
    const pageInit = (): void => {
      const data: any[] = props.selectedData
      openFirstOrg()
      if (propsData.value.multiple) {
        state.checkboxData = [...data[0]]
      } else {
        if (data.length > 0) {
          state.radioData = data[0]
        }
      }
      if (propsData.value.type == 'user') {
        userDataRest()
      }
    }
    pageInit()
    return {
      ...toRefs(state),
      hideOrgTabs,
      propsData,
      userList,
      orgList,
      tagList,
      getOrgUser,
      removeTag,
      clearTag,
      onExpand,
      letterClick,
    }
  },
})
</script>
