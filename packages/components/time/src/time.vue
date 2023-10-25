<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { dateUtil, formatToDate, formatToDateTime } from '@tav-ui/utils/dateUtil'
import { isNumber, isObject, isString } from '@tav-ui/utils/is'
import { tavI18n } from '@tav-ui/locales'
import { timeProps } from './types'
const ONE_SECONDS = 1000 * 1
const ONE_MINUTES = ONE_SECONDS * 60
const ONE_HOUR = ONE_MINUTES * 60
const ONE_DAY = ONE_HOUR * 24

export default defineComponent({
  name: 'TaTime',
  props: timeProps,
  setup(props) {
    const date = ref('')

    useIntervalFn(setTime, props.step * ONE_SECONDS)

    watch(
      () => props.value,
      () => {
        setTime()
      },
      { immediate: true }
    )

    function getTime() {
      const { value } = props
      let time = 0
      if (isNumber(value)) {
        const timestamp = value.toString().length > 10 ? value : value * 1000
        time = new Date(timestamp).getTime()
      } else if (isString(value)) {
        time = new Date(value).getTime()
      } else if (isObject(value)) {
        time = value.getTime()
      }
      return time
    }

    function setTime() {
      const { mode, value } = props
      const time = getTime()
      if (mode === 'relative') {
        date.value = getRelativeTime(time)
      } else {
        if (mode === 'datetime') date.value = formatToDateTime(value)
        else if (mode === 'date') date.value = formatToDate(value)
      }
    }

    function getRelativeTime(timeStamp: number) {
      const currentTime = new Date().getTime()

      // Determine whether the incoming timestamp is earlier than the current timestamp
      const isBefore = dateUtil(timeStamp).isBefore(currentTime)

      let diff = currentTime - timeStamp
      if (!isBefore) diff = -diff

      let resStr = ''
      const dirStr = isBefore ? tavI18n('Tav.time.1') : tavI18n('Tav.time.2')

      if (diff < ONE_SECONDS) {
        resStr = tavI18n('Tav.time.3')
        // Less than or equal to 59 seconds
      } else if (diff < ONE_MINUTES) {
        const result = (diff / ONE_SECONDS).toString()
        resStr = `${parseInt(result)}${tavI18n('Tav.time.4')}${dirStr}`
        // More than 59 seconds, less than or equal to 59 minutes and 59 seconds
      } else if (diff >= ONE_MINUTES && diff < ONE_HOUR) {
        resStr = `${Math.floor(diff / ONE_MINUTES)}${tavI18n('Tav.time.5')}${dirStr}`
        // More than 59 minutes and 59 seconds, less than or equal to 23 hours, 59 minutes and 59 seconds
      } else if (diff >= ONE_HOUR && diff < ONE_DAY) {
        resStr = `${Math.floor(diff / ONE_HOUR)}${tavI18n('Tav.time.6')}${dirStr}`
        // More than 23 hours, 59 minutes and 59 seconds, less than or equal to 29 days, 59 minutes and 59 seconds
      } else if (diff >= ONE_DAY && diff < 2623860000) {
        resStr = `${Math.floor(diff / ONE_DAY)}${tavI18n('Tav.time.7')}${dirStr}`
        // More than 29 days, 59 minutes, 59 seconds, less than 364 days, 23 hours, 59 minutes, 59 seconds, and the incoming timestamp is earlier than the current
      } else if (diff >= 2623860000 && diff <= 31567860000 && isBefore) {
        resStr = dateUtil(timeStamp).format('MM-DD-HH-mm')
      } else {
        resStr = dateUtil(timeStamp).format('YYYY')
      }
      return resStr
    }

    return { date }
  },
})
</script>
<template>
  <span class="ta-time">{{ date }}</span>
</template>
