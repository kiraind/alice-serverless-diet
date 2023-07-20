export enum NluType {
  Number = 'YANDEX.NUMBER',
  String = 'YANDEX.STRING'
}

export type Token = any

export interface Request {
  command: string
  original_utterance: string
  nlu: {
    tokens: string[]
    entities: Array<{
      type: NluType
      tokens: Token[]
      value: string | number
    }>
    intents: {
      query?: { slots: {} }
      add_meal?: {
        slots: {
          meal: { type: NluType.String, tokens: Token[], value: string }
          kcal: { type: NluType.Number, tokens: Token[], value: number }
        }
      }
      consume?: {
        slots: {
          meal: { type: NluType.String, tokens: Token[], value: string }
          amount: { type: NluType.Number, tokens: Token[], value: number }
        }
      }
    }
  }
  markup: {
    dangerous_context: false
  }
  type: 'SimpleUtterance' | string
}

export interface Event {
  version: string
  session: any
  request: Request
}

export interface Response {
  text: string
  end_session: boolean
}

export interface EventResponse {
  version: string
  session: any
  response: Response
}

export interface Context {
  token?: {
    access_token: string
    expires_in: number
    token_type: string
  }
}
