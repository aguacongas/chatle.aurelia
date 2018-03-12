define(["require", "exports", "../events/messageReceived", "../events/conversationJoined", "../events/notificationClicked"], function (require, exports, messageReceived_1, conversationJoined_1, notificationClicked_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotificationService = (function () {
        function NotificationService(ea) {
            this.ea = ea;
        }
        NotificationService.prototype.start = function () {
            var _this = this;
            if (window['Notification']) {
                if (Notification.permission === 'granted') {
                    this.listen();
                }
                else if (Notification.permission !== 'denied') {
                    Notification
                        .requestPermission()
                        .then(function (permission) {
                        if (permission === 'granted') {
                            _this.listen();
                        }
                    });
                }
            }
        };
        NotificationService.prototype.stop = function () {
            if (this.messageSubscription) {
                this.messageSubscription.dispose();
            }
            if (this.conversationSubscription) {
                this.conversationSubscription.dispose();
            }
        };
        NotificationService.prototype.listen = function () {
            var _this = this;
            this.messageSubscription = this.ea.subscribe(messageReceived_1.MessageReceived, function (e) {
                _this.notify(e.message);
            });
            this.conversationSubscription = this.ea.subscribe(conversationJoined_1.ConversationJoined, function (e) {
                var conversation = e.conversation;
                var message = conversation.messages[0];
                if (message) {
                    _this.notify(message);
                }
            });
        };
        NotificationService.prototype.notify = function (message) {
            var _this = this;
            var option = {
                body: message.text,
                icon: "favicon.ico"
            };
            var n = new Notification(message.from, option);
            n.onclick = function () {
                _this.ea.publish(new notificationClicked_1.NotificationClicked(message));
                n.close.bind(n);
            };
            setTimeout(n.close.bind(n), 5000);
        };
        return NotificationService;
    }());
    exports.NotificationService = NotificationService;
});
//# sourceMappingURL=notification.service.js.map