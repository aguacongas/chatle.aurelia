import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { State } from './state'

import { User } from '../model/user';

@autoinject
export class UserService {

    constructor(private http: HttpClient, 
        private settings: Settings,
        private state: State) { }

    getUsers(): Promise<User[]> {
        return new Promise<User[]>((resolve, reject) => {
            this.http.get(this.settings.userAPI)
                .then(response => {
                        var data = response.content;
                        if (data && data.users) {
                            resolve(<User[]>data.users);
                        }
                    })
                .catch(error => reject(new Error('the service is down')));
        });
    }
}