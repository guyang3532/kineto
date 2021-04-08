/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react'
import { DataGrid, GridColDef, GridSortModel } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/core/styles'
import { CallStackTableData, OperationTableData } from '../../api'
import { OperationGroupBy } from '../../constants/groupBy'
import Modal from '@material-ui/core/Modal'
import * as api from '../../api'
import { DataLoading } from '../DataLoading'
import { CallStackTable } from './CallStackTable'
import { attachId, commonTableProps, getCommonOperationColumns } from './common'
import { ViewCallStackButton } from './ViewCallStackButton'

export interface IProps {
  data: OperationTableData
  run: string
  worker: string
  view: string
  groupBy: OperationGroupBy
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  paper: {
    position: 'absolute',
    width: '70%',
    minWidth: '400px',
    left: '50%',
    top: '50%',
    transform: `translate(-50%, -50%)`,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

export const OperationTable = (props: IProps) => {
  const { data, run, worker, view, groupBy } = props
  const classes = useStyles(props)

  const [callStackTableData, setCallStackTableData] = React.useState<
    CallStackTableData | undefined
  >(undefined)
  const [callStackModalOpen, setCallStackModalOpen] = React.useState(false)

  const openCallStackModal = React.useCallback(() => {
    setCallStackModalOpen(true)
  }, [])

  const closeCallStackModal = React.useCallback(() => {
    setCallStackModalOpen(false)
  }, [])

  const onShowCallStackClicked = React.useCallback(
    (name: string, inputShape?: string) => {
      openCallStackModal()
      api.defaultApi
        .operationStackGet(run, worker, view, groupBy, name, inputShape)
        .then((resp) => {
          setCallStackTableData(resp)
        })
    },
    [run, worker, view, groupBy]
  )

  const callStackColumnDef: GridColDef = React.useMemo(
    () => ({
      field: 'has_call_stack',
      headerName: 'Call Stack',
      filterable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      renderCell: (params) => {
        const name = params.row.name as string
        const inputShape = params.row.input_shape as string | undefined

        return (
          <ViewCallStackButton
            name={name}
            inputShape={inputShape}
            has_call_stack={!!params.value}
            onClick={onShowCallStackClicked}
          />
        )
      }
    }),
    [onShowCallStackClicked]
  )

  const columns: GridColDef[] = React.useMemo(
    () => getCommonOperationColumns(data).concat([callStackColumnDef]),
    [data, callStackColumnDef]
  )

  const sortModel: GridSortModel = React.useMemo(
    () => [{ field: 'device_self_duration', sort: 'desc' }],
    []
  )

  const renderedTable = React.useMemo(
    () => (
      <DataLoading value={callStackTableData}>
        {(graph) => <CallStackTable data={graph} />}
      </DataLoading>
    ),
    [callStackTableData]
  )

  const rows = React.useMemo(() => attachId(data), [data])

  return (
    <div className={classes.root}>
      <DataGrid
        {...commonTableProps}
        columns={columns}
        sortModel={sortModel}
        rows={rows}
      />
      <Modal
        title="Call stack"
        open={callStackModalOpen}
        onClose={closeCallStackModal}
      >
        <div className={classes.paper}>{renderedTable}</div>
      </Modal>
    </div>
  )
}
