define(["require", "exports", "../../../src/services/chat.service", "../../../src/services/state", "../../../src/model/attendee", "../../../src/model/conversation", "../../../src/events/conversationJoined", "../../../src/events/userDisconnected", "../../../src/events/connectionStateChanged", "../../../src/components/conversation-list"], function (require, exports, chat_service_1, state_1, attendee_1, conversation_1, conversationJoined_1, userDisconnected_1, connectionStateChanged_1, conversation_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('conversation list component specs', function () {
        var service;
        var state;
        var ea;
        var router;
        var component;
        var promise;
        var resolveCallback;
        var rejectCallback;
        var conversationJoinedSubscription;
        var userDisconnectedSubscription;
        var connectionStateChangeSubscription;
        var conversationJoinedCallback;
        var userDisconnectedCallback;
        var connectionStateChangeCallback;
        var evt;
        beforeEach(function () {
            promise = {
                then: function (r) {
                    resolveCallback = r;
                    return {
                        catch: function (e) {
                            rejectCallback = e;
                        }
                    };
                }
            };
            service = {
                getConversations: function () {
                    return promise;
                }
            };
            ea = {
                subscribe: function (e, d) {
                    evt = e;
                    if (e === connectionStateChanged_1.ConnectionStateChanged) {
                        connectionStateChangeCallback = d;
                        connectionStateChangeSubscription = {
                            dispose: function () { }
                        };
                        return connectionStateChangeSubscription;
                    }
                    if (e === userDisconnected_1.UserDisconnected) {
                        userDisconnectedCallback = d;
                        userDisconnectedSubscription = {
                            dispose: function () { }
                        };
                        return userDisconnectedSubscription;
                    }
                    if (e === conversationJoined_1.ConversationJoined) {
                        conversationJoinedCallback = d;
                        conversationJoinedSubscription = {
                            dispose: function () { }
                        };
                        return conversationJoinedSubscription;
                    }
                }
            };
            state = new state_1.State();
            router = {
                navigateToRoute: function (route) { }
            };
            component = new conversation_list_1.ConversationList(service, state, ea, router);
        });
        it('attached should reset conversations', function () {
            component.conversations = [
                new conversation_1.Conversation()
            ];
            component.attached();
            expect(component.conversations).toBeDefined();
            expect(component.conversations.length).toBe(0);
        });
        it('attached should subscribe to ConnectionStateChanged', function () {
            spyOn(ea, 'subscribe');
            component.attached();
            expect(connectionStateChangeCallback).toBeDefined();
        });
        it('attached should get conversations', function () {
            spyOn(service, 'getConversations')
                .and.returnValue(promise);
            component.attached();
            expect(service.getConversations).toHaveBeenCalledTimes(1);
        });
        describe('attached specs', function () {
            var conversations = [];
            beforeEach(function () {
                component.attached();
                expect(resolveCallback).toBeDefined();
            });
            it('get conversation callback should set conversation', function () {
                resolveCallback(conversations);
                expect(component.conversations).toBe(conversations);
            });
            it('get conversation callback should subscribe to UserDisconnected', function () {
                resolveCallback(conversations);
                expect(userDisconnectedCallback).toBeDefined();
                expect(userDisconnectedSubscription).toBeDefined();
            });
            it('get conversation callback should subscribe to ConversationJoined', function () {
                resolveCallback(conversations);
                expect(conversationJoinedCallback).toBeDefined();
                expect(conversationJoinedSubscription).toBeDefined();
            });
            it('connection state change callback should remove all conversations when disconnected', function () {
                conversations.concat([
                    new conversation_1.Conversation(),
                    new conversation_1.Conversation()
                ]);
                connectionStateChangeCallback(new connectionStateChanged_1.ConnectionStateChanged(chat_service_1.ConnectionState.Disconnected));
                expect(conversations.length).toBe(0);
            });
            it('connection state change callback should get conversations when connected', function () {
                spyOn(service, 'getConversations')
                    .and.returnValue(promise);
                connectionStateChangeCallback(new connectionStateChanged_1.ConnectionStateChanged(chat_service_1.ConnectionState.Connected));
                expect(service.getConversations).toHaveBeenCalledTimes(1);
            });
            describe('conversations retrieves specs', function () {
                beforeEach(function () {
                    resolveCallback(conversations);
                });
                describe('user disconnected callback specs', function () {
                    var conversation;
                    beforeEach(function () {
                        conversation = new conversation_1.Conversation();
                        conversation.attendees = [
                            new attendee_1.Attendee('test'),
                            new attendee_1.Attendee('user')
                        ];
                        conversations.unshift(conversation);
                    });
                    it('user disconnected callback should remove conversation when user is removed', function () {
                        userDisconnectedCallback(new userDisconnected_1.UserDisconnected({
                            id: 'test',
                            isRemoved: true
                        }));
                        expect(conversations.length).toBe(0);
                    });
                    it('user disconnected callback should not remove conversation when user is not removed', function () {
                        userDisconnectedCallback(new userDisconnected_1.UserDisconnected({
                            id: 'test',
                            isRemoved: false
                        }));
                        expect(conversations.length).toBe(1);
                    });
                    it('user disconnected callback should not remove conversation when conversation attendees > 2', function () {
                        conversation.attendees.unshift(new attendee_1.Attendee());
                        userDisconnectedCallback(new userDisconnected_1.UserDisconnected({
                            id: 'test',
                            isRemoved: true
                        }));
                        expect(conversations.length).toBe(1);
                    });
                    it('user disconnected callback should delete current conversation when user is removed', function () {
                        service.currentConversation = conversation;
                        userDisconnectedCallback(new userDisconnected_1.UserDisconnected({
                            id: 'test',
                            isRemoved: true
                        }));
                        expect(service.currentConversation).toBeUndefined();
                    });
                });
                it('conversation joined callback should add conversation in conversations', function () {
                    var conversation = new conversation_1.Conversation();
                    conversationJoinedCallback(new conversationJoined_1.ConversationJoined(conversation));
                    expect(component.conversations[0]).toBe(conversation);
                });
                it('detached should dispose subscriptions', function () {
                    spyOn(connectionStateChangeSubscription, 'dispose');
                    spyOn(userDisconnectedSubscription, 'dispose');
                    spyOn(conversationJoinedSubscription, 'dispose');
                    component.detached();
                    expect(connectionStateChangeSubscription.dispose).toHaveBeenCalledTimes(1);
                    expect(userDisconnectedSubscription.dispose).toHaveBeenCalledTimes(1);
                    expect(conversationJoinedSubscription.dispose).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
//# sourceMappingURL=conversation-list.spec.js.map