import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { ConnectionState } from '../../../src/services/chat.service';
import { UserService } from '../../../src/services/user.service';
import { ChatService } from '../../../src/services/chat.service';

import { User } from '../../../src/model/user';
import { UserConnected } from '../../../src/events/userConnected'
import { UserDisconnected } from '../../../src/events/userDisconnected'
import { ConnectionStateChanged } from '../../../src/events/connectionStateChanged';
import { ContactList } from '../../../src/components/contact-list';

describe('contact-list component spec', () => {
    let userService: UserService;
    let chatService: ChatService;
    let ea: EventAggregator;
    let userConnectedSubscription: Subscription;
    let userDisconnectedSubscription: Subscription;
    let connectionStateChangeSubscription: Subscription;

    let promise;
    let resolveCallback;
    let rejectCallback;

    let connectionStateCallback;
    let userConnectedCallback;
    let userDisconnectedCallback;

    let contactList: ContactList;

    beforeEach(() => {
        promise = {
            then: r => {
                resolveCallback = r;
                return {
                    catch: e => {
                        rejectCallback = e;
                    }
                }
            }
        };

        userService = {
            getUsers: () => {
                return promise;
            }
        } as UserService;

        chatService = {
            currentState: ConnectionState.Disconnected
        } as ChatService;

        ea = {
            subscribe: (e, d) => {
                if (e === ConnectionStateChanged) {
                    connectionStateCallback = d;

                    connectionStateChangeSubscription = {
                        dispose: () => { }
                    } as Subscription;

                    return connectionStateChangeSubscription;
                }

                if (e === UserDisconnected) {
                    userDisconnectedCallback = d;
                    userDisconnectedSubscription = {
                        dispose: () => { }
                    } as Subscription;

                    return userDisconnectedSubscription;
                }

                if (e === UserConnected) {
                    userConnectedCallback = d;
                    userConnectedSubscription = {
                        dispose: () => { }
                    } as Subscription;

                    return userConnectedSubscription;
                }
            }
        } as EventAggregator;

        contactList = new ContactList(userService, chatService, ea);
    });

    it('attached should get users when connection state equals Connected', () => {
        // prepare
        chatService.currentState = ConnectionState.Connected;
        spyOn(userService, 'getUsers')
            .and.returnValue(promise);

        // act
        contactList.attached();

        // verify
        expect(userService.getUsers).toHaveBeenCalledTimes(1);
    });

    it('attached should not get users when connection state not equals Connected', () => {
        // prepare
        chatService.currentState = ConnectionState.Disconnected;
        spyOn(userService, 'getUsers');

        // act
        contactList.attached();

        // verify
        expect(userService.getUsers).not.toHaveBeenCalled();
    });

    it('attached should subscribe to ConnectionStateChanged', () => {
        // act
        contactList.attached();

        // verify
        expect(connectionStateChangeSubscription).toBeDefined();
    });

    it('connectionStateChangeSubscription callback should get users when connection state equals Connected', () => {
        // prepare
        spyOn(userService, 'getUsers')
            .and.returnValue(promise);

        // act
        contactList.attached();
        connectionStateCallback({
            state: ConnectionState.Connected
        });

        // verify
        expect(userService.getUsers).toHaveBeenCalledTimes(1);
    });

    it('connectionStateChangeSubscription callback should not get users when connection state not equals Connected', () => {
        // prepare
        spyOn(userService, 'getUsers')
            .and.returnValue(promise);

        // act
        contactList.attached();
        connectionStateCallback({
            state: ConnectionState.Error
        });

        // verify
        expect(userService.getUsers).not.toHaveBeenCalled();
    });

    describe('on get users spec', () => {
        let users;
        beforeEach(() => {
            users = new Array<User>();

            chatService.currentState = ConnectionState.Connected;

            contactList.attached();
        });

        afterEach(() => {
            userConnectedSubscription = undefined;
            userDisconnectedSubscription = undefined;
            userConnectedCallback = undefined;
            userDisconnectedCallback = undefined;
        })

        it('get user callback should subscribe to UserConnected event', () => {
            // act
            resolveCallback();

            // verify
            expect(userConnectedSubscription).toBeDefined();
        });

        it('get user callback should subscribe to UserDisconnected event', () => {
            // act
            resolveCallback();

            // verify
            expect(userDisconnectedSubscription).toBeDefined();
        });

        it('get user callback should set error on error', () => {

            // act
            rejectCallback(new Error('error'));

            // verify
            expect(contactList.loadingMessage).toBe('error');
        });

        it('get user callback should set users', () => {

            // act
            resolveCallback(users);

            // verify
            expect(contactList.users).toBe(users);
        });

        describe('user event specs', () => {
            beforeEach(() => {
                resolveCallback(users);
            });

            it('user connected subscribiscription callback should add user', () => {
                // prepare
                let user = new User();
                user.id = 'test';

                // act
                userConnectedCallback(new UserConnected(user));

                // verify
                expect(contactList.users[0]).toBe(user);
            });

            it('user disconnected subscribiscription callback should remove user', () => {
                // prepare
                let user = new User();
                user.id = 'test';
                contactList.users.unshift(user);
                let disconnected = {
                    id: user.id,
                    isRemoved: false
                }

                // act
                userDisconnectedCallback(new UserDisconnected(disconnected));

                // verify
                expect(contactList.users.length).toBe(0);
            });

            it('detached shoud dispose subscriptions', () => {
                // prepare
                spyOn(userConnectedSubscription, 'dispose');
                spyOn(userDisconnectedSubscription, 'dispose');
                spyOn(connectionStateChangeSubscription, 'dispose');

                // act
                contactList.detached();

                // verify
                expect(userConnectedSubscription.dispose).toHaveBeenCalledTimes(1);
                expect(userDisconnectedSubscription.dispose).toHaveBeenCalledTimes(1);
                expect(connectionStateChangeSubscription.dispose).toHaveBeenCalledTimes(1);
            });
        });

        it('detached shoud dispose subscriptions', () => {
            // prepare
            spyOn(connectionStateChangeSubscription, 'dispose');

            // act
            contactList.detached();

            // verify
            expect(connectionStateChangeSubscription.dispose).toHaveBeenCalledTimes(1);
        });
    });
});