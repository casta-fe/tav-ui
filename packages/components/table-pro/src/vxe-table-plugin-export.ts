// @ts-nocheck
/* eslint-disable @typescript-eslint/no-namespace */
import ExcelJS from 'exceljs'
import XEUtils from 'xe-utils'
import { useMessage } from '@tav-ui/hooks/web/useMessage'
import { ACTION_COLUMNS, SELECT_COMPONENTS } from './const'
import type {
  VxeGlobalInterceptorHandles,
  VxeTableConstructor,
  // eslint-disable-next-line sort-imports
  VXETableCore,
  // VxeTableDefines,
  VxeTablePropTypes,
} from 'vxe-table'

interface ColumnInfo {
  _row: any
  _colSpan: number
  _rowSpan: number
  childNodes: ColumnInfo[]
  [key: string]: any
}

let vxetable: VXETableCore

// declare module 'vxe-table' {
//   namespace VxeTableDefines {
//     interface ExtortSheetMethodParams {
//       workbook: ExcelJS.Workbook
//       worksheet: ExcelJS.Worksheet
//     }
//     interface ColumnInfo {
//       _row: any
//       _colSpan: number
//       _rowSpan: number
//       childNodes: ColumnInfo[]
//     }
//   }
// }

// 遵循飞书文档样式
let defaultHeaderHeight = 26
let defaultHeaderBackgroundColor = 'f5f6f7'
let defaultHeaderFontSize = 11

let defaultCellHeight = 24
let defaultCellFontColor = '1f2329'
let defaultCellFontSize = 10
let defaultCellBorderStyle = 'thin'
let defaultCellBorderColor = 'dee0e3'

let defaultFooterHeight = defaultHeaderHeight
let defaultFooterBackgroundColor = defaultHeaderBackgroundColor
let defaultFooterFontSize = defaultHeaderFontSize

let defaultDescriptionHeight = 40
let defaultDescriptionBackgroundColor = 'fff258'
let defaultDescriptionFontSize = 14
let defaultDescriptionAlign = 'left'

const { createMessage } = useMessage()

function getCellLabel(column: ColumnInfo, cellValue: any) {
  if (cellValue) {
    if (column.type === 'seq') {
      return XEUtils.toValueString(cellValue)
    }
    switch (column.cellType) {
      case 'string':
        return XEUtils.toValueString(cellValue)
      case 'number':
        if (!isNaN(cellValue)) {
          return Number(cellValue)
        }
        break
      default:
        if (cellValue.length < 12 && !isNaN(cellValue)) {
          return Number(cellValue)
        }
        break
    }
  }
  return cellValue
}

function getFooterData(opts: VxeTablePropTypes.ExportConfig, footerData: any[][]) {
  const { footerFilterMethod } = opts
  return footerFilterMethod
    ? footerData.filter((items, index) => footerFilterMethod({ items, $rowIndex: index }))
    : footerData
}

function getFooterCellValue(
  $table: VxeTableConstructor,
  opts: VxeTablePropTypes.ExportConfig,
  rows: any[],
  column: ColumnInfo
) {
  //TODO 尾部处理
  const cellValue = getCellLabel(column, rows[$table.getVMColumnIndex(column)])
  return cellValue
}

function getValidColumn(column: ColumnInfo): ColumnInfo {
  const { childNodes } = column
  const isColGroup = childNodes && childNodes.length
  if (isColGroup) {
    return getValidColumn(childNodes[0])
  }
  return column
}

function setExcelRowHeight(excelRow: ExcelJS.Row, height: number, type?: string) {
  if (height) {
    if (type === 'header') {
      excelRow.height = Math.min(XEUtils.floor(height * 0.75, 12), defaultHeaderHeight)
    } else if (type === 'footer') {
      excelRow.height = Math.min(XEUtils.floor(height * 0.75, 12), defaultFooterHeight)
    } else {
      excelRow.height = Math.min(XEUtils.floor(height * 0.75, 12), defaultCellHeight)
    }
  }
}

function setExcelCellStyle(
  excelCell: ExcelJS.Cell,
  align?: VxeTablePropTypes.Align | VxeTablePropTypes.HeaderAlign | VxeTablePropTypes.FooterAlign
) {
  excelCell.protection = {
    locked: false,
  }
  excelCell.alignment = {
    vertical: 'middle',
    horizontal: align || 'left',
  }
}

