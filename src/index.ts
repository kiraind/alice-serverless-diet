import { Driver, getLogger, TokenAuthService } from 'ydb-sdk'

import { addMeal, consumeMeal, findMeal, getTodayKcal } from './controllers'
import { Context, Event, EventResponse } from './types'

const logger = getLogger({ level: 'debug' })
const panic = (message: string): never => {
  logger.fatal(message)
  process.exit(1)
}

const endpoint = process.env.YDB_ENDPOINT
const database = process.env.YDB_DATABASE

export async function handler (event: Event, context: Context): Promise<EventResponse> {
  if (context.token?.access_token === undefined) {
    panic('No access token provided')
  }

  const authService = new TokenAuthService(context.token?.access_token ?? '')
  const driver = new Driver({ endpoint, database, authService })

  const { version, session, request } = event

  const respond = (text: string): EventResponse => ({
    version,
    session,
    response: {
      text,
      end_session: false
    }
  })

  if (request.type !== 'SimpleUtterance') {
    return respond('Функция не поддерживается')
  }

  if (!(await driver.ready(3000))) {
    panic('Driver has not become ready in 3 seconds!')
  }

  const response = await driver.tableClient.withSession(async (session) => {
    if (request.command.length === 0 || request.nlu.intents.query !== undefined) {
      const kcal = await getTodayKcal(session)
      return `За сегодня вы съели ${kcal} килокалорий`
    } else if (request.nlu.intents.add_meal !== undefined) {
      const name = request.nlu.intents.add_meal.slots.meal.value
      const kcalPer100G = request.nlu.intents.add_meal.slots.kcal.value

      await addMeal(session, { name, kcalPer100G })

      return 'Окей, запомнила новое блюдо'
    } else if (request.nlu.intents.consume !== undefined) {
      const name = request.nlu.intents.consume.slots.meal.value
      const grams = request.nlu.intents.consume.slots.amount.value

      const meal = await findMeal(session, { name })

      if (meal === null) {
        return `Блюдо ${name} не найдено`
      }

      await consumeMeal(session, { mealId: meal.id, grams })

      const kcal = await getTodayKcal(session)

      return `Записала! Итого за сегодня вы съели ${kcal} килокалорий`
    } else {
      return 'Я вас не понимаю'
    }
  })

  return respond(response)
}
