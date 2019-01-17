// external imports
import React, { ReactElement } from 'react'
import { css, Checkbox, ITheme } from 'office-ui-fabric-react'
import { AutoSizer, Column, Table } from 'react-virtualized'

// internal imports
import defineStyle, { ClassesOf } from '../../../styling/defineStyle'
import DataTableProps from './DataTableProps'
import DataTableColumnProps from './DataTableColumnProps'
import SortAscIcon from './internal/icons/SortAscIcon'
import SortDescIcon from './internal/icons/SortDescIcon'


// --- styles of DataTable ------------------------------------------

const styleDataTable = defineStyle((theme: ITheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexGrow: 1,
    overflow: 'hidden',

    selectors: {
      '& .ReactVirtualized__Table__Grid': {
        outline: 'none',
      }
    }
  },

  tableHead: {
    display: 'flex',
    alignItems: 'stretch !important',
    justifyContent: 'stretch',
    flexWrap: 'nowrap',

    selectors: {
      '& > *': {
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '5px',
        color: theme.palette.black,
        backgroundColor: theme.palette.neutralLighter,
        borderWidth: '1px 0 1px 1px',
        borderColor: theme.palette.neutralTertiaryAlt,
        borderStyle: 'solid',
        fontSize: theme.fonts.mediumPlus.fontSize,
        fontWeight: 'normal',
        textTransform: 'none',
      },

      '& > *:last-child': {
        borderRightWidth: '1px'
      },

      '& > *[data-sortable=true]': {
        cursor: 'pointer',
        
        selectors: {
          ':hover': {
            //borderBottomWidth: '1px',
            //borderBottomStyle: 'solid',
            //borderBottomColor: theme.palette.themePrimary,
            backgroundColor: theme.palette.neutralLight,
          },

          ':active': {
            backgroundColor: theme.palette.neutralTertiaryAlt,
          }
        }
      },
    }
  },

  tableHeadCellContent: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },

  tableBody: {
    selectors: {
      '& > tr': {
        backgroundColor: theme.palette.white, 
      },

      '& > tr > td': {
        boxSizing: 'border-box',
        padding: '0.375rem',
        fontSize: theme.fonts.medium.fontSize,
        borderWidth: '0 0 0.5px 0',
        borderColor: theme.palette.neutralLight,
        borderStyle: 'solid',
      },
    }
  },

  tableRow: {
    borderWidth: '0 0 1px 0',
    borderColor: theme.palette.neutralLight,
    borderStyle: 'solid',
    fontSize: '14px',
  },

  dataCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  alignCenter: {
    textAlign: 'center'
  },

  alignEnd: {
    textAlign: 'right'
  },

  rowSelectionColumn: {
    width: '32px',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,

      selectors: {
      '& > div': {
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      }
    }
  },

  selectedRow: {
    color: 'black !important',
    backgroundColor: theme.palette.themeLighter + ' !important',
  }
}))

type DataTableClasses = ClassesOf<typeof styleDataTable>

// --- DataTableView ------------------------------------------------

