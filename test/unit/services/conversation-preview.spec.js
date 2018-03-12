define(["require", "exports", "../../../src/model/conversation", "../../../src/model/message", "../../../src/events/conversationSelected", "../../../src/events/messageReceived", "../../../src/components/conversation-preview"], function (require, exports, conversation_1, message_1, conversationSelected_1, messageReceived_1, conversation_preview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('conversation preview component specs', function () {
        var service;
        var ea;
        var router;
        var component;
        var conversationSelectedSubscription;
        var messageReceivedSubscription;
        var conversationSelectedSubscriptionCallback;
        var messageReceivedSubscriptionCallback;
        beforeEach(function () {
            service = {
                showConversation: function (c, r) { }
            };
            ea = {
                subscribe: function (e, d) {
                    if (e === conversationSelected_1.ConversationSelected) {
                        conversationSelectedSubscriptionCallback = d;
                        conversationSelectedSubscription = {
                            dispose: function () { }
                        };
                        return conversationSelectedSubscription;
                    }
                    if (e === messageReceived_1.MessageReceived) {
                        messageReceivedSubscriptionCallback = d;
                        messageReceivedSubscription = {
                            dispose: function () { }
                        };
                        return messageReceivedSubscription;
                    }
                }
            };
            router = {};
            component = new conversation_preview_1.ConversationPreview(service, ea, router);
        });
        it('select should call conversation service showConversation', function () {
            component.conversation = new conversation_1.Conversation();
            spyOn(service, 'showConversation');
            component.select();
            expect(service.showConversation).toHaveBeenCalledWith(component.conversation, router);
        });
        describe('attached specs', function () {
            var message;
            var conversation;
            beforeEach(function () {
                conversation = new conversation_1.Conversation();
                component.conversation = conversation;
                conversation.messages = new Array();
                message = new message_1.Message();
                conversation.messages.push(message);
            });
            it('attached should subscribe to ConversationSelected and MessageReceived events', function () {
                component.attached();
                expect(conversationSelectedSubscription).toBeDefined();
                expect(conversationSelectedSubscriptionCallback).toBeDefined();
                expect(messageReceivedSubscription).toBeDefined();
                expect(messageReceivedSubscriptionCallback).toBeDefined();
            });
            it('attached should set last message', function () {
                message.text = 'test';
                component.attached();
                expect(component.lastMessage).toBe(message.text);
            });
            describe('subscriptions specs', function () {
                beforeEach(function () {
                    component.attached();
                });
                it('conversation selected should set isSelect to true when conversation ids match', function () {
                    conversation.id = 'test';
                    component.isSelected = false;
                    conversationSelectedSubscriptionCallback(new conversationSelected_1.ConversationSelected(conversation));
                    expect(component.isSelected).toBe(true);
                });
                it("conversation selected should set isSelect to false when conversation ids doesn't match", function () {
                    conversation.id = 'test';
                    component.isSelected = true;
                    conversationSelectedSubscriptionCallback(new conversationSelected_1.ConversationSelected(new conversation_1.Conversation()));
                    expect(component.isSelected).toBe(false);
                });
                it("message received should add message to the conversation and set lastMessage", function () {
                    conversation.id = 'test';
                    var m = new message_1.Message();
                    m.conversationId = conversation.id;
                    m.text = 'message received';
                    messageReceivedSubscriptionCallback(new messageReceived_1.MessageReceived(m));
                    expect(component.conversation.messages[0]).toBe(m);
                    expect(component.lastMessage).toBe(m.text);
                });
                it("detached should dispose subscriptions", function () {
                    spyOn(messageReceivedSubscription, 'dispose');
                    spyOn(conversationSelectedSubscription, 'dispose');
                    component.detached();
                    expect(messageReceivedSubscription.dispose).toHaveBeenCalledTimes(1);
                    expect(conversationSelectedSubscription.dispose).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
//# sourceMappingURL=conversation-preview.spec.js.map