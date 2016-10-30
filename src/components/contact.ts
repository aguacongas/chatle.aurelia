import { bindable, autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { ConversationService } from '../services/conversation.service';
import { State } from '../services/state';
import { User } from '../model/user';
import { Conversation } from '../model/conversation';
import { Attendee } from '../model/attendee';
import { Message } from '../model/message';
import { ConversationSelected } from '../events/conversationSelected';

@autoinject
export class Contact {
    @bindable user: User;
    isSelected: boolean;
    private conversationSelectedSubscription: Subscription;

    constructor(private service: ConversationService, 
        private state: State,
        private ea: EventAggregator, 
        private router: Router) { }

    get isCurrentUser() {
        return this.state.userName === this.user.id; 
    }

    select() {
        if (this.isCurrentUser) {
            return;
        }

        if (!this.user.conversation) {
            this.user.conversation = new Conversation(this.user);
        }

        this.service.showConversation(this.user.conversation, this.router);        
    }

    attached() {
        this.conversationSelectedSubscription = this.ea.subscribe(ConversationSelected, e => {
            let conv = e.conversation as Conversation;
            let attendees = conv.attendees;

            this.isSelected = false;
            if (attendees.length < 3) {
                attendees.forEach(a => {
                    if (a.userId !== this.state.userName && a.userId === this.user.id) {
                        this.isSelected = true;
                    }
                })
            }
        });
    }

    detached() {
        this.conversationSelectedSubscription.dispose();
    }
}

