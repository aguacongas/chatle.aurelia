import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ValidationRules } from 'aurelia-validation';

import { LoginService } from '../services/login.service';

@autoinject
export class UserName {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    userName: string;
    controller: ValidationController;

    constructor(private service: LoginService, controllerFactory: ValidationControllerFactory) { 
        this.controller = controllerFactory.createForCurrentScope();
    }

    userNameAvailable(value: string) {        
        return new Promise<boolean>(resolve => {
            this.service.exists(value)
                .then(r => resolve(!r));
        })
    }
}

ValidationRules
    .ensure((c: UserName) => c.userName)
    .satisfies((value, obj) => obj.userNameAvailable(value))
    .withMessage('This user name already exists, please choose another one')
    .on(UserName);
