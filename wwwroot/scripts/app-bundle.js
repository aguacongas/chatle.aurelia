define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true,
        apiBaseUrl: 'http://localhost:5000'
    };
});

define('config/settings',["require", "exports"], function (require, exports) {
    "use strict";
    var Settings = (function () {
        function Settings() {
            this.apiBaseUrl = 'http://localhost:5000';
            this.userAPI = '/api/users';
            this.convAPI = '/api/chat/conv';
            this.chatAPI = '/api/chat';
            this.accountdAPI = "/account";
        }
        return Settings;
    }());
    exports.Settings = Settings;
});

define('services/state',["require", "exports"], function (require, exports) {
    "use strict";
    var State = (function () {
        function State() {
        }
        return State;
    }());
    exports.State = State;
});

define('model/serviceError',["require", "exports"], function (require, exports) {
    "use strict";
    var Key = (function () {
        function Key() {
        }
        return Key;
    }());
    var ErrorMessage = (function () {
        function ErrorMessage() {
        }
        return ErrorMessage;
    }());
    var ServiceError = (function () {
        function ServiceError() {
        }
        return ServiceError;
    }());
    exports.ServiceError = ServiceError;
});

define('model/attendee',["require", "exports"], function (require, exports) {
    "use strict";
    var Attendee = (function () {
        function Attendee(userId) {
            this.userId = userId;
        }
        return Attendee;
    }());
    exports.Attendee = Attendee;
});

define('model/message',["require", "exports"], function (require, exports) {
    "use strict";
    var Message = (function () {
        function Message() {
        }
        return Message;
    }());
    exports.Message = Message;
});

define('model/conversation',["require", "exports"], function (require, exports) {
    "use strict";
    var Conversation = (function () {
        function Conversation() {
        }
        return Conversation;
    }());
    exports.Conversation = Conversation;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/helpers',["require", "exports", 'aurelia-framework', './state'], function (require, exports, aurelia_framework_1, state_1) {
    "use strict";
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
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
        Helpers = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [state_1.State])
        ], Helpers);
        return Helpers;
    }());
    exports.Helpers = Helpers;
});

define('model/user',["require", "exports"], function (require, exports) {
    "use strict";
    var User = (function () {
        function User() {
        }
        return User;
    }());
    exports.User = User;
});

define('events/connectionStateChanged',["require", "exports"], function (require, exports) {
    "use strict";
    var ConnectionStateChanged = (function () {
        function ConnectionStateChanged(state) {
            this.state = state;
        }
        return ConnectionStateChanged;
    }());
    exports.ConnectionStateChanged = ConnectionStateChanged;
});

define('events/conversationJoined',["require", "exports"], function (require, exports) {
    "use strict";
    var ConversationJoined = (function () {
        function ConversationJoined(conversation) {
            this.conversation = conversation;
        }
        return ConversationJoined;
    }());
    exports.ConversationJoined = ConversationJoined;
});

define('events/messageReceived',["require", "exports"], function (require, exports) {
    "use strict";
    var MessageReceived = (function () {
        function MessageReceived(message) {
            this.message = message;
        }
        return MessageReceived;
    }());
    exports.MessageReceived = MessageReceived;
});

define('events/userConnected',["require", "exports"], function (require, exports) {
    "use strict";
    var UserConnected = (function () {
        function UserConnected(user) {
            this.user = user;
        }
        return UserConnected;
    }());
    exports.UserConnected = UserConnected;
});

define('events/userDisconnected',["require", "exports"], function (require, exports) {
    "use strict";
    var UserDisconnected = (function () {
        function UserDisconnected(user) {
            this.user = user;
        }
        return UserDisconnected;
    }());
    exports.UserDisconnected = UserDisconnected;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/chat.service',["require", "exports", 'aurelia-event-aggregator', 'aurelia-http-client', 'aurelia-framework', '../environment', '../config/settings', './helpers', './state', '../events/connectionStateChanged', '../events/conversationJoined', '../events/messageReceived', '../events/userConnected', '../events/userDisconnected'], function (require, exports, aurelia_event_aggregator_1, aurelia_http_client_1, aurelia_framework_1, environment_1, settings_1, helpers_1, state_1, connectionStateChanged_1, conversationJoined_1, messageReceived_1, userConnected_1, userDisconnected_1) {
    "use strict";
    (function (ConnectionState) {
        ConnectionState[ConnectionState["Connected"] = 1] = "Connected";
        ConnectionState[ConnectionState["Disconnected"] = 2] = "Disconnected";
        ConnectionState[ConnectionState["Error"] = 3] = "Error";
    })(exports.ConnectionState || (exports.ConnectionState = {}));
    var ConnectionState = exports.ConnectionState;
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
            var debug = environment_1.default.debug;
            var hub = jQuery.connection.hub;
            hub.logging = debug;
            hub.url = this.settings.apiBaseUrl + '/signalr';
            var connection = jQuery.connection;
            var chatHub = connection.chat;
            chatHub.client.userConnected = function (user) { return _this.onUserConnected(user); };
            chatHub.client.userDisconnected = function (user) { return _this.onUserDisconnected(user); };
            chatHub.client.messageReceived = function (message) { return _this.onMessageReceived(message); };
            chatHub.client.joinConversation = function (conversation) { return _this.onJoinConversation(conversation); };
            if (debug) {
                hub.stateChanged(function (change) {
                    var oldState, newState;
                    var signalR = jQuery.signalR;
                    for (var state in signalR.connectionState) {
                        if (signalR.connectionState[state] === change.oldState) {
                            oldState = state;
                        }
                        if (signalR.connectionState[state] === change.newState) {
                            newState = state;
                        }
                    }
                    console.log("Chat Hub state changed from " + oldState + " to " + newState);
                });
            }
            hub.reconnected(function () { return _this.onReconnected(); });
            hub.error(function (error) { return _this.onError(error); });
            hub.disconnected(function () { return _this.onDisconnected(); });
            return new Promise(function (resolve, reject) {
                hub.start()
                    .done(function () {
                    _this.setConnectionState(ConnectionState.Connected);
                    resolve(ConnectionState.Connected);
                })
                    .fail(function (error) {
                    _this.setConnectionState(ConnectionState.Error);
                    reject(new Error(error));
                });
            });
        };
        ChatService.prototype.stop = function () {
            jQuery.connection.hub.stop();
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
            __metadata('design:paramtypes', [settings_1.Settings, aurelia_event_aggregator_1.EventAggregator, aurelia_http_client_1.HttpClient, state_1.State, helpers_1.Helpers])
        ], ChatService);
        return ChatService;
    }());
    exports.ChatService = ChatService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/login.service',["require", "exports", 'aurelia-http-client', 'aurelia-framework', '../config/settings', './chat.service', './helpers', './state'], function (require, exports, aurelia_http_client_1, aurelia_framework_1, settings_1, chat_service_1, helpers_1, state_1) {
    "use strict";
    var LoginService = (function () {
        function LoginService(http, settings, chatService, state, helpers) {
            this.http = http;
            this.settings = settings;
            this.chatService = chatService;
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
        LoginService.prototype.login = function (userName, password) {
            var _this = this;
            this.state.isGuess = !password;
            return new Promise(function (resolve, reject) {
                _this.getXhrf()
                    .then(function (r) {
                    if (_this.state.isGuess) {
                        _this.loginAsGuess(userName, resolve, reject);
                    }
                    else {
                        _this.loginAsRegistered(userName, password, resolve, reject);
                    }
                })
                    .catch(function (error) { return reject(error); });
            });
        };
        LoginService.prototype.logoff = function () {
            var _this = this;
            delete this.state.userName;
            delete this.xhrf;
            sessionStorage.removeItem('userName');
            this.chatService.stop();
            this.getXhrf()
                .then(function (r) { return _this.http.post(_this.settings.accountdAPI + '/spalogoff', null); });
        };
        LoginService.prototype.exists = function (userName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.getXhrf()
                    .then(function (r) {
                    _this.http.get(_this.settings.accountdAPI + "/exists")
                        .then(function (response) {
                        resolve(response.content);
                    })
                        .catch(function (error) { return reject(new Error('the service is down')); });
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
                    })
                        .catch(function (error) { return reject(_this.helpers.getError(error)); });
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
                reject(_this.helpers.getError(error));
            });
        };
        LoginService.prototype.loginAsRegistered = function (userName, password, resolve, reject) {
            var _this = this;
            this.http.post(this.settings.accountdAPI + '/spalogin', { userName: userName, password: password })
                .then(function (response) {
                _this.logged(userName, resolve, reject);
                sessionStorage.setItem('userName', userName);
            })
                .catch(function (error) {
                reject(_this.helpers.getError(error));
            });
        };
        LoginService.prototype.logged = function (userName, resolve, reject) {
            this.state.userName = userName;
            this.chatService.start();
            this.setXhrf(resolve, reject);
        };
        LoginService = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_http_client_1.HttpClient, settings_1.Settings, chat_service_1.ChatService, state_1.State, helpers_1.Helpers])
        ], LoginService);
        return LoginService;
    }());
    exports.LoginService = LoginService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", 'aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', 'aurelia-http-client', './environment', './services/login.service', './services/state', './events/connectionStateChanged', './config/settings', './services/helpers'], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, aurelia_http_client_1, environment_1, login_service_1, state_1, connectionStateChanged_1, settings_1, helpers_1) {
    "use strict";
    var App = (function () {
        function App(service, ea, state, settings, http) {
            this.service = service;
            this.ea = ea;
            this.state = state;
            settings.apiBaseUrl = environment_1.default.apiBaseUrl;
            http.configure(function (builder) { return builder
                .withBaseUrl(environment_1.default.apiBaseUrl)
                .withCredentials(true); });
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Chatle';
            config.addPipelineStep('authorize', AuthorizeStep);
            config.map([
                { route: ['', 'home'], name: 'home', moduleId: 'pages/home', title: 'Home' },
                { route: 'account', name: 'account', moduleId: 'pages/account', title: 'Account' },
                { route: 'login', name: 'login', moduleId: 'pages/login', title: 'Login', anomymous: true },
                { route: 'confirm', name: 'confirm', moduleId: 'pages/confirm', title: 'Confirm', anomymous: true }
            ]);
            this.router = router;
        };
        App.prototype.attached = function () {
            var _this = this;
            this.ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (e) {
                _this.setIsConnected();
            });
            this.setIsConnected();
        };
        App.prototype.logoff = function () {
            this.service.logoff();
            this.router.navigateToRoute('login');
        };
        App.prototype.manage = function () {
            this.router.navigateToRoute('account');
        };
        App.prototype.setIsConnected = function () {
            this.isConnected = this.state.userName !== undefined && this.state.userName != null;
            this.userName = this.state.userName;
        };
        App = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [login_service_1.LoginService, aurelia_event_aggregator_1.EventAggregator, state_1.State, settings_1.Settings, aurelia_http_client_1.HttpClient])
        ], App);
        return App;
    }());
    exports.App = App;
    var AuthorizeStep = (function () {
        function AuthorizeStep(state, helpers) {
            this.state = state;
            this.helpers = helpers;
        }
        AuthorizeStep.prototype.run = function (navigationInstruction, next) {
            if (navigationInstruction.getAllInstructions().some(function (i) {
                var route = i.config;
                return !route.anomymous;
            })) {
                var provider = this.helpers.getUrlParameter('p');
                if (provider) {
                    return next.cancel(new aurelia_router_1.Redirect('confirm'));
                }
                var userName = this.helpers.getUrlParameter('u');
                if (userName) {
                    this.state.userName = userName;
                }
                var isLoggedIn = this.state.userName;
                if (!isLoggedIn) {
                    return next.cancel(new aurelia_router_1.Redirect('login'));
                }
            }
            return next();
        };
        AuthorizeStep = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [state_1.State, helpers_1.Helpers])
        ], AuthorizeStep);
        return AuthorizeStep;
    }());
});

