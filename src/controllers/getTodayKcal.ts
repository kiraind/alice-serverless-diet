import { Session } from 'ydb-sdk'

import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import { toTypedValue } from '../utils/toTypedValue'

export async function getTodayKcal (session: Session): Promise<number> {
  const query = await session.prepareQuery(`
    DECLARE $from AS Datetime;
    DECLARE $to AS Datetime;

    SELECT SUM(grams / 100 * kcalPer100G)
    FROM consumptions
        INNER JOIN meals ON consumptions.mealId = meals.id
    WHERE datetime >= $from AND datetime < $to;
  `)

  const now = new Date()

  const res = await session.executeQuery(query, {
    $from: toTypedValue(startOfDay(now)),
    $to: toTypedValue(endOfDay(now))
  })

  const todayKcal = res.resultSets[0].rows?.[0].items?.[0].doubleValue

  if (typeof todayKcal !== 'number') {
    return 0
  }

  return todayKcal
}
