import { promiseTimeout } from '@vueuse/shared'
import type { ProvideDataType } from '@tav-ui/components/upload/src/types'

const uploadArr: any[] = [
  {
    id: 9662,
    appId: 10001,
    actualId: '7f14e527f0344896a969ec046bea11a0',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 1,
    name: 'ces',
    suffix: null,
    fullName: null,
    size: null,
    address:
      'http://192.168.10.52/#/project/exitProject/detail/TC-20220802000113/91330106396310952P',
    runtime: null,
    hyperlink: 1,
    sourceFileDownload: 1,
    watermarkFileDownload: 2,
    fileSize: null,
    createBy: '1',
    createByName: '系统管理员',
    moduleCode: 'tg_company',
    moduleName: '企业库',
    typeCode: 'COMPANY_OTHER',
    typeName: '其他资料',
    createTime: '2022-08-18 15:33:41',
  },
  {
    id: 9661,
    appId: 10001,
    actualId: 'c2feb54f41db4b72af2f29c92d87bfab',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 4,
    name: '投管联调计划第二版-贾旭鹏xlsx',
    suffix: 'xlsx',
    fullName: '投管联调计划第二版-贾旭鹏xlsx.xlsx',
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
  {
    id: 9662,
    appId: 10001,
    actualId: '7f14e527f0344896a969ec046bea11a0',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 1,
    name: 'ces',
    suffix: null,
    fullName: null,
    size: null,
    address:
      'http://192.168.10.52/#/project/exitProject/detail/TC-20220802000113/91330106396310952P',
    runtime: null,
    hyperlink: 1,
    sourceFileDownload: 1,
    watermarkFileDownload: 2,
    fileSize: null,
    createBy: '1',
    createByName: '系统管理员',
    moduleCode: 'tg_company',
    moduleName: '企业库',
    typeCode: 'COMPANY_OTHER',
    typeName: '其他资料',
    createTime: '2022-08-18 15:33:41',
  },
  {
    id: 9661,
    appId: 10001,
    actualId: 'c2feb54f41db4b72af2f29c92d87bfab',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 4,
    name: '投管联调计划第二版-贾旭鹏xlsx',
    suffix: 'xlsx',
    fullName: '投管联调计划第二版-贾旭鹏xlsx.xlsx',
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
  {
    id: 9662,
    appId: 10001,
    actualId: '7f14e527f0344896a969ec046bea11a0',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 1,
    name: 'ces',
    suffix: null,
    fullName: null,
    size: null,
    address:
      'http://192.168.10.52/#/project/exitProject/detail/TC-20220802000113/91330106396310952P',
    runtime: null,
    hyperlink: 1,
    sourceFileDownload: 1,
    watermarkFileDownload: 2,
    fileSize: null,
    createBy: '1',
    createByName: '系统管理员',
    moduleCode: 'tg_company',
    moduleName: '企业库',
    typeCode: 'COMPANY_OTHER',
    typeName: '其他资料',
    createTime: '2022-08-18 15:33:41',
  },
  {
    id: 9661,
    appId: 10001,
    actualId: 'c2feb54f41db4b72af2f29c92d87bfab',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 4,
    name: '投管联调计划第二版-贾旭鹏xlsx',
    suffix: 'xlsx',
    fullName: '投管联调计划第二版-贾旭鹏xlsx.xlsx',
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
  {
    id: 9662,
    appId: 10001,
    actualId: '7f14e527f0344896a969ec046bea11a0',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 1,
    name: 'ces',
    suffix: null,
    fullName: null,
    size: null,
    address:
      'http://192.168.10.52/#/project/exitProject/detail/TC-20220802000113/91330106396310952P',
    runtime: null,
    hyperlink: 1,
    sourceFileDownload: 1,
    watermarkFileDownload: 2,
    fileSize: null,
    createBy: '1',
    createByName: '系统管理员',
    moduleCode: 'tg_company',
    moduleName: '企业库',
    typeCode: 'COMPANY_OTHER',
    typeName: '其他资料',
    createTime: '2022-08-18 15:33:41',
  },
  {
    id: 9661,
    appId: 10001,
    actualId: 'c2feb54f41db4b72af2f29c92d87bfab',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 4,
    name: '投管联调计划第二版-贾旭鹏xlsx',
    suffix: 'xlsx',
    fullName: '投管联调计划第二版-贾旭鹏xlsx.xlsx',
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
  {
    id: 9662,
    appId: 10001,
    actualId: '7f14e527f0344896a969ec046bea11a0',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 1,
    name: 'ces',
    suffix: null,
    fullName: null,
    size: null,
    address:
      'http://192.168.10.52/#/project/exitProject/detail/TC-20220802000113/91330106396310952P',
    runtime: null,
    hyperlink: 1,
    sourceFileDownload: 1,
    watermarkFileDownload: 2,
    fileSize: null,
    createBy: '1',
    createByName: '系统管理员',
    moduleCode: 'tg_company',
    moduleName: '企业库',
    typeCode: 'COMPANY_OTHER',
    typeName: '其他资料',
    createTime: '2022-08-18 15:33:41',
  },
  {
    id: 9661,
    appId: 10001,
    actualId: 'c2feb54f41db4b72af2f29c92d87bfab',
    moduleId: 7,
    businessKey: null,
    businessId: '91100000101619881W',
    type: 5,
    deleted: 0,
    version: 4,
    name: '投管联调计划第二版-贾旭鹏xlsx',
    suffix: 'xlsx',
    fullName: '投管联调计划第二版-贾旭鹏xlsx.xlsx',
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

export const taUploadProvideData: Partial<ProvideDataType & { queryFileHistory: any }> = {
  // typeCodeRecord: {
  //   tg_invest: [
  //     {
  //       label: '文件类型1',
  //       value: 'FILE_TYPE_1',
  //     },
  //     {
  //       label: '文件类型2',
  //       value: 'FILE_TYPE_2',
  //     },
  //     {
  //       label: '基金管理人其他资料',
  //       value: 'FUND_GLR_QTZL',
  //     },
  //   ],
  // },
  queryFileType: async (moduleCodes: string[]) => {
    await promiseTimeout(1000)

    console.log('moduleCodes', moduleCodes)

    return Promise.resolve({
      data: {
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
      }[moduleCodes[0]],
    })
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryFile: (params: any): Promise<any> =>
    new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: {
            result: uploadArr,
          },
        }),
        900
      )
    ),
  queryFileHistory: (): Promise<any> =>
    new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: uploadArr,
        }),
        900
      )
    ),
  uploadFile: (payload: FormData): Promise<any> => {
    console.log('[uploadFile] parame', payload, Object.fromEntries(payload))

    return new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: [...(payload.getAll('files') as File[])].map((el) => ({
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
  updateFile: (payload: FormData): Promise<any> => {
    return new Promise((r) =>
      setTimeout(
        r.bind(null, {
          data: [...(payload.getAll('files') as File[])].map((el) => ({
            fullName: el.name,
            typeCode: payload.get('typeCode'),
            moduleCode: payload.get('moduleCode'),
            fileSize: `${(el.size / 1024).toFixed(2)}kb`,
            createByName: 'mxs',
            createTime: +new Date() + 1000 * 60 * 24 * 3,
            actualId: '93645034fb304ba3a5015412c1b2fc4a',
          })),
        }),
        900
      )
    )
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
}