define('main',["require", "exports", 'aurelia-framework', 'aurelia-logging-console', './environment'], function (require, exports, aurelia_framework_1, aurelia_logging_console_1, environment_1) {
    "use strict";
    if (environment_1.default.debug) {
        aurelia_framework_1.LogManager.addAppender(new aurelia_logging_console_1.ConsoleAppender());
        aurelia_framework_1.LogManager.setLevel(aurelia_framework_1.LogManager.logLevel.debug);
    }
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-validation');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/user.service',["require", "exports", 'aurelia-http-client', 'aurelia-framework', '../config/settings', './state', './helpers'], function (require, exports, aurelia_http_client_1, aurelia_framework_1, settings_1, state_1, helpers_1) {
    "use strict";
    var UserService = (function () {
        function UserService(http, settings, state, helpers) {
            this.http = http;
            this.settings = settings;
            this.state = state;
            this.helpers = helpers;
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
                    .catch(function (error) { return reject(new Error('The service is down')); });
            });
        };
        UserService = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_http_client_1.HttpClient, settings_1.Settings, state_1.State, helpers_1.Helpers])
        ], UserService);
        return UserService;
    }());
    exports.UserService = UserService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/contact-list',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', '../services/chat.service', '../services/user.service', '../services/chat.service', '../events/userConnected', '../events/userDisconnected', '../events/connectionStateChanged'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, chat_service_1, user_service_1, chat_service_2, userConnected_1, userDisconnected_1, connectionStateChanged_1) {
    "use strict";
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
                    _this.removeUser(e.user.id);
                    _this.users.unshift(e.user);
                });
                _this.userDisconnectedSubscription = _this.ea.subscribe(userDisconnected_1.UserDisconnected, function (e) {
                    _this.removeUser(e.user.id);
                });
            })
                .catch(function (error) { return _this.loadingMessage = error; });
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
            __metadata('design:paramtypes', [user_service_1.UserService, chat_service_2.ChatService, aurelia_event_aggregator_1.EventAggregator])
        ], ContactList);
        return ContactList;
    }());
    exports.ContactList = ContactList;
});

define('events/conversationSelected',["require", "exports"], function (require, exports) {
    "use strict";
    var ConversationSelected = (function () {
        function ConversationSelected(conversation) {
            this.conversation = conversation;
        }
        return ConversationSelected;
    }());
    exports.ConversationSelected = ConversationSelected;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/conversation.service',["require", "exports", 'aurelia-event-aggregator', 'aurelia-http-client', 'aurelia-framework', '../config/settings', './state', './helpers', '../model/message', '../events/conversationSelected', '../events/conversationJoined'], function (require, exports, aurelia_event_aggregator_1, aurelia_http_client_1, aurelia_framework_1, settings_1, state_1, helpers_1, message_1, conversationSelected_1, conversationJoined_1) {
    "use strict";
    var ConversationService = (function () {
        function ConversationService(http, settings, state, helpers, ea) {
            this.http = http;
            this.settings = settings;
            this.state = state;
            this.helpers = helpers;
            this.ea = ea;
        }
        ConversationService.prototype.showConversation = function (conversation, router) {
            this.currentConversation = conversation;
            this.helpers.setConverationTitle(conversation);
            this.ea.publish(conversationSelected_1.ConversationSelected, new conversationSelected_1.ConversationSelected(conversation));
            router.navigateToRoute('conversation', { id: conversation.title });
        };
        ConversationService.prototype.sendMessage = function (conversation, message) {
            var _this = this;
            var m = new message_1.Message();
            m.conversationId = conversation.id;
            m.from = this.state.userName;
            m.text = message;
            if (conversation.id) {
                return new Promise(function (resolve, reject) {
                    _this.http.post(_this.settings.chatAPI, {
                        to: conversation.id,
                        text: message
                    })
                        .then(function (response) {
                        conversation.messages.unshift(m);
                        resolve(m);
                    })
                        .catch(function (error) { return reject(_this.helpers.getError(error)); });
                });
            }
            else {
                var attendee_1;
                conversation.attendees.forEach(function (a) {
                    if (a.userId !== _this.state.userName) {
                        attendee_1 = a;
                    }
                });
                return new Promise(function (resolve, reject) {
                    _this.http.post(_this.settings.convAPI, {
                        to: attendee_1.userId,
                        text: message
                    })
                        .then(function (response) {
                        conversation.id = response.content;
                        _this.ea.publish(new conversationJoined_1.ConversationJoined(conversation));
                        conversation.messages.unshift(m);
                        resolve(m);
                    })
                        .catch(function (error) { return reject(_this.helpers.getError(error)); });
                });
            }
        };
        ConversationService.prototype.getConversations = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.http.get(_this.settings.chatAPI)
                    .then(function (response) {
                    if (response.response) {
                        var data = response.content;
                        if (data) {
                            resolve(data);
                            return;
                        }
                    }
                    resolve(null);
                })
                    .catch(function (error) { return reject(new Error('The service is down')); });
            });
        };
        ConversationService = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_http_client_1.HttpClient, settings_1.Settings, state_1.State, helpers_1.Helpers, aurelia_event_aggregator_1.EventAggregator])
        ], ConversationService);
        return ConversationService;
    }());
    exports.ConversationService = ConversationService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/contact',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', '../services/conversation.service', '../model/user', '../model/conversation', '../model/attendee', '../events/conversationSelected'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_router_1, conversation_service_1, user_1, conversation_1, attendee_1, conversationSelected_1) {
    "use strict";
    var Contact = (function () {
        function Contact(service, state, ea, router) {
            this.service = service;
            this.state = state;
            this.ea = ea;
            this.router = router;
        }
        Contact.prototype.select = function () {
            if (!this.user.conversation) {
                var conversation = new conversation_1.Conversation();
                var attendees = new Array();
                var attendee = new attendee_1.Attendee();
                attendee.userId = this.user.id;
                attendees.push(attendee);
                conversation.attendees = attendees;
                conversation.messages = new Array();
                this.user.conversation = conversation;
            }
            this.service.showConversation(this.user.conversation, this.router);
        };
        Contact.prototype.attached = function () {
            var _this = this;
            this.conversationSelectedSubscription = this.ea.subscribe(conversationSelected_1.ConversationSelected, function (e) {
                var conv = e.conversation;
                var attendees = conv.attendees;
                _this.isSelected = false;
                if (attendees.length == 2) {
                    attendees.forEach(function (a) {
                        if (a.userId !== _this.state.userName && a.userId === _this.user.id) {
                            _this.isSelected = true;
                        }
                    });
                }
            });
        };
        Contact.prototype.detached = function () {
            this.conversationSelectedSubscription.dispose();
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', user_1.User)
        ], Contact.prototype, "user", void 0);
        Contact = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [conversation_service_1.ConversationService, Object, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
        ], Contact);
        return Contact;
    }());
    exports.Contact = Contact;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/conversation-component',["require", "exports", 'aurelia-framework', 'aurelia-router', '../services/conversation.service'], function (require, exports, aurelia_framework_1, aurelia_router_1, conversation_service_1) {
    "use strict";
    var ConversationComponent = (function () {
        function ConversationComponent(service, router) {
            this.service = service;
            this.router = router;
        }
        ConversationComponent.prototype.activate = function (params, routeConfig) {
            if (!params) {
                delete this.service.currentConversation;
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
            this.service.sendMessage(this.conversation, this.message);
            this.conversation.messages.unshift();
            this.message = '';
        };
        ConversationComponent = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [conversation_service_1.ConversationService, aurelia_router_1.Router])
        ], ConversationComponent);
        return ConversationComponent;
    }());
    exports.ConversationComponent = ConversationComponent;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/conversation-list',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', '../services/chat.service', '../services/conversation.service', '../services/state', '../events/conversationJoined', '../events/userDisconnected', '../events/connectionStateChanged'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, chat_service_1, conversation_service_1, state_1, conversationJoined_1, userDisconnected_1, connectionStateChanged_1) {
    "use strict";
    var ConversationList = (function () {
        function ConversationList(service, state, ea) {
            this.service = service;
            this.state = state;
            this.ea = ea;
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
                conversations.forEach(function (c) { return _this.setConversationTitle(c); });
                _this.conversations = conversations;
                _this.userDisconnectedSubscription = _this.ea.subscribe(userDisconnected_1.UserDisconnected, function (e) {
                    _this.conversations.forEach(function (c) {
                        var attendees = c.attendees;
                        if (attendees.length === 2) {
                            attendees.forEach(function (a) {
                                var user = e.user;
                                if (user.isRemoved && a.userId === user.id) {
                                    var index = _this.conversations.indexOf(c);
                                    var conversation = _this.conversations[index];
                                    _this.conversations.splice(index, 1);
                                    if (_this.service.currentConversation === conversation) {
                                        delete _this.service.currentConversation;
                                    }
                                }
                            });
                        }
                    });
                });
                _this.conversationJoinedSubscription = _this.ea.subscribe(conversationJoined_1.ConversationJoined, function (e) {
                    var conversation = e.conversation;
                    _this.conversations.unshift(e.conversation);
                });
            });
        };
        ConversationList.prototype.setConversationTitle = function (conversation) {
            var _this = this;
            var title = '';
            conversation.attendees.forEach(function (attendee) {
                if (attendee && attendee.userId && attendee.userId !== _this.state.userName) {
                    title += attendee.userId + ' ';
                }
            });
            conversation.title = title.trim();
        };
        ConversationList = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [conversation_service_1.ConversationService, state_1.State, aurelia_event_aggregator_1.EventAggregator])
        ], ConversationList);
        return ConversationList;
    }());
    exports.ConversationList = ConversationList;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/conversation-preview',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', '../services/conversation.service', '../model/conversation', '../events/conversationSelected', '../events/messageReceived'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_router_1, conversation_service_1, conversation_1, conversationSelected_1, messageReceived_1) {
    "use strict";
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
            __metadata('design:type', conversation_1.Conversation)
        ], ConversationPreview.prototype, "conversation", void 0);
        ConversationPreview = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [conversation_service_1.ConversationService, aurelia_event_aggregator_1.EventAggregator, aurelia_router_1.Router])
        ], ConversationPreview);
        return ConversationPreview;
    }());
    exports.ConversationPreview = ConversationPreview;
});

