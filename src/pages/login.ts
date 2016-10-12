import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { LoginService } from '../services/login.service';
import { Settings } from '../config/settings';

@autoinject
export class Login {
    userName: '';
    error: Error;
    externalLogin: string;
    token: string;
    
    constructor(private service: LoginService, private router: Router, settings: Settings) { 
        this.externalLogin = settings.apiBaseUrl + 
            settings.accountdAPI + 
            '/externalLogin?returnUrl=' + 
            encodeURIComponent(window.location.href + "/externalLogin");
    }

    login(userName: string) {        
        this.service.login(userName, this.password)
            .then(() => {
                this.router.navigateToRoute('home');
            })
            .catch((error: Error) => {
                this.error = error;
            });
    }

    activate() {
        this.service.getXhrf()
            .then(t => 
                this.token = t)
            .catch(e => 
                this.error = e);
    }
}