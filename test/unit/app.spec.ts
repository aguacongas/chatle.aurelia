import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import { Router, Redirect, NavigationInstruction, RouterConfiguration, Next, RouteConfig } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { History } from 'aurelia-history';

import { App } from '../../src/app';
import { LoginService } from '../../src/services/login.service';
import { ChatService } from '../../src/services/chat.service';
import { State } from '../../src/services/state';
import { Helpers } from '../../src/services/helpers';
import { Settings } from '../../src/config/settings';

describe('the app', () => {
  let app: App;
  let service: LoginService;
  let settings: Settings;
  let ea: EventAggregator;
  let http: HttpClient;

  beforeEach(() => {  
    http = new HttpClient();
    ea = new EventAggregator();
    settings = new Settings();
    let state = new State();
    let helpers = new Helpers(state);
    let chatService = new ChatService(settings, ea, http, state, helpers);
    service = new LoginService(http, settings, chatService, state, helpers)
    app = new App(service, ea, state, settings, http);   
  });

  describe('configure router specs', () => {
      let config = new RouterConfiguration();
      let container = new Container();
      let history = new History();
      let router = new Router(container, history);

      it('configureRouter should set default title = Chatle', () => {
        // act
        app.configureRouter(config, router);        

        // verify
        expect(config.title).toBe('Chatle');
      });

      it('configureRouter should map pages table', () => {
        // act
        app.configureRouter(config, router);        

        config.map = c => {
          expect(c).toBeDefined();
          expect(c).toEqual([
              { route: ['', 'home'], name: 'home', moduleId: 'pages/home', title: 'Home' },
              { route: 'account', name: 'account', moduleId: 'pages/account', title: 'Account' },
              { route: 'login', name: 'login', moduleId: 'pages/login', title: 'Login', anomymous: true },
              { route: 'confirm', name: 'confirm', moduleId: 'pages/confirm', title: 'Confirm', anomymous: true }
          ]);

          return new RouterConfiguration();
        };
      });

      it('configureRouter should set app router', () => {
        // act
        app.configureRouter(config, router);        

        expect(app.router).toEqual(router);
      });
  })

  describe('attached specs', () => {
    beforeEach(() => {
      let container = new Container();
      let history = new History();
      let router = new Router(container, history);
      
      app.router = router;
      // mock router navigateToRoute
      router.navigateToRoute = route => {
        return true;
      }; 
      // mock EventAggregator.subscribe
      ea.subscribe = (event, callback) => { 
        return {
          dispose: function() {}
        } 
      };
    })

    it('attached should subscribe to ConnectionStateChanged', () => {
      // prepare
      let called = false;
      ea.subscribe = (event, callback) => {
        called = true;
        return {
          dispose: function() {}
        } 
      };

      // act
      app.attached();

      // verify
      expect(called).toBe(true);
    });

    it('logof should call service logoff and navigate to login', () => {
      // prepare
      let logoffCalled = false;
      let navigateTo= '';
      service.logoff = function() {
        logoffCalled = true;
      }
      app.router.navigateToRoute = function(route: string, params?: any, options?: any): boolean {
        navigateTo = route;
        return true;
      }

      // act
      app.logoff();

      // verify
      expect(logoffCalled).toBe(true);
      expect(navigateTo).toBe('login');
    });
  })
});