define('model/changePassword',["require", "exports"], function (require, exports) {
    "use strict";
    var ChangePassword = (function () {
        function ChangePassword() {
        }
        return ChangePassword;
    }());
    exports.ChangePassword = ChangePassword;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('services/account.service',["require", "exports", 'aurelia-http-client', 'aurelia-framework', '../config/settings', './state', './helpers'], function (require, exports, aurelia_http_client_1, aurelia_framework_1, settings_1, state_1, helpers_1) {
    "use strict";
    var AccountService = (function () {
        function AccountService(http, settings, state, helpers) {
            this.http = http;
            this.settings = settings;
            this.state = state;
            this.helpers = helpers;
        }
        AccountService.prototype.changePassword = function (model) {
            var _this = this;
            if (this.state.isGuess) {
                return new Promise(function (resolve, reject) {
                    _this.http.post(_this.settings.accountdAPI + '/setpassword', model)
                        .then(function (response) {
                        _this.state.isGuess = false;
                        sessionStorage.setItem('userName', _this.state.userName);
                        resolve();
                    })
                        .catch(function (error) { return reject(_this.helpers.getError(error)); });
                });
            }
            else {
                return new Promise(function (resolve, reject) {
                    _this.http.put(_this.settings.accountdAPI + '/changepassword', model)
                        .then(function (response) { return resolve(); })
                        .catch(function (error) { return reject(_this.helpers.getError(error)); });
                });
            }
        };
        AccountService = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [aurelia_http_client_1.HttpClient, settings_1.Settings, state_1.State, helpers_1.Helpers])
        ], AccountService);
        return AccountService;
    }());
    exports.AccountService = AccountService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/account',["require", "exports", 'aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', 'aurelia-validation', 'aurelia-validation', '../services/chat.service', '../services/state', '../services/account.service', '../events/connectionStateChanged'], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, aurelia_validation_1, aurelia_validation_2, chat_service_1, state_1, account_service_1, connectionStateChanged_1) {
    "use strict";
    var Account = (function () {
        function Account(service, router, ea, state, controllerFactory) {
            this.service = service;
            this.router = router;
            this.ea = ea;
            this.state = state;
            this.userName = state.userName;
            this.isGuess = state.isGuess;
            this.controller = controllerFactory.createForCurrentScope();
        }
        Account.prototype.attached = function () {
            var _this = this;
            this.connectionStateSubscription = this.ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (e) {
                if (e.state === chat_service_1.ConnectionState.Connected) {
                    _this.isGuess = _this.state.isGuess;
                }
            });
        };
        Account.prototype.detached = function () {
            this.connectionStateSubscription.dispose();
        };
        Account.prototype.changePassword = function () {
            var _this = this;
            this.controller.validate();
            if (this.controller.errors.length === 0) {
                var model = {
                    oldPassword: this.oldPassword,
                    newPassword: this.newPassword,
                    confirmPassword: this.confirmPassword
                };
                this.service.changePassword(model)
                    .then(function () {
                    _this.isGuess = false;
                    _this.router.navigateToRoute('home');
                })
                    .catch(function (error) { return _this.errorMessage = error; });
            }
        };
        Account = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [account_service_1.AccountService, aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, state_1.State, aurelia_validation_2.ValidationControllerFactory])
        ], Account);
        return Account;
    }());
    exports.Account = Account;
    aurelia_validation_1.ValidationRules.customRule('matchesProperty', function (value, obj, otherPropertyName) {
        return value === null
            || value === undefined
            || value === ''
            || obj[otherPropertyName] === null
            || obj[otherPropertyName] === undefined
            || obj[otherPropertyName] === ''
            || value === obj[otherPropertyName];
    }, '${$displayName} must match ${$config.otherPropertyName}', function (otherPropertyName) { return ({ otherPropertyName: otherPropertyName }); });
    aurelia_validation_1.ValidationRules
        .ensure(function (a) { return a.confirmPassword; })
        .displayName('Confirm new password')
        .required()
        .satisfiesRule('matchesProperty', 'newPassword')
        .withMessage('Confirm new password must match New password')
        .ensure(function (a) { return a.newPassword; })
        .displayName("New password")
        .required()
        .matches(/(?=.*[A-Z])(?=.*[!@#$&\.\*\-\+\=\?£€])(?=.*[0-9])/)
        .withMessage('${$displayName} must contains at least one uppercase letter, one digit and one special charactere.')
        .minLength(6)
        .on(Account);
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/confirm',["require", "exports", 'aurelia-framework', 'aurelia-router', 'aurelia-validation', 'aurelia-validation', '../services/login.service', '../services/state', '../services/helpers'], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_validation_1, aurelia_validation_2, login_service_1, state_1, helpers_1) {
    "use strict";
    var Confirm = (function () {
        function Confirm(service, router, state, helpers, controllerFactory) {
            this.service = service;
            this.router = router;
            this.state = state;
            this.helpers = helpers;
            this.controller = controllerFactory.createForCurrentScope();
            this.provider = this.helpers.getUrlParameter('p');
            this.userName = this.helpers.getUrlParameter('u');
            window.history.replaceState(null, null, '/');
        }
        Confirm.prototype.confirm = function () {
            var _this = this;
            this.controller.validate()
                .then(function () {
                _this.service.confirm(_this.userName)
                    .then(function () {
                    _this.router.navigateToRoute('home');
                })
                    .catch(function (e) {
                    if (e.name === 'NullInfo') {
                        _this.router.navigateToRoute('login');
                    }
                    else {
                        _this.error = e;
                    }
                });
            })
                .catch(function (e) { return _this.error = e; });
        };
        Confirm = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [login_service_1.LoginService, aurelia_router_1.Router, state_1.State, helpers_1.Helpers, aurelia_validation_2.ValidationControllerFactory])
        ], Confirm);
        return Confirm;
    }());
    exports.Confirm = Confirm;
    aurelia_validation_1.ValidationRules
        .ensure(function (c) { return c.userName; })
        .satisfies(function (value, obj) { return obj.service.exists(value); })
        .withMessage('This user name already exists, please choose another one');
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/home',["require", "exports", 'aurelia-framework', 'aurelia-router', 'aurelia-event-aggregator', '../services/chat.service', '../services/login.service', '../events/connectionStateChanged'], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_event_aggregator_1, chat_service_1, login_service_1, connectionStateChanged_1) {
    "use strict";
    var Home = (function () {
        function Home(chatService, loginService, config, ea) {
            this.chatService = chatService;
            this.loginService = loginService;
            this.config = config;
            this.ea = ea;
        }
        Home.prototype.configureRouter = function (config, router) {
            config.map([
                { route: ['', 'conversation/:id'], name: 'conversation', moduleId: '../components/conversation-component' }
            ]);
            this.router = router;
        };
        Home.prototype.attached = function () {
            var _this = this;
            this.connectionStateSubscription = this.ea.subscribe(connectionStateChanged_1.ConnectionStateChanged, function (e) {
                _this.setIsDisconnected(e.state);
            });
            this.setIsDisconnected(this.chatService.currentState);
            if (this.chatService.currentState !== chat_service_1.ConnectionState.Connected) {
                this.chatService.start();
            }
        };
        Home.prototype.detached = function () {
            this.connectionStateSubscription.dispose();
        };
        Home.prototype.setIsDisconnected = function (state) {
            if (state === chat_service_1.ConnectionState.Error) {
                this.loginService.logoff();
            }
            if (state === chat_service_1.ConnectionState.Disconnected) {
                this.isDisconnected = true;
            }
            else {
                this.isDisconnected = false;
            }
        };
        Home = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [chat_service_1.ChatService, login_service_1.LoginService, aurelia_router_1.RouterConfiguration, aurelia_event_aggregator_1.EventAggregator])
        ], Home);
        return Home;
    }());
    exports.Home = Home;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/login',["require", "exports", 'aurelia-framework', 'aurelia-router', '../services/login.service', '../config/settings'], function (require, exports, aurelia_framework_1, aurelia_router_1, login_service_1, settings_1) {
    "use strict";
    var Login = (function () {
        function Login(service, router, settings) {
            this.service = service;
            this.router = router;
            var location = window.location;
            this.externalLogin = settings.apiBaseUrl +
                settings.accountdAPI +
                '/externalLogin?returnUrl=' +
                encodeURIComponent(location.protocol + '//' + location.host);
        }
        Login.prototype.login = function (userName) {
            var _this = this;
            this.service.login(userName, null)
                .then(function () {
                _this.router.navigateToRoute('home');
            })
                .catch(function (error) {
                _this.error = error;
            });
        };
        Login.prototype.activate = function () {
            var _this = this;
            this.service.getXhrf(true)
                .then(function (t) {
                return _this.token = t;
            })
                .catch(function (e) {
                return _this.error = e;
            });
        };
        Login = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [login_service_1.LoginService, aurelia_router_1.Router, settings_1.Settings])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('aurelia-validation/validate-binding-behavior',["require", "exports", 'aurelia-dependency-injection', 'aurelia-pal', 'aurelia-task-queue', './validation-controller', './validate-trigger'], function (require, exports, aurelia_dependency_injection_1, aurelia_pal_1, aurelia_task_queue_1, validation_controller_1, validate_trigger_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated.
     */
    var ValidateBindingBehavior = (function () {
        function ValidateBindingBehavior(taskQueue) {
            this.taskQueue = taskQueue;
        }
        /**
        * Gets the DOM element associated with the data-binding. Most of the time it's
        * the binding.target but sometimes binding.target is an aurelia custom element,
        * or custom attribute which is a javascript "class" instance, so we need to use
        * the controller's container to retrieve the actual DOM element.
        */
        ValidateBindingBehavior.prototype.getTarget = function (binding, view) {
            var target = binding.target;
            // DOM element
            if (target instanceof Element) {
                return target;
            }
            // custom element or custom attribute
            for (var i = 0, ii = view.controllers.length; i < ii; i++) {
                var controller = view.controllers[i];
                if (controller.viewModel === target) {
                    var element = controller.container.get(aurelia_pal_1.DOM.Element);
                    if (element) {
                        return element;
                    }
                    throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
                }
            }
            throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
        };
        ValidateBindingBehavior.prototype.bind = function (binding, source, rulesOrController, rules) {
            var _this = this;
            // identify the target element.
            var target = this.getTarget(binding, source);
            // locate the controller.
            var controller;
            if (rulesOrController instanceof validation_controller_1.ValidationController) {
                controller = rulesOrController;
            }
            else {
                controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
                rules = rulesOrController;
            }
            if (controller === null) {
                throw new Error("A ValidationController has not been registered.");
            }
            controller.registerBinding(binding, target, rules);
            binding.validationController = controller;
            if (controller.validateTrigger === validate_trigger_1.validateTrigger.change) {
                binding.standardUpdateSource = binding.updateSource;
                binding.updateSource = function (value) {
                    this.standardUpdateSource(value);
                    this.validationController.validateBinding(this);
                };
            }
            else if (controller.validateTrigger === validate_trigger_1.validateTrigger.blur) {
                binding.validateBlurHandler = function () {
                    _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
                };
                binding.validateTarget = target;
                target.addEventListener('blur', binding.validateBlurHandler);
            }
            if (controller.validateTrigger !== validate_trigger_1.validateTrigger.manual) {
                binding.standardUpdateTarget = binding.updateTarget;
                binding.updateTarget = function (value) {
                    this.standardUpdateTarget(value);
                    this.validationController.resetBinding(this);
                };
            }
        };
        ValidateBindingBehavior.prototype.unbind = function (binding) {
            // reset the binding to it's original state.
            if (binding.standardUpdateSource) {
                binding.updateSource = binding.standardUpdateSource;
                binding.standardUpdateSource = null;
            }
            if (binding.standardUpdateTarget) {
                binding.updateTarget = binding.standardUpdateTarget;
                binding.standardUpdateTarget = null;
            }
            if (binding.validateBlurHandler) {
                binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
                binding.validateBlurHandler = null;
                binding.validateTarget = null;
            }
            binding.validationController.unregisterBinding(binding);
            binding.validationController = null;
        };
        ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateBindingBehavior;
    }());
    exports.ValidateBindingBehavior = ValidateBindingBehavior;
});

define('aurelia-validation/validation-controller',["require", "exports", './validator', './validate-trigger', './property-info', './validation-error'], function (require, exports, validator_1, validate_trigger_1, property_info_1, validation_error_1) {
    "use strict";
    /**
     * Orchestrates validation.
     * Manages a set of bindings, renderers and objects.
     * Exposes the current list of validation errors for binding purposes.
     */
    var ValidationController = (function () {
        function ValidationController(validator) {
            this.validator = validator;
            // Registered bindings (via the validate binding behavior)
            this.bindings = new Map();
            // Renderers that have been added to the controller instance.
            this.renderers = [];
            /**
             * Errors that have been rendered by the controller.
             */
            this.errors = [];
            /**
             *  Whether the controller is currently validating.
             */
            this.validating = false;
            // Elements related to errors that have been rendered.
            this.elements = new Map();
            // Objects that have been added to the controller instance (entity-style validation).
            this.objects = new Map();
            /**
             * The trigger that will invoke automatic validation of a property used in a binding.
             */
            this.validateTrigger = validate_trigger_1.validateTrigger.blur;
            // Promise that resolves when validation has completed.
            this.finishValidating = Promise.resolve();
        }
        /**
         * Adds an object to the set of objects that should be validated when validate is called.
         * @param object The object.
         * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
         */
        ValidationController.prototype.addObject = function (object, rules) {
            this.objects.set(object, rules);
        };
        /**
         * Removes an object from the set of objects that should be validated when validate is called.
         * @param object The object.
         */
        ValidationController.prototype.removeObject = function (object) {
            this.objects.delete(object);
            this.processErrorDelta('reset', this.errors.filter(function (error) { return error.object === object; }), []);
        };
        /**
         * Adds and renders a ValidationError.
         */
        ValidationController.prototype.addError = function (message, object, propertyName) {
            var error = new validation_error_1.ValidationError({}, message, object, propertyName);
            this.processErrorDelta('validate', [], [error]);
            return error;
        };
        /**
         * Removes and unrenders a ValidationError.
         */
        ValidationController.prototype.removeError = function (error) {
            if (this.errors.indexOf(error) !== -1) {
                this.processErrorDelta('reset', [error], []);
            }
        };
        /**
         * Adds a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.addRenderer = function (renderer) {
            var _this = this;
            this.renderers.push(renderer);
            renderer.render({
                kind: 'validate',
                render: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); }),
                unrender: []
            });
        };
        /**
         * Removes a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.removeRenderer = function (renderer) {
            var _this = this;
            this.renderers.splice(this.renderers.indexOf(renderer), 1);
            renderer.render({
                kind: 'reset',
                render: [],
                unrender: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); })
            });
        };
        /**
         * Registers a binding with the controller.
         * @param binding The binding instance.
         * @param target The DOM element.
         * @param rules (optional) rules associated with the binding. Validator implementation specific.
         */
        ValidationController.prototype.registerBinding = function (binding, target, rules) {
            this.bindings.set(binding, { target: target, rules: rules });
        };
        /**
         * Unregisters a binding with the controller.
         * @param binding The binding instance.
         */
        ValidationController.prototype.unregisterBinding = function (binding) {
            this.resetBinding(binding);
            this.bindings.delete(binding);
        };
        /**
         * Interprets the instruction and returns a predicate that will identify
         * relevant errors in the list of rendered errors.
         */
        ValidationController.prototype.getInstructionPredicate = function (instruction) {
            if (instruction) {
                var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
                var predicate_1;
                if (instruction.propertyName) {
                    predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
                }
                else {
                    predicate_1 = function (x) { return x.object === object_1; };
                }
                // todo: move to Validator interface:
                if (rules_1 && rules_1.indexOf) {
                    return function (x) { return predicate_1(x) && rules_1.indexOf(x.rule) !== -1; };
                }
                return predicate_1;
            }
            else {
                return function () { return true; };
            }
        };
        /**
         * Validates and renders errors.
         * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
         */
        ValidationController.prototype.validate = function (instruction) {
            var _this = this;
            // Get a function that will process the validation instruction.
            var execute;
            if (instruction) {
                var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
                // if rules were not specified, check the object map.
                rules_2 = rules_2 || this.objects.get(object_2);
                // property specified?
                if (instruction.propertyName === undefined) {
                    // validate the specified object.
                    execute = function () { return _this.validator.validateObject(object_2, rules_2); };
                }
                else {
                    // validate the specified property.
                    execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
                }
            }
            else {
                // validate all objects and bindings.
                execute = function () {
                    var promises = [];
                    for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                        var _b = _a[_i], object = _b[0], rules = _b[1];
                        promises.push(_this.validator.validateObject(object, rules));
                    }
                    for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                        var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                        var _f = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _f.object, propertyName = _f.propertyName;
                        if (_this.objects.has(object)) {
                            continue;
                        }
                        promises.push(_this.validator.validateProperty(object, propertyName, rules));
                    }
                    return Promise.all(promises).then(function (errorSets) { return errorSets.reduce(function (a, b) { return a.concat(b); }, []); });
                };
            }
            // Wait for any existing validation to finish, execute the instruction, render the errors.
            this.validating = true;
            var result = this.finishValidating
                .then(execute)
                .then(function (newErrors) {
                var predicate = _this.getInstructionPredicate(instruction);
                var oldErrors = _this.errors.filter(predicate);
                _this.processErrorDelta('validate', oldErrors, newErrors);
                if (result === _this.finishValidating) {
                    _this.validating = false;
                }
                return newErrors;
            })
                .catch(function (error) {
                // recover, to enable subsequent calls to validate()
                _this.validating = false;
                _this.finishValidating = Promise.resolve();
                return Promise.reject(error);
            });
            this.finishValidating = result;
            return result;
        };
        /**
         * Resets any rendered errors (unrenders).
         * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
         */
        ValidationController.prototype.reset = function (instruction) {
            var predicate = this.getInstructionPredicate(instruction);
            var oldErrors = this.errors.filter(predicate);
            this.processErrorDelta('reset', oldErrors, []);
        };
        /**
         * Gets the elements associated with an object and propertyName (if any).
         */
        ValidationController.prototype.getAssociatedElements = function (_a) {
            var object = _a.object, propertyName = _a.propertyName;
            var elements = [];
            for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
                var _c = _b[_i], binding = _c[0], target = _c[1].target;
                var _d = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), o = _d.object, p = _d.propertyName;
                if (o === object && p === propertyName) {
                    elements.push(target);
                }
            }
            return elements;
        };
        ValidationController.prototype.processErrorDelta = function (kind, oldErrors, newErrors) {
            // prepare the instruction.
            var instruction = {
                kind: kind,
                render: [],
                unrender: []
            };
            // create a shallow copy of newErrors so we can mutate it without causing side-effects.
            newErrors = newErrors.slice(0);
            // create unrender instructions from the old errors.
            var _loop_1 = function(oldError) {
                // get the elements associated with the old error.
                var elements = this_1.elements.get(oldError);
                // remove the old error from the element map.
                this_1.elements.delete(oldError);
                // create the unrender instruction.
                instruction.unrender.push({ error: oldError, elements: elements });
                // determine if there's a corresponding new error for the old error we are unrendering.
                var newErrorIndex = newErrors.findIndex(function (x) { return x.rule === oldError.rule && x.object === oldError.object && x.propertyName === oldError.propertyName; });
                if (newErrorIndex === -1) {
                    // no corresponding new error... simple remove.
                    this_1.errors.splice(this_1.errors.indexOf(oldError), 1);
                }
                else {
                    // there is a corresponding new error...        
                    var newError = newErrors.splice(newErrorIndex, 1)[0];
                    // get the elements that are associated with the new error.
                    var elements_1 = this_1.getAssociatedElements(newError);
                    this_1.elements.set(newError, elements_1);
                    // create a render instruction for the new error.
                    instruction.render.push({ error: newError, elements: elements_1 });
                    // do an in-place replacement of the old error with the new error.
                    // this ensures any repeats bound to this.errors will not thrash.
                    this_1.errors.splice(this_1.errors.indexOf(oldError), 1, newError);
                }
            };
            var this_1 = this;
            for (var _i = 0, oldErrors_1 = oldErrors; _i < oldErrors_1.length; _i++) {
                var oldError = oldErrors_1[_i];
                _loop_1(oldError);
            }
            // create render instructions from the remaining new errors.
            for (var _a = 0, newErrors_1 = newErrors; _a < newErrors_1.length; _a++) {
                var error = newErrors_1[_a];
                var elements = this.getAssociatedElements(error);
                instruction.render.push({ error: error, elements: elements });
                this.elements.set(error, elements);
                this.errors.push(error);
            }
            // render.
            for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
                var renderer = _c[_b];
                renderer.render(instruction);
            }
        };
        /**
        * Validates the property associated with a binding.
        */
        ValidationController.prototype.validateBinding = function (binding) {
            if (!binding.isBound) {
                return;
            }
            var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
            var registeredBinding = this.bindings.get(binding);
            var rules = registeredBinding ? registeredBinding.rules : undefined;
            this.validate({ object: object, propertyName: propertyName, rules: rules });
        };
        /**
        * Resets the errors for a property associated with a binding.
        */
        ValidationController.prototype.resetBinding = function (binding) {
            var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
            this.reset({ object: object, propertyName: propertyName });
        };
        ValidationController.inject = [validator_1.Validator];
        return ValidationController;
    }());
    exports.ValidationController = ValidationController;
});

