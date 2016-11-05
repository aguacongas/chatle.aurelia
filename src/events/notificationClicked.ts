import { Message } from '../model/message';

export class NotificationClicked {
    constructor(public message: Message) { }
}