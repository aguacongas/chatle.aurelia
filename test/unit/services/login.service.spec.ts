import { HttpClient, HttpResponseMessage, RequestMessage, Headers } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';

import { Settings } from '../../../src/config/settings';
import { ChatService } from '../../../src/services/chat.service';
import { LoginService } from '../../../src/services/login.service';
import { Helpers } from '../../../src/services/helpers';
import { State } from '../../../src/services/state';

describe('logins service specs', () => {
    let settings; Settings;
    let service: LoginService;
    let chatService: ChatService;
    let state: State;
    let ea: EventAggregator;
    let http: HttpClient;
    let response: HttpResponseMessage;
    let promise: any;
    let error: any;
    let responseCallback: (response: HttpResponseMessage) => void;
    let catchCallback: (e: any) => void;

    function getHttpMock() {
        response = {
            requestMessage: null,
            statusCode: 200,
            response: {},
            isSuccess: true,
            statusText: 'OK',
            reviver: function (key: string, value: any) {
            },
            mimeType: '',
            headers: new Headers(),
            content: {}
        };

        promise = {
            then: r => {
                responseCallback = r;
                return {
                    catch: error => {
                        catchCallback = error;
                    }
                }
            }
        } as Promise<HttpResponseMessage>;

        return promise;
    }
    
    beforeEach(() => {
        state = new State();
        ea = new EventAggregator();
        http = new HttpClient();
        settings = new Settings();
        let helpers = new Helpers(state);
        chatService = new ChatService(settings, ea, http, state, helpers);
        service = new LoginService(http, settings, chatService, state, helpers);
    })

    describe('getXhrf specs', () => {

    });
});
