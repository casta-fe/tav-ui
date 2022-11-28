import { type ComputedRef, defineComponent, nextTick, ref, unref } from 'vue'
import { Empty, Spin } from 'ant-design-vue'
// import { debounce } from 'lodash-es'
import ContainerScroll from '@tav-ui/components/container-scroll'
import { cascadeProPannelProps } from '../types'
import { useCascadeProContext, useFieldRequest, useLoading } from '../hooks'
// import { DebounceDely } from '../constants'
import { DEFAULT_CASCADE_PRO_SELECT_RECORD } from '../utils'
import type { DebouncedFunc } from 'lodash-es'
import type { CascadeProOption } from '../types'

export interface CascadeProPannelInstance {
  handlePannelFieldScrollToLetter: (letter: string) => Promise<void>
  handleFieldClear: (options: CascadeProOption[], idx?: number) => Promise<void>
  result: ComputedRef<CascadeProOption[][]>
  handleOptionClick: DebouncedFunc<(...args: any) => Promise<void>>
}

export default defineComponent({
  name: 'TaCascadeProPannel',
  props: cascadeProPannelProps,
  emits: ['click'],
  setup(props, { emit, expose }) {
    const {
      firstLetterVisible,
      fields,
      options,
      selectRecord,
      setSelectRecord,
      selectRecordFibers,
      selectRecords,
      setSelectRecords,
      id,
    } = useCascadeProContext()

    const containerScrollRefs = ref<any[]>([])
    const setContainerScrollRefs = (scrollRef: any) => {
      containerScrollRefs.value.push(scrollRef)
    }

    const { loading, setLoading } = useLoading()

    const { result, error, onClick } = useFieldRequest({
      loading,
      setLoading,
      firstLetterVisible,
      selectRecord,
      setSelectRecord,
      setSelectRecords,
      selectRecordFibers,
      fields,
      options,
      id,
      immediate: unref(selectRecords).length > 0 ? false : true,
    })

    const handlePannelFieldScrollToLetter = async (letter: string) => {
      await nextTick()
      // 取第一个ref，因为目前只做了第一级数据的首字母
      const scrollRef = unref(containerScrollRefs)[0]
      const scrollEl = scrollRef.$el
      const target: HTMLElement | null = scrollEl.querySelector(
        `[data-first-letter-group="${letter}"]`
      )
      target && scrollRef.scrollTo(target.offsetTop)
    }

    const createLoading = () => {
      return unref(loading) ? (
        <div class="ta-cascade-pro-pannel--loading">
          <Spin size="large" />
        </div>
      ) : null
    }

    const createNotFound = () => {
      return !(unref(result) && unref(result).length) || unref(error) ? (
        <div class="ta-cascade-pro-pannel--not-found">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={unref(error) || '暂无数据'} />
        </div>
      ) : null
    }

    const isAllSelected = (options: CascadeProOption[], fieldIndex: number) => {
      const _selectRecord = unref(selectRecord)
      if (!_selectRecord.id && fieldIndex === 0) {
        return true
      } else {
        if (fieldIndex === 0) {
          if (unref(selectRecords).length > 0) {
            return false
          } else {
            return true
          }
        } else {
          if (unref(selectRecords).length <= 0) return false

          const optionsIds = options.map((option) => ({
            current: `-${option.id}`,
          }))
          const hasSelectRecords: CascadeProOption[] = []
          for (let i = 0; i < unref(selectRecords).length; i++) {
            const selectRecordIdPath = unref(selectRecords)[i].idPath
            for (let j = 0; j < optionsIds.length; j++) {
              const { current } = optionsIds[j]
              const isDelete = selectRecordIdPath.indexOf(current) > -1
              if (isDelete) {
                hasSelectRecords.push(unref(selectRecords)[i])
              }
            }
          }
          return hasSelectRecords.length > 0 ? false : true
        }
      }
    }

    const isOptionSelected = (idPath: string) => {
      return !!unref(selectRecords).find((selectRecord) => selectRecord.idPath === idPath)
    }

    // const handleOptionClick = debounce(async (option: CascadeProOption) => {
    //   // // TODO 删掉 children 减少内存做优化
    //   // const _option = option
    //   // Reflect.deleteProperty(_option, 'children')

    //   onClick(option)
    //   await nextTick()
    //   emit('click', option)
    // }, 16.7 || DebounceDely)

    const handleOptionClick = async (option: CascadeProOption) => {
      // // TODO 删掉 children 减少内存做优化
      // const _option = option
      // Reflect.deleteProperty(_option, 'children')

      onClick(option)
      await nextTick()
      emit('click', option)
    }

    /**
     * 删掉当前field与子field selectrecord 数据
     *
     * @param options 当前field数据
     */
    const handleFieldClear = async (options: CascadeProOption[], idx?: number) => {
      if (idx === undefined) {
        // 兼容select-result删除，把删除逻辑放在一起好管理。
        const coveredSelectRecords = options
        setSelectRecords(coveredSelectRecords, 'recover')
      } else {
        if (idx === 0) {
          setSelectRecords([], 'recover')
          await nextTick()
          handleOptionClick(DEFAULT_CASCADE_PRO_SELECT_RECORD)
        } else {
          const optionsIds = options.map((option) => ({
            current: `-${option.id}`,
            next: `${option.id}-`,
          }))

          const shouldDeleteSelectRecords: CascadeProOption[] = []
          for (let i = 0; i < unref(selectRecords).length; i++) {
            const selectRecordIdPath = unref(selectRecords)[i].idPath
            for (let j = 0; j < optionsIds.length; j++) {
              const { current, next } = optionsIds[j]
              const isDelete =
                selectRecordIdPath.indexOf(current) > -1 || selectRecordIdPath.indexOf(next) > -1
              if (isDelete) {
                shouldDeleteSelectRecords.push(unref(selectRecords)[i])
              }
            }
          }

          const coveredSelectRecords = unref(selectRecords).filter((option) => {
            if (shouldDeleteSelectRecords.find((_option) => _option.idPath === option.idPath)) {
              return false
            }
            return true
          })

          setSelectRecords(coveredSelectRecords, 'recover')
          await nextTick()
          // handleOptionClick(unref(selectRecords).slice(-1)[0]) // 回到最新的selectrecord
        }
      }
    }

    const createFields = () => {
      return unref(result) && unref(result).length ? (
        <div class="ta-cascade-pro-pannel--success">
          {unref(result).map((options, idx) => {
            return (
              <div
                class={`ta-cascade-pro-pannel-field ta-cascade-pro-pannel-field--${
                  unref(fields)[idx]
                }`}
              >
                <ContainerScroll ref={setContainerScrollRefs}>
                  <div
                    class={`ant-select-item ant-select-item-option ${
                      isAllSelected(options, idx) ? 'ant-select-item-option-selected' : ''
                    }`}
                    data-is-selected={isAllSelected(options, idx)}
                    onClick={() => handleFieldClear(options, idx)}
                  >
                    全部
                  </div>
                  {unref(options) && unref(options).length
                    ? unref(options).map((option) => (
                        <div
                          class={`ant-select-item ant-select-item-option ${
                            isOptionSelected(option.idPath) ? 'ant-select-item-option-selected' : ''
                          }`}
                          data-is-selected={isOptionSelected(option.idPath)}
                          data-first-letter-group={option.firstLetterGroup}
                          onClick={() => handleOptionClick(option)}
                        >
                          <div class="ant-select-item-option-content">
                            {idx === 0 ? (
                              <div class="first-letter-group">
                                {option.firstLetter && option.firstLetterGroup
                                  ? option.firstLetterGroup
                                  : null}
                              </div>
                            ) : null}
                            {props.generatePannelItem ? (
                              props.generatePannelItem(option, idx)
                            ) : (
                              <div>{option.name}</div>
                            )}
                          </div>
                        </div>
                      ))
                    : null}
                </ContainerScroll>
              </div>
            )
          })}
        </div>
      ) : null
    }

    expose({
      handlePannelFieldScrollToLetter,
      handleFieldClear,
      result,
      handleOptionClick,
    })

    return () => {
      return (
        <div class="ta-cascade-pro-pannel">
          {createLoading()}
          {createNotFound()}
          {createFields()}
        </div>
      )
    }
  },
})
