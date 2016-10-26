import { Router, NavigationInstruction } from 'aurelia-router';

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
    let controllerFactory;

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
        controllerFactory = {
            createForCurrentScope: () => { }
        };

        spyOn(controllerFactory, 'createForCurrentScope')
            .and.returnValue({
                validate: () => {
                    return promise;
                }
            });
    });

    it('constructor should get url paratemeters', () => {
        // prepare
        spyOn(helpers, 'getUrlParameter');

        // act
        let page = new Confirm(service, router, helpers, state, controllerFactory);

        // verify
        expect(helpers.getUrlParameter).toHaveBeenCalledWith('p');
        expect(helpers.getUrlParameter).toHaveBeenCalledWith('u');
    });

    describe('confirm specs', () => {
        let page: Confirm;
        beforeEach(() => {
            page = new Confirm(service, router, helpers, state, controllerFactory);
        });

        describe('confirm should call service confirm', () => {
            // prepare
            let userName;

            beforeEach(() => {
                state.userName = userName;
                spyOn(service, 'confirm')
                    .and.returnValue(promise);

                // act
                page.confirm();
                resolveCallback();

                // verify
                expect(service.confirm).toHaveBeenCalledWith(userName);
            });

            it('and navigate to homme on success', () => {
                // prepare
                spyOn(router, 'navigateToRoute');

                // act
                resolveCallback();

                // verify
                expect(router.navigateToRoute).toHaveBeenCalledWith('home');
            });

            it('and navigate on to login NullInfo', () => {
                // prepare
                spyOn(router, 'navigateToRoute');
                let error = new Error('NullInfo');
                error.name = 'NullInfo';

                // act
                rejectCallback(error);

                // verify
                expect(router.navigateToRoute).toHaveBeenCalledWith('login');
            });

            it('and set error on others errors', () => {
                // prepare
                spyOn(router, 'navigateToRoute');
                let error = new Error('NullInfo');

                // act
                rejectCallback(error);

                // verify
                expect(page.error).toBe(error);
            });
        });

        it('confirm should set error on validation error', () => {
            state.userName = userName;
            spyOn(service, 'confirm')
                .and.returnValue(promise);
            let error = new Error('test');

            // act
            page.confirm();
            rejectCallback(error);

            // verify
            expect(page.error).toBe(error);
        })
    });
});
