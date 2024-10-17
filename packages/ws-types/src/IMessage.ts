import { WebSocketMessageType } from './Enums'

export interface WebSocketMessage<T> {
    type: WebSocketMessageType
    data: T
}