define('aurelia-validation/validator',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var Validator = (function () {
        function Validator() {
        }
        return Validator;
    }());
    exports.Validator = Validator;
});

define('aurelia-validation/validate-trigger',["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * Validation triggers.
    */
    exports.validateTrigger = {
        /**
        * Validate the binding when the binding's target element fires a DOM "blur" event.
        */
        blur: 'blur',
        /**
        * Validate the binding when it updates the model due to a change in the view.
        * Not specific to DOM "change" events.
        */
        change: 'change',
        /**
        * Manual validation.  Use the controller's `validate()` and  `reset()` methods
        * to validate all bindings.
        */
        manual: 'manual'
    };
});

define('aurelia-validation/property-info',["require", "exports", 'aurelia-binding'], function (require, exports, aurelia_binding_1) {
    "use strict";
    function getObject(expression, objectExpression, source) {
        var value = objectExpression.evaluate(source, null);
        if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
            return value;
        }
        if (value === null) {
            value = 'null';
        }
        else if (value === undefined) {
            value = 'undefined';
        }
        throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object.");
    }
    /**
     * Retrieves the object and property name for the specified expression.
     * @param expression The expression
     * @param source The scope
     */
    function getPropertyInfo(expression, source) {
        var originalExpression = expression;
        while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
            expression = expression.expression;
        }
        var object;
        var propertyName;
        if (expression instanceof aurelia_binding_1.AccessScope) {
            object = source.bindingContext;
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessMember) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessKeyed) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.key.evaluate(source);
        }
        else {
            throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
        }
        return { object: object, propertyName: propertyName };
    }
    exports.getPropertyInfo = getPropertyInfo;
});

