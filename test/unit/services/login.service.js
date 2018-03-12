var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-http-client", "aurelia-framework", "../config/settings", "./chat.service", "./conversation.service", "./helpers", "./state"], function (require, exports, aurelia_http_client_1, aurelia_framework_1, settings_1, chat_service_1, conversation_service_1, helpers_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginService = (function () {
        function LoginService(http, settings, chatService, conversationService, state, helpers) {
            this.http = http;
            this.settings = settings;
            this.chatService = chatService;
            this.conversationService = conversationService;
            this.state = state;
            this.helpers = helpers;
        }
        LoginService.prototype.getXhrf = function (clearCookies) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (clearCookies) {
                    _this.http.get('cls')
                        .then(function () { return _this.setXhrf(resolve, reject); })
                        .catch(function (e) { return reject(new Error('the service is down')); });
                }
                else if (_this.xhrf) {
                    resolve(_this.xhrf);
                }
                else {
                    _this.setXhrf(resolve, reject);
                }
            });
        };
        LoginService.prototype.login = function (userName) {
            var _this = this;
            this.state.isGuess = true;
            return new Promise(function (resolve, reject) {
                _this.getXhrf()
                    .then(function (r) {
                    if (_this.state.isGuess) {
                        _this.loginAsGuess(userName, resolve, reject);
                    }
                })
                    .catch(function (error) { return reject(error); });
            });
        };
        LoginService.prototype.logoff = function () {
            var _this = this;
            if (!this.state.userName) {
                return;
            }
            this.state.userName = undefined;
            this.conversationService.currentConversation = undefined;
            this.chatService.stop();
            this.getXhrf()
                .then(function (r) {
                _this.http.post(_this.settings.accountdAPI + '/spalogoff', null);
            });
            this.xhrf = undefined;
        };
        LoginService.prototype.exists = function (userName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (!userName) {
                    resolve(false);
                    return;
                }
                _this.getXhrf()
                    .then(function (r) {
                    _this.http.get(_this.settings.accountdAPI + "/exists?userName=" + encodeURIComponent(userName))
                        .then(function (response) {
                        resolve(response.content);
                    })
                        .catch(function (error) {
                        _this.manageError(error, reject, new Error('the service is down'));
                    });
                })
                    .catch(function (error) { return reject(new Error('the service is down')); });
            });
        };
        LoginService.prototype.confirm = function (userName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.getXhrf()
                    .then(function (r) {
                    _this.http.put(_this.settings.accountdAPI + "/spaExternalLoginConfirmation", { userName: userName })
                        .then(function (response) {
                        _this.logged(userName, resolve, reject);
                        sessionStorage.setItem('userName', userName);
                    })
                        .catch(function (error) { return _this.manageError(error, reject, _this.helpers.getError(error)); });
                })
                    .catch(function (error) { return reject(new Error('the service is down')); });
            });
        };
        LoginService.prototype.getExternalLoginProviders = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.getXhrf()
                    .then(function (r) {
                    _this.http.get(_this.settings.accountdAPI + "/getExternalProviders")
                        .then(function (response) {
                        resolve(response.content);
                    })
                        .catch(function (error) { return _this.manageError(error, reject, _this.helpers.getError(error)); });
                })
                    .catch(function (error) { return reject(new Error('the service is down')); });
            });
        };
        LoginService.prototype.setXhrf = function (resolve, reject) {
            var _this = this;
            this.http.get('xhrf')
                .then(function (r) {
                _this.xhrf = r.response;
                _this.http.configure(function (builder) {
                    builder.withHeader('X-XSRF-TOKEN', _this.xhrf);
                });
                resolve(_this.xhrf);
            })
                .catch(function (error) { return reject(new Error('the service is down')); });
        };
        LoginService.prototype.loginAsGuess = function (userName, resolve, reject) {
            var _this = this;
            this.http.post(this.settings.accountdAPI + '/spaguess', { userName: userName })
                .then(function (response) {
                _this.logged(userName, resolve, reject);
            })
                .catch(function (error) {
                _this.manageError(error, reject, _this.helpers.getError(error));
            });
        };
        LoginService.prototype.logged = function (userName, resolve, reject) {
            this.state.userName = userName;
            this.setXhrf(resolve, reject);
        };
        LoginService.prototype.manageError = function (error, reject, exception) {
            this.xhrf = undefined;
            reject(exception);
        };
        LoginService = __decorate([
            aurelia_framework_1.autoinject,
            __metadata("design:paramtypes", [aurelia_http_client_1.HttpClient,
                settings_1.Settings,
                chat_service_1.ChatService,
                conversation_service_1.ConversationService,
                state_1.State,
                helpers_1.Helpers])
        ], LoginService);
        return LoginService;
    }());
    exports.LoginService = LoginService;
});
//# sourceMappingURL=login.service.js.map