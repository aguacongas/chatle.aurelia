define(["require", "exports", "./attendee"], function (require, exports, attendee_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Conversation = (function () {
        function Conversation(user) {
            if (!user) {
                return;
            }
            var attendees = new Array();
            attendees.push(new attendee_1.Attendee(user.id));
            this.attendees = attendees;
            this.messages = new Array();
            this.isInitiatedByUser = true;
        }
        return Conversation;
    }());
    exports.Conversation = Conversation;
});
//# sourceMappingURL=conversation.js.map