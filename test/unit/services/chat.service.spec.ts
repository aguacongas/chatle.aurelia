import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import environment from '../../../src/environment';

import { ChatService } from '../../../src/services/chat.service';
import { Settings } from '../../../src/config/settings';
import { ConnectionState } from '../../../src/services/chat.service';
import { ConnectionStateChanged } from '../../../src/events/connectionStateChanged'
import { State } from '../../../src/services/state';
import { Helpers } from '../../../src/services/helpers';
import { ConversationJoined } from '../../../src/events/conversationJoined';
import { MessageReceived } from '../../../src/events/messageReceived';
import { UserConnected } from '../../../src/events/userConnected';
import { UserDisconnected } from '../../../src/events/userDisconnected';

import { User } from '../../../src/model/user';
import { Message } from '../../../src/model/message';
import { Conversation } from '../../../src/model/conversation';

describe('chat service test', () => {
    let state: State;
    let service: ChatService;
    let ea: EventAggregator;

    beforeEach(() => {
        state = new State();
        ea = new EventAggregator();
        service = new ChatService(new Settings(), ea, new HttpClient(), state, new Helpers(state));
    });

    afterEach(() => {
        delete service.start;
    });

    it('chat service default state is disconnected', () => {
        expect(service.currentState).toBe(ConnectionState.Disconnected);
    });

    describe('start specs', () => {
        let reconnectedCallback: () => void;
        let errorCallback: (e: any) => void;
        let disconnectedCallback: () => void;
        let doneCallback: (response: any) => void;
        let failCallback: (error: any) => void;
        let stateChangedCallback: (state: any) => void;
        let started = false;

        beforeEach(() => {
            window['jQuery'] = {
                connection: {
                    hub: {
                        logging: null,
                        url: null,
                        stateChanged: function (callback: (state: any) => void) {
                            stateChangedCallback = callback;
                        },
                        reconnected: function (callback: () => void) {
                            reconnectedCallback = callback;
                        },
                        error: function (callback: (e: any) => void) {
                            errorCallback = callback;
                        },
                        disconnected: function (callback: () => void) {
                            disconnectedCallback = callback;
                        },
                        start: function () {
                            started = true;
                            return {
                                done: function (callback: (response: any) => void) {
                                    doneCallback = callback;
                                    return {
                                        fail: function (callback: (error: any) => void) {
                                            failCallback = callback;
                                        }
                                    }
                                }
                            }
                        },
                        stop: function () { }
                    },
                    chat: {
                        client: {
                            userConnected: null,
                            userDisconnected: null,
                            messageReceived: null,
                            joinConversation: null
                        }
                    }
                }
            };
        });

        afterEach(() => {
            reconnectedCallback = null;
            errorCallback = null;
            disconnectedCallback = null;
            doneCallback = null;
            failCallback = null;
            stateChangedCallback = null;
            started = false;

            delete window['jQuery'];
        });

        it('start should initialized signalr', () => {
            // prepare
            environment.debug = true;

            // act
            service.start();

            // verify
            expect(started).toBe(true);
            expect(reconnectedCallback).not.toBe(null);
            expect(errorCallback).not.toBe(null);
            expect(disconnectedCallback).not.toBe(null);
            expect(doneCallback).not.toBe(null);
            expect(failCallback).not.toBe(null);
            expect(stateChangedCallback).not.toBe(null);
        });

        it('start should not initialized stateChanged when debug is false', () => {
            // prepare
            environment.debug = false;

            // act
            service.start();

            // verify
            expect(stateChangedCallback).toBe(null);
        });

        it('state changed callback should log states', () => {
            // prepare
            environment.debug = true;
            let change = {
                oldState: "old",
                newState: "new"
            };

            window['jQuery']['signalR'] = {
                connectionState: change
            };

            spyOn(console, 'log');

            // act
            service.start();
            stateChangedCallback(change);

            // verify
            expect(console.log).toHaveBeenCalledWith('Chat Hub state changed from oldState to newState');
        });

        it('stop should stop the signal connection', () => {
            //prepare
            let hub = window['jQuery'].connection.hub;
            spyOn(hub, 'stop');

            // act
            service.stop();

            // verify
            expect(hub.stop).toHaveBeenCalledTimes(1);
        });

        it('stop should stop the signal connection', () => {
            //prepare
            let hub = window['jQuery'].connection.hub;
            spyOn(hub, 'stop');

            // act
            service.stop();

            // verify
            expect(hub.stop).toHaveBeenCalledTimes(1);
        });

        it('chat client userConnected should raise UserConnected event', done => {
            // prepare
            let expected: any;
            ea.subscribe(UserConnected, s => {
                expected = s;
                done();
            });
            service.start();
            let client = window['jQuery'].connection.chat.client;
            let user = new User();

            // act
            client.userConnected(user);

            // verify
            expect(expected.user).toBe(user);
        });

        it('chat client userDisconnected should raise UserDisconnected event', done => {
            // prepare
            let expected: any;
            ea.subscribe(UserDisconnected, s => {
                expected = s;
                done();
            });
            service.start();
            let client = window['jQuery'].connection.chat.client;
            let id = 'test';
            let user = { id: 'test' };

            // act
            client.userDisconnected(user);

            // verify
            expect(expected.user.id).toBe(user.id);
        });

        it('chat client messageReceived should raise MessageReceived event', done => {
            // prepare
            let expected: any;
            ea.subscribe(MessageReceived, s => {
                expected = s;
                done();
            });
            service.start();
            let client = window['jQuery'].connection.chat.client;
            let message = new Message();

            // act
            client.messageReceived(message);

            // verify
            expect(expected.message).toBe(message);
        });

        it('chat client joinConversation should raise ConversationJoined event', done => {
            // prepare
            let expected: any;
            ea.subscribe(ConversationJoined, s => {
                expected = s;
                done();
            });
            service.start();
            let client = window['jQuery'].connection.chat.client;
            let conversation = new Conversation();
            conversation.attendees = [];

            // act
            client.joinConversation(conversation);

            // verify
            expect(expected.conversation).toBe(conversation);
        });

        it('done callback should set connection state to connected', done => {
            // prepare
            environment.debug = false;
            let expected: any;
            
            ea.subscribe(ConnectionStateChanged, s => {
                expected = s;
            });

            let tested = false
            // act
            service.start()
                .then(result => { 
                    if (tested) { return; }                   
                    // verify
                    expect(service.currentState).toBe(ConnectionState.Connected);
                    expect(expected).toBeDefined();
                    expect(expected.state).toBe(ConnectionState.Connected);
                    expect(result).toBe(ConnectionState.Connected);

                    tested = true;
                    done();
                });

            doneCallback({});
        });

        it('fail callback should set connection state to error', done => {
            // prepare
            environment.debug = false;
            let expected: any;            
            ea.subscribe(ConnectionStateChanged, s => {
                expected = s;
            });

            // act
            service.start()
                .then(() => {})
                .catch(error => {
                    // verify
                    expect(service.currentState).toBe(ConnectionState.Error);
                    expect(expected).toBeDefined();
                    expect(expected.state).toBe(ConnectionState.Error);
                    expect(error).toBeDefined();

                    done();
                });

            failCallback(new Error('error'));
        });
    });
});