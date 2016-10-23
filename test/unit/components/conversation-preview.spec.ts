import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { ConversationService } from '../../../src/services/conversation.service';
import { Conversation } from '../../../src/model/conversation';
import { Message } from '../../../src/model/message';
import { ConversationSelected } from '../../../src/events/conversationSelected';
import { MessageReceived } from '../../../src/events/messageReceived';
import { ConversationPreview } from '../../../src/components/conversation-preview';

describe('conversation preview component specs', () => {
    let service: ConversationService;
    let ea: EventAggregator;
    let router: Router;

    let component: ConversationPreview;

    let conversationSelectedSubscription: Subscription;
    let messageReceivedSubscription: Subscription;

    let conversationSelectedSubscriptionCallback; 
    let messageReceivedSubscriptionCallback;

    beforeEach(() => {
        service = {
            showConversation: (c, r) => {}
        } as ConversationService;

        ea = {
            subscribe: (e, d) => {
                if (e === ConversationSelected) {
                    conversationSelectedSubscriptionCallback = d;
                    conversationSelectedSubscription = {
                        dispose: () => {}
                    };
                    return conversationSelectedSubscription;
                }
                if (e === MessageReceived) {
                    messageReceivedSubscriptionCallback = d;
                    messageReceivedSubscription = {
                        dispose: () => {}
                    };
                    return messageReceivedSubscription;
                }
            }
        } as EventAggregator;

        router = {} as Router;
        component = new ConversationPreview(service, ea, router);
    });

    it('select should call conversation service showConversation', () => {
        // prepare
        component.conversation = new Conversation();
        spyOn(service, 'showConversation');

        // act
        component.select();

        // verify
        expect(service.showConversation).toHaveBeenCalledWith(component.conversation, router);
    });
});