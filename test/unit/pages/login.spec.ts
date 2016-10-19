import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Router } from 'aurelia-router';

import { Login } from '../../../src/pages/login';
import { LoginService } from '../../../src/services/login.service';
import { Settings } from '../../../src/config/settings';

describe('Login page specs', () => {
    let component;
    let service: LoginService;
    let settings: Settings;
    let router: Router;

    beforeEach(() => {
        service = {
            getXhrf: (clearCookies?: Boolean) => {},
            login: (userName: string, password: string): Promise<string> => {
                return new Promise<string>((resolve, reject) => { });
            }
        } as LoginService;

        settings = {
            apiBaseUrl: 'test',
            accountdAPI: 'test'
        } as Settings;

        router = {
            navigateToRoute: route => {}
        } as Router;

        component = StageComponent
            .withResources('../../../src/pages/login')
            .inView('<login></login>');
    });

});