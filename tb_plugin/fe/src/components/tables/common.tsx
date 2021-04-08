/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { GridColDef } from '@material-ui/data-grid'
import { firstOrUndefined, isDef } from '../../utils/def'
import {
  CallStackTableData,
  CallStackTableDataInner,
  OperationTableData,
  OperationTableDataInner
} from '../../api'

export function getCommonOperationColumns(
  data: CallStackTableData | OperationTableData | undefined
): GridColDef[] {
  const firstData = firstOrUndefined<
    CallStackTableDataInner | OperationTableDataInner
  >(data)
  const hasInputShape = !firstData || isDef(firstData.input_shape)
  const hasDeviceSelfDuration =
    !firstData || isDef(firstData.device_self_duration)
  const hasDeviceTotalDuration =
    !firstData || isDef(firstData.device_total_duration)

  return [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      filterable: true,
      resizeable: true
    },
    hasInputShape
      ? {
          field: 'input_shape',
          headerName: 'Input Shape',
          filterable: false,
          disableColumnMenu: true,
          resizeable: true
        }
      : undefined,
    {
      field: 'calls',
      headerName: 'Calls',
      disableColumnMenu: true,
      filterable: false
    },
    hasDeviceSelfDuration
      ? {
          field: 'device_self_duration',
          headerName: 'Device Self Duration (us)',
          filterable: false,
          disableColumnMenu: true
        }
      : undefined,
    hasDeviceTotalDuration
      ? {
          field: 'device_total_duration',
          headerName: 'Device Total Duration (us)',
          filterable: false,
          disableColumnMenu: true
        }
      : undefined,
    {
      field: 'host_self_duration',
      headerName: 'Host Self Duration (us)',
      filterable: false,
      disableColumnMenu: true
    },
    {
      field: 'host_total_duration',
      headerName: 'Host Total Duration (us)',
      filterable: false,
      disableColumnMenu: true
    }
  ].filter(isDef)
}

let uid = 1
export function attachId<
  T extends CallStackTableDataInner | OperationTableDataInner
>(data: T[]): T[] {
  return data.map((d) => ({
    ...d,
    id: uid++
  }))
}

export const commonTableProps = {
  rowHeight: 24,
  headerHeight: 32,
  pageSize: 30,
  autoHeight: true
}
