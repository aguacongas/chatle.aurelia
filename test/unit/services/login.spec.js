define(["require", "exports", "../../../src/pages/login", "../../../src/services/state"], function (require, exports, login_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Login page specs', function () {
        var service;
        var settings;
        var router;
        var state;
        var page;
        var resolveCallback;
        var rejectCallback;
        var promise;
        beforeEach(function () {
            promise = {
                then: function (r) {
                    resolveCallback = r;
                    return {
                        catch: function (error) {
                            rejectCallback = error;
                        }
                    };
                }
            };
            service = {
                getXhrf: function (clearCookies) {
                    return promise;
                },
                login: function (userName) {
                    return promise;
                },
                logoff: function () { },
                getExternalLoginProviders: function () { return promise; }
            };
            settings = {
                apiBaseUrl: 'test',
                accountdAPI: 'test'
            };
            router = {
                navigateToRoute: function (route) { }
            };
            state = new state_1.State;
            page = new login_1.Login(service, router, state, settings);
        });
        it('constructor should set externalLogin', function () {
            settings.apiBaseUrl = 'http://base/test';
            settings.accountdAPI = 'test';
            page = new login_1.Login(service, router, state, settings);
            expect(page.externalLogin).toBeDefined();
            expect(page.externalLogin).not.toBeNull();
            expect(page.externalLogin).toContain(settings.apiBaseUrl + settings.accountdAPI);
        });
        it('login should navigate to homme on login success', function () {
            spyOn(service, 'login')
                .and.returnValue(promise);
            spyOn(router, 'navigateToRoute');
            state.userName = 'test';
            page.login();
            resolveCallback('OK');
            expect(service.login).toHaveBeenCalledWith('test');
            expect(router.navigateToRoute).toHaveBeenCalledWith('home');
        });
        it('login should set error on login error', function () {
            var expected = new Error('test');
            state.userName = 'test';
            page.login();
            rejectCallback(expected);
            expect(page.error).toBe(expected);
        });
        it('activate set token on get xhrf success', function () {
            spyOn(service, 'getXhrf')
                .and.returnValue(promise);
            page.activate();
            resolveCallback('token');
            expect(service.getXhrf).toHaveBeenCalledWith(true);
            expect(page.token).toBe('token');
        });
        it('activate set error on get xhrf error', function () {
            var expected = new Error('test');
            page.activate();
            rejectCallback(expected);
            expect(page.error).toBe(expected);
        });
    });
});
//# sourceMappingURL=login.spec.js.map