import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import environment from '../environment';

import { Settings } from '../config/settings';
import { Helpers } from './helpers';
import { State } from './state';

import { User } from '../model/user';
import { Message } from '../model/message';
import { Conversation } from '../model/conversation';
import { Attendee } from '../model/attendee';

import { ConnectionStateChanged } from '../events/connectionStateChanged';
import { ConversationJoined } from '../events/conversationJoined';
import { ConversationSelected } from '../events/conversationSelected';
import { MessageReceived } from '../events/messageReceived';
import { UserConnected } from '../events/userConnected';
import { UserDisconnected } from '../events/userDisconnected';
import { ServiceError } from '../model/serviceError';

interface ChatSignalR extends SignalR {
    chat: ChatProxy,
    hub: any
}

interface ChatProxy {
    client: ChatClient
}

interface ChatClient {
    userConnected: (user: User) => void;
    userDisconnected: (user: Disconnected) => void;
    messageReceived: (message: Message) => void;
    joinConversation: (conversation: Conversation) => void;
}

export interface Disconnected {
    id: string;
    isRemoved: boolean
}

export enum ConnectionState {  
    Connected = 1,
    Disconnected = 2,
    Error = 3
}

@autoinject
export class ChatService {
    currentState = ConnectionState.Disconnected;    
    currentConversation: Conversation;

    constructor(private settings: Settings, 
        private ea: EventAggregator, 
        private http: HttpClient, 
        private state: State, 
        private helpers: Helpers) { }
    
    start(): Promise<ConnectionState> {
        
        let debug = environment.debug;
        // only for debug
        let hub = jQuery.connection.hub; 
        hub.logging = debug;
        hub.url = this.settings.apiBaseUrl + '/signalr';
        // get the signalR hub named 'chat'
        let connection = <ChatSignalR>jQuery.connection;
        let chatHub = connection.chat;
        
        /**
          * @desc callback when a new user connect to the chat
          * @param User user, the connected user
        */
        chatHub.client.userConnected = user => this.onUserConnected(user);
        /**
          * @desc callback when a new user disconnect the chat
          * @param id, the disconnected user id
        */
        chatHub.client.userDisconnected = user => this.onUserDisconnected(user);
        /**
          * @desc callback when a message is received
          * @param String to, the conversation id
          * @param Message data, the message
        */
        chatHub.client.messageReceived = message => this.onMessageReceived(message);
        /**
          * @desc callback when a new conversation is create on server
          * @param Conv data, the conversation model
        */
        chatHub.client.joinConversation = conversation => this.onJoinConversation(conversation);

        if (debug) {
            // for debug only, callback on connection state change
            hub.stateChanged(change => {
                let oldState: string,
                    newState: string;
                
                let signalR = jQuery.signalR;
                for (var state in signalR.connectionState) {
                    if (signalR.connectionState[state] === change.oldState) {
                        oldState = state;
                    }
                    if (signalR.connectionState[state] === change.newState) {
                        newState = state;
                    }
                }

                console.log("Chat Hub state changed from " + oldState + " to " + newState);
            });                        
        }

        // callback on connection reconnect
        hub.reconnected(() => this.onReconnected());
        // callback on connection error
        hub.error(error => this.onError(error) );
        // callback on connection disconnect
        hub.disconnected(() => this.onDisconnected());
    
        // start the connection
        return new Promise<ConnectionState>((resolve, reject) => {
            hub.start()
                .done(response => { 
                    this.setConnectionState(ConnectionState.Connected);
                    resolve(ConnectionState.Connected);
                })
                .fail(error => {
                    this.setConnectionState(ConnectionState.Error)
                    reject(ConnectionState.Error);
                });
        });
    }

    stop() {
        jQuery.connection.hub.stop();
    }

    private setConnectionState(connectionState: ConnectionState) {
        if (this.currentState === connectionState) {
            return;
        }
        
        console.log('connection state changed to: ' + connectionState);
        this.currentState = connectionState;
        this.ea.publish(new ConnectionStateChanged(connectionState));
    }
       
    private onReconnected() {
        this.setConnectionState(ConnectionState.Connected);
    }

    private onDisconnected() {
        this.setConnectionState(ConnectionState.Disconnected);
    }

    private onError(error: any) {
        this.setConnectionState(ConnectionState.Error);
    }

    private onUserConnected(user: User) {
        console.log("Chat Hub new user connected: " + user.id);
        this.ea.publish(new UserConnected(user));
    }

    private onUserDisconnected(user: Disconnected) {
        console.log("Chat Hub user disconnected: " + user.id);
        if (user.id !== this.state.userName) {
            this.ea.publish(new UserDisconnected(user));
        }
    }   

    private onMessageReceived(message: Message) {
        this.ea.publish(new MessageReceived(message));
    }

    private onJoinConversation(conversation: Conversation) {
        this.helpers.setConverationTitle(conversation);
        this.ea.publish(new ConversationJoined(conversation));
    }
}