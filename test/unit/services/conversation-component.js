var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-router", "../services/conversation.service"], function (require, exports, aurelia_framework_1, aurelia_router_1, conversation_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConversationComponent = (function () {
        function ConversationComponent(service, router) {
            this.service = service;
            this.router = router;
        }
        ConversationComponent.prototype.activate = function (params, routeConfig) {
            this.error = '';
            if (!params) {
                this.service.currentConversation = undefined;
            }
            this.conversation = this.service.currentConversation;
            if (!this.conversation) {
                this.router.navigateToRoute('home');
            }
            else {
                routeConfig.navModel.setTitle(this.conversation.title);
            }
        };
        ConversationComponent.prototype.sendMessage = function () {
            if (this.service.currentConversation === this.conversation) {
                this.service.sendMessage(this.conversation, this.message);
            }
            else {
                this.error = 'this user is disconnected';
            }
            this.message = '';
        };
        ConversationComponent = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [conversation_service_1.ConversationService, aurelia_router_1.Router])
        ], ConversationComponent);
        return ConversationComponent;
    }());
    exports.ConversationComponent = ConversationComponent;
});
//# sourceMappingURL=conversation-component.js.map