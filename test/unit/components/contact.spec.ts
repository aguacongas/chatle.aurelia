import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

import { ConversationService } from '../../../src/services/conversation.service';
import { State } from '../../../src/services/state';
import { User } from '../../../src/model/user';
import { Conversation } from '../../../src/model/conversation';
import { Attendee } from '../../../src/model/attendee';
import { Message } from '../../../src/model/message';
import { ConversationSelected } from '../../../src/events/conversationSelected';
import { Contact } from '../../../src/components/contact';

describe('contact component spec', () => {
    let service: ConversationService;
    let state;
    let ea: EventAggregator;
    let router: Router;
    let subscription: Subscription;
    let contact: Contact;
    let subscriptionCallback;
    let evt;

    beforeEach(() => {
        service = {
            showConversation: (c, r) => {}
        } as ConversationService;

        state = new State;
        router = {} as Router;
        ea = {
            subscribe: (e, d) => {
                evt = e;
                subscriptionCallback = d;
                return subscription;
             }
        } as EventAggregator;

        contact = new Contact(service, state, ea, router);
    });

    it("select should create a conversation when user doesn't have one", () => {
        // prepare
        let user = new User();
        user.id = 'test';
        contact.user = user;
        spyOn(service, 'showConversation');
        // act
        contact.select();

        // verify
        expect(user.conversation).toBeDefined();
        expect(user.conversation.attendees).toBeDefined();
        expect(user.conversation.attendees[0].userId).toBeDefined(user.id);
        expect(user.conversation.messages).toBeDefined();
        expect(service.showConversation).toHaveBeenCalledWith(user.conversation, router);
    });

    it("select should call service showConversation with the user's conversation", () => {
        // prepare
        let user = new User();
        user.conversation = new Conversation();
        contact.user = user;
        spyOn(service, 'showConversation');
        // act
        contact.select();

        // verify
        expect(service.showConversation).toHaveBeenCalledWith(user.conversation, router);
    });

    describe('attached specs', () => {
        let subscription: Subscription;
        let user: User;
        beforeEach(() => {
            subscription = {
                dispose: () => {}
            } as Subscription;

            user = new User();            
            user.id = 'test';
            contact.user = user;

            // act
            contact.attached();
            
            // verify
            expect(subscription).toBeDefined();
        });

        it('should set isSelected to true on ConversationSelected event when conversation attendees contains 2 users & userId equals user.id', () => {
            // prepare
            let conversation = new Conversation();            
            conversation.attendees = [
                new Attendee('test'),
                new Attendee('user')
            ];
            let event = new ConversationSelected(conversation);
            contact.isSelected = false;

            // act
            subscriptionCallback(event);

            // verify
            expect(contact.isSelected).toBe(true);
        })

        it('should set isSelected to false on ConversationSelected event when conversation attendees doent contains 2 users', () => {
            // prepare
            let conversation = new Conversation();            
            conversation.attendees = [
                new Attendee('test'),
            ];
            let event = new ConversationSelected(conversation);
            contact.isSelected = true;
            
            // act
            subscriptionCallback(event);

            // verify
            expect(contact.isSelected).toBe(false);
        });
    });
});
