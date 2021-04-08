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
    { field: 'name', headerName: 'Name', filterable: true },
    hasInputShape
      ? {
          field: 'input_shape',
          headerName: 'Input Shape',
          filterable: false,
          disableColumnMenu: true
        }
      : undefined,
    { field: 'calls', headerName: 'Calls', filterable: false },
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
