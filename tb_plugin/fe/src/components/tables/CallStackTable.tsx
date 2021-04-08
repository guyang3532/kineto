/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react'
import { DataGrid, GridColDef, GridSortModel } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/core/styles'
import { CallStackTableData } from '../../api'
import { getCommonOperationColumns } from './common'
import { CallStackFrame, transformTableData } from './transform'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import { navToCode } from '../../utils/vscode'

export interface IProps {
  data: CallStackTableData
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
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
          return <div>-</div>
        }

        return (
          <List>
            {value.map((frame) => {
              const onClick = () => {
                if (frame.line && frame.file) {
                  navToCode(frame.file, frame.line)
                }
              }

              return (
                <ListItem>
                  <Button onClick={onClick}>{frame.raw}</Button>
                </ListItem>
              )
            })}
          </List>
        )
      }
    }),
    []
  )

  const transformedData = React.useMemo(() => transformTableData(data), [data])

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
        columns={columns}
        sortModel={sortModel}
        rows={transformedData}
        pageSize={30}
      />
    </div>
  )
}
