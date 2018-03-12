var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-http-client", "aurelia-framework", "../config/settings", "./state"], function (require, exports, aurelia_http_client_1, aurelia_framework_1, settings_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserService = (function () {
        function UserService(http, settings, state) {
            this.http = http;
            this.settings = settings;
            this.state = state;
        }
        UserService.prototype.getUsers = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.http.get(_this.settings.userAPI)
                    .then(function (response) {
                    var data = response.content;
                    if (data && data.users) {
                        resolve(data.users);
                    }
                })
                    .catch(function (error) { return reject(new Error('the service is down')); });
            });
        };
        UserService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient,
                settings_1.Settings,
                state_1.State])
        ], UserService);
        return UserService;
    }());
    exports.UserService = UserService;
});
//# sourceMappingURL=user.service.js.map