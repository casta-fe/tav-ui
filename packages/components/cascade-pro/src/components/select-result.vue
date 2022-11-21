<template>
  <div class="ta-cascade-pro-search-result">
    <div class="ta-cascade-pro-search-result-title">
      <div class="ta-cascade-pro-search-result-tip">已选（{{ options.length }}）</div>
      <Button type="link" size="small" @click="handleClearAll">清空</Button>
    </div>
    <div class="ta-cascade-pro-search-result-list">
      <ContainerScroll>
        <Tag
          v-for="option in options"
          :key="option.idPath"
          closable
          @close="() => handleClear(option)"
        >
          {{ option.namePath }}
        </Tag>
      </ContainerScroll>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, watch } from 'vue'
import { Tag } from 'ant-design-vue'
import Button from '@tav-ui/components/button'
import ContainerScroll from '@tav-ui/components/container-scroll'
// import { cascadeProSelectResultProps } from '../types'
import { useCascadeProContext } from '../hooks'
import type { CascadeProOption } from '../types'
import type { Ref } from 'vue'

export interface CascadeProSelectResultInstance {
  handleClear: (option: CascadeProOption) => void
  options: Ref<CascadeProOption[]>
}

export default defineComponent({
  name: 'TaCascadeProSelectResult',
  components: { Button, Tag, ContainerScroll },
  // props: cascadeProSelectResultProps,
  emits: ['clear', 'clearAll'],
  setup(props, { emit, expose }) {
    const { selectRecords } = useCascadeProContext()

    const visible = ref<boolean>(false)
    const options = ref<CascadeProOption[]>([])

    const handler = (_selectRecords: CascadeProOption[]) => {
      if (_selectRecords.length > 0) {
        visible.value = true
      } else {
        visible.value = false
      }

      const getMaxLevelInfo = _selectRecords.reduce((result, cur) => {
        const idPath = cur.idPath
        const idPathSplitResult = idPath.split('-')
        const isRoot = !idPath.includes('-')
        if (!result[idPath] && isRoot) {
          result[idPath] = {
            records: [cur],
            idPathLengths: [idPathSplitResult.length],
            maxLevel: Math.max(...[idPathSplitResult.length]),
          }
        } else {
          const root = idPathSplitResult[0]
          result[root].records.push(cur)
          result[root].idPathLengths.push(idPathSplitResult.length)
          result[root].maxLevel = Math.max(...result[root].idPathLengths)
        }
        return result
      }, {} as Record<string, any>)

      // 根据最大值maxlevel 把要展示的数据筛选出来
      const filterMaxLevelSelectRecords =
        Object.keys(getMaxLevelInfo).length > 0
          ? Object.keys(getMaxLevelInfo).reduce((result, id) => {
              const { maxLevel, records } = getMaxLevelInfo[id]
              if (!result[id]) {
                result[id] = []
              }
              result[id].push(
                ...records.filter((record) => {
                  const idPathSplitResult = record.idPath.split('-')
                  if (idPathSplitResult.length === maxLevel) {
                    return true
                  }
                  return false
                })
              )
              return result
            }, {} as Record<string, any>)
          : ({} as Record<string, any>)

      // 遍历 _selectRecords 生成新数据，这一步是确保显示顺序
      let result: CascadeProOption[] = []
      for (let i = 0; i < _selectRecords.length; i++) {
        const target = filterMaxLevelSelectRecords[_selectRecords[i].idPath]
        if (target) {
          result = [...result, ...target]
        }
      }

      options.value = result
    }

    const handleClear = (option: CascadeProOption) => {
      const ensureSelectRecordsCorrect = (idPathSplitResult: string[]) => {
        if (idPathSplitResult.length <= 1) {
          // 筛选一级
          const rootLevelRecords = unref(selectRecords).filter(
            (record) => record.id === record.idPath
          )
          if (rootLevelRecords.length > 1) {
            const _option = rootLevelRecords.find(
              (record) => record.idPath === idPathSplitResult.join('-')
            )
            emit('clear', {
              type: 'normal',
              option: _option,
            })
          } else {
            emit('clear', {
              type: 'fieldClear',
              idx: 0,
            })
          }
          return
        }

        for (let i = idPathSplitResult.length - 1 - 1; i >= 0; i--) {
          const pid = idPathSplitResult[i]
          const next = `${pid}-`
          const num = unref(selectRecords).filter((record) => {
            const _idPathSplitResult = record.idPath.split('-')
            return (
              _idPathSplitResult.length === idPathSplitResult.length &&
              record.idPath.indexOf(next) > -1
            )
          }).length

          if (num === 1) {
            emit('clear', {
              type: 'fieldClear',
              idx: i + 1,
            })
            ensureSelectRecordsCorrect(idPathSplitResult.slice(0, i + 1))
            return
          } else if (num > 1) {
            const _option = unref(selectRecords).find(
              (record) => record.idPath === idPathSplitResult.join('-')
            )
            emit('clear', {
              type: 'normal',
              option: _option,
            })
            return
          } else {
            console.warn('ta-cascade-pro select-result handler has error')
            return
          }
        }
      }

      ensureSelectRecordsCorrect(option.idPath.split('-'))
    }

    const handleClearAll = () => {
      unref(selectRecords).length > 1 && emit('clearAll')
    }

    watch(
      () => unref(selectRecords).length,
      () => {
        handler(unref(selectRecords))
      },
      {
        immediate: true,
      }
    )

    expose({
      handleClear,
      options,
    })

    return {
      visible,
      options,
      handleClear,
      handleClearAll,
    }
  },
})
</script>
