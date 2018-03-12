var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-event-aggregator", "../services/chat.service", "../services/conversation.service", "../services/state", "../events/conversationJoined", "../events/userDisconnected", "../events/connectionStateChanged", "../events/notificationClicked"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, chat_service_1, conversation_service_1, state_1, conversationJoined_1, userDisconnected_1, connectionStateChanged_1, notificationClicked_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConversationList = (function () {
        function ConversationList(service, state, ea, router) {
            this.service = service;
            this.state = state;
            this.ea = ea;
            this.router = router;
        }
        ConversationList.prototype.attached = function () {
            var _this = this;
            this.conversations = new Array();
            this.getConversations();
            this.connectionStateSubscription = this.ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (e) {
                var state = e.state;
                if (state === chat_service_1.ConnectionState.Disconnected) {
                    _this.conversations.splice(_this.conversations.length);
                }
                else if (state === chat_service_1.ConnectionState.Connected) {
                    _this.getConversations();
                }
            });
            this.notificationClickedSubscription = this.ea.subscribe(notificationClicked_1.NotificationClicked, function (e) {
                var message = e.message;
                var conversation = _this.conversations.find(function (c) { return c.id === message.conversationId; });
                if (conversation) {
                    _this.service.showConversation(conversation, _this.router);
                }
            });
        };
        ConversationList.prototype.detached = function () {
            this.Unsubscribe();
            this.connectionStateSubscription.dispose();
        };
        ConversationList.prototype.Unsubscribe = function () {
            if (this.conversationJoinedSubscription) {
                this.conversationJoinedSubscription.dispose();
            }
            if (this.userDisconnectedSubscription) {
                this.userDisconnectedSubscription.dispose();
            }
        };
        ConversationList.prototype.getConversations = function () {
            var _this = this;
            this.service.getConversations()
                .then(function (conversations) {
                _this.Unsubscribe();
                if (!conversations) {
                    return;
                }
                _this.conversations = conversations;
                _this.userDisconnectedSubscription = _this.ea.subscribe(userDisconnected_1.UserDisconnected, function (e) {
                    _this.conversations.forEach(function (c) {
                        var attendees = c.attendees;
                        attendees.forEach(function (a) {
                            var user = e.user;
                            if (user.isRemoved && a.userId === user.id) {
                                if (c.attendees.length < 3) {
                                    var index = _this.conversations.indexOf(c);
                                    _this.conversations.splice(index, 1);
                                    if (_this.service.currentConversation === c) {
                                        _this.service.currentConversation = undefined;
                                    }
                                }
                                else {
                                    var index = attendees.indexOf(a);
                                    attendees.splice(index, 1);
                                    if (_this.service.currentConversation === c) {
                                        c.title = undefined;
                                        _this.service.showConversation(c, _this.router);
                                    }
                                }
                            }
                        });
                    });
                });
                _this.conversationJoinedSubscription = _this.ea.subscribe(conversationJoined_1.ConversationJoined, function (e) {
                    var conversation = e.conversation;
                    _this.conversations.unshift(e.conversation);
                });
            });
        };
        ConversationList = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [conversation_service_1.ConversationService,
                state_1.State,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_router_1.Router])
        ], ConversationList);
        return ConversationList;
    }());
    exports.ConversationList = ConversationList;
});
//# sourceMappingURL=conversation-list.js.map