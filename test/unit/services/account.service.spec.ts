import { HttpClient } from 'aurelia-http-client';

import { Settings } from '../../../src/config/settings';
import { State } from '../../../src/services/state'
import { Helpers } from '../../../src/services/helpers'
import { AccountService } from '../../../src/services/account.service'

import { ChangePassword } from '../../../src/model/changePassword';

describe('account service specs', () => {
    let service: AccountService;
    let state: State;
    let http: HttpClient;

    beforeEach(() => {
        state = new State();
        http = new HttpClient();
        service = new AccountService(http, new Settings(), state, new Helpers(state));
    });
});