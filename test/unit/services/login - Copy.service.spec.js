define(["require", "exports", "aurelia-http-client", "aurelia-event-aggregator", "../../../src/config/settings", "../../../src/services/chat.service", "../../../src/services/conversation.service", "../../../src/services/login.service", "../../../src/services/helpers", "../../../src/services/state"], function (require, exports, aurelia_http_client_1, aurelia_event_aggregator_1, settings_1, chat_service_1, conversation_service_1, login_service_1, helpers_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('logins service specs', function () {
        var settings;
        settings_1.Settings;
        var service;
        var chatService;
        var conversationService;
        var state;
        var ea;
        var http;
        var helpers;
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
                content: {},
                responseType: undefined
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
            state = new state_1.State();
            ea = new aurelia_event_aggregator_1.EventAggregator();
            http = new aurelia_http_client_1.HttpClient();
            settings = new settings_1.Settings();
            helpers = new helpers_1.Helpers(state);
            chatService = new chat_service_1.ChatService(settings, ea, http, state, helpers);
            conversationService = new conversation_service_1.ConversationService(http, settings, state, helpers, ea);
            chatService.start = function () {
                return new Promise(function (resolve, reject) { });
            };
        });
        describe('getXhrf', function () {
            beforeEach(function () {
                http.get = function (to) {
                    promise = getHttpMock();
                    response.requestMessage = new aurelia_http_client_1.RequestMessage('GET', 'http://test', {});
                    return promise;
                };
                http.configure = function (fn) {
                    return http;
                };
                service = new login_service_1.LoginService(http, settings, chatService, conversationService, state, helpers);
            });
            it('should set xhrf token when clear cookies', function (done) {
                service.getXhrf(true)
                    .then(function (r) {
                    console.log('getXhrf response received');
                    expect(r).toBe(response.response);
                    done();
                });
                response.response = "xhrf";
                responseCallback(response);
                responseCallback(response);
            });
            it('should return xhrf token when xhrf already setted', function (done) {
                service.getXhrf()
                    .then(function (r) {
                    console.log('getXhrf response received');
                    expect(r).toBe(response.response);
                });
                responseCallback(response);
                service.getXhrf()
                    .then(function (r) {
                    console.log('getXhrf response received');
                    expect(r).toBe(response.response);
                    done();
                });
                responseCallback(response);
            });
            it('should reject with error when clear cookies', function (done) {
                service.getXhrf(true)
                    .catch(function (e) {
                    console.log('getXhrf response received');
                    expect(e).toBeDefined();
                    expect(e.message).toBe('the service is down');
                    done();
                });
                response.response = "xhrf";
                catchCallback({});
            });
            it('should reject with error when no clear cookies', function (done) {
                service.getXhrf()
                    .catch(function (e) {
                    console.log('getXhrf response received');
                    expect(e).toBeDefined();
                    expect(e.message).toBe('the service is down');
                    done();
                });
                catchCallback({});
            });
            describe('login should', function () {
                var onTimerTimeout = function () {
                    responseCallback(response);
                };
                beforeEach(function () {
                    http.get = function (to) {
                        promise = getHttpMock();
                        response.requestMessage = new aurelia_http_client_1.RequestMessage('GET', 'http://test', {});
                        var counter = 0;
                        var timer = setTimeout(function (args) {
                            onTimerTimeout();
                            counter++;
                            if (counter > 1) {
                                clearTimeout(timer);
                            }
                        }, 25);
                        return promise;
                    };
                    http.post = function (to, data) {
                        promise = getHttpMock();
                        response.requestMessage = new aurelia_http_client_1.RequestMessage('POST', 'http://test', {});
                        return promise;
                    };
                    service = new login_service_1.LoginService(http, settings, chatService, conversationService, state, helpers);
                });
                it('set userName when is guess', function (done) {
                    state.userName = undefined;
                    var userName = 'test';
                    service.login(userName)
                        .then(function (result) {
                        expect(result).toBe(response.response);
                        expect(state.userName).toBe(userName);
                        done();
                    });
                    response.response = 'xhrf';
                    responseCallback(response);
                });
                describe(',on error ,', function () {
                    var error;
                    beforeEach(function () {
                        onTimerTimeout = function () {
                            catchCallback({});
                        };
                        helpers.getError = function (e) {
                            error = new Error('test');
                            return error;
                        };
                    });
                    it('reject with error when is guess', function (done) {
                        state.userName = undefined;
                        var userName = 'test';
                        service.login(userName)
                            .catch(function (e) {
                            expect(e).toBe(error);
                            done();
                        });
                        response.response = 'xhrf';
                        responseCallback(response);
                    });
                });
            });
            describe('logoff should', function () {
                beforeEach(function () {
                    conversationService.currentConversation = null;
                    spyOn(chatService, 'stop');
                    http.post = function (to, data) {
                        promise = getHttpMock();
                        response.requestMessage = new aurelia_http_client_1.RequestMessage('POST', 'http://test', {});
                        return promise;
                    };
                    state.userName = 'test';
                    service.logoff();
                });
                it('clear userName', function () {
                    expect(state.userName).toBeUndefined();
                });
                it('stop chat', function () {
                    expect(chatService.stop).toHaveBeenCalled();
                });
                it('set current conversation undifened', function () {
                    expect(conversationService.currentConversation).toBeUndefined();
                });
                it('call logoff api', function () {
                    spyOn(http, 'post');
                    responseCallback(response);
                    expect(chatService.stop).toHaveBeenCalled();
                });
            });
            describe('exists should', function () {
                var onTimerTimeout;
                beforeEach(function () {
                    http.get = function (to) {
                        promise = getHttpMock();
                        response.requestMessage = new aurelia_http_client_1.RequestMessage('GET', 'http://test', {});
                        var timer = setTimeout(function (args) {
                            onTimerTimeout();
                            clearTimeout(timer);
                        }, 25);
                        return promise;
                    };
                    service = new login_service_1.LoginService(http, settings, chatService, conversationService, state, helpers);
                });
                it('resolve with response content', function (done) {
                    service.exists('test')
                        .then(function (r) {
                        expect(r).toBe(response.content);
                        done();
                    });
                    onTimerTimeout = function () {
                        response.content = 'test';
                        responseCallback(response);
                    };
                    responseCallback(response);
                });
                it('reject with service down on api error', function (done) {
                    service.exists('test')
                        .catch(function (e) {
                        expect(e.message).toBe('the service is down');
                        done();
                    });
                    onTimerTimeout = function () {
                        response.content = 'test';
                        catchCallback({});
                    };
                    responseCallback(response);
                });
                it('reject with service down on xhrf error', function (done) {
                    service.exists('test')
                        .catch(function (e) {
                        expect(e.message).toBe('the service is down');
                        done();
                    });
                    catchCallback({});
                });
            });
            describe('confirm should', function () {
                var onTimerTimeout = function () {
                    responseCallback(response);
                };
                beforeEach(function () {
                    http.get = function (to) {
                        promise = getHttpMock();
                        response.requestMessage = new aurelia_http_client_1.RequestMessage('GET', 'http://test', {});
                        var counter = 0;
                        var timer = setTimeout(function (args) {
                            onTimerTimeout();
                            counter++;
                            if (counter > 1) {
                                clearTimeout(timer);
                            }
                        }, 25);
                        return promise;
                    };
                    http.put = function (to, data) {
                        promise = getHttpMock();
                        response.requestMessage = new aurelia_http_client_1.RequestMessage('PUT', 'http://test', {});
                        return promise;
                    };
                    helpers.getError = function (e) {
                        error = new Error('test');
                        return error;
                    };
                    service = new login_service_1.LoginService(http, settings, chatService, conversationService, state, helpers);
                });
                it('set userName', function () {
                    state.userName = null;
                    service.confirm('test')
                        .then(function (r) {
                        expect(state.userName).toBe('test');
                    });
                    responseCallback(response);
                });
                it('reject with error', function (done) {
                    var onTimerTimeout = function () {
                        catchCallback({});
                    };
                    state.userName = null;
                    service.confirm('test')
                        .catch(function (e) {
                        expect(e).toBe(error);
                        done();
                    });
                    responseCallback(response);
                });
                it('reject with service done', function (done) {
                    state.userName = null;
                    service.confirm('test')
                        .catch(function (e) {
                        expect(e.message).toBe('the service is down');
                        done();
                    });
                    catchCallback({});
                });
            });
        });
    });
});
//# sourceMappingURL=login.service.spec.js.map