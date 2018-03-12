define(["require", "exports", "aurelia-http-client", "../../../src/config/settings", "../../../src/services/state", "../../../src/services/helpers", "../../../src/services/account.service"], function (require, exports, aurelia_http_client_1, settings_1, state_1, helpers_1, account_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('account service specs', function () {
        var service;
        var state;
        var http;
        beforeEach(function () {
            state = new state_1.State();
            http = new aurelia_http_client_1.HttpClient();
            service = new account_service_1.AccountService(http, new settings_1.Settings(), state, new helpers_1.Helpers(state));
        });
    });
});
//# sourceMappingURL=account.service.spec.js.map