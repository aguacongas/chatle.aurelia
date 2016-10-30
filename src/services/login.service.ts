import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';

import { Settings } from '../config/settings';
import { ChatService } from './chat.service';
import { Helpers } from './helpers';
import { State } from './state';
import { Provider } from '../model/provider'

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

    login(userName: string): Promise<string> {
        this.state.isGuess = true;

        return new Promise<string>((resolve, reject) => {
            this.getXhrf()
                .then(r => {
                    if (this.state.isGuess) {
                        this.loginAsGuess(userName, resolve, reject);
                    }
                })
                .catch(error => reject(error));
        });
    }

    logoff() {
        if (!this.state.userName) {
            return;
        }
        
        this.chatService.stop();
        this.getXhrf()
            .then(r => { 
                this.http.post(this.settings.accountdAPI + '/spalogoff', null);                
            });

        this.xhrf = undefined;
        this.state.userName = undefined;
    }

    exists(userName): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!userName) {
                resolve(false);
                return;
            }

            this.getXhrf()
                .then(r => {
                    this.http.get(this.settings.accountdAPI + "/exists?userName=" + encodeURIComponent(userName))
                        .then(response => {
                            resolve(response.content);
                        })
                        .catch(error => {
                            this.manageError(error, reject, new Error('the service is down'));
                        });
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
                            sessionStorage.setItem('userName', userName);
                        })
                        .catch(error => this.manageError(error, reject, this.helpers.getError(error)));
                })
                .catch(error => reject(new Error('the service is down')));
        });
    }

    getExternalLoginProviders(): Promise<Array<Provider>> {
        return new Promise<Array<Provider>>((resolve, reject) => {
            this.getXhrf()
                .then(r => {
                    this.http.get(this.settings.accountdAPI + "/getExternalProviders")
                        .then(response => {
                            resolve(response.content as Array<Provider>);
                        })
                        .catch(error => this.manageError(error, reject, this.helpers.getError(error)));
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
                this.manageError(error, reject, this.helpers.getError(error));
            });
    }

    private logged(userName: string, resolve: Function, reject: Function) {
        this.state.userName = userName;
        // get a new token for the session lifecycle
        this.setXhrf(resolve, reject);
    }

    private manageError(error: HttpResponseMessage, reject: Function, exception: Error) {
        this.xhrf = undefined;
        reject(exception);        
    }
}