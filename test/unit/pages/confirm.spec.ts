import { Aurelia } from 'aurelia-framework'
import { Router, NavigationInstruction } from 'aurelia-router';
import { ValidationRules } from 'aurelia-validation';
import { ValidationControllerFactory, ValidationController } from 'aurelia-validation';

import { Confirm } from '../../../src/pages/confirm';
import { LoginService } from '../../../src/services/login.service';
import { Settings } from '../../../src/config/settings';
import { State } from '../../../src/services/state';
import { Helpers } from '../../../src/services/helpers';

describe('confirm page spec', () => {
    let service: LoginService;
    let router: Router;
    let state: State;
    let helpers: Helpers;
    let controllerFactory: ValidationControllerFactory;

    let userName;
    let promise;
    let resolveCallback;
    let rejectCallback;

    beforeEach(() => {
        promise = {
            then: r => {
                resolveCallback = r;
                return {
                    catch: e => {
                        rejectCallback = e;
                    }
                }
            }
        };

        service = {
            confirm: u => {
                userName = u;
                return promise;
            }
        } as LoginService;

        router = {
            navigateToRoute: r => { }
        } as Router;

        state = new State();
        helpers = new Helpers(state);
        spyOn(helpers, 'getUrlParameter')
        controllerFactory = new ValidationControllerFactory(null);
        spyOn(controllerFactory, 'createForCurrentScope')
            .and.returnValue({
                validate: () => {
                    return promise;
                }
            });
        let aurelia = new Aurelia();
        aurelia.use.plugin('aurelia-validation');
    });

    it('constructor should get url paratemeters', () => {
        // prepare
        spyOn(helpers, 'getUrlParameter');

        // act
        let page = new Confirm(service, router, state, helpers, controllerFactory);

        // verify
        expect(helpers.getUrlParameter).toHaveBeenCalledWith('p');
        expect(helpers.getUrlParameter).toHaveBeenCalledWith('u');
    })
});