import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ConversationService } from '../services/conversation.service';
import { Conversation } from '../model/conversation';

@autoinject
export class ConversationComponent {
    conversation: Conversation;
    message: string;
    error: string;

    constructor(private service: ConversationService, private router: Router) {
    }

    activate(params, routeConfig) {
        this.error = '';

        if (!params) {
            this.service.currentConversation = undefined;
        }

        this.conversation = this.service.currentConversation;

        if (!this.conversation) {
            this.router.navigateToRoute('home');
        } else {
            routeConfig.navModel.setTitle(this.conversation.title);
        }
    }

    sendMessage() {
        if (this.service.currentConversation === this.conversation) {
            this.service.sendMessage(this.conversation, this.message);            
        } else {
            this.error = 'this user is disconnected';
        }

        this.message = '';
    }
}

