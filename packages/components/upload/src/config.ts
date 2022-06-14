import { formatToDate } from '@tav-ui/utils'
import type { TableProColumn } from '@tav-ui/components/table-pro'

const columns: TableProColumn[] = [
  {
    title: '文件名称',
    field: 'fullName',
    width: 400,
    slots: { default: 'fullName' },
    showOverflow: 'tooltip',
  },
  {
    title: '文件类型',
    field: 'typeCode',
    minWidth: 100,
    width: 400,
    slots: { default: 'typeCode' },
  },
  {
    title: '文件大小',
    field: 'fileSize',
    width: 400,
    minWidth: 100,
  },
  { title: '上传人', field: 'createByName' },
  {
    width: 400,
    title: '更新时间',
    field: 'createTime',
    formatter: ({ cellValue }) => {
      return formatToDate(cellValue)
    },
  },
]

export { columns }
