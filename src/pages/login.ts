import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { LoginService } from '../services/login.service';
import { Settings } from '../config/settings';

@autoinject
export class Login {
    userName: string;
    error: Error;
    externalLogin: string;
    token: string;
    
    constructor(private service: LoginService, private router: Router, settings: Settings) {
        let location = window.location; 
        this.externalLogin = settings.apiBaseUrl + 
            settings.accountdAPI + 
            '/externalLogin?returnUrl=' + 
            encodeURIComponent(location.protocol + '//' + location.host);
    }

    login(userName: string) {        
        this.service.login(userName, null)
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