import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { ChatService } from './chat.service';
import { Helpers } from './helpers';
import { State } from './state'

@autoinject
export class LoginService {
    private xhrf: string;
    constructor(private http: HttpClient,
        private settings: Settings,
        private chatService: ChatService,
        private state: State,
        private helpers: Helpers) { }

    getXhrf(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.xhrf) {
                resolve(this.xhrf);
            } else {
                this.setXhrf(resolve, reject);
            }
        });
    }

    login(userName: string, password: string): Promise<string> {
        this.state.isGuess = !password;

        return new Promise<string>((resolve, reject) => {
            this.getXhrf()
                .then(r => {
                    if (this.state.isGuess) {
                        this.loginAsGuess(userName, resolve, reject);
                    } else {
                        this.loginAsRegistered(userName, password, resolve, reject);
                    }
                })
                .catch(error => reject(new Error('the service is down')));
        });
    }

    logoff() {
        delete this.state.userName;
        delete this.xhrf;
        sessionStorage.removeItem('userName');
        this.chatService.stop();
        this.http.post(this.settings.accountdAPI + '/spalogoff', null);
    }

    private setXhrf(resolve: Function, reject: Function) {
        this.http.get('xhrf')
            .then(r => {
                this.xhrf = r.response
                this.http.configure(builder => {
                    builder.withHeader('X-XSRF-TOKEN', this.xhrf);
                });
                resolve();
            })
            .catch(error => reject(new Error('the service is down')));
    }

    private loginAsGuess(userName, resolve: Function, reject: Function) {
        this.http.post(this.settings.accountdAPI + '/spaguess', { userName: userName })
            .then(response => {
                this.state.userName = userName;
                this.chatService.start();
                // get a new token for the session lifecycle
                this.setXhrf(resolve, reject);
            })
            .catch(error => {
                reject(new Error(this.helpers.getErrorMessage(error)));
            });
    }

    private loginAsRegistered(userName: string, password: string, resolve: Function, reject: Function) {
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
}