import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { ConnectionState } from '../services/chat.service';
import { State } from '../services/state';
import { AccountService } from '../services/account.service';
import { LoginService } from '../services/login.service';
import { ChangePassword } from '../model/changePassword';
import { ManageLogins } from '../model/manage-logins';
import { ConnectionStateChanged } from '../events/connectionStateChanged';
import { Settings } from '../config/settings';

@autoinject
export class Account {
    userName: string;
    errorMessage: string;
    logins: ManageLogins;
    externalLinkLogin: string;
    token: string;

    private connectionStateSubscription: Subscription;

    constructor(private accountService: AccountService, 
            private loginService: LoginService,
            private router: Router, 
            private ea: EventAggregator,
            private state: State,
            settings: Settings) { 
        this.userName = state.userName;
        this.externalLinkLogin = settings.apiBaseUrl + 
            settings.accountdAPI + 
            '/linklogin?returnUrl=' + 
            encodeURIComponent(location.protocol + '//' + location.host + '/manage');
    }

    remove(loginProvider: string, providerKey: string) {
        this.accountService.removeLogin(loginProvider, providerKey)
            .then(() => {
                let currentLogins = this.logins.currentLogins;
                const index = currentLogins.findIndex(value => value.loginProvider === loginProvider && value.providerKey === providerKey);
                currentLogins.splice(index, 1);
            })
            .catch((e: Error) => this.errorMessage = e.message);
    }

    attached() {
        this.connectionStateSubscription = this.ea.subscribe(ConnectionStateChanged, e => {
            if ((<ConnectionStateChanged>e).state === ConnectionState.Connected) {
                this.getLogins();
            }
        });
        
        this.getLogins();
    }

    detached() {
        this.connectionStateSubscription.dispose();
    }

    private getLogins() {
        this.loginService.getXhrf()            
            .then((token: string) => {
                    this.token = token;
                    this.accountService.getLogins()
                        .then((logins: ManageLogins) => this.logins = logins)
                        .catch((e: Error) => this.errorMessage = e.message);
                })
            .catch((e: Error) => this.errorMessage = e.message);
    }
}
