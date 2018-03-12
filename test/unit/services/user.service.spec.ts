import { HttpClient, HttpResponseMessage, RequestMessage, Headers, RequestBuilder } from 'aurelia-http-client';

import { UserService } from '../../../src/services/user.service';
import { Settings } from '../../../src/config/settings';
import { State } from '../../../src/services/state'

import { User } from '../../../src/model/user';

describe('user service specs', () => {
    let settings; Settings;
    let service: UserService;
    let state: State;
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
            content: {},
            responseType : 'Success'
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
        http = new HttpClient();
        settings = new Settings();

        http.get = function (to: string): Promise<HttpResponseMessage> {

            promise = getHttpMock();
            response.requestMessage = new RequestMessage('GET', 'http://test', {});

            return promise;
        }

        service = new UserService(http, settings, state);
    })

    it('getUsers should resolve with response.content.users', done => {
        service.getUsers()
            .then(r => {
                expect(r).toBe(response.content.users);
                done();
            });
        
        response.content = {
            users: [
                'test'
            ]
        };

        responseCallback(response);
    });

    it('getUsers should reject with service down', done => {
        service.getUsers()
            .catch((e:Error) => {
                expect(e.message).toBe('the service is down');
                done();
            });
        
        catchCallback({});
    });
});
