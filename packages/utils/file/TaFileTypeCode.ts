import { computed } from 'vue'
interface LabelValueOption<V = any, K = string | number | boolean> {
  label: K
  [key: string]: any
  value: V
  disabled?: boolean
}

type LabelValueOptions<V = any, K = string | number | boolean> = LabelValueOption<V, K>[]
const fileTypeCode = {
  // 科服-投行管理 pitch 节点
  kf_pitch: <LabelValueOptions<string>>[
    {
      label: 'QR',
      value: 'POE_TH_PITCH_QR',
    },
    {
      label: 'Pitchbook',
      value: 'POE_TH_PITCH_BOOK',
    },
  ],
  // 科服-投行管理 合同签署 节点
  kf_contract: <LabelValueOptions<string>>[
    {
      label: '合同签署文件',
      value: 'TH_CONTRACT',
    },
  ],
  // 科服-投行管理 材料梳理节点
  kf_filecard: <LabelValueOptions<string>>[
    {
      label: 'BP',
      value: 'TH_FILECARD_BP',
    },
    {
      label: '自定义文件',
      value: 'TH_FILECARD_CUSTOM',
    },
    {
      label: 'DATAPACK',
      value: 'TH_FILECARD_DATAPACK',
    },
    {
      label: '财务模型',
      value: 'TH_FILECARD_MODEL',
    },
    {
      label: 'PRE-DD',
      value: 'TH_FILECARD_PREDD',
    },
    {
      label: 'TEASER',
      value: 'TH_FILECARD_TEASER',
    },
    {
      label: '技术线路分析报告',
      value: 'TH_FILECARD_TECHNICAL',
    },
    {
      label: '估值分析',
      value: 'TH_FILECARD_VALUATION',
    },
  ],
  // 科服-投行管理 路演执行节点
  kf_roadshow: <LabelValueOptions<string>>[
    {
      label: '路演执行',
      value: 'POE_TH_ROADSHOW',
    },
  ],
  // 科服-投行管理 PREDD 节点
  kf_predd: <LabelValueOptions<string>>[
    {
      label: 'PREDD',
      value: 'POE_TH_PREDD',
    },
  ],
  // 科服-投行管理 TS 节点
  kf_ts: <LabelValueOptions<string>>[
    {
      label: 'TS',
      value: 'POE_TH_TS',
    },
  ],
  // 科服-投行管理 DD 节点
  kf_dd: <LabelValueOptions<string>>[
    {
      label: 'DD',
      value: 'POE_TH_DD',
    },
  ],
  // 科服-投行管理 SPA 节点
  kf_spa: <LabelValueOptions<string>>[
    {
      label: 'SPA',
      value: 'POE_TH_SPA',
    },
  ],
  // 科服-客户管理 相关文件 wwluzhou
  kf_customer_file: <LabelValueOptions<string>>[
    {
      label: '商业计划书',
      value: 'BUSINESS_PLAN',
    },
    {
      label: '投资建议书',
      value: 'BUSINESS_PROPOSAL',
    },
  ],
}

type ModuleCodeCollectionType = typeof fileTypeCode

type ModuleCodeType = keyof ModuleCodeCollectionType

const moduleCodePrefix = ['tg_invest', 'tg_post', 'tg_exit'] as const

type ModuleCodePrefixType = typeof moduleCodePrefix

type ModuleCodePrefixKeyType = ModuleCodePrefixType[number]
const getOptionsByModuleCode = (moduleCode: ModuleCodeType | ModuleCodeType[]) =>
  Array.isArray(moduleCode)
    ? [...new Set(moduleCode)].map(el => fileTypeCode[el]).reduce((x, y) => x.concat(y), [])
    : fileTypeCode[moduleCode]
const getOptionsByTypeCodes = (typeCodeArray: string[]) =>
  computed(() => {
    const options: LabelValueOptions<string> = []
    const typeCodeArraySet = [...new Set(typeCodeArray)]
    for (const key in fileTypeCode) {
      options.push(
        ...fileTypeCode[key as ModuleCodeType].filter(el => typeCodeArraySet.includes(el.value)),
      )
    }
    return options
  })

const getOptionsByModuleCodePrefix = (
  prefix: ModuleCodePrefixKeyType | ModuleCodePrefixKeyType[],
) => {
  if (!Array.isArray(prefix))
    prefix = [prefix]

  const onlyPrefix = [...new Set(prefix)]
  const moduleCodes: string[] = []
  onlyPrefix.forEach((prefix) => {
    moduleCodes.push(...Object.keys(fileTypeCode).filter(el => el.startsWith(prefix)))
  })
  return getOptionsByModuleCode(moduleCodes as ModuleCodeType[])
}

const mergeOptions = (
  moduleCode?: ModuleCodeType | ModuleCodeType[],
  typeCodeArray?: string[],
  moduleCodePrefix?: ModuleCodePrefixKeyType | ModuleCodePrefixKeyType[],
) => {
  const options = ((moduleCode && getOptionsByModuleCode(moduleCode)) || ([] as any[]))
    .concat(undefined !== typeCodeArray ? getOptionsByTypeCodes(typeCodeArray).value : [])
    .concat(undefined !== moduleCodePrefix ? getOptionsByModuleCodePrefix(moduleCodePrefix) : [])
  if (!(options && options.length))
    return []

  const result: LabelValueOptions<string> = []
  options.forEach((el) => {
    if (!result.some(resItem => resItem.value === el.value && resItem.label === el.label))
      result.push(el)
  })

  return result
}

export {
  fileTypeCode,
  mergeOptions,
  getOptionsByTypeCodes,
  getOptionsByModuleCode,
  getOptionsByModuleCodePrefix,
}
export type {
  ModuleCodeType,
  ModuleCodeCollectionType,
  ModuleCodePrefixType,
  ModuleCodePrefixKeyType,
}
