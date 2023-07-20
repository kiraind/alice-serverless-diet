import { Session, Ydb } from 'ydb-sdk'

import { IMeal, Meal } from '../models'
import { toTypedValue } from '../utils/toTypedValue'

export async function findMeal (session: Session, { name }: Omit<IMeal, 'id' | 'kcalPer100G'>): Promise<Meal | null> {
  const query = await session.prepareQuery(`
    DECLARE $name AS Utf8;

    SELECT id, name, kcalPer100G FROM meals 
    WHERE name LIKE $name || '%';
  `)

  const res = await session.executeQuery(query, {
    $name: toTypedValue(name)
  })

  const rows = res.resultSets[0].rows

  if (rows === undefined || rows === null || rows.length === 0) {
    return null
  }

  const [idVal, nameVal, kcalPer100GVal] = rows[0].items as [Ydb.IValue, Ydb.IValue, Ydb.IValue]

  const meal = new Meal({
    id: idVal.textValue as string,
    name: nameVal.textValue as string,
    kcalPer100G: kcalPer100GVal.doubleValue as number
  })

  return meal
}
