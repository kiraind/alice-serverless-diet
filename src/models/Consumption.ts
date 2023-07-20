import { declareType, TypedData, Types } from 'ydb-sdk'

export interface IConsumption {
  id: string
  datetime: Date
  grams: number
  mealId: string
}

export class Consumption extends TypedData {
  @declareType(Types.UTF8)
  public id: string

  @declareType(Types.DATETIME)
  public datetime: Date

  @declareType(Types.DOUBLE)
  public grams: number

  @declareType(Types.UTF8)
  public mealId: string

  constructor (data: IConsumption) {
    super(data)
    this.id = data.id
    this.datetime = data.datetime
    this.grams = data.grams
    this.mealId = data.mealId
  }
}