define('aurelia-validation/validation-error',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A validation error.
     */
    var ValidationError = (function () {
        /**
         * @param rule The rule associated with the error. Validator implementation specific.
         * @param message The error message.
         * @param object The invalid object
         * @param propertyName The name of the invalid property. Optional.
         */
        function ValidationError(rule, message, object, propertyName) {
            if (propertyName === void 0) { propertyName = null; }
            this.rule = rule;
            this.message = message;
            this.object = object;
            this.propertyName = propertyName;
            this.id = ValidationError.nextId++;
        }
        ValidationError.prototype.toString = function () {
            return this.message;
        };
        ValidationError.nextId = 0;
        return ValidationError;
    }());
    exports.ValidationError = ValidationError;
});

define('aurelia-validation/validation-controller-factory',["require", "exports", './validation-controller'], function (require, exports, validation_controller_1) {
    "use strict";
    /**
     * Creates ValidationController instances.
     */
    var ValidationControllerFactory = (function () {
        function ValidationControllerFactory(container) {
            this.container = container;
        }
        ValidationControllerFactory.get = function (container) {
            return new ValidationControllerFactory(container);
        };
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        ValidationControllerFactory.prototype.create = function () {
            return this.container.invoke(validation_controller_1.ValidationController);
        };
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        ValidationControllerFactory.prototype.createForCurrentScope = function () {
            var controller = this.create();
            this.container.registerInstance(validation_controller_1.ValidationController, controller);
            return controller;
        };
        return ValidationControllerFactory;
    }());
    exports.ValidationControllerFactory = ValidationControllerFactory;
    ValidationControllerFactory['protocol:aurelia:resolver'] = true;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-validation/validation-errors-custom-attribute',["require", "exports", 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-templating', './validation-controller'], function (require, exports, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_templating_1, validation_controller_1) {
    "use strict";
    var ValidationErrorsCustomAttribute = (function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
            this.boundaryElement = boundaryElement;
            this.controllerAccessor = controllerAccessor;
            this.errors = [];
        }
        ValidationErrorsCustomAttribute.prototype.sort = function () {
            this.errors.sort(function (a, b) {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
            });
        };
        ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
            var _this = this;
            return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
        };
        ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
            var _loop_1 = function(error) {
                var index = this_1.errors.findIndex(function (x) { return x.error === error; });
                if (index !== -1) {
                    this_1.errors.splice(index, 1);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var error = _a[_i].error;
                _loop_1(error);
            }
            for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
                var _d = _c[_b], error = _d.error, elements = _d.elements;
                var targets = this.interestingElements(elements);
                if (targets.length) {
                    this.errors.push({ error: error, targets: targets });
                }
            }
            this.sort();
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.bind = function () {
            this.controllerAccessor().addRenderer(this);
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.unbind = function () {
            this.controllerAccessor().removeRenderer(this);
        };
        ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
        ValidationErrorsCustomAttribute = __decorate([
            aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
        ], ValidationErrorsCustomAttribute);
        return ValidationErrorsCustomAttribute;
    }());
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});

