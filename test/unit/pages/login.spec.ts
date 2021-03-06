import { Router } from 'aurelia-router';

import { Login } from '../../../src/pages/login';
import { LoginService } from '../../../src/services/login.service';
import { State } from '../../../src/services/state';
import { Settings } from '../../../src/config/settings';
import environment from '../../../src/environment';
import * as TestDouble from 'testdouble';

describe('Login page specs', () => {
    let service: LoginService;
    let settings: Settings;
    let router: Router;
    let state: State;

    let page: Login;
    let resolveCallback: (value?: string) => void;
    let rejectCallback: (error?: any) => void;
    let promise: Promise<string>;

    beforeEach(() => {
        promise = {
            then: r => {
                resolveCallback = r;
                return {
                    catch: error => {
                        rejectCallback = error;
                    }
                }
            }
        } as Promise<string>;

        TestDouble.reset();

        service = TestDouble.object(LoginService);
        TestDouble.when(service.getXhrf()).thenReturn(promise);
        TestDouble.when(service.login(TestDouble.matchers.isA(type => type instanceof String))).thenReturn(promise);
        TestDouble.when(service.logoff()).thenDo(() => {});
        TestDouble.when(service.getExternalLoginProviders()).thenReturn(promise);

        settings = {
            apiBaseUrl: 'test',
            accountdAPI: 'test'
        } as Settings;

        router = {
            navigateToRoute: route => { }
        } as Router;

        state = new State;

        page = new Login(service, router, state, settings);
    });

    it('constructor should set externalLogin', () => {
        // prepare
        settings.apiBaseUrl = 'http://base/test';
        settings.accountdAPI = 'test';

        // act
        page = new Login(service, router, state, settings);

        // verify
        expect(page.externalLogin).toBeDefined();
        expect(page.externalLogin).not.toBeNull();
        expect(page.externalLogin).toContain(settings.apiBaseUrl + settings.accountdAPI);
    });

    it('login should navigate to homme on login success', () => {
        // prepare
        spyOn(service, 'login')
            .and.returnValue(promise);
        spyOn(router, 'navigateToRoute');
        state.userName = 'test';

        // act
        page.login();
        resolveCallback('OK');

        // verify
        expect(service.login).toHaveBeenCalledWith('test');
        expect(router.navigateToRoute).toHaveBeenCalledWith('home');
    });

    it('login should set error on login error', () => {
        // prepare
        let expected = new Error('test');
        state.userName = 'test';
        
        // act
        page.login();
        rejectCallback(expected);

        // verify
        expect(page.error).toBe(expected);
    });

    it('activate set token on get xhrf success', () => {
        // prepare
        spyOn(service, 'getXhrf')
            .and.returnValue(promise);

        // act
        page.activate();
        resolveCallback('token');

        // verify
        expect(service.getXhrf).toHaveBeenCalledWith(true);
        expect(page.token).toBe('token');
    });

    it('activate set error on get xhrf error', () => {
        // prepare
        let expected = new Error('test');

        // act
        page.activate();
        rejectCallback(expected);

        // verify
        expect(page.error).toBe(expected);
    });
});
