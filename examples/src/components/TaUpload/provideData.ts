import { promiseTimeout } from '@vueuse/shared'
import { __post } from '@tav-ui/components/table-pro/src/data'
import type { ProvideDataType } from '@tav-ui/components/upload/src/types'

const uploadArr: any[] = [
  {
    id: 9661,
    appId: 10001,
    actualId: 'c2feb54f41db4b72af2f29c92d87bfac',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 4,
    name: 'fffff',
    suffix: 'xlsx',
    fullName: 'fffff.xlsx',
    size: 12261,
    address: '/20220818/16608037441049063.xlsx',
    runtime: null,
    hyperlink: 0,
    sourceFileDownload: 1,
    watermarkFileDownload: 2,
    fileSize: '11KB',
    createBy: '1',
    createByName: '系统管理员',
    moduleCode: 'tg_company',
    moduleName: '企业库',
    typeCode: 'COMPANY_OTHER',
    typeName: '其他资料',
    createTime: '2022-08-18 14:22:24',
  },
]

export const taUploadProvideData: Partial<
  ProvideDataType & { queryFileHistory: any; removeFileById: any }
> = {
  actionLimit: 4,
  typeCodeRecord: {
    tg_invest: [
      {
        label: '企业库其他文件',
        value: 'COMPANY_OTHER',
      },
      {
        label: '文件类型1',
        value: 'FILE_TYPE_1',
      },
      {
        label: '文件类型2',
        value: 'FILE_TYPE_2',
      },
      {
        label: '基金管理人其他资料',
        value: 'FUND_GLR_QTZL',
      },
    ],
  },
  queryFileType: async (params: any) => {
    console.log('params', params)

    const { data } = await __post('/api/TIANTA-FILE/api/file/queryFileType', params)

    return Promise.resolve({
      data: data
        ? data
        : {
            tg_invest: [
              {
                name: '其他资料',
                code: 'COMPANY_OTHER',
              },
              {
                name: '类型二',
                code: 'type2',
              },
            ],
            other_module: [
              {
                name: '测试其他类型',
                code: 'otherType',
              },
            ],
          }['tg_invest']!,
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryFile: async (params: any): Promise<any> => {
    // console.log(params, 'queryFile')

    return new Promise((r) =>
      setTimeout(
        r.bind(null, {
          success: true,
          code: '0000',
          data: {
            result: [
              {
                id: 73086,
                appId: 10001,
                actualId: '5d8e721a997348c19c46041178348834',
                moduleId: 9,
                businessKey: '91320583MA20NTY87Y-tg_invest-TG-20240607000003',
                businessId: 'TG-20240607000003-0',
                type: 9,
                deleted: 0,
                version: 1,
                name: '10',
                suffix: 'png',
                fullName: '10.png',
                size: 45113,
                address: '/20240607/17177485273641322.png',
                runtime: null,
                hyperlink: 0,
                sourceFileDownload: 1,
                watermarkFileDownload: 2,
                fileSize: '44KB',
                createBy: '1',
                createByName: '系统管理员',
                expand: null,
                dataType: null,
                toPdf: 0,
                errorMsg: null,
                moduleCode: 'tg_invest_evaluation',
                moduleName: '评估立项',
                typeCode: 'INVEST_FOUND_BFJY',
                typeName: '拜访纪要',
                createTime: '2024-06-07 16:22:07',
              },
            ],
            total: 1,
            pageSize: 999,
            pageCount: 1,
            currentPage: 1,
            isFirstPage: true,
            isLastPage: true,
            hasPreviousPage: false,
            hasNextPage: false,
            navigatePages: 10,
            navigatePageNumbers: [1],
            expand: null,
          },
          msg: null,
          expand: null,
        }),
        900
      )
    )
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryFileHistory: (args: any): Promise<any> => {
    // console.error('args', args)

    return new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: Math.random() > 0.5 ? uploadArr.slice(0, 2) : uploadArr,
        }),
        900
      )
    )
  },
  uploadFile: async (payload: FormData): Promise<any> => {
    console.log('[uploadFile] parame', payload, Object.fromEntries(payload as any))

    const { data } = await __post('/api/TIANTA-FILE/api/file/upload', payload, true)

    return new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: data
            ? data
            : [...(payload.getAll('files') as File[])].map((el) => ({
                fullName: el.name,
                typeCode: payload.get('typeCode'),
                moduleCode: payload.get('moduleCode'),
                fileSize: `${(el.size / 1024).toFixed(2)}kb`,
                createByName: 'mxs',
                createTime: +new Date() + 1000 * 60 * 24 * 3,
              })),
        }),
        900
      )
    )
  },
  removeFile() {
    return Promise.resolve()
  },
  updateFile: (payload: FormData): Promise<any> => {
    const res = {
      data: [...(payload.getAll('files') as File[])].map((el) => ({
        ...uploadArr[uploadArr.length - 1],
        id: ~~(Math.random() * 1000),
        fullName: 'el.name--fullName',
        typeCode: payload.get('typeCode'),
        moduleCode: payload.get('moduleCode'),
        fileSize: `${(el.size / 1024).toFixed(2)}kb`,
        createByName: 'mxs',
        createTime: +new Date() + 1000 * 60 * 24 * 3,
        actualId: payload.get('fileActualIds'), // '93645034fb304ba3a5015412c1b2fc4a',
      })),
    }
    console.error(res)

    return new Promise((r) => setTimeout(r.bind(null, res), 900))
  },
  uploadHyperlink: (payload: any): Promise<any> => {
    console.error('[uploadHyperlink] parame', payload)
    return new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: {
            ...payload,
            fullName: payload.name,
            fileSize: '0kb',
            createByName: 'mxs-hyperlink',
            createTime: +new Date() + 1000 * 60 * 60 * 24 * 3,
            hyperlink: 1,
          },
        }),
        900
      )
    )
  },
  updateFileNameAndAddress: (v: any) => {
    console.error(v)
    return promiseTimeout(1000)
  },
  updateFileType: (id, typeCode) => {
    console.log('updateFileType', id, typeCode)

    return promiseTimeout(1000)
  },
  removeFileById(id: number) {
    console.error('removeFileById id', id)
  },
}

export const previewFile = async (id: string, appId?: string) => {
  const response = await __post(`/api/TIANTA-FILE/api/file/online/${id}`)

  return response
}

export const previewWPSFile = async (id: string, appId?: string) => {
  const response = await __post(`/api/TIANTA-FILE/api/file/webOnline/${id}`)

  return response
}
