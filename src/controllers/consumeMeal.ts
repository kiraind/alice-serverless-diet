import { Session } from 'ydb-sdk'
import { createId } from '@paralleldrive/cuid2'

import { Consumption, IConsumption } from '../models/Consumption'

export async function consumeMeal (session: Session, { mealId, grams }: Omit<IConsumption, 'id' | 'datetime'>): Promise<Consumption> {
  const query = await session.prepareQuery(`
    DECLARE $id AS Utf8;
    DECLARE $datetime AS Datetime;
    DECLARE $mealId AS Utf8;
    DECLARE $grams AS Double;

    UPSERT INTO consumptions (id, datetime, mealId, grams)
    VALUES ($id, $datetime, $mealId, $grams);
  `)

  const consumption = new Consumption({
    id: createId(),
    datetime: new Date(),
    mealId,
    grams
  })

  await session.executeQuery(query, {
    $id: consumption.getTypedValue('id'),
    $datetime: consumption.getTypedValue('datetime'),
    $mealId: consumption.getTypedValue('mealId'),
    $grams: consumption.getTypedValue('grams')
  })

  return consumption
}
