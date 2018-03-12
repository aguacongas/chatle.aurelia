var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "../services/chat.service", "../services/user.service", "../services/chat.service", "../events/userConnected", "../events/userDisconnected", "../events/connectionStateChanged"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, chat_service_1, user_service_1, chat_service_2, userConnected_1, userDisconnected_1, connectionStateChanged_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContactList = (function () {
        function ContactList(userService, chatService, ea) {
            this.userService = userService;
            this.chatService = chatService;
            this.ea = ea;
            this.loadingMessage = "loading...";
        }
        ContactList.prototype.attached = function () {
            var _this = this;
            this.connectionStateChangeSubscription = this.ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (e) {
                if (e.state === chat_service_1.ConnectionState.Connected) {
                    _this.getUser();
                }
            });
            if (this.chatService.currentState === chat_service_1.ConnectionState.Connected) {
                this.getUser();
            }
        };
        ContactList.prototype.detached = function () {
            this.connectionStateChangeSubscription.dispose();
            if (this.userConnectedSubscription) {
                this.userConnectedSubscription.dispose();
            }
            if (this.userDisconnectedSubscription) {
                this.userDisconnectedSubscription.dispose();
            }
        };
        ContactList.prototype.getUser = function () {
            var _this = this;
            this.userService.getUsers()
                .then(function (users) {
                _this.users = users;
                _this.userConnectedSubscription = _this.ea.subscribe(userConnected_1.UserConnected, function (e) {
                    var userConnected = e;
                    _this.removeUser(userConnected.user.id);
                    _this.users.unshift(userConnected.user);
                });
                _this.userDisconnectedSubscription = _this.ea.subscribe(userDisconnected_1.UserDisconnected, function (e) {
                    _this.removeUser(e.user.id);
                });
            })
                .catch(function (error) { return _this.loadingMessage = error.message; });
        };
        ContactList.prototype.removeUser = function (id) {
            var user;
            this.users.forEach(function (u) {
                if (u.id === id) {
                    user = u;
                }
            });
            if (user) {
                var index = this.users.indexOf(user);
                this.users.splice(index, 1);
            }
        };
        ContactList = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [user_service_1.UserService,
                chat_service_2.ChatService,
                aurelia_event_aggregator_1.EventAggregator])
        ], ContactList);
        return ContactList;
    }());
    exports.ContactList = ContactList;
});
//# sourceMappingURL=contact-list.js.map