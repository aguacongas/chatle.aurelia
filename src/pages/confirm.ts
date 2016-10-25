import { autoinject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { ValidationControllerFactory, ValidationController, ValidationRules } from 'aurelia-validation';

import { LoginService } from '../services/login.service';
import { Helpers } from '../services/helpers';
import { State } from '../services/state';

@autoinject
export class Confirm {
    error: Error;
    controller: ValidationController;
    provider: string;

    constructor(private service: LoginService,
        private router: Router,
        private helpers: Helpers,
        private state: State,
        controllerFactory: ValidationControllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.provider = this.helpers.getUrlParameter('p');
        window.history.replaceState(null, null, '/');
    }

    confirm() {
        this.controller.validate()
            .then(() => {
                this.service.confirm(this.state.userName)
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
