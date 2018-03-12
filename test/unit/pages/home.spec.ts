import { PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { Home } from '../../../src/pages/home';
import { ChatService, ConnectionState } from '../../../src/services/chat.service';
import { LoginService } from '../../../src/services/login.service';
import { ConnectionStateChanged } from '../../../src/events/connectionStateChanged';

describe('home page specs', () => {
    let loginService: LoginService;
    let chatService: ChatService;
    let page: Home;
    let resolveCallback: (value?: string) => void;
    let rejectCallback: (error?: any) => void;
    let promise: Promise<string>;
    let ea: EventAggregator;

    beforeEach(() => {
        promise = {
            then: r => {
                resolveCallback = r;
                return {
                    catch: error => {
                        rejectCallback = error;
                    }
                }
            }
        } as Promise<string>;

        chatService = {
            start: () => { }
        } as ChatService;

        ea = new EventAggregator();
        page = new Home(chatService, ea);
    });

    it('configureRouter should add conversation route in router configuration', () => {
        // prepare
        let map;
        let routerConfiguration = {
            map: m => { map = m; }
        } as RouterConfiguration;

        // act
        page.configureRouter(routerConfiguration, null)

        // verify
        expect(map).toBeDefined();
        expect(map[0]).toBeDefined();
        expect(map[0].route[0]).toBe('');
        expect(map[0].route[1]).toBe('conversation/:id');
        expect(map[0].name).toBe('conversation');
        expect(map[0].moduleId).toBe(PLATFORM.moduleName('../components/conversation-component'));
    });

    it('configureRouter should set router', () => {
        // prepare
        let routerConfiguration = {
            map: m => { }
        } as RouterConfiguration;
        let router = {
            baseUrl: 'test',
        } as Router;

        // act
        page.configureRouter(routerConfiguration, router)

        // verify
        expect(page.router).toBe(router);
    });

    describe('attached specs', () => {
        let event;
        let callback;
        let subcription = {
            dispose: () => { }
        };
        let router;

        beforeEach(() => {
            ea.subscribe = (e, c) => {
                event = e;
                callback = c;

                return subcription;
            };

            router = {
                navigateToRoute: name => {},
            } as Router;
            page.router = router;
        });

        it('attached should set isDisconnected to true when connaction state is Disconnected', () => {
            // prepare
            chatService.currentState = ConnectionState.Disconnected;

            // act
            page.attached();

            // verify
            expect(page.isDisconnected).toBe(true);
        });

        it('attached should set isDisconnected to false when connection state is Connected', () => {
            // prepare
            chatService.currentState = ConnectionState.Connected;

            // act
            page.attached();

            // verify
            expect(page.isDisconnected).toBe(false);
        });

        it('attached should logoff when connection state is Error', () => {
            // prepare
            chatService.currentState = ConnectionState.Error;

            spyOn(router, 'navigateToRoute');

            // act
            page.attached();

            // verify
            expect(page.isDisconnected).toBe(false);
            expect(router.navigateToRoute).toHaveBeenCalledWith('login');
        });

        it('attached should start chat when connection state is not Connected', () => {
            // prepare
            chatService.currentState = ConnectionState.Error;
            spyOn(chatService, 'start');
            // act
            page.attached();

            // verify
            expect(page.isDisconnected).toBe(false);
            expect(chatService.start).toHaveBeenCalledTimes(1);
        });

        it('ConnectionStateChanged subcription callback should set isDisconnected to true when connection state is Disconnected', () => {
            // prepare
            chatService.currentState = ConnectionState.Connected;

            // act
            page.attached();
            callback(new ConnectionStateChanged(ConnectionState.Disconnected));

            // verify
            expect(page.isDisconnected).toBe(true);
        });

        it('ConnectionStateChanged subcription callback should set isDisconnected to false when connection state is Connected', () => {
            // prepare
            chatService.currentState = ConnectionState.Disconnected;

            // act
            page.attached();
            callback(new ConnectionStateChanged(ConnectionState.Connected));

            // verify
            expect(page.isDisconnected).toBe(false);
        });

        it('ConnectionStateChanged subcription callback should logoff when connection state is Error', () => {
            // prepare
            chatService.currentState = ConnectionState.Connected;
            
            spyOn(router, 'navigateToRoute');
            // act
            page.attached();
            callback(new ConnectionStateChanged(ConnectionState.Error));

            // verify
            expect(page.isDisconnected).toBe(false);
            expect(router.navigateToRoute).toHaveBeenCalledWith('login');
        });

        it('detached should dispose subcription', () => {
            // prepare
            spyOn(subcription, 'dispose');
            page.attached();

            // act
            page.detached();

            // verify
            expect(subcription.dispose).toHaveBeenCalledTimes(1);
        });
    })
});
