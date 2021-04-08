/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react'
import { DataGrid, GridColDef, GridSortModel } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/core/styles'
import { CallStackTableData } from '../../api'
import { attachId, commonTableProps, getCommonOperationColumns } from './common'
import { CallStackFrame, transformTableData } from './transform'
import { EmpytCallStackCell } from './EmptyCallStackCell'
import { CallStackViewCell } from './CallStackViewCell'

export interface IProps {
  data: CallStackTableData
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%'
  }
}))

export const CallStackTable = (props: IProps) => {
  const { data } = props
  const classes = useStyles(props)

  const callStackColumnDef: GridColDef = React.useMemo(
    () => ({
      field: 'callStackFrames',
      headerName: 'Call Stacks',
      filterable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      renderCell: (params) => {
        const value = params.value as CallStackFrame[]
        if (!value.length) {
          return <EmpytCallStackCell />
        }

        return <CallStackViewCell frames={value} />
      }
    }),
    []
  )

  const transformedData = React.useMemo(
    () => transformTableData(attachId(data)),
    [data]
  )

  const columns: GridColDef[] = React.useMemo(
    () => getCommonOperationColumns(data).concat([callStackColumnDef]),
    [data]
  )

  const sortModel: GridSortModel = React.useMemo(
    () => [{ field: 'device_self_duration', sort: 'desc' }],
    []
  )

  return (
    <div className={classes.root}>
      <DataGrid
        {...commonTableProps}
        columns={columns}
        sortModel={sortModel}
        rows={transformedData}
      />
    </div>
  )
}
