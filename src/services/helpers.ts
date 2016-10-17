import { autoinject } from 'aurelia-framework';

import { State } from './state'

import { ServiceError } from '../model/serviceError';
import { Conversation } from '../model/conversation';

@autoinject
export class Helpers {
    location: Location;
    constructor(private state: State) {
        this.location = window.location;
     }

    getError(error: any) : Error {
        let errors = <ServiceError[]> error.content;
        let se = errors[0];
        let e = new Error(se.errors[0].errorMessage);
        e.name = se.key;
        return e;
    }

     setConverationTitle(conversation: Conversation) {
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

    getUrlParameter(name): string {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(this.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}