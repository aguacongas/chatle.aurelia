define(["require", "exports", "../../../src/model/conversation", "../../../src/components/conversation-component"], function (require, exports, conversation_1, conversation_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('conversation component spec', function () {
        var service;
        var router;
        var component;
        beforeEach(function () {
            service = {
                sendMessage: function (c, m) { }
            };
            router = {
                navigateToRoute: function (r) { }
            };
            component = new conversation_component_1.ConversationComponent(service, router);
        });
        it('active should delete current conversation when no params', function () {
            component.conversation = new conversation_1.Conversation();
            component.activate(null, {});
            expect(component.conversation).toBeUndefined();
        });
        it('active should navigate to home when no current conversation', function () {
            spyOn(router, 'navigateToRoute');
            component.activate({}, {});
            expect(router.navigateToRoute).toHaveBeenCalledWith('home');
        });
        it('active should set conversation', function () {
            var routeConfig = {
                navModel: {
                    setTitle: function (t) { }
                }
            };
            spyOn(routeConfig.navModel, 'setTitle');
            var conversation = new conversation_1.Conversation();
            conversation.title = 'test';
            service.currentConversation = conversation;
            component.activate({}, routeConfig);
            expect(component.conversation).toBe(service.currentConversation);
            expect(routeConfig.navModel.setTitle).toHaveBeenCalledWith(conversation.title);
        });
        it('sendMessage should call service send message', function () {
            component.message = 'test';
            component.conversation = new conversation_1.Conversation();
            service.currentConversation = component.conversation;
            spyOn(service, 'sendMessage');
            component.sendMessage();
            expect(service.sendMessage).toHaveBeenCalledWith(component.conversation, 'test');
            expect(component.message).toBe('');
        });
        it('sendMessage should set error', function () {
            component.message = 'test';
            component.conversation = new conversation_1.Conversation();
            component.sendMessage();
            expect(component.error).toBeDefined();
        });
    });
});
//# sourceMappingURL=conversation-component.spec.js.map