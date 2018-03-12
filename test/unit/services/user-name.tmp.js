define(["require", "exports", "aurelia-testing", "aurelia-bootstrapper"], function (require, exports, aurelia_testing_1, aurelia_bootstrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('user-name component specs', function () {
        var component;
        beforeEach(function () {
            component = aurelia_testing_1.StageComponent
                .withResources('components/user-name')
                .inView('<user-name userName.bind="firstName"></user-namet>')
                .boundTo({ firstName: 'Test' });
        });
        it('should render first name', function (done) {
            component.create(aurelia_bootstrapper_1.bootstrap).then(function () {
                var nameElement = document.querySelector('.form-control');
                expect(nameElement.attributes['value']).toBe('Test');
                done();
            });
        });
        afterEach(function () {
            component.dispose();
        });
    });
});
//# sourceMappingURL=user-name.tmp.js.map