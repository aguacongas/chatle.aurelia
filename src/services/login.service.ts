import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { ChatService } from './chat.service';
import { Helpers } from './helpers';
import { State } from './state';

@autoinject
export class LoginService {
    private xhrf: string;
    constructor(private http: HttpClient,
        private settings: Settings,
        private chatService: ChatService,
        private state: State,
        private helpers: Helpers) { }

    getXhrf(clearCookies?: Boolean): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (clearCookies) {
                this.http.get('cls')
                    .then(() => this.setXhrf(resolve, reject))
                    .catch(e => reject(new Error('the service is down')));
            } else if (this.xhrf) {
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
                .catch(error => reject(error));
        });
    }

    logoff() {
        delete this.state.userName;
        delete this.xhrf;
        sessionStorage.removeItem('userName');
        this.chatService.stop();
        this.getXhrf()
            .then(r => this.http.post(this.settings.accountdAPI + '/spalogoff', null));
    }

    exists(userName): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getXhrf()
                .then(r => {
                    this.http.get(this.settings.accountdAPI + "/exists")
                        .then(response => {
                            resolve(response.content);
                        })
                        .catch(error => reject(new Error('the service is down')));
                })
                .catch(error => reject(new Error('the service is down')));
        });
    }

    confirm(userName): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getXhrf()
                .then(r => {
                    this.http.put(this.settings.accountdAPI + "/spaExternalLoginConfirmation", { userName: userName })
                        .then(response => {
                            this.logged(userName, resolve, reject);
                        })
                        .catch(error => reject(this.helpers.getError(error)));
                })
                .catch(error => reject(new Error('the service is down')));
        });
    }

    private setXhrf(resolve: Function, reject: Function) {
        this.http.get('xhrf')
            .then(r => {
                this.xhrf = r.response
                this.http.configure(builder => {
                    builder.withHeader('X-XSRF-TOKEN', this.xhrf);
                });
                resolve(this.xhrf);
            })
            .catch(error => reject(new Error('the service is down')));
    }

    private loginAsGuess(userName, resolve: Function, reject: Function) {
        this.http.post(this.settings.accountdAPI + '/spaguess', { userName: userName })
            .then(response => {
                this.logged(userName, resolve, reject);
            })
            .catch(error => {
                reject(this.helpers.getError(error));
            });
    }

    private loginAsRegistered(userName: string, password: string, resolve: Function, reject: Function) {
        this.http.post(this.settings.accountdAPI + '/spalogin', { userName: userName, password: password })
            .then(response => {
                this.logged(userName, resolve, reject);
                sessionStorage.setItem('userName', userName);
            })
            .catch(error => {
                reject(this.helpers.getError(error));
            })
    }

    private logged(userName: string, resolve: Function, reject: Function) {
        this.state.userName = userName;
        this.chatService.start();
        // get a new token for the session lifecycle
        this.setXhrf(resolve, reject);
    }
}