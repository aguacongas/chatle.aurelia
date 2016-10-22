import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { ConversationService } from '../services/conversation.service';
import { Conversation } from '../model/conversation';

@autoinject
export class ConversationComponent {
    conversation: Conversation;
    message: string;

    constructor(private service: ConversationService, private router: Router) {
    }

    activate(params, routeConfig) {
        if (!params) {
            delete this.service.currentConversation;
        }

        this.conversation = this.service.currentConversation;

        if (!this.conversation) {
            this.router.navigateToRoute('home');
        } else {
            routeConfig.navModel.setTitle(this.conversation.title);
        }
    }

    sendMessage() {
        this.service.sendMessage(this.conversation, this.message);
        this.message = '';
    }
}

