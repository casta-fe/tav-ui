<template>
  <a-dropdown :trigger="trigger" v-bind="$attrs">
    <span style="position: relative">
      <slot />
    </span>
    <template #overlay>
      <a-menu :selected-keys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <a-menu-item
            v-bind="getAttr(item.event)"
            :disabled="item.disabled"
            size="small"
            @click.stop.prevent="handleClickMenu(item)"
          >
            <!-- <a-popconfirm
              v-if="popconfirm && item.popConfirm"
              v-bind="getPopConfirmAttrs(item.popConfirm)"
              :getPopupContainer="item.getPopupContainer"
              @visibleChange="handlePopConfirmVisible"
            >
              <template #icon v-if="item.popConfirm.icon">
                <Icon :icon="item.popConfirm.icon" />
              </template>
              <div>
                <Icon :icon="item.icon" v-if="item.icon" />
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </a-popconfirm> -->
            <ModalButton v-if="popconfirm && item.popConfirm" v-bind="item" :is-in-drop-down="true">
              <template v-if="item.popConfirm.icon" #icon>
                <Icon :icon="item.popConfirm.icon" />
              </template>
              <div>
                <Icon v-if="item.icon" :icon="item.icon" />
                <span class="ml-1 ant-btn ant-btn-link ant-btn-sm" style="font-size: 12px">{{
                  item.text
                }}</span>
              </div>
            </ModalButton>
            <template v-else>
              <Icon v-if="item.icon" :icon="item.icon" />
              <span class="ml-1 ant-btn ant-btn-link ant-btn-sm" style="font-size: 12px">
                {{ item.text }}
              </span>
              <!-- <span class="ml-1">{{ item.text }}</span> -->
            </template>
          </a-menu-item>
          <a-menu-divider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Dropdown, Menu, Popconfirm } from 'ant-design-vue'
import { omit } from 'lodash-es'
import ModalButton from '@tav-ui/components/button-modal'
import Icon from '@tav-ui/components/icon'
import { isFunction } from '@tav-ui/utils/is'
import { dropdownProps } from './types'
import type { DropdownMenu as DropMenu } from './types'

const ADropdown = Dropdown
const AMenu = Menu
const AMenuItem = Menu.Item
const AMenuDivider = Menu.Divider
const APopconfirm = Popconfirm

const props = defineProps(dropdownProps)

const emit = defineEmits(['menuEvent', 'menuItemPopConfirmVisible'])

function handleClickMenu(item: DropMenu) {
  const { event } = item
  const menu = props.dropMenuList.find((item) => `${item.event}` === `${event}`)
  emit('menuEvent', menu)
  item.onClick?.()
}

function handlePopConfirmVisible(visible: boolean) {
  emit('menuItemPopConfirmVisible', visible)
}

const getPopConfirmAttrs = computed(() => {
  return (attrs) => {
    const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon'])
    if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
      originAttrs['onConfirm'] = attrs.confirm
    if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
      originAttrs['onCancel'] = attrs.cancel
    return originAttrs
  }
})

const getAttr = (key: string | number) => ({ key })
</script>
