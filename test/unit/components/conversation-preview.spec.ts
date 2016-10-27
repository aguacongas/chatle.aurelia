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
            showConversation: (c, r) => { }
        } as ConversationService;

        ea = {
            subscribe: (e, d) => {
                if (e === 'ConversationSelected') {
                    conversationSelectedSubscriptionCallback = d;
                    conversationSelectedSubscription = {
                        dispose: () => { }
                    };
                    return conversationSelectedSubscription;
                }
                if (e === MessageReceived) {
                    messageReceivedSubscriptionCallback = d;
                    messageReceivedSubscription = {
                        dispose: () => { }
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

    describe('attached specs', () => {
        let message: Message;
        let conversation: Conversation;

        beforeEach(() => {
            conversation = new Conversation();
            component.conversation = conversation;
            conversation.messages = new Array<Message>();
            message = new Message();
            conversation.messages.push(message);
        });

        it('attached should subscribe to ConversationSelected and MessageReceived events', () => {
            // act
            component.attached();

            // verify
            expect(conversationSelectedSubscription).toBeDefined();
            expect(conversationSelectedSubscriptionCallback).toBeDefined();
            expect(messageReceivedSubscription).toBeDefined();
            expect(messageReceivedSubscriptionCallback).toBeDefined();
        });

        it('attached should set last message', () => {
            // prepare
            message.text = 'test';

            // act
            component.attached();

            // verify
            expect(component.lastMessage).toBe(message.text);
        });

        describe('subscriptions specs', () => {
            beforeEach(() => {
                component.attached();
            });

            it('conversation selected should set isSelect to true when conversation ids match', () => {
                // prepare
                conversation.id = 'test';
                component.isSelected = false;

                // act
                conversationSelectedSubscriptionCallback(new ConversationSelected(conversation));

                // verify
                expect(component.isSelected).toBe(true);
            });

            it("conversation selected should set isSelect to false when conversation ids doesn't match", () => {
                // prepare
                conversation.id = 'test';
                component.isSelected = true;

                // act
                conversationSelectedSubscriptionCallback(new ConversationSelected(new Conversation()));

                // verify@
                expect(component.isSelected).toBe(false);
            });

            it("message received should add message to the conversation and set lastMessage", () => {
                // prepare
                conversation.id = 'test';
                let m = new Message();
                m.conversationId = conversation.id;
                m.text = 'message received';

                // act
                messageReceivedSubscriptionCallback(new MessageReceived(m));

                // verify@
                expect(component.conversation.messages[0]).toBe(m);
                expect(component.lastMessage).toBe(m.text);
            });

            it("detached should dispose subscriptions", () => {
                // prepare
                spyOn(messageReceivedSubscription, 'dispose');
                spyOn(conversationSelectedSubscription, 'dispose');

                // act
                component.detached();

                // verify@
                expect(messageReceivedSubscription.dispose).toHaveBeenCalledTimes(1);
                expect(conversationSelectedSubscription.dispose).toHaveBeenCalledTimes(1);
            });
        });
    });
});