function getDefaultBorderStyle() {
  return {
    top: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor,
      },
    },
    left: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor,
      },
    },
    bottom: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor,
      },
    },
    right: {
      style: defaultCellBorderStyle,
      color: {
        argb: defaultCellBorderColor,
      },
    },
  }
}

function deleteNotRequiredColumns(columns: any[]) {
  const handler = (columns: any[]) =>
    columns.filter(
      (column) =>
        (column.type && !SELECT_COMPONENTS.includes(column.type)) ||
        (column.field && !ACTION_COLUMNS.includes(column.field))
    )
  return handler(columns)
}

/**
 * @description 设置表格描述
 * @param sheet
 * @param useStyle
 * @param fileDescription
 */
function setDescription(sheet, useStyle, fileDescription) {
  // see https://github.com/exceljs/exceljs/issues/433
  sheet.spliceRows(1, 0, [])
  // sheet.insertRow(1, [])
  sheet._rows[0].height = defaultDescriptionHeight

  const mergeColRange: string[] = []
  sheet.columns.forEach((column) => {
    mergeColRange.push(column.letter)
  })
  sheet.mergeCells(`${mergeColRange[0]}1`, `${mergeColRange[mergeColRange.length - 1]}1`)
  const cell = sheet.getCell(`${mergeColRange[0]}1`)
  cell.value = fileDescription

  setExcelCellStyle(cell, defaultDescriptionAlign || allAlign)

  if (useStyle) {
    Object.assign(cell, {
      font: {
        size: defaultDescriptionFontSize,
        color: {
          argb: defaultCellFontColor,
        },
        bold: true,
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: defaultDescriptionBackgroundColor,
        },
      },
      border: getDefaultBorderStyle(),
    })
  }
}

/**
 * @description 设置表格序号列
 * @param sheet
 * @param useStyle
 */
function setSeq(sheet, useStyle, fileDescription, headerList, contentList, footerList) {
  const headerDeep = headerList.length
  const seqValues: any[] = []
  // const { footerData } = $table.getTableData()
  // const footers = getFooterData(options, footerData)

  // 填充列内容
  for (let i = 0; i < sheet._rows.length; i++) {
    if (i < (fileDescription ? headerDeep + 1 : headerDeep)) {
      // 把表头的位置空出来占位
      seqValues.push('')
    } else if (
      footerList.length > 0 &&
      i > (fileDescription ? headerDeep + 1 : headerDeep) + contentList.length - 1
    ) {
      // 把表尾的位置空出来占位
      seqValues.push('')
    } else {
      seqValues.push(fileDescription ? i - headerDeep : i - headerDeep + 1)
    }
  }

  sheet.spliceColumns(1, 0, seqValues)
  // sheet.insertColumn(1, seqValues)
  sheet._columns[0].eachCell((cell) => {
    if (useStyle) {
      setExcelCellStyle(cell, defaultDescriptionAlign || allAlign)
      Object.assign(cell, {
        font: {
          size: defaultCellFontSize,
          color: {
            argb: defaultCellFontColor,
          },
        },
        border: getDefaultBorderStyle(),
      })
    }
  })

  // 合并占位符与'序号'
  const mergeColRange: string[] = []
  sheet.columns.forEach((column) => {
    mergeColRange.push(column.letter)
  })
  // fileDescription 如果有值，r、c 各加一让出第一行位置
  sheet.mergeCells(
    `${mergeColRange[0]}${fileDescription ? 1 + 1 : 1}`,
    `${mergeColRange[0]}${fileDescription ? headerDeep + 1 : headerDeep}`
  )
  const firstCell = sheet.getCell(`${mergeColRange[0]}${fileDescription ? 1 + 1 : 1}`)
  firstCell.value = '序号'

  setExcelCellStyle(firstCell, defaultDescriptionAlign || allAlign)
  if (useStyle) {
    Object.assign(firstCell, {
      font: {
        size: defaultHeaderFontSize,
        color: {
          argb: defaultCellFontColor,
        },
        bold: true,
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: defaultHeaderBackgroundColor,
        },
      },
      border: getDefaultBorderStyle(),
    })
  }

  if (fileDescription) {
    // excel bug, manual hack. 新增描述后调用spliceColumns新增一列后之前描述逻辑中合并失效这里需要先删除后覆盖
    Reflect.deleteProperty(sheet._merges, `${mergeColRange[0]}1`)
    sheet.mergeCells(`${mergeColRange[0]}1`, `${mergeColRange[mergeColRange.length - 1 - 1]}1`) // 调用spliceColumns新增一列后 excel 自动在尾部追加一列所以这里要减掉
    const cell = sheet.getCell(`${mergeColRange[0]}1`)
    cell.value = fileDescription

    setExcelCellStyle(cell, defaultDescriptionAlign || allAlign)

    if (useStyle) {
      Object.assign(cell, {
        font: {
          size: defaultDescriptionFontSize,
          color: {
            argb: defaultCellFontColor,
          },
          bold: true,
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: defaultDescriptionBackgroundColor,
          },
        },
        border: getDefaultBorderStyle(),
      })
    }
  }
}

