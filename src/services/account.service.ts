import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { State } from './state';
import { Helpers } from './helpers';
import { ManageLogins } from '../model/manage-logins'

import { ChangePassword } from '../model/changePassword';

@autoinject
export class AccountService {

    constructor(private http: HttpClient, 
        private settings: Settings,
        private state: State,
        private helpers: Helpers) { }

    getLogins(): Promise<ManageLogins> {
        return new Promise<ManageLogins>((resove, reject) => {
            this.http.get(this.settings.accountdAPI + '/logins')
                .then(response => {                    
                    resove(response.content as ManageLogins);
                })
                .catch(error => reject(new Error('The service is down')));
        });
    }

    removeLogin(loginProvider: string, providerKey: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete(this.settings.accountdAPI + '/sparemoveLogin?loginProvider=' + encodeURIComponent(loginProvider) + '&providerKey=' + encodeURIComponent(providerKey))
                .then(() => {
                    resolve();
                })
                .catch(e => reject(this.helpers.getError(e)));
        });
    }
}