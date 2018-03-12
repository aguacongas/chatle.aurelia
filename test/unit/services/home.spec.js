define(["require", "exports", "aurelia-event-aggregator", "../../../src/pages/home", "../../../src/services/chat.service", "../../../src/events/connectionStateChanged"], function (require, exports, aurelia_event_aggregator_1, home_1, chat_service_1, connectionStateChanged_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('home page specs', function () {
        var loginService;
        var chatService;
        var page;
        var resolveCallback;
        var rejectCallback;
        var promise;
        var ea;
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
            chatService = {
                start: function () { }
            };
            ea = new aurelia_event_aggregator_1.EventAggregator();
            page = new home_1.Home(chatService, ea);
        });
        it('configureRouter should add conversation route in router configuration', function () {
            var map;
            var routerConfiguration = {
                map: function (m) { map = m; }
            };
            page.configureRouter(routerConfiguration, null);
            expect(map).toBeDefined();
            expect(map[0]).toBeDefined();
            expect(map[0].route[0]).toBe('');
            expect(map[0].route[1]).toBe('conversation/:id');
            expect(map[0].name).toBe('conversation');
            expect(map[0].moduleId).toBe('../components/conversation-component');
        });
        it('configureRouter should set router', function () {
            var routerConfiguration = {
                map: function (m) { }
            };
            var router = {
                baseUrl: 'test',
            };
            page.configureRouter(routerConfiguration, router);
            expect(page.router).toBe(router);
        });
        describe('attached specs', function () {
            var event;
            var callback;
            var subcription = {
                dispose: function () { }
            };
            var router;
            beforeEach(function () {
                ea.subscribe = function (e, c) {
                    event = e;
                    callback = c;
                    return subcription;
                };
                router = {
                    navigateToRoute: function (name) { },
                };
                page.router = router;
            });
            it('attached should set isDisconnected to true when connaction state is Disconnected', function () {
                chatService.currentState = chat_service_1.ConnectionState.Disconnected;
                page.attached();
                expect(page.isDisconnected).toBe(true);
            });
            it('attached should set isDisconnected to false when connection state is Connected', function () {
                chatService.currentState = chat_service_1.ConnectionState.Connected;
                page.attached();
                expect(page.isDisconnected).toBe(false);
            });
            it('attached should logoff when connection state is Error', function () {
                chatService.currentState = chat_service_1.ConnectionState.Error;
                spyOn(router, 'navigateToRoute');
                page.attached();
                expect(page.isDisconnected).toBe(false);
                expect(router.navigateToRoute).toHaveBeenCalledWith('login');
            });
            it('attached should start chat when connection state is not Connected', function () {
                chatService.currentState = chat_service_1.ConnectionState.Error;
                spyOn(chatService, 'start');
                page.attached();
                expect(page.isDisconnected).toBe(false);
                expect(chatService.start).toHaveBeenCalledTimes(1);
            });
            it('ConnectionStateChanged subcription callback should set isDisconnected to true when connection state is Disconnected', function () {
                chatService.currentState = chat_service_1.ConnectionState.Connected;
                page.attached();
                callback(new connectionStateChanged_1.ConnectionStateChanged(chat_service_1.ConnectionState.Disconnected));
                expect(page.isDisconnected).toBe(true);
            });
            it('ConnectionStateChanged subcription callback should set isDisconnected to false when connection state is Connected', function () {
                chatService.currentState = chat_service_1.ConnectionState.Disconnected;
                page.attached();
                callback(new connectionStateChanged_1.ConnectionStateChanged(chat_service_1.ConnectionState.Connected));
                expect(page.isDisconnected).toBe(false);
            });
            it('ConnectionStateChanged subcription callback should logoff when connection state is Error', function () {
                chatService.currentState = chat_service_1.ConnectionState.Connected;
                spyOn(router, 'navigateToRoute');
                page.attached();
                callback(new connectionStateChanged_1.ConnectionStateChanged(chat_service_1.ConnectionState.Error));
                expect(page.isDisconnected).toBe(false);
                expect(router.navigateToRoute).toHaveBeenCalledWith('login');
            });
            it('detached should dispose subcription', function () {
                spyOn(subcription, 'dispose');
                page.attached();
                page.detached();
                expect(subcription.dispose).toHaveBeenCalledTimes(1);
            });
        });
    });
});
//# sourceMappingURL=home.spec.js.map