define(["require", "exports", "aurelia-http-client", "../../../src/services/user.service", "../../../src/config/settings", "../../../src/services/state"], function (require, exports, aurelia_http_client_1, user_service_1, settings_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('user service specs', function () {
        var settings;
        settings_1.Settings;
        var service;
        var state;
        var http;
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
            state = new state_1.State();
            http = new aurelia_http_client_1.HttpClient();
            settings = new settings_1.Settings();
            http.get = function (to) {
                promise = getHttpMock();
                response.requestMessage = new aurelia_http_client_1.RequestMessage('GET', 'http://test', {});
                return promise;
            };
            service = new user_service_1.UserService(http, settings, state);
        });
        it('getUsers should resolve with response.content.users', function (done) {
            service.getUsers()
                .then(function (r) {
                expect(r).toBe(response.content.users);
                done();
            });
            response.content = {
                users: [
                    'test'
                ]
            };
            responseCallback(response);
        });
        it('getUsers should reject with service down', function (done) {
            service.getUsers()
                .catch(function (e) {
                expect(e.message).toBe('the service is down');
                done();
            });
            catchCallback({});
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map