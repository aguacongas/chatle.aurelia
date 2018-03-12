define(["require", "exports", "aurelia-event-aggregator", "aurelia-http-client", "../../../src/config/settings", "../../../src/services/state", "../../../src/services/helpers", "../../../src/services/conversation.service", "../../../src/model/conversation", "../../../src/model/attendee", "../../../src/events/conversationSelected", "../../../src/events/conversationJoined"], function (require, exports, aurelia_event_aggregator_1, aurelia_http_client_1, settings_1, state_1, helpers_1, conversation_service_1, conversation_1, attendee_1, conversationSelected_1, conversationJoined_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('conversation service specs', function () {
        var service;
        var state;
        var http;
        var ea;
        var conversation;
        var response;
        var promise;
        var error;
        var responseCallback;
        var catchCallback;
        function getHttpMock() {
            response = {
                requestMessage: null,
                statusCode: 200,
                response: {},
                isSuccess: true,
                statusText: 'OK',
                reviver: function (key, value) {
                },
                mimeType: '',
                headers: new aurelia_http_client_1.Headers(),
                content: {}
            };
            promise = {
                then: function (r) {
                    responseCallback = r;
                    return {
                        catch: function (error) {
                            catchCallback = error;
                        }
                    };
                }
            };
            return promise;
        }
        beforeEach(function () {
            state = new state_1.State;
            http = new aurelia_http_client_1.HttpClient();
            ea = new aurelia_event_aggregator_1.EventAggregator();
            service = new conversation_service_1.ConversationService(http, new settings_1.Settings(), state, new helpers_1.Helpers(state), ea);
        });
        it('showConversation should set, raise, navigate conversation', function () {
            var expected = new conversation_1.Conversation();
            expected.attendees = [new attendee_1.Attendee('test')];
            var router = {
                navigateToRoute: function (route, p) { },
                currentInstruction: {
                    fragment: ''
                }
            };
            spyOn(ea, 'publish');
            spyOn(router, 'navigateToRoute');
            service.showConversation(expected, router);
            expect(expected).toBe(service.currentConversation);
            expect(ea.publish).toHaveBeenCalledWith(new conversationSelected_1.ConversationSelected(expected));
            expect(router.navigateToRoute).toHaveBeenCalledWith('conversation', { id: expected.title });
        });
        describe('sendMessage specs', function () {
            var m = 'test';
            beforeEach(function () {
                conversation = new conversation_1.Conversation();
                conversation.attendees = [new attendee_1.Attendee()];
                conversation.messages = [];
                http.post = function (to, data) {
                    promise = getHttpMock();
                    response.requestMessage = new aurelia_http_client_1.RequestMessage('POST', 'http://test', {
                        to: conversation.id,
                        text: m
                    });
                    return promise;
                };
                service = new conversation_service_1.ConversationService(http, new settings_1.Settings(), state, new helpers_1.Helpers(state), ea);
            });
            it('send message should set message id when conversations exists', function () {
                conversation.id = 'test';
                var result = service.sendMessage(conversation, 'test');
                responseCallback(response);
                expect(conversation.messages.length).toBe(1);
                expect(conversation.messages[0].text).toBe(m);
            });
            it('send message should set conversation id on new conversation', function () {
                conversation.id = null;
                state.userName = 'test';
                var result = service.sendMessage(conversation, 'test');
                response.content = 'test';
                responseCallback(response);
                expect(conversation.id).toBe(response.content);
                expect(conversation.messages.length).toBe(1);
                expect(conversation.messages[0].text).toBe(m);
            });
            it('send message should raise conversationJoined on new conversation', function () {
                state.userName = 'test';
                spyOn(ea, 'publish');
                var result;
                service.sendMessage(conversation, 'test')
                    .then(function (r) { return result = r; });
                response.content = 'test';
                responseCallback(response);
                expect(ea.publish).toHaveBeenCalledWith(new conversationJoined_1.ConversationJoined(conversation));
            });
        });
        describe('getConversations specs', function () {
            beforeEach(function () {
                http.get = function (to) {
                    promise = getHttpMock();
                    response.requestMessage = new aurelia_http_client_1.RequestMessage('GET', 'http://test', {});
                    return promise;
                };
                service = new conversation_service_1.ConversationService(http, new settings_1.Settings(), state, new helpers_1.Helpers(state), ea);
            });
            it('getConversations should resolve with conversations', function (done) {
                service.getConversations()
                    .then(function (r) {
                    console.log('getConversation response received');
                    expect(r).toBe(response.content);
                    done();
                });
                response.content = new Array();
                responseCallback(response);
            });
            it('getConversations should resolve with null if no content', function (done) {
                service.getConversations()
                    .then(function (r) {
                    console.log('getConversation response received');
                    expect(r).toBe(response.content);
                    done();
                });
                response.response = {};
                response.content = null;
                responseCallback(response);
            });
            it('getConversations should resolve with null if no response', function (done) {
                service.getConversations()
                    .then(function (r) {
                    console.log('getConversation response received');
                    expect(r).toBe(response.content);
                    done();
                });
                response.response = null;
                response.content = null;
                responseCallback(response);
            });
            it('getConversations should reject with service down', function (done) {
                service.getConversations()
                    .catch(function (error) {
                    console.log('getConversation response received');
                    expect(error.message).toBe(new Error('The service is down').message);
                    done();
                });
                catchCallback({});
            });
        });
    });
});
//# sourceMappingURL=conversation.service.spec.js.map