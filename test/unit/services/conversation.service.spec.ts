import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient, HttpResponseMessage, RequestMessage, Headers } from 'aurelia-http-client';

import { Settings } from '../../../src/config/settings';
import { State } from '../../../src/services/state'
import { Helpers } from '../../../src/services/helpers'
import { ConversationService } from '../../../src/services/conversation.service'

import { Message } from '../../../src/model/message';
import { Conversation } from '../../../src/model/conversation';
import { Attendee } from '../../../src/model/attendee';

import { ConversationSelected } from '../../../src/events/conversationSelected';
import { ConversationJoined } from '../../../src/events/conversationJoined';

describe('conversation service specs', () => {
    let service: ConversationService;
    let state: State;
    let http: HttpClient;
    let ea: EventAggregator;

    beforeEach(() => {
        state = new State;
        http = new HttpClient();
        ea = new EventAggregator();

        service = new ConversationService(http, new Settings(), state, new Helpers(state), ea);
    });

    it('showConversation should set, raise, navigate conversation', () => {
        // prepare
        let expected = new Conversation();
        expected.attendees = [new Attendee('test')];
        let router = {
            navigateToRoute: function (route: string, p: any) { }
        };

        spyOn(ea, 'publish');
        spyOn(router, 'navigateToRoute');

        // act
        service.showConversation(expected, router as Router);

        expect(expected).toBe(service.currentConversation);
        expect(ea.publish).toHaveBeenCalledWith(new ConversationSelected(expected));
        expect(router.navigateToRoute).toHaveBeenCalledWith('conversation', { id: expected.title })
    });

    describe('sendMessage specs', () => {
        let m = 'test';
        let conversation: Conversation;
        let response: HttpResponseMessage;
        let promise: any;
        let error: any;
        let responseCallback: (response: HttpResponseMessage) => void;
        let catchCallback: (e: any) => void;

        beforeEach(() => {
            conversation = new Conversation();
            conversation.attendees = [new Attendee()];
            conversation.messages = [];

            http.post = function (to: string, data: any): Promise<HttpResponseMessage> {

                response = {
                    requestMessage: new RequestMessage('POST', 'http://test', {
                        to: conversation.id,
                        text: m
                    }),
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

            service = new ConversationService(http, new Settings(), state, new Helpers(state), ea);
        });

        it('send message should set message id when conversations exists', () => {
            // prepare
            conversation.id = 'test';

            // act
            let result = service.sendMessage(conversation, 'test');
            responseCallback(response);

            // verify
            expect(conversation.messages.length).toBe(1);
            expect(conversation.messages[0].text).toBe(m);
        });

        it('send message should set conversation id on new conversation', () => {
            // prepare
            conversation.id = null;
            state.userName = 'test';
            response.content = 'test';

            // act
            let result = service.sendMessage(conversation, 'test');
            responseCallback(response);

            // verify
            expect(conversation.id).toBe(response.content);
            expect(conversation.messages.length).toBe(1);
            expect(conversation.messages[0].text).toBe(m);
        });

        it('send message should raise conversationJoined on new conversation', () => {
            // prepare
            response.content = 'test';
            state.userName = 'test';
            spyOn(ea, 'publish');

            // act
            let result = service.sendMessage(conversation, 'test');
            responseCallback(response);

            // verify
            expect(ea.publish).toHaveBeenCalledWith(new ConversationJoined(conversation));
        });
    });

    describe('getConversations specs', () => {
        let response: HttpResponseMessage;
        let promise: any;
        let error: any;
        let responseCallback: (response: HttpResponseMessage) => void;
        let catchCallback: (e: any) => void;

        beforeEach(() => {
            http.get = function (to: string): Promise<HttpResponseMessage> {

                response = {
                    requestMessage: new RequestMessage('GET', 'http://test', {}),
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

            service = new ConversationService(http, new Settings(), state, new Helpers(state), ea);
        });

        
    });
});
