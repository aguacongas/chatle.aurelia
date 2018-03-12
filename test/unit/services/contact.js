var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-router", "../services/conversation.service", "../services/state", "../model/user", "../model/conversation", "../events/conversationSelected"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_router_1, conversation_service_1, state_1, user_1, conversation_1, conversationSelected_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Contact = (function () {
        function Contact(service, state, ea, router) {
            this.service = service;
            this.state = state;
            this.ea = ea;
            this.router = router;
        }
        Object.defineProperty(Contact.prototype, "isCurrentUser", {
            get: function () {
                return this.state.userName === this.user.id;
            },
            enumerable: true,
            configurable: true
        });
        Contact.prototype.select = function () {
            if (this.isCurrentUser) {
                return;
            }
            if (!this.user.conversation) {
                this.user.conversation = new conversation_1.Conversation(this.user);
            }
            this.service.showConversation(this.user.conversation, this.router);
        };
        Contact.prototype.attached = function () {
            var _this = this;
            this.conversationSelectedSubscription = this.ea.subscribe(conversationSelected_1.ConversationSelected, function (e) {
                var conv = e.conversation;
                var attendees = conv.attendees;
                _this.isSelected = false;
                if (attendees.length < 3) {
                    attendees.forEach(function (a) {
                        if (a.userId !== _this.state.userName && a.userId === _this.user.id) {
                            _this.isSelected = true;
                        }
                    });
                }
            });
        };
        Contact.prototype.detached = function () {
            this.conversationSelectedSubscription.dispose();
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", user_1.User)
        ], Contact.prototype, "user", void 0);
        Contact = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [conversation_service_1.ConversationService,
                state_1.State,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_router_1.Router])
        ], Contact);
        return Contact;
    }());
    exports.Contact = Contact;
});
//# sourceMappingURL=contact.js.map