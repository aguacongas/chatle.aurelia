import { autoinject } from 'aurelia-framework';

import { State } from './state'

import { ServiceError } from '../model/serviceError';
import { Conversation } from '../model/conversation';

@autoinject
export class Helpers {

    constructor(private state: State) { }

    getErrorMessage(error: any) {
        return (<ServiceError[]>error.content)[0].errors[0].errorMessage
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

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}