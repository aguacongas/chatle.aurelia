import { Router, RouteConfig } from 'aurelia-router';

import { ConversationService } from '../../../src/services/conversation.service';
import { Conversation } from '../../../src/model/conversation';
import { ConversationComponent } from '../../../src/components/conversation-component'

describe('conversation component spec', () => {
    let service: ConversationService;
    let router: Router;
    let component: ConversationComponent;

    beforeEach(() => {
        service = {
            sendMessage: (c, m) => { }
        } as ConversationService;
        router = {
            navigateToRoute: r => { }
        } as Router;

        component = new ConversationComponent(service, router);
    });

    it('active should delete current conversation when no params', () => {
        // prepare
        component.conversation = new Conversation();
        // act
        component.activate(null, {});

        // verify
        expect(component.conversation).toBeUndefined();
    });

    it('active should navigate to home when no current conversation', () => {
        // prepare
        spyOn(router, 'navigateToRoute');
        // act
        component.activate({}, {});

        // verify
        expect(router.navigateToRoute).toHaveBeenCalledWith('home');
    });

    it('active should set conversation', () => {
        // prepare
        let routeConfig = {
            navModel: {
                setTitle: t => { }
            }
        }
        spyOn(routeConfig.navModel, 'setTitle');
        let conversation = new Conversation();
        conversation.title = 'test';
        service.currentConversation = conversation;

        // act
        component.activate({}, routeConfig);

        // verify
        expect(component.conversation).toBe(service.currentConversation);
        expect(routeConfig.navModel.setTitle).toHaveBeenCalledWith(conversation.title);
    });

    it('sendMessage should call service send message', () => {
        // prepare
        component.message = 'test';
        component.conversation = new Conversation();
        service.currentConversation = component.conversation;
        spyOn(service, 'sendMessage');

        // act
        component.sendMessage();

        // verify
        expect(service.sendMessage).toHaveBeenCalledWith(component.conversation, 'test');
        expect(component.message).toBe('');
    });

    it('sendMessage should set error', () => {
        // prepare
        component.message = 'test';
        component.conversation = new Conversation();

        // act
        component.sendMessage();

        // verify
        expect(component.error).toBeDefined();
    });
});