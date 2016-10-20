import { autoinject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { ValidationRules } from 'aurelia-validation';
import { ValidationControllerFactory, ValidationController } from 'aurelia-validation';

import { LoginService } from '../services/login.service';
import { Settings } from '../config/settings';
import { State } from '../services/state';
import { Helpers } from '../services/helpers';

@autoinject
export class Confirm {
    userName: string;
    error: Error;
    controller: ValidationController;
    provider: string;

    constructor(private service: LoginService,
        private router: Router,
        private state: State,
        private helpers: Helpers,
        controllerFactory: ValidationControllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.provider = this.helpers.getUrlParameter('p');
        this.userName = this.helpers.getUrlParameter('u');
        window.history.replaceState(null, null, '/');
    }

    confirm() {
        this.controller.validate()
            .then(() => {
                this.service.confirm(this.userName)
                    .then(() => {
                        this.router.navigateToRoute('home');
                    })
                    .catch((e: Error) => {
                        if (e.name === 'NullInfo') {
                            this.router.navigateToRoute('login');
                        } else {
                            this.error = e;
                        }
                    });
            })
            .catch(e => this.error = e);
    }
}

ValidationRules
    .ensure((c: Confirm) => c.userName)
    .satisfies((value, obj) => obj.service.exists(value))
    .withMessage('This user name already exists, please choose another one');