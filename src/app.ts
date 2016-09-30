import { autoinject } from 'aurelia-framework';
import { Router, Redirect, NavigationInstruction, RouterConfiguration, Next, RouteConfig } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import environment from './environment';

import { ConnectionState } from './services/chat.service';
import { LoginService } from './services/login.service';
import { State } from './services/state';
import { ConnectionStateChanged } from './events/connectionStateChanged';
import { Settings } from './config/settings';

interface CustomRouteConfig extends RouteConfig {
    anomymous: boolean;
}

@autoinject
export class App {
    router: Router;
    isConnected: boolean;
    userName: string;
    errorMessage: string;

    constructor(private service: LoginService, 
        private ea: EventAggregator,
        private state: State,
        settings: Settings) { 
        settings.apiBaseUrl = environment.apiBaseUrl;
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Chatle';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: 'pages/home', title: 'Home' },
            { route: 'account', name: 'account', moduleId: 'pages/account', title: 'Account' },
            { route: 'login', name: 'login', moduleId: 'pages/login', title: 'Login', anomymous: true }
        ]);

        this.router = router;
    }

    attached() {
        this.ea.subscribe(ConnectionStateChanged, e => {
            this.setIsConnected();
        });
        this.setIsConnected();
        this.service.setXhrf(() => {}, error => this.errorMessage = error);
    }

    logoff() {
        this.service.logoff();
    }

    manage() {
        this.router.navigateToRoute('account');
    }

    private setIsConnected() {
        this.isConnected = this.state.userName !== undefined && this.state.userName != null;
        this.userName = this.state.userName;
        if (!this.isConnected) {
            this.router.navigateToRoute('login');
        }
    }

}

@autoinject
class AuthorizeStep {

    constructor(private service: LoginService, private state: State) { }

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => {
            let route = i.config as CustomRouteConfig;
            return !route.anomymous;
        })) {
            var isLoggedIn = this.state.userName;
            if (!isLoggedIn) {
                return next.cancel(new Redirect('login'));
            }
        }

        return next();
    }
}