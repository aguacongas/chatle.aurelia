import { autoinject } from 'aurelia-framework';
import { Router, NavigationInstruction } from 'aurelia-router';
import { ValidationRules } from 'aurelia-validation';
import { ValidationControllerFactory, ValidationController} from 'aurelia-validation';

import { LoginService } from '../services/login.service';
import { Settings } from '../config/settings';

@autoinject
export class Confirm {
    userName: '';
    error: Error;
    controller: ValidationController;
    
    constructor(public service: LoginService, private router: Router, controllerFactory: ValidationControllerFactory) { 
        this.controller = controllerFactory.createForCurrentScope();
    }
}

ValidationRules
    .ensure((c: Confirm) => c.userName)
    .satisfies((value, obj) => obj.service.exists(value))
    .withMessage('This user name already exists, please choose another one');