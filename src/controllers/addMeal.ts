import { Session } from 'ydb-sdk'
import { createId } from '@paralleldrive/cuid2'

import { IMeal, Meal } from '../models'

export async function addMeal (session: Session, { name, kcalPer100G }: Omit<IMeal, 'id'>): Promise<Meal> {
  const query = await session.prepareQuery(`
    DECLARE $id AS Utf8;
    DECLARE $name AS Utf8;
    DECLARE $kcalPer100G AS Double;

    UPSERT INTO meals (id, name, kcalPer100G)
    VALUES ($id, $name, $kcalPer100G);
  `)

  const meal = new Meal({
    id: createId(),
    name,
    kcalPer100G
  })

  await session.executeQuery(query, {
    $id: meal.getTypedValue('id'),
    $name: meal.getTypedValue('name'),
    $kcalPer100G: meal.getTypedValue('kcalPer100G')
  })

  return meal
}
