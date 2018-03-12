define(["require", "exports", "../../../src/services/state", "../../../src/model/user", "../../../src/model/conversation", "../../../src/model/attendee", "../../../src/events/conversationSelected", "../../../src/components/contact"], function (require, exports, state_1, user_1, conversation_1, attendee_1, conversationSelected_1, contact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('contact component spec', function () {
        var service;
        var state;
        var ea;
        var router;
        var subscription;
        var contact;
        var subscriptionCallback;
        var evt;
        beforeEach(function () {
            service = {
                showConversation: function (c, r) { }
            };
            state = new state_1.State;
            router = {};
            subscription = {
                dispose: function () { }
            };
            ea = {
                subscribe: function (e, d) {
                    evt = e;
                    subscriptionCallback = d;
                    return subscription;
                }
            };
            contact = new contact_1.Contact(service, state, ea, router);
        });
        it("select should create a conversation when user doesn't have one", function () {
            var user = new user_1.User();
            user.id = 'test';
            contact.user = user;
            spyOn(service, 'showConversation');
            contact.select();
            expect(user.conversation).toBeDefined();
            expect(user.conversation.attendees).toBeDefined();
            expect(user.conversation.attendees[0].userId).toBeDefined(user.id);
            expect(user.conversation.messages).toBeDefined();
            expect(service.showConversation).toHaveBeenCalledWith(user.conversation, router);
        });
        it("select should call service showConversation with the user's conversation", function () {
            var user = new user_1.User();
            user.id = 'test';
            user.conversation = new conversation_1.Conversation();
            contact.user = user;
            spyOn(service, 'showConversation');
            contact.select();
            expect(service.showConversation).toHaveBeenCalledWith(user.conversation, router);
        });
        describe('attached specs', function () {
            var user;
            beforeEach(function () {
                user = new user_1.User();
                user.id = 'test';
                contact.user = user;
                contact.attached();
                expect(subscription).toBeDefined();
            });
            it('should set isSelected to true on ConversationSelected event when conversation attendees contains 2 users & userId equals user.id', function () {
                var conversation = new conversation_1.Conversation();
                conversation.attendees = [
                    new attendee_1.Attendee('test'),
                    new attendee_1.Attendee('user')
                ];
                var event = new conversationSelected_1.ConversationSelected(conversation);
                contact.isSelected = false;
                subscriptionCallback(event);
                expect(contact.isSelected).toBe(true);
            });
            it('should set isSelected to false on ConversationSelected event when conversation attendees contains more than 2 users', function () {
                var conversation = new conversation_1.Conversation();
                conversation.attendees = [
                    new attendee_1.Attendee('test'),
                    new attendee_1.Attendee('test'),
                    new attendee_1.Attendee('test')
                ];
                var event = new conversationSelected_1.ConversationSelected(conversation);
                contact.isSelected = true;
                subscriptionCallback(event);
                expect(contact.isSelected).toBe(false);
            });
            it('detached should dispose subscription', function () {
                spyOn(subscription, 'dispose');
                contact.detached();
                expect(subscription.dispose).toHaveBeenCalledTimes(1);
            });
        });
    });
});
//# sourceMappingURL=contact.spec.js.map