function DataTableView(props: DataTableProps) {
  const
    [selectedRows, setSelectionRows] = React.useState(() => new Set<number>()),
    runOnUpdater = React.useRef([]),
    model = React.useMemo(() => getDataTableModel(props, selectedRows), null),
    rowSelectionMode = props.rowSelectionOptions.mode || 'none'

  React.useEffect(() =>  {
    for (let i = 0; i < runOnUpdater.current.length; ++i) {
      const action = runOnUpdater.current[i]
      action()
    }
  
    runOnUpdater.current.length = 0
  })


  function changeSort(field: string, sortDesc: boolean) {
    const onSortChange = props.onSortChange

    if (onSortChange) {
      runOnUpdater.current.push(() => onSortChange({
        type: 'sortChange',
        sortBy: field,
        sortDesc
      }))
    }
  }

  function changeSelection(selection: Set<number>) { // TODO
    setSelectionRows(selection)

    const onRowSelectionChange = props.onRowSelectionChange

    if (onRowSelectionChange) {
      runOnUpdater.current.push(() => onRowSelectionChange({
        type: 'rowSelectionChange',
        selection: Array.from(selection)
      }))
    }
  }

  return styleDataTable(classes => {
    return (
      <div className={classes.container}>
        <AutoSizer>
          {
            ({ width, height }) => { 
              const
                columnWidths = calculateColumnWidths(model, width),
                   dataColumns = 
                  model.columns.map((column: any, columnIndex: any)  => // TODO
                    <Column
                      width={columnWidths.dataColumns[columnIndex]}
                      label={column.title}
                      dataKey={column.field}
                      cellRenderer={({ rowIndex }) =>
                        createTableBodyCell(columnIndex, model, model.data[rowIndex], classes)}
                    />
                  )
               if (model.rowSelectionOptions.mode !== 'none') {
                  dataColumns.unshift(
                    <Column
                      width={columnWidths.selectorColumn}
                      dataKey={null}
                      cellRenderer={({ rowIndex }) =>
                        createSelectCheckbox(rowIndex, model, changeSelection)}
                    />
                  )
                }

                return (
                  <Table
                    width={width}
                    height={height - 10}
                    headerHeight={20}
                    rowHeight={28}
                    rowCount={model.data.length}
                    rowGetter={({ index }) => model.data[index]}
                    headerRowRenderer={(params: any) => createHeaderRow(model, columnWidths, classes, changeSelection, changeSort)}
                    rowClassName={classes.tableRow}
                  >
                    {dataColumns}
                  </Table>
                )
              }
            }
          </AutoSizer>
        </div>
    )
  })
}

// --- locals -------------------------------------------------------

function getDataTableModel(props: DataTableProps, rowSelection: Set<number>): DataTableModel {
  const model: DataTableModel = {
    $kind: 'DataTableModel',
    rowSelectionOptions : props.rowSelectionOptions,
    columns: [],
    data: props.data || [],
    rowSelection,
    sortBy: props.sortBy  || null,
    sortDesc: props.sortDesc || false,
  }

  React.Children.forEach(props.children, (child: ReactElement<DataTableColumnModel>) => {
    model.columns.push(
        getColumnModel(child.props))
  })

  return model
}

function getColumnModel(props: DataTableColumnProps): DataTableColumnModel {
  return {
    $kind: 'DataTableColumnModel',
    title: props.title,
    field: props.field || null,
    align: props.align || null,
    sortable: props.sortable || false,
    width: props.width
  }
}

// --- data models --------------------------------------------------

type DataTableModel = {
  $kind: 'DataTableModel',

  rowSelectionOptions: {
    mode: 'none' | 'single' | 'multi',
  },

  columns: (DataTableColumnModel)[],
  data: any[],
  sortBy: string | null,
  sortDesc: boolean,

  rowSelection: Set<number>,
}

type DataTableColumnModel = {
  $kind: 'DataTableColumnModel',
  title: string,
  field: string | null,
  align: 'start' | 'center' | 'end' | null,
  sortable: boolean,
  width: number
}


function calculateColumnWidths(model: DataTableModel, totalWidth: number) {
  const
    hasSelectorColumn = model.rowSelectionOptions.mode !== 'none',
    selectorColumnWidth = hasSelectorColumn ? 32 : 0,
    columns = model.columns,
    columnCount = columns.length,

    ret = {
      selectorColumn: selectorColumnWidth,
      dataColumns: [] as number[]
    }

    const
      realTotal = totalWidth - selectorColumnWidth,

      ratioTotal = columns.reduce((sum, col) => {
        return sum + col.width
      }, 0)

    let sumRealWidths = 0 

    for (let i = 0; i < columnCount; ++i) {
      const
        column = columns[i],
  
        realWidth =
          i < columnCount - 1
            ? Math.round(column.width * realTotal / ratioTotal)
            : realTotal - sumRealWidths - 0.5 // TODO: why -0.5

      sumRealWidths += realWidth

      ret.dataColumns.push(realWidth)
    }

    return ret
}

