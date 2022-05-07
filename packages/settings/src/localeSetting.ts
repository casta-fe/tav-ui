export const LOCALE: Record<string, any> = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
}

export const localeSetting: any = {
  showPicker: false,
  // Locale
  locale: LOCALE.ZH_CN,
  // Default locale
  fallback: LOCALE.ZH_CN,
  // available Locales
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
}

// locale list
export const localeList: any[] = [
  {
    text: '简体中文',
    event: LOCALE.ZH_CN,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
]
