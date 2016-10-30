import { Attendee } from './attendee';
import { Message } from './message';
import { User } from './user';

export class Conversation {
    id: string;
    title: string;
    attendees: Attendee[];
    messages: Message[];
    isInitiatedByUser: boolean;

    constructor(user?: User) {
        if (!user) {
            return;
        }
        
        let attendees = new Array<Attendee>();
        attendees.push(new Attendee(user.id));
        this.attendees = attendees;
        this.messages = new Array<Message>();
        this.isInitiatedByUser = true;
    }
}