define('aurelia-validation/validation-renderer-custom-attribute',["require", "exports", './validation-controller'], function (require, exports, validation_controller_1) {
    "use strict";
    var ValidationRendererCustomAttribute = (function () {
        function ValidationRendererCustomAttribute() {
        }
        ValidationRendererCustomAttribute.prototype.created = function (view) {
            this.container = view.container;
        };
        ValidationRendererCustomAttribute.prototype.bind = function () {
            this.controller = this.container.get(validation_controller_1.ValidationController);
            this.renderer = this.container.get(this.value);
            this.controller.addRenderer(this.renderer);
        };
        ValidationRendererCustomAttribute.prototype.unbind = function () {
            this.controller.removeRenderer(this.renderer);
            this.controller = null;
            this.renderer = null;
        };
        return ValidationRendererCustomAttribute;
    }());
    exports.ValidationRendererCustomAttribute = ValidationRendererCustomAttribute;
});

define('aurelia-validation/implementation/rules',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Sets, unsets and retrieves rules on an object or constructor function.
     */
    var Rules = (function () {
        function Rules() {
        }
        /**
         * Applies the rules to a target.
         */
        Rules.set = function (target, rules) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
        };
        /**
         * Removes rules from a target.
         */
        Rules.unset = function (target) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            target[Rules.key] = null;
        };
        /**
         * Retrieves the target's rules.
         */
        Rules.get = function (target) {
            return target[Rules.key] || null;
        };
        /**
         * The name of the property that stores the rules.
         */
        Rules.key = '__rules__';
        return Rules;
    }());
    exports.Rules = Rules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/standard-validator',["require", "exports", 'aurelia-templating', '../validator', '../validation-error', './rules', './validation-messages'], function (require, exports, aurelia_templating_1, validator_1, validation_error_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var StandardValidator = (function (_super) {
        __extends(StandardValidator, _super);
        function StandardValidator(messageProvider, resources) {
            _super.call(this);
            this.messageProvider = messageProvider;
            this.lookupFunctions = resources.lookupFunctions;
            this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
        }
        StandardValidator.prototype.getMessage = function (rule, object, value) {
            var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
            var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
            if (displayName === null && propertyName !== null) {
                displayName = this.messageProvider.getDisplayName(propertyName);
            }
            var overrideContext = {
                $displayName: displayName,
                $propertyName: propertyName,
                $value: value,
                $object: object,
                $config: rule.config,
                $getDisplayName: this.getDisplayName
            };
            return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
        };
        StandardValidator.prototype.validate = function (object, propertyName, rules) {
            var _this = this;
            var errors = [];
            // rules specified?
            if (!rules) {
                // no. locate the rules via metadata.
                rules = rules_1.Rules.get(object);
            }
            // any rules?
            if (!rules) {
                return Promise.resolve(errors);
            }
            // are we validating all properties or a single property?
            var validateAllProperties = propertyName === null || propertyName === undefined;
            var addError = function (rule, value) {
                var message = _this.getMessage(rule, object, value);
                errors.push(new validation_error_1.ValidationError(rule, message, object, rule.property.name));
            };
            // validate each rule.
            var promises = [];
            var _loop_1 = function(i) {
                var rule = rules[i];
                // is the rule related to the property we're validating.
                if (!validateAllProperties && rule.property.name !== propertyName) {
                    return "continue";
                }
                // is this a conditional rule? is the condition met?
                if (rule.when && !rule.when(object)) {
                    return "continue";
                }
                // validate.
                var value = rule.property.name === null ? object : object[rule.property.name];
                var promiseOrBoolean = rule.condition(value, object);
                if (promiseOrBoolean instanceof Promise) {
                    promises.push(promiseOrBoolean.then(function (isValid) {
                        if (!isValid) {
                            addError(rule, value);
                        }
                    }));
                    return "continue";
                }
                if (!promiseOrBoolean) {
                    addError(rule, value);
                }
            };
            for (var i = 0; i < rules.length; i++) {
                _loop_1(i);
            }
            if (promises.length === 0) {
                return Promise.resolve(errors);
            }
            return Promise.all(promises).then(function () { return errors; });
        };
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
            return this.validate(object, propertyName, rules || null);
        };
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateObject = function (object, rules) {
            return this.validate(object, null, rules || null);
        };
        StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
        return StandardValidator;
    }(validator_1.Validator));
    exports.StandardValidator = StandardValidator;
});

define('aurelia-validation/implementation/validation-messages',["require", "exports", './validation-parser'], function (require, exports, validation_parser_1) {
    "use strict";
    /**
     * Dictionary of validation messages. [messageKey]: messageExpression
     */
    exports.validationMessages = {
        /**
         * The default validation message. Used with rules that have no standard message.
         */
        default: "${$displayName} is invalid.",
        required: "${$displayName} is required.",
        matches: "${$displayName} is not correctly formatted.",
        email: "${$displayName} is not a valid email.",
        minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        equals: "${$displayName} must be ${$config.expectedValue}.",
    };
    /**
     * Retrieves validation messages and property display names.
     */
    var ValidationMessageProvider = (function () {
        function ValidationMessageProvider(parser) {
            this.parser = parser;
        }
        /**
         * Returns a message binding expression that corresponds to the key.
         * @param key The message key.
         */
        ValidationMessageProvider.prototype.getMessage = function (key) {
            var message;
            if (key in exports.validationMessages) {
                message = exports.validationMessages[key];
            }
            else {
                message = exports.validationMessages['default'];
            }
            return this.parser.parseMessage(message);
        };
        /**
         * When a display name is not provided, this method is used to formulate
         * a display name using the property name.
         * Override this with your own custom logic.
         * @param propertyName The property name.
         */
        ValidationMessageProvider.prototype.getDisplayName = function (propertyName) {
            // split on upper-case letters.
            var words = propertyName.split(/(?=[A-Z])/).join(' ');
            // capitalize first letter.
            return words.charAt(0).toUpperCase() + words.slice(1);
        };
        ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
        return ValidationMessageProvider;
    }());
    exports.ValidationMessageProvider = ValidationMessageProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/validation-parser',["require", "exports", 'aurelia-binding', 'aurelia-templating', './util', 'aurelia-logging'], function (require, exports, aurelia_binding_1, aurelia_templating_1, util_1, LogManager) {
    "use strict";
    var ValidationParser = (function () {
        function ValidationParser(parser, bindinqLanguage) {
            this.parser = parser;
            this.bindinqLanguage = bindinqLanguage;
            this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
            this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
            this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
            this.cache = {};
        }
        ValidationParser.prototype.coalesce = function (part) {
            // part === null || part === undefined ? '' : part
            return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
        };
        ValidationParser.prototype.parseMessage = function (message) {
            if (this.cache[message] !== undefined) {
                return this.cache[message];
            }
            var parts = this.bindinqLanguage.parseInterpolation(null, message);
            if (parts === null) {
                return new aurelia_binding_1.LiteralString(message);
            }
            var expression = new aurelia_binding_1.LiteralString(parts[0]);
            for (var i = 1; i < parts.length; i += 2) {
                expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
            }
            MessageExpressionValidator.validate(expression, message);
            this.cache[message] = expression;
            return expression;
        };
        ValidationParser.prototype.getAccessorExpression = function (fn) {
            var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
            var arrow = /^[$_\w\d]+\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
            var match = classic.exec(fn) || arrow.exec(fn);
            if (match === null) {
                throw new Error("Unable to parse accessor function:\n" + fn);
            }
            return this.parser.parse(match[1]);
        };
        ValidationParser.prototype.parseProperty = function (property) {
            var accessor;
            if (util_1.isString(property)) {
                accessor = this.parser.parse(property);
            }
            else {
                accessor = this.getAccessorExpression(property.toString());
            }
            if (accessor instanceof aurelia_binding_1.AccessScope
                || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                return {
                    name: accessor.name,
                    displayName: null
                };
            }
            throw new Error("Invalid subject: \"" + accessor + "\"");
        };
        ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
        return ValidationParser;
    }());
    exports.ValidationParser = ValidationParser;
    var MessageExpressionValidator = (function (_super) {
        __extends(MessageExpressionValidator, _super);
        function MessageExpressionValidator(originalMessage) {
            _super.call(this, []);
            this.originalMessage = originalMessage;
        }
        MessageExpressionValidator.validate = function (expression, originalMessage) {
            var visitor = new MessageExpressionValidator(originalMessage);
            expression.accept(visitor);
        };
        MessageExpressionValidator.prototype.visitAccessScope = function (access) {
            if (access.ancestor !== 0) {
                throw new Error('$parent is not permitted in validation message expressions.');
            }
            if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
                LogManager.getLogger('aurelia-validation')
                    .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
            }
        };
        return MessageExpressionValidator;
    }(aurelia_binding_1.Unparser));
    exports.MessageExpressionValidator = MessageExpressionValidator;
});

define('aurelia-validation/implementation/util',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
    exports.isString = isString;
});

