import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';

import { ConnectionState, Disconnected } from '../../../src/services/chat.service';
import { ConversationService } from '../../../src/services/conversation.service';
import { State } from '../../../src/services/state';

import { Attendee } from '../../../src/model/attendee';
import { Conversation } from '../../../src/model/conversation';
import { ConversationJoined } from '../../../src/events/conversationJoined';
import { UserDisconnected } from '../../../src/events/userDisconnected';
import { ConnectionStateChanged } from '../../../src/events/connectionStateChanged';
import { ConversationList } from '../../../src/components/conversation-list';

describe('conversation list component specs', () => {
    let service: ConversationService;
    let state: State;
    let ea: EventAggregator;
    let router: Router;

    let component: ConversationList;

    let promise;
    let resolveCallback;
    let rejectCallback;

    let conversationJoinedSubscription: Subscription;
    let userDisconnectedSubscription: Subscription;
    let connectionStateChangeSubscription: Subscription;

    let conversationJoinedCallback;
    let userDisconnectedCallback;
    let connectionStateChangeCallback;

    let evt;

    beforeEach(() => {
        promise = {
            then: r => {
                resolveCallback = r;
                return {
                    catch: e => {
                        rejectCallback = e;
                    }
                }
            }
        };

        service = {
            getConversations: () => {
                return promise;
            }
        } as ConversationService;

        ea = {
            subscribe: (e, d) => {
                evt = e;

                if (e === ConnectionStateChanged) {
                    connectionStateChangeCallback = d;
                    connectionStateChangeSubscription = {
                        dispose: () => { }
                    }
                    return connectionStateChangeSubscription;
                }

                if (e === UserDisconnected) {
                    userDisconnectedCallback = d;
                    userDisconnectedSubscription = {
                        dispose: () => { }
                    }
                    return userDisconnectedSubscription;
                }

                if (e === ConversationJoined) {
                    conversationJoinedCallback = d;
                    conversationJoinedSubscription = {
                        dispose: () => { }
                    }
                    return conversationJoinedSubscription;
                }
            }
        } as EventAggregator;

        state = new State();

        router = {
            navigateToRoute: route => {}
        } as Router;

        component = new ConversationList(service, state, ea, router);
    });

    it('attached should reset conversations', () => {
        // prepare
        component.conversations = [
            new Conversation()
        ];

        // act
        component.attached();

        // verify
        expect(component.conversations).toBeDefined();
        expect(component.conversations.length).toBe(0);
    });

    it('attached should subscribe to ConnectionStateChanged', () => {
        // prepare
        spyOn(ea, 'subscribe');

        // act
        component.attached();

        // verify
        expect(connectionStateChangeCallback).toBeDefined();
    });

    it('attached should get conversations', () => {
        // prepare
        spyOn(service, 'getConversations')
            .and.returnValue(promise);

        // act
        component.attached();

        // verify
        expect(service.getConversations).toHaveBeenCalledTimes(1);
    });

    describe('attached specs', () => {
        let conversations = [
        ];

        beforeEach(() => {
            component.attached();
            expect(resolveCallback).toBeDefined();
        });

        it('get conversation callback should set conversation', () => {
            // act
            resolveCallback(conversations);

            // verify
            expect(component.conversations).toBe(conversations);
        });

        it('get conversation callback should subscribe to UserDisconnected', () => {
            // act
            resolveCallback(conversations);

            // verify
            expect(userDisconnectedCallback).toBeDefined();
            expect(userDisconnectedSubscription).toBeDefined();
        });

        it('get conversation callback should subscribe to ConversationJoined', () => {
            // act
            resolveCallback(conversations);

            // verify
            expect(conversationJoinedCallback).toBeDefined();
            expect(conversationJoinedSubscription).toBeDefined();
        });

        it('connection state change callback should remove all conversations when disconnected', () => {
            // prepare
            conversations.concat([
                new Conversation(),
                new Conversation()
            ]);

            // act
            connectionStateChangeCallback(new ConnectionStateChanged(ConnectionState.Disconnected));

            // verify
            expect(conversations.length).toBe(0);
        });

        it('connection state change callback should get conversations when connected', () => {
            // prepare
            spyOn(service, 'getConversations')
                .and.returnValue(promise);
            // act
            connectionStateChangeCallback(new ConnectionStateChanged(ConnectionState.Connected));

            // verify
            expect(service.getConversations).toHaveBeenCalledTimes(1);
        });

        describe('conversations retrieves specs', () => {
            beforeEach(() => {
                resolveCallback(conversations);
            });

            describe('user disconnected callback specs', () => {
                let conversation: Conversation;

                beforeEach(() => {
                    // prepare
                    conversation = new Conversation();
                    conversation.attendees = [
                        new Attendee('test'),
                        new Attendee('user')
                    ];
                    conversations.unshift(conversation);
                });

                it('user disconnected callback should remove conversation when user is removed', () => {
                    // act
                    userDisconnectedCallback(new UserDisconnected({
                        id: 'test',
                        isRemoved: true
                    }));

                    // verify
                    expect(conversations.length).toBe(0);
                });

                it('user disconnected callback should not remove conversation when user is not removed', () => {
                    // act
                    userDisconnectedCallback(new UserDisconnected({
                        id: 'test',
                        isRemoved: false
                    }));

                    // verify
                    expect(conversations.length).toBe(1);
                });

                it('user disconnected callback should not remove conversation when conversation attendees > 2', () => {
                    // prepare
                    conversation.attendees.unshift(new Attendee());
                    // act
                    userDisconnectedCallback(new UserDisconnected({
                        id: 'test',
                        isRemoved: true
                    }));

                    // verify
                    expect(conversations.length).toBe(1);
                });

                it('user disconnected callback should delete current conversation when user is removed', () => {
                    // prepare
                    service.currentConversation = conversation;

                    // act
                    userDisconnectedCallback(new UserDisconnected({
                        id: 'test',
                        isRemoved: true
                    }));

                    // verify
                    expect(service.currentConversation).toBeUndefined();
                });
            });

            it('conversation joined callback should add conversation in conversations', () => {
               // prepare
               let conversation = new Conversation();

               // act
               conversationJoinedCallback(new ConversationJoined(conversation));

               // verify
               expect(component.conversations[0]).toBe(conversation); 
            });

            it('detached should dispose subscriptions', () => {
                // prepare
                spyOn(connectionStateChangeSubscription, 'dispose');
                spyOn(userDisconnectedSubscription, 'dispose');
                spyOn(conversationJoinedSubscription, 'dispose');

                // act
                component.detached();

                // verify
                expect(connectionStateChangeSubscription.dispose).toHaveBeenCalledTimes(1);
                expect(userDisconnectedSubscription.dispose).toHaveBeenCalledTimes(1);
                expect(conversationJoinedSubscription.dispose).toHaveBeenCalledTimes(1);
            });
        });
    });
});
