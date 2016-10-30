import { customElement, autoinject, bindable, bindingMode } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ValidationRules } from 'aurelia-validation';

import { LoginService } from '../services/login.service';
import { State } from '../services/state';

@autoinject
@customElement('user-name')
export class UserName {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    userName: string;
    controller: ValidationController;

    constructor(private service: LoginService, private state: State, controllerFactory: ValidationControllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.validateTrigger = 'change';
    }

    attached() {
        this.userName = this.state.userName;
    }

    userNameAvailable(value: string) {
        return new Promise<boolean>(resolve => {
            this.service.exists(value)
                .then(r => {
                    resolve(!r)
                    this.state.userName = value;
                });
        })
    }
}

ValidationRules
    .ensure((c: UserName) => c.userName)
    .satisfies((value, obj) => obj.userNameAvailable(value))
    .withMessage('This user name already exists, please choose another one')
    .satisfiesRule('required')
    .on(UserName);