define('aurelia-validation/implementation/validation-rules',["require", "exports", './util', './rules', './validation-messages'], function (require, exports, util_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Part of the fluent rule API. Enables customizing property rules.
     */
    var FluentRuleCustomizer = (function () {
        function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parser) {
            if (config === void 0) { config = {}; }
            this.fluentEnsure = fluentEnsure;
            this.fluentRules = fluentRules;
            this.parser = parser;
            this.rule = {
                property: property,
                condition: condition,
                config: config,
                when: null,
                messageKey: 'default',
                message: null
            };
            this.fluentEnsure.rules.push(this.rule);
        }
        /**
         * Specifies the key to use when looking up the rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessageKey = function (key) {
            this.rule.messageKey = key;
            this.rule.message = null;
            return this;
        };
        /**
         * Specifies rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessage = function (message) {
            this.rule.messageKey = 'custom';
            this.rule.message = this.parser.parseMessage(message);
            return this;
        };
        /**
         * Specifies a condition that must be met before attempting to validate the rule.
         * @param condition A function that accepts the object as a parameter and returns true
         * or false whether the rule should be evaluated.
         */
        FluentRuleCustomizer.prototype.when = function (condition) {
            this.rule.when = condition;
            return this;
        };
        /**
         * Tags the rule instance, enabling the rule to be found easily
         * using ValidationRules.taggedRules(rules, tag)
         */
        FluentRuleCustomizer.prototype.tag = function (tag) {
            this.rule.tag = tag;
            return this;
        };
        ///// FluentEnsure APIs /////
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentRuleCustomizer.prototype.ensure = function (subject) {
            return this.fluentEnsure.ensure(subject);
        };
        /**
         * Targets an object with validation rules.
         */
        FluentRuleCustomizer.prototype.ensureObject = function () {
            return this.fluentEnsure.ensureObject();
        };
        Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
            /**
             * Rules that have been defined using the fluent API.
             */
            get: function () {
                return this.fluentEnsure.rules;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentRuleCustomizer.prototype.on = function (target) {
            return this.fluentEnsure.on(target);
        };
        ///////// FluentRules APIs /////////
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
            return this.fluentRules.satisfies(condition, config);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
            var _a;
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRuleCustomizer.prototype.required = function () {
            return this.fluentRules.required();
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.matches = function (regex) {
            return this.fluentRules.matches(regex);
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.email = function () {
            return this.fluentRules.email();
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.minLength = function (length) {
            return this.fluentRules.minLength(length);
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxLength = function (length) {
            return this.fluentRules.maxLength(length);
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.minItems = function (count) {
            return this.fluentRules.minItems(count);
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxItems = function (count) {
            return this.fluentRules.maxItems(count);
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.equals = function (expectedValue) {
            return this.fluentRules.equals(expectedValue);
        };
        return FluentRuleCustomizer;
    }());
    exports.FluentRuleCustomizer = FluentRuleCustomizer;
    /**
     * Part of the fluent rule API. Enables applying rules to properties and objects.
     */
    var FluentRules = (function () {
        function FluentRules(fluentEnsure, parser, property) {
            this.fluentEnsure = fluentEnsure;
            this.parser = parser;
            this.property = property;
        }
        /**
         * Sets the display name of the ensured property.
         */
        FluentRules.prototype.displayName = function (name) {
            this.property.displayName = name;
            return this;
        };
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRules.prototype.satisfies = function (condition, config) {
            return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parser);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRules.prototype.satisfiesRule = function (name) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var rule = FluentRules.customRules[name];
            if (!rule) {
                // standard rule?
                rule = this[name];
                if (rule instanceof Function) {
                    return rule.call.apply(rule, [this].concat(args));
                }
                throw new Error("Rule with name \"" + name + "\" does not exist.");
            }
            var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
            return this.satisfies(function (value, obj) { return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args)); var _a; }, config)
                .withMessageKey(name);
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRules.prototype.required = function () {
            return this.satisfies(function (value) {
                return value !== null
                    && value !== undefined
                    && !(util_1.isString(value) && !/\S/.test(value));
            }).withMessageKey('required');
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.matches = function (regex) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
                .withMessageKey('matches');
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.email = function () {
            return this.matches(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/)
                .withMessageKey('email');
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.minLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
                .withMessageKey('minLength');
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.maxLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
                .withMessageKey('maxLength');
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.minItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
                .withMessageKey('minItems');
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.maxItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
                .withMessageKey('maxItems');
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.equals = function (expectedValue) {
            return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
                .withMessageKey('equals');
        };
        FluentRules.customRules = {};
        return FluentRules;
    }());
    exports.FluentRules = FluentRules;
    /**
     * Part of the fluent rule API. Enables targeting properties and objects with rules.
     */
    var FluentEnsure = (function () {
        function FluentEnsure(parser) {
            this.parser = parser;
            /**
             * Rules that have been defined using the fluent API.
             */
            this.rules = [];
        }
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentEnsure.prototype.ensure = function (property) {
            this.assertInitialized();
            return new FluentRules(this, this.parser, this.parser.parseProperty(property));
        };
        /**
         * Targets an object with validation rules.
         */
        FluentEnsure.prototype.ensureObject = function () {
            this.assertInitialized();
            return new FluentRules(this, this.parser, { name: null, displayName: null });
        };
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentEnsure.prototype.on = function (target) {
            rules_1.Rules.set(target, this.rules);
            return this;
        };
        FluentEnsure.prototype.assertInitialized = function () {
            if (this.parser) {
                return;
            }
            throw new Error("Did you forget to add \".plugin('aurelia-validation)\" to your main.js?");
        };
        return FluentEnsure;
    }());
    exports.FluentEnsure = FluentEnsure;
    /**
     * Fluent rule definition API.
     */
    var ValidationRules = (function () {
        function ValidationRules() {
        }
        ValidationRules.initialize = function (parser) {
            ValidationRules.parser = parser;
        };
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        ValidationRules.ensure = function (property) {
            return new FluentEnsure(ValidationRules.parser).ensure(property);
        };
        /**
         * Targets an object with validation rules.
         */
        ValidationRules.ensureObject = function () {
            return new FluentEnsure(ValidationRules.parser).ensureObject();
        };
        /**
         * Defines a custom rule.
         * @param name The name of the custom rule. Also serves as the message key.
         * @param condition The rule function.
         * @param message The message expression
         * @param argsToConfig A function that maps the rule's arguments to a "config" object that can be used when evaluating the message expression.
         */
        ValidationRules.customRule = function (name, condition, message, argsToConfig) {
            validation_messages_1.validationMessages[name] = message;
            FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
        };
        /**
         * Returns rules with the matching tag.
         * @param rules The rules to search.
         * @param tag The tag to search for.
         */
        ValidationRules.taggedRules = function (rules, tag) {
            return rules.filter(function (r) { return r.tag === tag; });
        };
        /**
         * Removes the rules from a class or object.
         * @param target A class or object.
         */
        ValidationRules.off = function (target) {
            rules_1.Rules.unset(target);
        };
        return ValidationRules;
    }());
    exports.ValidationRules = ValidationRules;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./css/site.css\"></require>\r\n    <div class=\"navbar navbar-default navbar-fixed-top\">\r\n        <div class=\"container\">\r\n            <div class=\"navbar-header\">\r\n                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\r\n                    <span class=\"icon-bar menu\"></span>\r\n                    <span class=\"icon-bar menu\"></span>\r\n                    <span class=\"icon-bar menu\"></span>\r\n                </button>\r\n                <a class=\"navbar-brand title\" href=\"/\">chatle</a>\r\n            </div>\r\n            <div class=\"navbar-collapse collapse\">\r\n                <ul class=\"nav navbar-nav\" if.bind=\"isConnected\">\r\n                    <li click.delegate=\"manage()\"><a>Welcom ${userName}!</a></li>\r\n                    <li click.delegate=\"logoff()\"><a>Log off</a></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"container body-content\">\r\n        <div if.bind=\"errorMessage\" class=\"text-danger\">\r\n            <ul>\r\n                <li>${errorMessage}</li>\r\n            </ul>\r\n        </div>\r\n        <router-view></router-view>\r\n    </div>\r\n    <footer>\r\n        <p>&copy; 2016 - chatle</p>\r\n    </footer>\r\n</template>\r\n"; });
define('text!css/site.css', ['module'], function(module) { module.exports = "html {\r\n    font-family: cursive\r\n}\r\n/* Move down content because we have a fixed navbar that is 50px tall */\r\nbody.chatle {\r\n    padding-top: 50px;\r\n    padding-bottom: 20px;\r\n}\r\n\r\n/* Wrapping element */\r\n/* Set some basic padding to keep content from hitting the edges */\r\n.body-content {\r\n    padding-left: 15px;\r\n    padding-right: 15px;\r\n}\r\n\r\n.navbar.navbar-default {\r\n    background-color: #000;\r\n}\r\n\r\n.title.navbar-brand:focus,\r\n.title.navbar-brand:hover,\r\n.nav.navbar-nav > li > a:hover {\r\n    color: #fff;    \r\n}\r\n\r\nli:hover {\r\n    cursor: pointer;\r\n}\r\n\r\n/* Set widths on the form inputs since otherwise they're 100% wide */\r\ninput,\r\nselect,\r\ntextarea {\r\n    max-width: 280px;\r\n}\r\n\r\nul\r\n{\r\n    padding-left: 0;\r\n    list-style-type: none;\r\n}\r\n\r\nsmall {\r\n    color: #666666;\r\n}\r\n\r\n/* Responsive: Portrait tablets and up */\r\n@media screen and (min-width: 768px) {\r\n    .jumbotron {\r\n        margin-top: 20px;\r\n    }\r\n\r\n    .body-content {\r\n        padding: 0;\r\n    }\r\n}\r\n\r\n.list-group-item {\r\n    border: 0;\r\n    padding: 0;\r\n}\r\n\r\n.list-group-item.active {    \r\n    background-color: #ddd;\r\n    color: #808080\r\n}\r\n\r\n.list-group-item.active:hover {    \r\n    background-color: #eee;\r\n    color: #666;\r\n}"; });
define('text!components/contact-list.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./contact\"></require>\r\n  <div class=\"contact-list\">\r\n    <span if.bind=\"!users\">${loadingMessage}</span>\r\n    <ul class=\"list-group\" if.bind=\"users\">\r\n      <contact repeat.for=\"user of users\" user.bind=\"user\"></contact>\r\n    </ul>\r\n  </div>\r\n</template>"; });
define('text!css/site.min.css', ['module'], function(module) { module.exports = "html{font-family:cursive}body{padding-top:50px;padding-bottom:20px}.console{font-family:'Lucida Console',Monaco,monospace}.body-content{padding-left:15px;padding-right:15px}.navbar.navbar-default{background-color:#fff}.nav.navbar-nav>li>a:hover,.title.navbar-brand:focus,.title.navbar-brand:hover{color:#222}input,select,textarea{max-width:280px}ul{padding-left:0;list-style-type:none}small{color:#666}@media screen and (min-width:768px){.jumbotron{margin-top:20px}.body-content{padding:0}}"; });
define('text!components/contact.html', ['module'], function(module) { module.exports = "<template>\r\n    <li class=\"list-group-item ${isSelected ? 'active' : ''}\" click.delegate=\"select()\"><a>${user.id}</a></li>\r\n</template>"; });
define('text!components/conversation-component.html', ['module'], function(module) { module.exports = "<template>\r\n    <div if.bind=\"conversation\">\r\n        <h6>${conversation.title}</h6>\r\n        <form class=\"form-inline\">\r\n            <input class=\"form-control\" value.bind=\"message\" placeholder=\"message...\">\r\n            <button type=\"submit\" class=\"btn btn-default\" click.delegate=\"sendMessage()\" disabled.bind=\"!message\">send</button>\r\n        </form>\r\n        <ul>\r\n            <li repeat.for=\"message of conversation.messages\">\r\n                <small>${message.from}</small><br />\r\n                <span>${message.text}</span>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n    <h1 if.bind=\"!conversation\">WELCOME TO THIS REALLY SIMPLE CHAT</h1>\r\n</template>"; });
define('text!components/conversation-list.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./conversation-preview\"></require>\r\n  <div class=\"conversation-list\">\r\n    <ul class=\"list-group\">\r\n      <conversation-preview repeat.for=\"conversation of conversations\" conversation.bind=\"conversation\"></conversation-preview>\r\n    </ul>\r\n  </div>\r\n</template>"; });
define('text!components/conversation-preview.html', ['module'], function(module) { module.exports = "<template>\r\n  <li class=\"list-group-item ${isSelected ? 'active' : ''}\" click.delegate=\"select()\">\r\n    <a>${conversation.title}</a><br/>\r\n    <span>${lastMessage}</span>\r\n  </li>\r\n</template>"; });
define('text!pages/account.html', ['module'], function(module) { module.exports = "<template>\r\n    <h2>Manage Account.</h2>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <p>You're logged in as <strong>${userName}</strong>.</p>\r\n            <form class=\"form-horizontal\">\r\n                <h4 if.bind=\"!isGuess\">Change Password Form</h4>\r\n                <h4 if.bind=\"isGuess\">Create Password Form</h4>\r\n                <hr>\r\n                <div if.bind=\"errorMessage\" class=\"text-danger\">\r\n                    <ul>\r\n                        <li>${errorMessage}</li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"form-group\" if.bind=\"!isGuess\">\r\n                    <label class=\"col-md-2 control-label\" for=\"oldPassword\">Current password</label>\r\n                    <div class=\"col-md-10\">\r\n                        <input class=\"form-control\" type=\"password\" id=\"oldPassword\" value.bind=\"model.oldPassword\" />\t\t\t\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\" validation-errors.bind=\"newPasswordErrors\" class.bind=\"newPasswordErrors.length ? 'has-error' : ''\">\r\n                    <label class=\"col-md-2 control-label\" for=\"newPassword\">New password</label>\t\r\n                    <div class=\"col-md-10\">\r\n                        <input class=\"form-control\" type=\"password\" name=\"newPassword\" value.bind=\"newPassword & validate\" change.delegate=\"confirmPassword = ''\"/>\r\n                    </div>\r\n                    <span class=\"help-block\" repeat.for=\"errorInfo of newPasswordErrors\">\r\n                        ${errorInfo.error.message}\r\n                    <span>\r\n                </div>\r\n                <div class=\"form-group\" validation-errors.bind=\"confirmPasswordErrors\" class.bind=\"confirmPasswordErrors.length ? 'has-error' : ''\">\r\n                    <label class=\"col-md-2 control-label\" for=\"confirmPassword\">Confirm new password</label>\r\n                    <div class=\"col-md-10\">\r\n                        <input class=\"form-control\" type=\"password\" name=\"confirmPassword\" value.bind=\"confirmPassword & validate\" />\r\n                    </div>\r\n                    <span class=\"help-block\" repeat.for=\"errorInfo of confirmPasswordErrors\">\r\n                        ${errorInfo.error.message}\r\n                    <span>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <div class=\"col-md-offset-2 col-md-10\">\r\n                        <input class=\"btn btn-default\" type=\"submit\" value=\"Change password\" click.delegate=\"changePassword()\" disabled.bind=\"controller.errors.length > 0\"/>\r\n                    </div>\r\n                </div>\r\n            </form>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!pages/confirm.html', ['module'], function(module) { module.exports = "<template>\r\n\t<h3>Associate your ${provider} account.</h3>\r\n\r\n\t<form class=\"form-horizontal\" submit.delegate=\"confirm()\">\r\n\t\t<h4>Association Form</h4>\r\n\t\t<hr />\r\n\t\t<div class=\"text-danger\">${error.message}</div>\r\n\r\n\t\t<p class=\"text-info\">\r\n\t\t\tYou've successfully authenticated with <strong>${provider}</strong>. Please enter a user name for this site below and\r\n\t\t\tclick the Register button to finish logging in.\r\n\t\t</p>\r\n\t\t<div class=\"form-group\" validation-errors.bind=\"userNameErrors\" class.bind=\"userNameErrors.length ? 'has-error' : ''\">\r\n\t\t\t<label class=\"col-md-2 control-label\" for=\"UserName\">User name</label>\r\n\t\t\t<div class=\"col-md-10\">\r\n\t\t\t\t<input class=\"form-control\" name=\"UserName\" value.bind=\"userName & validate\" />\r\n\t\t\t\t<span class=\"help-block\" repeat.for=\"errorInfo of userNameErrors\">\r\n                    ${errorInfo.error.message}\r\n                <span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"form-group\">\r\n\t\t\t<div class=\"col-md-offset-2 col-md-10\">\r\n\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">Register</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</form>\r\n\r\n</template>"; });
define('text!pages/home.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../components/contact-list\"></require>\r\n    <require from=\"../components/conversation-list\"></require>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-3\">\r\n            <h6>CONVERSATION</h6>\r\n            <conversation-list></conversation-list>\r\n        </div>\r\n        <router-view class=\"col-xs-6\"></router-view>\r\n        <div class=\"col-xs-3\">\r\n            <h6>CONNECTED</h6>\r\n            <contact-list></contact-list>\r\n        </div>\r\n    </div>\r\n</template>"; });
define('text!pages/login.html', ['module'], function(module) { module.exports = "<template>\r\n\t<h2>Log in.</h2>\r\n\t<hr />\r\n\t<div class=\"col-xs-6\">\r\n\t\t<section>\r\n            <h4>Guess access.</h4>\r\n\t\t\t<hr>\r\n\t\t\t<form class=\"form-horizontal\">\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<label class=\"col-xs-3 control-label\" for=\"userName\"></label>\r\n\t\t\t\t\t<div class=\"col-xs-9\">\r\n\t\t\t\t\t\t<input class=\"form-control\" name=\"userName\" value.bind=\"userName\" change.delegate=\"delete error\" />\r\n\t\t\t\t\t\t<span class=\"text-danger\" if.bind=\"error\">${error.message}</span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<div class=\"col-xs-offset-3 col-xs-9\">\r\n\t\t\t\t\t\t<input type=\"submit\" value=\"Log in\" class=\"btn btn-default\" click.delegate=\"login(userName)\" />\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</form>\r\n\t\t</section>\r\n\t</div>\r\n\t<div class=\"col-xs-6\">\r\n\t\t<section>\r\n\t\t\t<h4>Use another service to log in.</h4>\r\n\t\t\t<hr>\r\n\t\t\t<form class=\"form-horizontal\" role=\"form\" method=\"post\" action.bind=\"externalLogin\" disabled.bind=\"token\">\r\n\t\t\t\t<div>\r\n\t\t\t\t\t<p>\r\n\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-default\" name=\"provider\" value=\"Microsoft\" title=\"Log in using your Microsoft account\">Microsoft</button>\r\n\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-default\" name=\"provider\" value=\"Google\" title=\"Log in using your Google account\">Google</button>\r\n\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-default\" name=\"provider\" value=\"Twitter\" title=\"Log in using your Twitter account\">Twitter</button>\r\n\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-default\" name=\"provider\" value=\"Facebook\" title=\"Log in using your Facebook account\">Facebook</button>\r\n\t\t\t\t\t</p>\r\n\t\t\t\t</div>\r\n\t\t\t\t<input name=\"__RequestVerificationToken\" type=\"hidden\" value.bind=\"token\"></form>\r\n\t\t</section>\r\n\t</div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map