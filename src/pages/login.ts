import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { LoginService } from '../services/login.service';
import { Settings } from '../config/settings';
import { State } from '../services/state';

@autoinject
export class Login {
    error: Error;
    externalLogin: string;
    token: string;
    
    constructor(private service: LoginService, private router: Router, private state: State, settings: Settings) {
        let location = window.location; 
        this.externalLogin = settings.apiBaseUrl + 
            settings.accountdAPI + 
            '/externalLogin?returnUrl=' + 
            encodeURIComponent(location.protocol + '//' + location.host);
    }

    login() {        
        this.service.login(this.state.userName, null)
            .then(() => {
                this.router.navigateToRoute('home');
            })
            .catch((error: Error) => {
                this.error = error;
            });
    }

    activate() {
        this.service.getXhrf(true)
            .then(t => 
                this.token = t)
            .catch(e => 
                this.error = e);
    }
}