function setFooter(
  sheet,
  useStyle,
  fileSeq,
  $table,
  options,
  fileDescription,
  headerList,
  contentList,
  _footerData
) {
  const headerDeep = headerList.length
  const totalRowCount = sheet._rows.length
  const { footerData } = $table.getTableData()
  const footers = getFooterData(options, _footerData || footerData)

  // 序号列最后一位填充表尾信息
  const fillFooterTitle = (row, value) => {
    if (fileSeq) {
      row.getCell(1).value = value
    }
  }

  for (let i = totalRowCount - footers.length; i < totalRowCount; i++) {
    const idx = (fileDescription ? headerDeep + 1 : headerDeep) + contentList.length
    const row = sheet.getRow(i + 1)
    fillFooterTitle(row, footers[i - idx][0])

    row.eachCell((excelCell) => {
      setExcelCellStyle(excelCell, defaultDescriptionAlign || allAlign)
      if (useStyle) {
        Object.assign(excelCell, {
          font: {
            size: defaultFooterFontSize,
            color: {
              argb: defaultCellFontColor,
            },
            bold: true,
          },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: defaultFooterBackgroundColor,
            },
          },
          border: getDefaultBorderStyle(),
        })
      }
      // const excelCol = sheet.getColumn(excelCell.col)
      // const column: any = $table.getColumnById(excelCol.key as string)
      // const { footerAlign, align } = column
      // setExcelCellStyle(excelCell, footerAlign || align || allFooterAlign || allAlign)
      // if (useStyle) {
      //   Object.assign(excelCell, {
      //     font: {
      //       size: defaultFooterFontSize,
      //       color: {
      //         argb: defaultCellFontColor,
      //       },
      //     },
      //     fill: {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: {
      //         argb: defaultFooterBackgroundColor,
      //       },
      //     },
      //     border: getDefaultBorderStyle(),
      //   })
      // }
    })
  }
}

