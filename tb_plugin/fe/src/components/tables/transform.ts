/*---------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { CallStackTableData, CallStackTableDataInner } from '../../api'

export interface CallStackFrame {
  file?: string
  line?: number
  raw: string
}

type TransformedCallStackDataInner = Omit<
  CallStackTableDataInner,
  'call_stack' | 'callStack'
> & {
  callStackFrames: CallStackFrame[]
}

const lineRegex = /\([0-9]+\)$/

function parseCallStackLine(raw: string): CallStackFrame {
  raw = raw.trim()
  const [location] = raw.split(':')

  const result = lineRegex.exec(location)
  if (!result) {
    return { raw }
  }

  const lineWithParens = result[0].trim()
  const file = raw.slice(0, result.index).trim()
  const line = Number(lineWithParens.substr(1, lineWithParens.length - 2))

  return {
    raw,
    file,
    line
  }
}

function parseCallStack(callStack: string | undefined): CallStackFrame[] {
  const lines = (callStack ?? '')
    .trim()
    .split(';')
    .map((x) => x.trim())
  return lines.map(parseCallStackLine)
}

function transformCallStackData(
  data: CallStackTableDataInner
): TransformedCallStackDataInner {
  return {
    ...data,
    callStackFrames: parseCallStack(data.call_stack)
  }
}

export function transformTableData(
  data: CallStackTableData
): TransformedCallStackDataInner[] {
  return data.map(transformCallStackData)
}
