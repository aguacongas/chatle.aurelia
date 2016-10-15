import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import environment from '../../../src/environment';

import { ChatService } from '../../../src/services/chat.service';
import { Settings } from '../../../src/config/settings';
import { ConnectionState } from '../../../src/services/chat.service';
import { ConnectionStateChanged } from '../../../src/events/connectionStateChanged'
import { State } from '../../../src/services/state';
import { Helpers } from '../../../src/services/helpers';

describe('chat service test', () => {
    let state: State;
    let service: ChatService;
    let ea: EventAggregator;

    beforeEach(() => {
        state = new State();
        ea = new EventAggregator();
        service = new ChatService(new Settings(), ea, new HttpClient(), state, new Helpers(state));
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

            reconnectedCallback;
            errorCallback = null;
            disconnectedCallback = null;
            doneCallback = null;
            failCallback = null;
            stateChangedCallback = null;
            started = false;
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

        it('done callback should set connection state to connected', done => {
            // prepare
            environment.debug = false;
            let expected: any;
            let result: any;
            ea.subscribe(ConnectionStateChanged, s => {
                expected = s;
                done();
            });
            
            // act
            service.start()
                .then(r => result = r);

            doneCallback({});

            // verify
            expect(service.currentState).toBe(ConnectionState.Connected);
            expect(expected).toBeDefined();
            expect(expected.state).toBe(ConnectionState.Connected);
            expect(result).toBe(ConnectionState.Connected);
        });

        it('fail callback should set connection state to error', done => {
            // prepare
            environment.debug = false;
            let expected: any;
            let error: Error;
            ea.subscribe(ConnectionStateChanged, s => {
                expected = s;
                done();
            });
            
            // act
            service.start()
                .catch(e => error = e)

            failCallback(new Error('error'));

            // verify
            expect(service.currentState).toBe(ConnectionState.Error);
            expect(expected).toBeDefined();
            expect(expected.state).toBe(ConnectionState.Error);
            expect(error).toBeDefined();
        });

        it('state changed callback should log states', () => {
            // prepare
            environment.debug = true;
            window['jQuery']['signalR'] = {
                connectionState: [
                    {"oldState": "old"},
                    {"new": "new"}
                ]
            };
            let change = {
                oldState: "old",
                newState: "new"
            };

            spyOn(console, 'log');

            // act
            service.start();
            stateChangedCallback(change);

            // verify
            expect(console.log).toHaveBeenCalledWith('Chat Hub state changed from ' + change.oldState + ' to ' + change.newState);
        });
    });
});