async function exportXLSX(params: VxeGlobalInterceptorHandles.InterceptorExportParams) {
  const msgKey = 'xlsx'
  const { modal, t } = vxetable
  const { $table, options, columns: _columns, colgroups, datas } = params
  const columns = deleteNotRequiredColumns(_columns)
  const { props, reactData } = $table
  const { headerAlign: allHeaderAlign, align: allAlign, footerAlign: allFooterAlign } = props
  const { rowHeight } = reactData
  const {
    message,
    sheetName,
    isHeader,
    isFooter,
    isMerge,
    isColgroup,
    original,
    useStyle,
    sheetMethod,
    fileDescription,
    fileSeq,
    backupColumns,
    exportModalClose,
    fileStyles,
  } = options

  defaultHeaderHeight = fileStyles.headerHeight ?? defaultHeaderHeight
  defaultHeaderBackgroundColor = fileStyles.headerBackgroundColor ?? defaultHeaderBackgroundColor
  defaultHeaderFontSize = fileStyles.headerFontSize ?? defaultHeaderFontSize

  defaultCellHeight = fileStyles.cellHeight ?? defaultCellHeight
  defaultCellFontColor = fileStyles.cellFontColor ?? defaultCellFontColor
  defaultCellFontSize = fileStyles.cellFontSize ?? defaultCellFontSize
  defaultCellBorderStyle = fileStyles.cellBorderStyle ?? defaultCellBorderStyle
  defaultCellBorderColor = fileStyles.cellBorderColor ?? defaultCellBorderColor

  defaultFooterHeight = fileStyles.footerHeight ?? defaultHeaderHeight
  defaultFooterBackgroundColor = fileStyles.footerBackgroundColor ?? defaultHeaderBackgroundColor
  defaultFooterFontSize = fileStyles.footerFontSize ?? defaultHeaderFontSize

  defaultDescriptionHeight = fileStyles.descriptionHeight ?? defaultDescriptionHeight
  defaultDescriptionBackgroundColor =
    fileStyles.descriptionBackgroundColor ?? defaultDescriptionBackgroundColor
  defaultDescriptionFontSize = fileStyles.descriptionFontSize ?? defaultDescriptionFontSize
  defaultDescriptionAlign = fileStyles.descriptionAlign ?? defaultDescriptionAlign

  const showMsg = message !== false
  const mergeCells = $table.getMergeCells()
  const colList: any[] = []
  const footList: any[] = []
  const sheetCols: any[] = []
  const sheetMerges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = []
  let beforeRowCount = 0
  const colHead: any = {}
  // await $table.updateFooter()
  const _footerData = $table.props.footerMethod
    ? $table.props.footerMethod({ columns, data: datas.map((d) => d._row) })
    : null
  columns.forEach((column) => {
    const { id, property, renderWidth, width, minWidth } = column
    colHead[id] = original ? property : column.getTitle()
    sheetCols.push({
      key: id,
      width: XEUtils.ceil((renderWidth || width || minWidth) / 8, 1),
    })
  })
  // 处理表头
  if (isHeader) {
    // 处理分组
    if (isColgroup && !original && colgroups) {
      colgroups.forEach((cols, rIndex) => {
        const groupHead: any = {}
        columns.forEach((column) => {
          groupHead[column.id] = null
        })
        cols.forEach((column) => {
          const { _colSpan, _rowSpan } = column
          const validColumn = getValidColumn(column)
          const columnIndex = columns.indexOf(validColumn)
          groupHead[validColumn.id] = original ? validColumn.property : column.getTitle()
          if (_colSpan > 1 || _rowSpan > 1) {
            // sheetMerges.push({
            //   s: { r: rIndex, c: columnIndex },
            //   e: { r: rIndex + _rowSpan - 1, c: columnIndex + _colSpan - 1 },
            // })
            sheetMerges.push({
              s: { r: rIndex + 1, c: columnIndex + 1 },
              e: { r: rIndex + _rowSpan - 1 + 1, c: columnIndex + _colSpan - 1 + 1 },
            })
          }
        })
        colList.push(groupHead)
      })
    } else {
      colList.push(colHead)
    }
    beforeRowCount += colList.length
  }
  // 处理合并
  if (isMerge && !original) {
    mergeCells.forEach((mergeItem) => {
      const {
        row: mergeRowIndex,
        rowspan: mergeRowspan,
        col: mergeColIndex,
        colspan: mergeColspan,
      } = mergeItem
      // sheetMerges.push({
      //   s: { r: mergeRowIndex + beforeRowCount, c: mergeColIndex },
      //   e: {
      //     r: mergeRowIndex + beforeRowCount + mergeRowspan - 1,
      //     c: mergeColIndex + mergeColspan - 1,
      //   },
      // })
      sheetMerges.push({
        s: { r: mergeRowIndex + beforeRowCount + 1, c: mergeColIndex + 1 },
        e: {
          r: mergeRowIndex + beforeRowCount + mergeRowspan - 1 + 1,
          c: mergeColIndex + mergeColspan - 1 + 1,
        },
      })
    })
  }
  const rowList = datas.map((item) => {
    const rest: any = {}
    columns.forEach((column) => {
      // rest[column.id] = getCellLabel(column, item[column.id])
      let cellValue = item[column.id]
      // 使用自定义的导出逻辑，针对于单元格是复杂组件的情况（图片、tags等）
      if (column.params && column.params.cellContent) {
        cellValue = column.params.cellContent({ row: item._row || {} }) || ''
      }
      rest[column.id] = getCellLabel(column, cellValue)
    })
    return rest
  })
  beforeRowCount += rowList.length
  // 处理表尾
  if (isFooter) {
    const { footerData } = $table.getTableData()
    const footers = getFooterData(options, _footerData || footerData)
    const mergeFooterItems = $table.getMergeFooterItems()
    // 处理合并
    if (isMerge && !original) {
      mergeFooterItems.forEach((mergeItem) => {
        const {
          row: mergeRowIndex,
          rowspan: mergeRowspan,
          col: mergeColIndex,
          colspan: mergeColspan,
        } = mergeItem
        // sheetMerges.push({
        //   s: { r: mergeRowIndex + beforeRowCount, c: mergeColIndex },
        //   e: {
        //     r: mergeRowIndex + beforeRowCount + mergeRowspan - 1,
        //     c: mergeColIndex + mergeColspan - 1,
        //   },
        // })
        sheetMerges.push({
          s: { r: mergeRowIndex + beforeRowCount + 1, c: mergeColIndex + 1 },
          e: {
            r: mergeRowIndex + beforeRowCount + mergeRowspan - 1 + 1,
            c: mergeColIndex + mergeColspan - 1 + 1,
          },
        })
      })
    }
    footers.forEach((rows) => {
      const item: any = {}
      columns.forEach((column) => {
        item[column.id] = getFooterCellValue($table, options, rows, column) || ''
      })
      footList.push(item)
    })
  }
  const exportMethod = () => {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet(sheetName)
    workbook.creator = 'i7eo'
    sheet.views = [{}] // 为了设置固定的行高必须设置该值，see：https://github.com/exceljs/exceljs/issues/422
    sheet.columns = sheetCols
    if (isHeader) {
      sheet.addRows(colList).forEach((excelRow) => {
        if (useStyle) {
          setExcelRowHeight(excelRow, rowHeight, 'header')
        }
        excelRow.eachCell((excelCell) => {
          const excelCol = sheet.getColumn(excelCell.col)
          const column: any = $table.getColumnById(excelCol.key as string)
          const { headerAlign, align } = column
          setExcelCellStyle(excelCell, headerAlign || align || allHeaderAlign || allAlign)
          if (useStyle) {
            Object.assign(excelCell, {
              font: {
                size: defaultHeaderFontSize,
                color: {
                  argb: defaultCellFontColor,
                },
                bold: true,
              },
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                  argb: defaultHeaderBackgroundColor,
                },
              },
              border: getDefaultBorderStyle(),
            })
          }
        })
      })
    }
    sheet.addRows(rowList).forEach((excelRow) => {
      if (useStyle) {
        setExcelRowHeight(excelRow, rowHeight)
      }
      excelRow.eachCell((excelCell) => {
        const excelCol = sheet.getColumn(excelCell.col)
        const column: any = $table.getColumnById(excelCol.key as string)
        const { align } = column
        setExcelCellStyle(excelCell, align || allAlign)
        if (useStyle) {
          Object.assign(excelCell, {
            font: {
              size: defaultCellFontSize,
              color: {
                argb: defaultCellFontColor,
              },
            },
            border: getDefaultBorderStyle(),
          })
        }

        // 如果不格式化时间或者时间字段返回时间戳能直接供excel使用则可以开启，当前时间字段返回格式化好的时间所以要格式化的话得把每条数据转为时间戳才能让excel的格式化生效
        // if(!excelCol.numFmt) {
        //   if (column.params && column.params.columnFormat) {
        //     excelCol.numFmt = column.params.columnFormat(column, excelCell)
        //   } else {
        //     excelCol.numFmt = '@'
        //   }
        // }

        if (column.params && column.params.cellFormat) {
          excelCell.numFmt = column.params.cellFormat(excelCell)
        } else {
          excelCell.numFmt = '@'
        }
      })
    })
    if (isFooter) {
      sheet.addRows(footList).forEach((excelRow) => {
        if (useStyle) {
          setExcelRowHeight(excelRow, rowHeight, 'footer')
        }
        excelRow.eachCell((excelCell) => {
          const excelCol = sheet.getColumn(excelCell.col)
          const column: any = $table.getColumnById(excelCol.key as string)
          const { footerAlign, align } = column
          setExcelCellStyle(excelCell, footerAlign || align || allFooterAlign || allAlign)
          if (useStyle) {
            Object.assign(excelCell, {
              font: {
                size: defaultFooterFontSize,
                color: {
                  argb: defaultCellFontColor,
                },
              },
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                  argb: defaultFooterBackgroundColor,
                },
              },
              border: getDefaultBorderStyle(),
            })
          }

          if (column.params && column.params.cellFormat) {
            excelCell.numFmt = column.params.cellFormat(excelCell)
          } else {
            excelCell.numFmt = '@'
          }
        })
      })
    }

    if (useStyle && sheetMethod) {
      sheetMethod({
        options,
        workbook,
        worksheet: sheet,
        columns,
        colgroups,
        datas,
        $table,
      })
    }

    fileDescription && setDescription(sheet, useStyle, fileDescription)
    fileSeq && setSeq(sheet, useStyle, fileDescription, colList, rowList, footList)
    footList.length > 0 &&
      setFooter(
        sheet,
        useStyle,
        fileSeq,
        $table,
        options,
        fileDescription,
        colList,
        rowList,
        _footerData
      )

    // sheetMerges.forEach(({ s, e }) => {
    //   // 按开始行，开始列，结束行，结束列合并, see https://github.com/exceljs/exceljs/blob/master/README_zh.md#合并单元格
    //   sheet.mergeCells(s.r + 1, s.c + 1, e.r + 1, e.c + 1)
    // })

    // sheetMerges.forEach(({ s, e }) => {
    //   sheet.mergeCells(s.r, s.c, e.r, e.c)
    // })

    sheetMerges.forEach(({ s, e }) => {
      if (fileDescription) {
        if (fileSeq) {
          sheet.mergeCells(s.r + 1, s.c + 1, e.r + 1, e.c + 1)
        } else {
          sheet.mergeCells(s.r + 1, s.c, e.r + 1, e.c)
        }
      } else {
        if (fileSeq) {
          sheet.mergeCells(s.r, s.c + 1, e.r, e.c + 1)
        } else {
          sheet.mergeCells(s.r, s.c, e.r, e.c)
        }
      }
    })

    // sheetMerges.forEach(({ s, e }) => {
    //   // 按开始行，开始列，结束行，结束列合并, see https://github.com/exceljs/exceljs/blob/master/README_zh.md#合并单元格
    //   if (fileDescription) {
    //     // 如果有描述先往顶部插入一行合并完成后再调用原本的合并，此时因为顶部插入了一行所以在合并时行计算应该下移一位
    //     // sheet.mergeCells(s.r + 1 + 1, s.c + 1, e.r + 1 + 1, e.c + 1)
    //     // 手动添加序号列后行右移
    //     sheet.mergeCells(s.r + 1 + 1, s.c + 1 + 1, e.r + 1 + 1, e.c + 1 + 1)
    //   } else {
    //     // sheet.mergeCells(s.r + 1, s.c + 1, e.r + 1, e.c + 1)
    //     // 手动添加序号列后行右移
    //     sheet.mergeCells(s.r + 1, s.c + 1 + 1, e.r + 1, e.c + 1 + 1)
    //   }
    // })
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' })
      // 导出 xlsx
      downloadFile(blob, options, $table)
      if (showMsg && modal) {
        modal.close(msgKey)
        // modal.message({ content: t('vxe.table.expSuccess'), status: 'success' })
        createMessage.success(t('vxe.table.expSuccess'))
      }
      $table.loadColumn(backupColumns.value)
      exportModalClose()
    })
  }
  if (showMsg && modal) {
    // modal.message({
    //   id: msgKey,
    //   content: t('vxe.table.expLoading'),
    //   status: 'loading',
    //   duration: -1,
    // })
    // setTimeout(exportMethod, 1500)
    createMessage.loading(t('vxe.table.expLoading'), 2).then(
      () => exportMethod(),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    )
  } else {
    exportMethod()
  }
}

