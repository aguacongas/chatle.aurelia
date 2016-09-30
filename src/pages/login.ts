import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { LoginService } from '../services/login.service';

@autoinject
export class Login {
    userName: '';
    password: '';
    error: Error;
    
    constructor(private service: LoginService, private router: Router) { }

    login() {        
        this.service.login(this.userName, this.password)
            .then(() => {
                this.router.navigateToRoute('home');
            })
            .catch((error: Error) => {
                this.error = error;
            });
    }
}