function createHeaderRow(model: DataTableModel, columnWidths: any,  classes: DataTableClasses, changeSelection: (selection: any) => void, changeSort: (field: string, sortDesc: boolean) => void) { // TODO
  const
    selectionMode = model.rowSelectionOptions.mode,

    selectionColumn =
      selectionMode === 'none'
        ? null
        : <div className={classes.rowSelectionColumn} style={{ minWidth: columnWidths.selectorColumn }}>
            <div>
              {
                selectionMode === 'multi'
                  ? createSelectAllCheckbox(model, changeSelection)
                  : null
              }
            </div>
          </div>

  return (
    <div className={css('ReactVirtualized__Table__headerRow', classes.tableHead)}>
      {selectionColumn}
      {
        model.columns.map((column, columnIdx) =>
          createTableHeadCell(columnIdx, column, model, columnWidths.dataColumns[columnIdx], classes, changeSort))
      }
    </div>
  )
}

function createTableHeadCell(columnIdx: number, column: DataTableColumnModel, model: DataTableModel, width: number, classes: DataTableClasses, changeSort: (field: string, sortDesc: boolean) => void) {
  const
    sortable = model.columns[columnIdx].sortable,
    sortBy = model.sortBy,
    sortDesc = model.sortDesc,
    isSorted = sortBy !== null && sortBy === column.field,

    sortIcon = // TODO
      <div style={{ width: '20px', height: '20px' }}>
        {
          sortable && isSorted
            ? (sortDesc ? <SortDescIcon/> : <SortAscIcon/>)
            : null
        }
      </div>,

    onClick = 
      !sortable && column.field
        ? null
        : () => {
          changeSort(column.field, isSorted ? !sortDesc : false)
        } 

  return (
    <div key={columnIdx} data-sortable={String(sortable)} onClick={onClick} style={{ width, minWidth: width, maxWidth: width }}>
      <div className={classes.tableHeadCellContent}>
        {column.title}
        {sortIcon}
      </div>
    </div>
  )
}

function createTableBodyRow(rowIndex: number, model: DataTableModel, classes: DataTableClasses, changeRowSelection: (selection: any) => void) { // TODO
  const
    row: any = model.data[rowIndex],
    selectionMode = model.rowSelectionOptions.mode,
  
    selectionColumn =
      selectionMode === 'none'
        ? null
        : <div className={classes.rowSelectionColumn}>
            <div>{createSelectCheckbox(rowIndex, model, changeRowSelection)}
            </div>
          </div>

  return (
    <tr key={rowIndex} className={model.rowSelection.has(rowIndex) ? classes.selectedRow : null }>
      {selectionColumn}
      {
        model.columns.map((column, columnIdx) =>
          createTableBodyCell(columnIdx, model, row, classes))
      }
    </tr>
  )
}

function createTableBodyCell(columnIndex: number, model: DataTableModel, row: any, classes: DataTableClasses) {
  const column = model.columns[columnIndex]

  const className =
    column.align === 'center'
      ? css(classes.dataCell, classes.alignCenter)
      : column.align === 'end'
      ? css(classes.dataCell, classes.alignEnd)
      : classes.dataCell

  return (
    <div key={columnIndex} className={className}>
      {row[column.field]}
    </div>
  )
}

function createSelectCheckbox(index: number, model: DataTableModel, changeRowSelection: (selection: any) => void) { // TODO
  const
    selectionMode = model.rowSelectionOptions.mode,
    checked = model.rowSelection.has(index),

    onChange =() => {
      let selectedRows: Set<number>
      
      if (selectionMode === 'single') {
        selectedRows = new Set([index])
      } else {
        selectedRows = new Set(model.rowSelection)

        if (checked) {
          selectedRows.delete(index)
        } else {
          selectedRows.add(index)
        }
      }

      changeRowSelection(selectedRows)
    }

  return (
    <Checkbox checked={checked} onChange={onChange}/>
  ) 
}

function createSelectAllCheckbox(model: DataTableModel, changeRowSelection: (selection: Set<number>) => void) { // TODO
  const
    rowSelectionSize = model.rowSelection.size,
    checked = rowSelectionSize > 0 && rowSelectionSize === model.data.length,

    onChange =() => {
      const selectedRows: Iterable<number> =
        checked
          ? []
          : model.data.keys()

      changeRowSelection(new Set(selectedRows))
    }

  return (
    <Checkbox checked={checked} onChange={onChange}/>
  ) 
}

// --- exports ------------------------------------------------------

export default DataTableView
