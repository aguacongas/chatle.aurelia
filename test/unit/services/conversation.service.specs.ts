import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';

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

    
});