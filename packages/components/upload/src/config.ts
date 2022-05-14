const columns: Record<string, any>[] = [
  {
    title: '文件名称',
    dataIndex: 'fullName',
    key: 'fullName',
    slots: { customRender: 'name' },
    ellipsis: true,
  },
  {
    title: '文件类型',
    dataIndex: 'typeCode',
    key: 'typeCode',
    width: 100,
    slots: { customRender: 'typeCode' },
    ellipsis: true,
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
    ellipsis: true,
  },
  { title: '上传人', dataIndex: 'createByName', key: 'createByName', ellipsis: true },
  {
    title: '更新时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    format: 'date|YYYY-MM-DD',
  },
]

export { columns }
