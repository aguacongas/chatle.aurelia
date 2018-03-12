var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-validation", "../services/login.service", "../services/state"], function (require, exports, aurelia_framework_1, aurelia_validation_1, login_service_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserName = (function () {
        function UserName(service, state, controllerFactory) {
            this.service = service;
            this.state = state;
            this.controller = controllerFactory.createForCurrentScope();
            this.controller.validateTrigger = 'change';
        }
        UserName.prototype.attached = function () {
            this.userName = this.state.userName;
        };
        UserName.prototype.userNameAvailable = function (value) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.service.exists(value)
                    .then(function (r) {
                    resolve(!r);
                    _this.state.userName = value;
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], UserName.prototype, "userName", void 0);
        UserName = __decorate([
            aurelia_framework_1.autoinject,
            aurelia_framework_1.customElement('user-name'),
            __metadata("design:paramtypes", [login_service_1.LoginService, state_1.State, aurelia_validation_1.ValidationControllerFactory])
        ], UserName);
        return UserName;
    }());
    exports.UserName = UserName;
    aurelia_validation_1.ValidationRules
        .ensure(function (c) { return c.userName; })
        .satisfies(function (value, obj) { return obj.userNameAvailable(value); })
        .withMessage('This user name already exists, please choose another one')
        .satisfiesRule('required')
        .on(UserName);
});
//# sourceMappingURL=user-name.js.map