function downloadFile(blob: Blob, options: VxeTablePropTypes.ExportConfig) {
  const { modal, t } = vxetable
  const { message, filename, type } = options
  const showMsg = message !== false
  if (window.Blob) {
    if ((navigator as any).msSaveBlob) {
      ;(navigator as any).msSaveBlob(blob, `${filename}.${type}`)
    } else {
      const linkElem = document.createElement('a')
      linkElem.target = '_blank'
      linkElem.download = `${filename}.${type}`
      linkElem.href = URL.createObjectURL(blob)
      document.body.appendChild(linkElem)
      linkElem.click()
      document.body.removeChild(linkElem)
    }
  } else {
    if (showMsg && modal) {
      // modal.alert({ content: t('vxe.error.notExp'), status: 'error' })
      createMessage.error(t('vxe.error.notExp'))
    }
  }
}

function checkImportData(tableFields: string[], fields: string[]) {
  return fields.some((field) => tableFields.indexOf(field) > -1)
}

function importError(params: VxeGlobalInterceptorHandles.InterceptorImportParams) {
  const { modal, t } = vxetable
  const { $table, options } = params
  const { internalData } = $table
  const { _importReject } = internalData
  const showMsg = options.message !== false
  if (showMsg && modal) {
    // modal.message({ content: t('vxe.error.impFields'), status: 'error' })
    createMessage.error(t('vxe.error.impFields'))
  }
  if (_importReject) {
    _importReject({ status: false })
  }
}

