import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { HubConnection, HttpConnection } from '@aspnet/signalr';

import environment from '../environment';

import { Settings } from '../config/settings';
import { Helpers } from './helpers';
import { State } from './state';

import { User } from '../model/user';
import { Message } from '../model/message';
import { Conversation } from '../model/conversation';

import { ConnectionStateChanged } from '../events/connectionStateChanged';
import { ConversationJoined } from '../events/conversationJoined';
import { MessageReceived } from '../events/messageReceived';
import { UserConnected } from '../events/userConnected';
import { UserDisconnected } from '../events/userDisconnected';
import { ServiceError } from '../model/serviceError';

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

    private hubConnection: HubConnection;
    constructor(private settings: Settings, 
        private ea: EventAggregator, 
        private http: HttpClient, 
        private state: State, 
        private helpers: Helpers) { }
    
    start(): Promise<ConnectionState> {
        const connection = new HttpConnection(this.settings.apiBaseUrl + this.settings.chatHub);
        this.hubConnection = new HubConnection(connection);
        /**
          * @desc callback when a new user connect to the chat
          * @param User user, the connected user
        */
        this.hubConnection.on('userConnected', user => this.onUserConnected(user));
        /**
          * @desc callback when a new user disconnect the chat
          * @param id, the disconnected user id
        */
        this.hubConnection.on('userDisconnected', user => this.onUserDisconnected(user));
        /**
          * @desc callback when a message is received
          * @param String to, the conversation id
          * @param Message data, the message
        */
        this.hubConnection.on('messageReceived', message => this.onMessageReceived(message));
        /**
          * @desc callback when a new conversation is create on server
          * @param Conv data, the conversation model
        */
        this.hubConnection.on('messageReceived', conversation => this.onJoinConversation(conversation));

        this.hubConnection.onclose(e => {
            if (e) {
                this.onError(e);
            } else {
                this.onDisconnected();
            }
        });
    
        // start the connection
        return new Promise<ConnectionState>((resolve, reject) => {
            this.hubConnection.start()
                .then(() => { 
                    this.setConnectionState(ConnectionState.Connected);
                    resolve(ConnectionState.Connected);
                })
                .catch(error => {
                    this.setConnectionState(ConnectionState.Error)
                    reject(new Error(error));
                });
        });
    }

    stop() {
        this.hubConnection.stop();
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
