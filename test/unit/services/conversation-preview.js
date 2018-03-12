var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-router", "../services/conversation.service", "../model/conversation", "../events/conversationSelected", "../events/messageReceived"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_router_1, conversation_service_1, conversation_1, conversationSelected_1, messageReceived_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConversationPreview = (function () {
        function ConversationPreview(service, ea, router) {
            this.service = service;
            this.ea = ea;
            this.router = router;
        }
        ConversationPreview.prototype.select = function () {
            this.service.showConversation(this.conversation, this.router);
        };
        ConversationPreview.prototype.attached = function () {
            var _this = this;
            this.lastMessage = this.conversation.messages[0].text;
            this.isSelected = this.conversation && this.conversation.isInitiatedByUser;
            this.conversationSelectedSubscription = this.ea.subscribe(conversationSelected_1.ConversationSelected, function (e) {
                if (e.conversation.id === _this.conversation.id) {
                    _this.isSelected = true;
                }
                else {
                    _this.isSelected = false;
                }
            });
            this.messageReceivedSubscription = this.ea.subscribe(messageReceived_1.MessageReceived, function (e) {
                var message = e.message;
                if (message.conversationId === _this.conversation.id) {
                    _this.conversation.messages.unshift(message);
                    _this.lastMessage = message.text;
                }
            });
        };
        ConversationPreview.prototype.detached = function () {
            this.conversationSelectedSubscription.dispose();
            this.messageReceivedSubscription.dispose();
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", conversation_1.Conversation)
        ], ConversationPreview.prototype, "conversation", void 0);
        ConversationPreview = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [conversation_service_1.ConversationService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
        ], ConversationPreview);
        return ConversationPreview;
    }());
    exports.ConversationPreview = ConversationPreview;
});
//# sourceMappingURL=conversation-preview.js.map