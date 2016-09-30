import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { State } from './state'
import { Helpers } from './helpers'

import { ChangePassword } from '../model/changePassword';

@autoinject
export class AccountService {

    constructor(private http: HttpClient, 
        private settings: Settings,
        private state: State,
        private helpers: Helpers) { }

    changePassword(model: ChangePassword): Promise<any> {
        if (this.state.isGuess) {
            return new Promise<any>((resolve, reject) => {
                this.http.post(this.settings.accountdAPI + '/setpassword', model)
                    .then(response => {
                        this.state.isGuess = false;
                        sessionStorage.setItem('userName', this.state.userName)
                        resolve();
                    })
                    .catch(error => reject(new Error(this.helpers.getErrorMessage(error))));
            });
        } else {
            return new Promise<any>((resolve, reject) => {
                this.http.put(this.settings.accountdAPI + '/changepassword', model)
                    .then(response => resolve())
                    .catch(error => reject(new Error(this.helpers.getErrorMessage(error))));
            });
        }
    }

}