import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { LoginService } from '../services/login.service';
import { Settings } from '../config/settings';
import { State } from '../services/state';
import { Provider } from '../model/provider';
import environment from '../environment';

@autoinject
export class Login {
    error: Error;
    externalLogin: string;
    token: string;
    providers: Array<Provider>;
    
    constructor(private service: LoginService, private router: Router, private state: State, settings: Settings) {
        let location = window.location; 
        this.externalLogin = settings.apiBaseUrl + 
            settings.accountdAPI + 
            '/externalLogin?returnUrl=' + 
            encodeURIComponent(location.protocol + '//' + location.host + environment.redirectPath);
    }

    login() {        
        this.service.login(this.state.userName)
            .then(() => {
                this.router.navigateToRoute('home');
            })
            .catch((error: Error) => {
                this.error = error;
            });
    }

    activate() {
        this.service.logoff();
        this.service.getXhrf(true)
            .then(t => {
                this.token = t;
                this.service.getExternalLoginProviders()
                    .then(providers => this.providers = providers)
                    .catch(e => this.error = e);
            })
            .catch(e => 
                this.error = e);
    }

    
}