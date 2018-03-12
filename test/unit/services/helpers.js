var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./state"], function (require, exports, aurelia_framework_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Helpers = (function () {
        function Helpers(state) {
            this.state = state;
            this.location = window.location;
        }
        Helpers.prototype.getError = function (error) {
            var errors = error.content;
            var se = errors[0];
            var e = new Error(se.errors[0].errorMessage);
            e.name = se.key;
            return e;
        };
        Helpers.prototype.setConverationTitle = function (conversation) {
            var _this = this;
            if (conversation.title) {
                return;
            }
            var title = '';
            conversation.attendees.forEach(function (attendee) {
                if (attendee && attendee.userId && attendee.userId !== _this.state.userName) {
                    title += attendee.userId + ' ';
                }
            });
            conversation.title = title.trim();
        };
        Helpers.prototype.getUrlParameter = function (name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(this.location.search);
            return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
        Helpers = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [state_1.State])
        ], Helpers);
        return Helpers;
    }());
    exports.Helpers = Helpers;
});
//# sourceMappingURL=helpers.js.map