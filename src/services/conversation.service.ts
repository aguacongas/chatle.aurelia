import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { State } from './state'
import { Helpers } from './helpers'

import { Message } from '../model/message';
import { Conversation } from '../model/conversation';
import { Attendee } from '../model/attendee';

import { ConversationSelected } from '../events/conversationSelected';
import { ConversationJoined } from '../events/conversationJoined';

@autoinject
export class ConversationService {
    currentConversation: Conversation;

    constructor(private http: HttpClient, 
        private settings: Settings,
        private state: State,
        private helpers: Helpers,
        private ea: EventAggregator) { }

    showConversation(conversation: Conversation, router: Router) {
        this.currentConversation = conversation;
        this.setConverationTitle(conversation);
        this.ea.publish(new ConversationSelected(conversation));
        router.navigateToRoute('conversation', { id: conversation.title });
    }

    sendMessage(conversation: Conversation, message: string): Promise<Message> {
        let m = new Message();
        m.conversationId = conversation.id;
        m.from = this.state.userName;
        m.text = message;

        if (conversation.id) {
            return new Promise<Message>((resolve, reject) => {
                this.http.post(this.settings.chatAPI, {
                    to: conversation.id,
                    text: message
                })
                .then(response => {
                    conversation.messages.unshift(m);
                    resolve(m);
                })
                .catch(error => reject(new Error(this.helpers.getErrorMessage(error))));
            });
        } else {
            let attendee: Attendee;
             conversation.attendees.forEach(a => {
                 if (a.userId !== this.state.userName) {
                     attendee = a;
                 }
             });

             return new Promise<Message>((resolve, reject) => {
                this.http.post(this.settings.convAPI, {
                    to: attendee.userId,
                    text: message
                })
                .then(
                    response => {
                        conversation.id = response.content;
                        this.ea.publish(new ConversationJoined(conversation));
                        conversation.messages.unshift(m);
                        resolve(m);
                    })
                    .catch(error => reject(new Error(this.helpers.getErrorMessage(error))));
            });
        }
    }
        
    getConversations(): Promise<Conversation[]> {
        return new Promise<Conversation[]>((resolve, reject) => {
            this.http.get(this.settings.chatAPI)
                .then(response => {
                    if (response.response) {
                        var data = response.content;
                        if (data) {
                            resolve(<Conversation[]>data);
                        }
                    } else {
                        resolve(null);
                    }
                })
                .catch(error => reject(new Error('The service is down')));
        });
    }

    private setConverationTitle(conversation: Conversation) {
        if (conversation.title) {
            return;
        }

        let title = '';
        conversation.attendees.forEach(attendee => {
            if (attendee && attendee.userId && attendee.userId !== this.state.userName) {
                title += attendee.userId + ' ';
            }
        });
        conversation.title = title.trim();
    }
}