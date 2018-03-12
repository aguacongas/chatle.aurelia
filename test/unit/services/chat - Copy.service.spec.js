define(["require", "exports", "aurelia-event-aggregator", "aurelia-http-client", "../../../src/environment", "../../../src/services/chat.service", "../../../src/config/settings", "../../../src/services/chat.service", "../../../src/events/connectionStateChanged", "../../../src/services/state", "../../../src/services/helpers", "../../../src/events/conversationJoined", "../../../src/events/messageReceived", "../../../src/events/userConnected", "../../../src/events/userDisconnected", "../../../src/model/user", "../../../src/model/message", "../../../src/model/conversation"], function (require, exports, aurelia_event_aggregator_1, aurelia_http_client_1, environment_1, chat_service_1, settings_1, chat_service_2, connectionStateChanged_1, state_1, helpers_1, conversationJoined_1, messageReceived_1, userConnected_1, userDisconnected_1, user_1, message_1, conversation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('chat service test', function () {
        var state;
        var service;
        var ea;
        beforeEach(function () {
            state = new state_1.State();
            ea = new aurelia_event_aggregator_1.EventAggregator();
            service = new chat_service_1.ChatService(new settings_1.Settings(), ea, new aurelia_http_client_1.HttpClient(), state, new helpers_1.Helpers(state));
        });
        afterEach(function () {
            delete service.start;
        });
        it('chat service default state is disconnected', function () {
            expect(service.currentState).toBe(chat_service_2.ConnectionState.Disconnected);
        });
        describe('start specs', function () {
            var reconnectedCallback;
            var errorCallback;
            var disconnectedCallback;
            var doneCallback;
            var failCallback;
            var stateChangedCallback;
            var started = false;
            beforeEach(function () {
                window['jQuery'] = {
                    connection: {
                        hub: {
                            logging: null,
                            url: null,
                            stateChanged: function (callback) {
                                stateChangedCallback = callback;
                            },
                            reconnected: function (callback) {
                                reconnectedCallback = callback;
                            },
                            error: function (callback) {
                                errorCallback = callback;
                            },
                            disconnected: function (callback) {
                                disconnectedCallback = callback;
                            },
                            start: function () {
                                started = true;
                                return {
                                    done: function (callback) {
                                        doneCallback = callback;
                                        return {
                                            fail: function (callback) {
                                                failCallback = callback;
                                            }
                                        };
                                    }
                                };
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
            afterEach(function () {
                reconnectedCallback = null;
                errorCallback = null;
                disconnectedCallback = null;
                doneCallback = null;
                failCallback = null;
                stateChangedCallback = null;
                started = false;
                delete window['jQuery'];
            });
            it('start should initialized signalr', function () {
                environment_1.default.debug = true;
                service.start();
                expect(started).toBe(true);
                expect(reconnectedCallback).not.toBe(null);
                expect(errorCallback).not.toBe(null);
                expect(disconnectedCallback).not.toBe(null);
                expect(doneCallback).not.toBe(null);
                expect(failCallback).not.toBe(null);
                expect(stateChangedCallback).not.toBe(null);
            });
            it('start should not initialized stateChanged when debug is false', function () {
                environment_1.default.debug = false;
                service.start();
                expect(stateChangedCallback).toBe(null);
            });
            it('state changed callback should log states', function () {
                environment_1.default.debug = true;
                var change = {
                    oldState: "old",
                    newState: "new"
                };
                window['jQuery']['signalR'] = {
                    connectionState: change
                };
                spyOn(console, 'log');
                service.start();
                stateChangedCallback(change);
                expect(console.log).toHaveBeenCalledWith('Chat Hub state changed from oldState to newState');
            });
            it('stop should stop the signal connection', function () {
                var hub = window['jQuery'].connection.hub;
                spyOn(hub, 'stop');
                service.stop();
                expect(hub.stop).toHaveBeenCalledTimes(1);
            });
            it('stop should stop the signal connection', function () {
                var hub = window['jQuery'].connection.hub;
                spyOn(hub, 'stop');
                service.stop();
                expect(hub.stop).toHaveBeenCalledTimes(1);
            });
            it('chat client userConnected should raise UserConnected event', function (done) {
                var expected;
                ea.subscribe(userConnected_1.UserConnected, function (s) {
                    expected = s;
                    done();
                });
                service.start();
                var client = window['jQuery'].connection.chat.client;
                var user = new user_1.User();
                client.userConnected(user);
                expect(expected.user).toBe(user);
            });
            it('chat client userDisconnected should raise UserDisconnected event', function (done) {
                var expected;
                ea.subscribe(userDisconnected_1.UserDisconnected, function (s) {
                    expected = s;
                    done();
                });
                service.start();
                var client = window['jQuery'].connection.chat.client;
                var id = 'test';
                var user = { id: 'test' };
                client.userDisconnected(user);
                expect(expected.user.id).toBe(user.id);
            });
            it('chat client messageReceived should raise MessageReceived event', function (done) {
                var expected;
                ea.subscribe(messageReceived_1.MessageReceived, function (s) {
                    expected = s;
                    done();
                });
                service.start();
                var client = window['jQuery'].connection.chat.client;
                var message = new message_1.Message();
                client.messageReceived(message);
                expect(expected.message).toBe(message);
            });
            it('chat client joinConversation should raise ConversationJoined event', function (done) {
                var expected;
                ea.subscribe(conversationJoined_1.ConversationJoined, function (s) {
                    expected = s;
                    done();
                });
                service.start();
                var client = window['jQuery'].connection.chat.client;
                var conversation = new conversation_1.Conversation();
                conversation.attendees = [];
                client.joinConversation(conversation);
                expect(expected.conversation).toBe(conversation);
            });
            it('done callback should set connection state to connected', function (done) {
                environment_1.default.debug = false;
                var expected;
                ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (s) {
                    expected = s;
                });
                var tested = false;
                service.start()
                    .then(function (result) {
                    if (tested) {
                        return;
                    }
                    expect(service.currentState).toBe(chat_service_2.ConnectionState.Connected);
                    expect(expected).toBeDefined();
                    expect(expected.state).toBe(chat_service_2.ConnectionState.Connected);
                    expect(result).toBe(chat_service_2.ConnectionState.Connected);
                    tested = true;
                    done();
                });
                doneCallback({});
            });
            it('fail callback should set connection state to error', function (done) {
                environment_1.default.debug = false;
                var expected;
                ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (s) {
                    expected = s;
                });
                service.start()
                    .then(function () { })
                    .catch(function (error) {
                    expect(service.currentState).toBe(chat_service_2.ConnectionState.Error);
                    expect(expected).toBeDefined();
                    expect(expected.state).toBe(chat_service_2.ConnectionState.Error);
                    expect(error).toBeDefined();
                    done();
                });
                failCallback(new Error('error'));
            });
        });
    });
});
//# sourceMappingURL=chat.service.spec.js.map