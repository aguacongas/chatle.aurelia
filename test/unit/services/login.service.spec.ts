import { HttpClient, HttpResponseMessage, RequestMessage, Headers, RequestBuilder } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';

import { Settings } from '../../../src/config/settings';
import { ChatService, ConnectionState } from '../../../src/services/chat.service';
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
    let helpers: Helpers;
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
        helpers = new Helpers(state);
        chatService = new ChatService(settings, ea, http, state, helpers);
        chatService.start = () => {
            return new Promise<ConnectionState>((resolve, reject) => { });
        };
    })

    describe('getXhrf', () => {
        beforeEach(() => {
            http.get = function (to: string): Promise<HttpResponseMessage> {

                promise = getHttpMock();
                response.requestMessage = new RequestMessage('GET', 'http://test', {});

                return promise;
            };
            http.configure = (fn: ((builder: RequestBuilder) => void)) => {

                return http;
            }

            service = new LoginService(http, settings, chatService, state, helpers);
        });

        it('should set xhrf token when clear cookies', done => {
            // act
            service.getXhrf(true)
                .then(r => {
                    console.log('getXhrf response received')
                    // verify
                    expect(r).toBe(response.response);
                    done();
                });

            // inject
            response.response = "xhrf";
            responseCallback(response);
            responseCallback(response);
        })

        it('should return xhrf token when xhrf already setted', done => {
            // prepare
            service.getXhrf()
                .then(r => {
                    console.log('getXhrf response received')
                    // verify
                    expect(r).toBe(response.response);
                })

            responseCallback(response);

            // act
            service.getXhrf()
                .then(r => {
                    console.log('getXhrf response received')
                    // verify
                    expect(r).toBe(response.response);
                    done();
                })

            responseCallback(response);
        });

        it('should reject with error when clear cookies', done => {
            // act
            service.getXhrf(true)
                .catch((e:Error) => {
                    console.log('getXhrf response received')
                    // verify
                    expect(e).toBeDefined();
                    expect(e.message).toBe('the service is down');
                    done();
                });

            // inject
            response.response = "xhrf";
            
            catchCallback({});
        })


        it('should reject with error when no clear cookies', done => {
            // act
            service.getXhrf()
                .catch((e:Error) => {
                    console.log('getXhrf response received')
                    // verify
                    expect(e).toBeDefined();
                    expect(e.message).toBe('the service is down');
                    done();
                });

            catchCallback({});
        });

        describe('login should', () => {
            let onTimerTimeout = () => {
                responseCallback(response);
            }

            beforeEach(() => {
                http.get = function (to: string): Promise<HttpResponseMessage> {

                    promise = getHttpMock();
                    response.requestMessage = new RequestMessage('GET', 'http://test', {});

                    let counter = 0;
                    let timer = setTimeout(args => {
                        onTimerTimeout();
                        counter++;
                        if (counter>1) {
                            clearTimeout(timer);
                        }
                    }, 25,);
                    return promise;
                };

                http.post = function (to: string, data: any): Promise<HttpResponseMessage> {
                    promise = getHttpMock();                    
                    response.requestMessage = new RequestMessage('POST', 'http://test', {});
                    return promise;
                };

                service = new LoginService(http, settings, chatService, state, helpers);                
            });

            it('set userName when is guess', done => {
                // prepare
                state.userName = undefined;
                let userName = 'test';

                // act
                service.login(userName, null)
                    .then(result => {
                        // verify
                        expect(result).toBe(response.response);
                        expect(state.userName).toBe(userName);
                        done();
                    });

                // inject
                response.response = 'xhrf';
                responseCallback(response);
            });

            it('set userName and persist when is registered', done => {
                // prepare
                state.userName = undefined;
                let userName = 'test';
                // act
                service.login(userName, 'null')
                    .then(result => {
                        // verify
                        expect(result).toBe(response.response);
                        expect(state.userName).toBe(userName);
                        expect(sessionStorage.getItem('userName')).toBe(userName);
                        done();
                    });

                // inject
                response.response = 'xhrf';
                responseCallback(response);
            });

            describe(',on error ,', () => {
                let error: Error;
                
                beforeEach (() => {
                    onTimerTimeout = () => {
                        catchCallback({});
                    };

                    helpers.getError = (e:any) => {
                        error = new Error('test');
                        return error;
                    };
                });

                it('reject with error when is guess', done => {
                    // prepare
                    state.userName = undefined;
                    let userName = 'test';
                    // act
                    service.login(userName, null)
                        .catch((e: Error) => {
                            // verify
                            expect(e).toBe(error)
                            done();
                        });

                    // inject
                    response.response = 'xhrf';
                    responseCallback(response);
                });

                it('reject with error when is registered', done => {
                    // prepare
                    state.userName = undefined;
                    let userName = 'test';
                    // act
                    service.login(userName, null)
                        .catch((e: Error) => {
                            // verify
                            expect(e).toBe(error)
                            done();
                        });

                    // inject
                    response.response = 'xhrf';
                    responseCallback(response);
                });
            });          
        });
    });
});
