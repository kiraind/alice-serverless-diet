import { declareType, TypedData, Types } from 'ydb-sdk'

export interface IMeal {
  id: string
  name: string
  kcalPer100G: number
}

export class Meal extends TypedData {
  @declareType(Types.UTF8)
  public id: string

  @declareType(Types.UTF8)
  public name: string

  @declareType(Types.DOUBLE)
  public kcalPer100G: number

  constructor (data: IMeal) {
    super(data)
    this.id = data.id
    this.name = data.name
    this.kcalPer100G = data.kcalPer100G
  }
}