function importXLSX(params: VxeGlobalInterceptorHandles.InterceptorImportParams) {
  const { modal, t } = vxetable
  const { $table, columns, options, file } = params
  const { internalData } = $table
  const { _importResolve } = internalData
  const showMsg = options.message !== false
  const fileReader = new FileReader()
  fileReader.onerror = () => {
    importError(params)
  }
  fileReader.onload = (evnt) => {
    const tableFields: string[] = []
    columns.forEach((column) => {
      const field = column.property
      if (field) {
        tableFields.push(field)
      }
    })
    const workbook = new ExcelJS.Workbook()
    const readerTarget = evnt.target
    if (readerTarget) {
      workbook.xlsx.load(readerTarget.result as ArrayBuffer).then((wb) => {
        const firstSheet = wb.worksheets[0]
        if (firstSheet) {
          const sheetValues = firstSheet.getSheetValues() as string[][]
          const fieldIndex = XEUtils.findIndexOf(sheetValues, (list) => list && list.length > 0)
          const fields = sheetValues[fieldIndex] as string[]
          const status = checkImportData(tableFields, fields)
          if (status) {
            const records = sheetValues.slice(fieldIndex).map((list) => {
              const item: any = {}
              list.forEach((cellValue, cIndex) => {
                item[fields[cIndex]] = cellValue
              })
              const record: any = {}
              tableFields.forEach((field) => {
                record[field] = XEUtils.isUndefined(item[field]) ? null : item[field]
              })
              return record
            })
            $table.createData(records).then((data: any[]) => {
              let loadRest: Promise<any>
              if (options.mode === 'insert') {
                loadRest = $table.insertAt(data, -1)
              } else {
                loadRest = $table.reloadData(data)
              }
              return loadRest.then(() => {
                if (_importResolve) {
                  _importResolve({ status: true })
                }
              })
            })
            if (showMsg && modal) {
              // modal.message({
              //   content: t('vxe.table.impSuccess', [records.length]),
              //   status: 'success',
              // })
              createMessage.success(t('vxe.table.impSuccess'))
            }
          } else {
            importError(params)
          }
        } else {
          importError(params)
        }
      })
    } else {
      importError(params)
    }
  }
  fileReader.readAsArrayBuffer(file)
}

function handleImportEvent(params: VxeGlobalInterceptorHandles.InterceptorImportParams) {
  if (params.options.type === 'xlsx') {
    importXLSX(params)
    return false
  }
}

function handleExportEvent(params: VxeGlobalInterceptorHandles.InterceptorExportParams) {
  if (params.options.type === 'xlsx') {
    exportXLSX(params)
    return false
  }
}

/**
 * 基于 vxe-table 表格的增强插件，支持导出 xlsx 格式
 */
export const VXETablePluginExportXLSX = {
  install(vxetablecore: VXETableCore) {
    const { setup, interceptor } = vxetablecore

    vxetable = vxetablecore

    setup({
      export: {
        types: {
          xlsx: 0,
        },
      },
    })
    interceptor.mixin({
      'event.import': handleImportEvent,
      'event.export': handleExportEvent,
    })
  },
}

if (typeof window !== 'undefined' && window.VXETable && window.VXETable.use) {
  window.VXETable.use(VXETablePluginExportXLSX)
}

export default VXETablePluginExportXLSX
