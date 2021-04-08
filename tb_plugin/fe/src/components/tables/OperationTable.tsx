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
import { getCommonOperationColumns } from './common'
import Button from '@material-ui/core/Button'

export interface IProps {
  data: OperationTableData
  run: string
  worker: string
  view: string
  groupBy: OperationGroupBy
}

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
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
      field: 'call_stack',
      headerName: 'Call Stack',
      filterable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      renderCell: (params) => {
        const onClick = () => {
          const name = params.getValue('name') as string
          const inputShape = params.getValue('input_shape') as
            | string
            | undefined
          onShowCallStackClicked(name, inputShape)
        }

        return (
          <Button disabled={!params.value} onClick={onClick}>
            View
          </Button>
        )
      }
    }),
    [onShowCallStackClicked]
  )

  const columns: GridColDef[] = React.useMemo(
    () =>
      getCommonOperationColumns(callStackTableData).concat([
        callStackColumnDef
      ]),
    [callStackTableData, callStackColumnDef]
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

  return (
    <div className={classes.root}>
      <DataGrid
        columns={columns}
        sortModel={sortModel}
        rows={data}
        pageSize={30}
      />
      <Modal
        title="Call stack"
        open={callStackModalOpen}
        onClose={closeCallStackModal}
      >
        {renderedTable}
      </Modal>
    </div>
  )
}
