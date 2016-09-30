import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { ChatService } from './chat.service';
import { Helpers } from './helpers';
import { State } from './state'

@autoinject
export class LoginService {
    constructor(private http: HttpClient, 
        private settings: Settings, 
        private chatService: ChatService,
        private state: State,
        private helpers: Helpers) { }

    login(userName: string, password: string): Promise<string> {
        this.state.isGuess = !password;

        return new Promise<string>((resolve, reject) => {
            if (this.state.isGuess) {
                this.http.post(this.settings.accountdAPI + '/spaguess', { userName: userName })
                    .then(response => {
                        this.state.userName = userName;
                        this.chatService.start();
                        // get a new token for the session lifecycle
                        this.setXhrf(resolve, reject);
                    })
                    .catch(error => {
                        reject(new Error(this.helpers.getErrorMessage(error)));
                    })
            } else {
                this.http.post(this.settings.accountdAPI + '/spalogin', { userName: userName, password: password })
                    .then(response => {
                        this.state.userName = userName;
                        sessionStorage.setItem('userName', userName);
                        this.chatService.start();
                        // get a new token for the session lifecycle
                        this.setXhrf(resolve, reject);
                    })
                    .catch(error => {
                        reject(new Error(this.helpers.getErrorMessage(error)));
                    })
            }
        });
    }

    logoff() {
        delete this.state.userName;
        sessionStorage.removeItem('userName');
        jQuery.connection.hub.stop();
        this.http.post(this.settings.accountdAPI + '/spalogoff', null);
    }

    setXhrf(resolve: Function, reject: Function) {
        this.http.get('xhrf')
            .then(r => {
                this.http.configure(builder => {
                    builder.withHeader('X-XSRF-TOKEN', r.response);
                });
                resolve();
            })
            .catch(error => reject(new Error('the service is down')));
    }
}