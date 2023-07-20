import { Types, Ydb } from 'ydb-sdk'

export function toTypedValue (value: Date | string): Ydb.ITypedValue {
  if (value instanceof Date) {
    return { type: Types.DATETIME, value: { uint32Value: value.valueOf() / 1000 } }
  }

  if (typeof value === 'string') {
    return { type: Types.UTF8, value: { textValue: value } }
  }

  throw new Error('Unsupported type')
}
