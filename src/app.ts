import { autoinject } from 'aurelia-framework';
import { Router, Redirect, NavigationInstruction, RouterConfiguration, Next, RouteConfig } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import environment from './environment';

import { ConnectionState } from './services/chat.service';
import { LoginService } from './services/login.service';
import { State } from './services/state';
import { ConnectionStateChanged } from './events/connectionStateChanged';
import { Settings } from './config/settings';
import { Helpers } from './services/helpers';

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
        private helpers: Helpers,
        settings: Settings,
        http: HttpClient) {
        settings.apiBaseUrl = environment.apiBaseUrl;
        http.configure(
            builder => builder
                .withBaseUrl(environment.apiBaseUrl)
                .withCredentials(true));

        state.userName = sessionStorage.getItem('userName');
    }

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Chatle';
        config.addPipelineStep('authorize', AuthorizeStep);
        const confirm = { route: 'confirm', name: 'confirm', moduleId: 'pages/confirm', title: 'Confirm', anomymous: true };
        const login = { route: 'login', name: 'login', moduleId: 'pages/login', title: 'Login', anomymous: true };
        const account = { route: 'account', name: 'account', moduleId: 'pages/account', title: 'Account' };
        const home = { route: 'home', name: 'home', moduleId: 'pages/home', title: 'Home' }; 

        config.map([
            home,
            account,
            confirm,
            login
        ]);

        let handleUnknownRoutes = (instruction: NavigationInstruction): RouteConfig => {
            const provider = this.helpers.getUrlParameter('p');

            if (provider) {
                return confirm;
            }

            const userName = this.helpers.getUrlParameter('u');
            const action = this.helpers.getUrlParameter('a');
 
            if (userName) {
                this.state.userName = userName;
                sessionStorage.setItem('userName', userName);
            }
 
            window.history.replaceState(null, null, '/');

            if (!this.state.userName) {
                return login;
            }
            
            if (action) {
                return account;
            }

            return home;
        }

        config.mapUnknownRoutes(handleUnknownRoutes)
        this.router = router;
    }

    attached() {
        this.ea.subscribe(ConnectionStateChanged, e => {
            this.setIsConnected();
        });
        this.setIsConnected();
    }

    logoff() {
        this.service.logoff();
        this.router.navigateToRoute('login');
    }

    manage() {
        this.router.navigateToRoute('account');
    }

    home() {
        if (this.isConnected) {
            this.router.navigateToRoute('home');
        } else {
            this.router.navigateToRoute('login');
        }
    }

    private setIsConnected() {
        this.isConnected = this.state.userName !== undefined 
            && this.state.userName != null
            && this.router.currentInstruction.config.moduleId != 'pages/confirm';

        this.userName = this.state.userName;
    }

}

@autoinject
class AuthorizeStep {

    constructor(private state: State, private helpers: Helpers) { }

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => {
            let route = i.config as CustomRouteConfig;
            return !route.anomymous;
        })) {            
            let isLoggedIn = this.state.userName;
            if (!isLoggedIn) {
                return next.cancel(new Redirect('login'));
            }
        }

        return next();
    }
}