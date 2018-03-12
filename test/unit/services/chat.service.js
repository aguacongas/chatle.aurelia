var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-event-aggregator", "aurelia-http-client", "aurelia-framework", "@aspnet/signalr-client", "../config/settings", "./helpers", "./state", "../events/connectionStateChanged", "../events/conversationJoined", "../events/messageReceived", "../events/userConnected", "../events/userDisconnected"], function (require, exports, aurelia_event_aggregator_1, aurelia_http_client_1, aurelia_framework_1, signalr_client_1, settings_1, helpers_1, state_1, connectionStateChanged_1, conversationJoined_1, messageReceived_1, userConnected_1, userDisconnected_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConnectionState;
    (function (ConnectionState) {
        ConnectionState[ConnectionState["Connected"] = 1] = "Connected";
        ConnectionState[ConnectionState["Disconnected"] = 2] = "Disconnected";
        ConnectionState[ConnectionState["Error"] = 3] = "Error";
    })(ConnectionState = exports.ConnectionState || (exports.ConnectionState = {}));
    var ChatService = (function () {
        function ChatService(settings, ea, http, state, helpers) {
            this.settings = settings;
            this.ea = ea;
            this.http = http;
            this.state = state;
            this.helpers = helpers;
            this.currentState = ConnectionState.Disconnected;
        }
        ChatService.prototype.start = function () {
            var _this = this;
            var connection = new signalr_client_1.HttpConnection(this.settings.apiBaseUrl + this.settings.chatAPI);
            this.hubConnection = new signalr_client_1.HubConnection(connection);
            this.hubConnection.on('userConnected', function (user) { return _this.onUserConnected(user); });
            this.hubConnection.on('userDisconnected', function (user) { return _this.onUserDisconnected(user); });
            this.hubConnection.on('messageReceived', function (message) { return _this.onMessageReceived(message); });
            this.hubConnection.on('messageReceived', function (conversation) { return _this.onJoinConversation(conversation); });
            this.hubConnection.onclose(function (e) {
                if (e) {
                    _this.onError(e);
                }
                else {
                    _this.onDisconnected();
                }
            });
            return new Promise(function (resolve, reject) {
                _this.hubConnection.start()
                    .then(function () {
                    _this.setConnectionState(ConnectionState.Connected);
                    resolve(ConnectionState.Connected);
                })
                    .catch(function (error) {
                    _this.setConnectionState(ConnectionState.Error);
                    reject(new Error(error));
                });
            });
        };
        ChatService.prototype.stop = function () {
            this.hubConnection.stop();
        };
        ChatService.prototype.setConnectionState = function (connectionState) {
            if (this.currentState === connectionState) {
                return;
            }
            console.log('connection state changed to: ' + connectionState);
            this.currentState = connectionState;
            this.ea.publish(new connectionStateChanged_1.ConnectionStateChanged(connectionState));
        };
        ChatService.prototype.onReconnected = function () {
            this.setConnectionState(ConnectionState.Connected);
        };
        ChatService.prototype.onDisconnected = function () {
            this.setConnectionState(ConnectionState.Disconnected);
        };
        ChatService.prototype.onError = function (error) {
            this.setConnectionState(ConnectionState.Error);
        };
        ChatService.prototype.onUserConnected = function (user) {
            console.log("Chat Hub new user connected: " + user.id);
            this.ea.publish(new userConnected_1.UserConnected(user));
        };
        ChatService.prototype.onUserDisconnected = function (user) {
            console.log("Chat Hub user disconnected: " + user.id);
            if (user.id !== this.state.userName) {
                this.ea.publish(new userDisconnected_1.UserDisconnected(user));
            }
        };
        ChatService.prototype.onMessageReceived = function (message) {
            this.ea.publish(new messageReceived_1.MessageReceived(message));
        };
        ChatService.prototype.onJoinConversation = function (conversation) {
            this.helpers.setConverationTitle(conversation);
            this.ea.publish(new conversationJoined_1.ConversationJoined(conversation));
        };
        ChatService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [settings_1.Settings,
                aurelia_event_aggregator_1.EventAggregator,
                aurelia_http_client_1.HttpClient,
                state_1.State,
                helpers_1.Helpers])
        ], ChatService);
        return ChatService;
    }());
    exports.ChatService = ChatService;
});
//# sourceMappingURL=chat.service.js.map