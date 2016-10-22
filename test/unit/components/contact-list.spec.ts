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

    let subscribeCallback;

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
                subscribeCallback = d;

                if (e === ConnectionStateChanged) {
                    connectionStateChangeSubscription = {
                        dispose: () => { }
                    } as Subscription;

                    return connectionStateChangeSubscription;
                }
                if (e === UserConnected) {
                    userDisconnectedSubscription = {
                        dispose: () => { }
                    } as Subscription;

                    return userConnectedSubscription;
                }
                if (e === UserDisconnected) {
                    userConnectedSubscription = {
                        dispose: () => { }
                    } as Subscription;

                    return userDisconnectedSubscription;
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
        subscribeCallback({
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
        subscribeCallback({
            state: ConnectionState.Error
        });

        // verify
        expect(userService.getUsers).not.toHaveBeenCalled();
    });

    describe('on get users spec', () => {
        let users;
        beforeEach(() => {
            users = [
                new User()
            ];

            chatService.currentState = ConnectionState.Connected;

            contactList.attached();
        });

        afterEach(() => {
            userConnectedSubscription = undefined;
            userDisconnectedSubscription = undefined;
        })

        it('get user callback should subscribe to UserConnected event', () => {
            // act
            resolveCallback()

            // verify
            expect(userConnectedSubscription).toBeDefined();
        });
    })
});