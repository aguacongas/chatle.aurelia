define(["require", "exports", "../../../src/services/helpers", "../../../src/services/state", "../../../src/model/serviceError"], function (require, exports, helpers_1, state_1, serviceError_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('helpers specs', function () {
        var state = new state_1.State();
        var service = new helpers_1.Helpers(state);
        it('getError should return an error with error message', function () {
            var serviceError = new serviceError_1.ServiceError();
            serviceError.errors = [
                { errorMessage: 'test' }
            ];
            var result = service.getError({
                content: [
                    serviceError
                ]
            });
            expect(result.message).toBe(serviceError.errors[0].errorMessage);
        });
        it('getUrlParameter should return the query string parameter value', function () {
            service.location = {
                search: '?test=value'
            };
            var result = service.getUrlParameter('test');
            expect(result).toBe('value');
        });
    });
});
//# sourceMappingURL=helpers.spec.js.map