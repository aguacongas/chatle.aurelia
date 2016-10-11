import { Disconnected } from '../services/chat.service'
export class UserDisconnected {
    constructor(public user: Disconnected) { }
}