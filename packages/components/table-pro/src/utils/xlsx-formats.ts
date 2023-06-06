// see https://github.com/exceljs/exceljs/blob/master/README_zh.md#样式
// source code https://github.com/exceljs/exceljs/blob/master/lib/xlsx/defaultnumformats.js
// usage https://zhuanlan.zhihu.com/p/31578032

/** 预设 excel 支持的格式 */
export enum XLSXFormats {
  'string' = '@',
  'number' = '#0',
  'number|0.0' = '#0.0',
  'number|0.00' = '#0.00',
  'number|0.000' = '#0.000',
  'number|0.0000' = '#0.0000',
  'number|0.00000' = '#0.00000',
  'number|0.000000' = '#0.000000',
  'percent' = '0%',
  'date' = 'yyyy/m/d hh:mm',
  'date|yyyy-mm-dd' = 'yyyy/m/d',
}
