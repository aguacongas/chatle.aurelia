define(["require", "exports", "../../../src/services/chat.service", "../../../src/model/user", "../../../src/events/userConnected", "../../../src/events/userDisconnected", "../../../src/events/connectionStateChanged", "../../../src/components/contact-list"], function (require, exports, chat_service_1, user_1, userConnected_1, userDisconnected_1, connectionStateChanged_1, contact_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('contact-list component spec', function () {
        var userService;
        var chatService;
        var ea;
        var userConnectedSubscription;
        var userDisconnectedSubscription;
        var connectionStateChangeSubscription;
        var promise;
        var resolveCallback;
        var rejectCallback;
        var connectionStateCallback;
        var userConnectedCallback;
        var userDisconnectedCallback;
        var contactList;
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
            userService = {
                getUsers: function () {
                    return promise;
                }
            };
            chatService = {
                currentState: chat_service_1.ConnectionState.Disconnected
            };
            ea = {
                subscribe: function (e, d) {
                    if (e === connectionStateChanged_1.ConnectionStateChanged) {
                        connectionStateCallback = d;
                        connectionStateChangeSubscription = {
                            dispose: function () { }
                        };
                        return connectionStateChangeSubscription;
                    }
                    if (e === userDisconnected_1.UserDisconnected) {
                        userDisconnectedCallback = d;
                        userDisconnectedSubscription = {
                            dispose: function () { }
                        };
                        return userDisconnectedSubscription;
                    }
                    if (e === userConnected_1.UserConnected) {
                        userConnectedCallback = d;
                        userConnectedSubscription = {
                            dispose: function () { }
                        };
                        return userConnectedSubscription;
                    }
                }
            };
            contactList = new contact_list_1.ContactList(userService, chatService, ea);
        });
        it('attached should get users when connection state equals Connected', function () {
            chatService.currentState = chat_service_1.ConnectionState.Connected;
            spyOn(userService, 'getUsers')
                .and.returnValue(promise);
            contactList.attached();
            expect(userService.getUsers).toHaveBeenCalledTimes(1);
        });
        it('attached should not get users when connection state not equals Connected', function () {
            chatService.currentState = chat_service_1.ConnectionState.Disconnected;
            spyOn(userService, 'getUsers');
            contactList.attached();
            expect(userService.getUsers).not.toHaveBeenCalled();
        });
        it('attached should subscribe to ConnectionStateChanged', function () {
            contactList.attached();
            expect(connectionStateChangeSubscription).toBeDefined();
        });
        it('connectionStateChangeSubscription callback should get users when connection state equals Connected', function () {
            spyOn(userService, 'getUsers')
                .and.returnValue(promise);
            contactList.attached();
            connectionStateCallback({
                state: chat_service_1.ConnectionState.Connected
            });
            expect(userService.getUsers).toHaveBeenCalledTimes(1);
        });
        it('connectionStateChangeSubscription callback should not get users when connection state not equals Connected', function () {
            spyOn(userService, 'getUsers')
                .and.returnValue(promise);
            contactList.attached();
            connectionStateCallback({
                state: chat_service_1.ConnectionState.Error
            });
            expect(userService.getUsers).not.toHaveBeenCalled();
        });
        describe('on get users spec', function () {
            var users;
            beforeEach(function () {
                users = new Array();
                chatService.currentState = chat_service_1.ConnectionState.Connected;
                contactList.attached();
            });
            afterEach(function () {
                userConnectedSubscription = undefined;
                userDisconnectedSubscription = undefined;
                userConnectedCallback = undefined;
                userDisconnectedCallback = undefined;
            });
            it('get user callback should subscribe to UserConnected event', function () {
                resolveCallback();
                expect(userConnectedSubscription).toBeDefined();
            });
            it('get user callback should subscribe to UserDisconnected event', function () {
                resolveCallback();
                expect(userDisconnectedSubscription).toBeDefined();
            });
            it('get user callback should set error on error', function () {
                rejectCallback(new Error('error'));
                expect(contactList.loadingMessage).toBe('error');
            });
            it('get user callback should set users', function () {
                resolveCallback(users);
                expect(contactList.users).toBe(users);
            });
            describe('user event specs', function () {
                beforeEach(function () {
                    resolveCallback(users);
                });
                it('user connected subscribiscription callback should add user', function () {
                    var user = new user_1.User();
                    user.id = 'test';
                    userConnectedCallback(new userConnected_1.UserConnected(user));
                    expect(contactList.users[0]).toBe(user);
                });
                it('user disconnected subscribiscription callback should remove user', function () {
                    var user = new user_1.User();
                    user.id = 'test';
                    contactList.users.unshift(user);
                    var disconnected = {
                        id: user.id,
                        isRemoved: false
                    };
                    userDisconnectedCallback(new userDisconnected_1.UserDisconnected(disconnected));
                    expect(contactList.users.length).toBe(0);
                });
                it('detached shoud dispose subscriptions', function () {
                    spyOn(userConnectedSubscription, 'dispose');
                    spyOn(userDisconnectedSubscription, 'dispose');
                    spyOn(connectionStateChangeSubscription, 'dispose');
                    contactList.detached();
                    expect(userConnectedSubscription.dispose).toHaveBeenCalledTimes(1);
                    expect(userDisconnectedSubscription.dispose).toHaveBeenCalledTimes(1);
                    expect(connectionStateChangeSubscription.dispose).toHaveBeenCalledTimes(1);
                });
            });
            it('detached shoud dispose subscriptions', function () {
                spyOn(connectionStateChangeSubscription, 'dispose');
                contactList.detached();
                expect(connectionStateChangeSubscription.dispose).toHaveBeenCalledTimes(1);
            });
        });
    });
});
//# sourceMappingURL=contact-list.spec.js.map