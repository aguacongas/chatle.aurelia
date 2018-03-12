define(["require", "exports", "../../../src/pages/confirm", "../../../src/services/state", "../../../src/services/helpers"], function (require, exports, confirm_1, state_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('confirm page spec', function () {
        var service;
        var router;
        var state;
        var helpers;
        var controllerFactory;
        var userName;
        var promise;
        var resolveCallback;
        var rejectCallback;
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
                confirm: function (u) {
                    userName = u;
                    return promise;
                }
            };
            router = {
                navigateToRoute: function (r) { }
            };
            state = new state_1.State();
            helpers = new helpers_1.Helpers(state);
            controllerFactory = {
                createForCurrentScope: function () { }
            };
            spyOn(controllerFactory, 'createForCurrentScope')
                .and.returnValue({
                validate: function () {
                    return promise;
                }
            });
        });
        it('constructor should get url paratemeters', function () {
            spyOn(helpers, 'getUrlParameter');
            var page = new confirm_1.Confirm(service, router, helpers, state, controllerFactory);
            expect(helpers.getUrlParameter).toHaveBeenCalledWith('p');
            expect(helpers.getUrlParameter).toHaveBeenCalledWith('u');
        });
        describe('confirm specs', function () {
            var page;
            beforeEach(function () {
                page = new confirm_1.Confirm(service, router, helpers, state, controllerFactory);
            });
            describe('confirm should call service confirm', function () {
                var userName;
                beforeEach(function () {
                    userName = 'test';
                    state.userName = userName;
                    spyOn(service, 'confirm')
                        .and.returnValue(promise);
                    page.confirm();
                    resolveCallback();
                    expect(service.confirm).toHaveBeenCalledWith(userName);
                });
                it('and navigate to homme on success', function () {
                    spyOn(router, 'navigateToRoute');
                    resolveCallback();
                    expect(router.navigateToRoute).toHaveBeenCalledWith('home');
                });
                it('and navigate on to login NullInfo', function () {
                    spyOn(router, 'navigateToRoute');
                    var error = new Error('NullInfo');
                    error.name = 'NullInfo';
                    rejectCallback(error);
                    expect(router.navigateToRoute).toHaveBeenCalledWith('login');
                });
                it('and set error on others errors', function () {
                    spyOn(router, 'navigateToRoute');
                    var error = new Error('NullInfo');
                    rejectCallback(error);
                    expect(page.error).toBe(error);
                });
            });
            it('confirm should set error on validation error', function () {
                state.userName = userName;
                spyOn(service, 'confirm')
                    .and.returnValue(promise);
                var error = new Error('test');
                page.confirm();
                rejectCallback(error);
                expect(page.error).toBe(error);
            });
        });
    });
});
//# sourceMappingURL=confirm.spec.js.map