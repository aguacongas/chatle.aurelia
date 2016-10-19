import { RouterConfiguration } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { Home } from '../../../src/pages/home';
import { ChatService } from '../../../src/services/chat.service';
import { LoginService } from '../../../src/services/login.service';

describe('home page specs', () => {
    let loginService: LoginService;
    let chatService: ChatService;
    let routerConfiguration: RouterConfiguration;
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

        loginService = {
            logoff: () => { }
        } as LoginService;

        chatService = {
            start: () => {},
        } as ChatService;

        routerConfiguration = {
            map: m => { }
        } as RouterConfiguration;

        page = new Home(chatService, loginService, routerConfiguration, ea);
    });

});