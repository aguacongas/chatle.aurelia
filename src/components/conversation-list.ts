import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { ConnectionState, Disconnected } from '../services/chat.service';
import { ConversationService } from '../services/conversation.service';
import { State } from '../services/state';

import { Conversation } from '../model/conversation';
import { ConversationJoined } from '../events/conversationJoined';
import { UserDisconnected } from '../events/userDisconnected';
import { ConnectionStateChanged } from '../events/connectionStateChanged';
import { NotificationClicked } from '../events/notificationClicked';

@autoinject
export class ConversationList {
  conversations: Conversation[];
  private conversationJoinedSubscription: Subscription;
  private userDisconnectedSubscription: Subscription;
  private connectionStateSubscription: Subscription;
  private notificationClickedSubscription: Subscription;

  constructor(private service: ConversationService,
    private state: State,
    private ea: EventAggregator,
    private router: Router) { }

  attached() {
    this.conversations = new Array<Conversation>();

    this.getConversations();

    this.connectionStateSubscription = this.ea.subscribe(ConnectionStateChanged, e => {
      let state = (<ConnectionStateChanged>e).state;
      if (state === ConnectionState.Disconnected) {
        // remove conversation on log off, disconnection
        this.conversations.splice(this.conversations.length);
      } else if (state === ConnectionState.Connected) {
        // get conversation for reconnect
        this.getConversations();
      }
    });

    this.notificationClickedSubscription = this.ea.subscribe(NotificationClicked, e => {
      const message = (<NotificationClicked>e).message;
      const conversation = this.conversations.find(c => c.id === message.conversationId);
      if (conversation) {
        this.service.showConversation(conversation, this.router);
      }
    });
  }

  detached() {
    this.Unsubscribe();
    this.connectionStateSubscription.dispose();
  }

  private Unsubscribe() {
    if (this.conversationJoinedSubscription) {
      this.conversationJoinedSubscription.dispose();
    }
    if (this.userDisconnectedSubscription) {
      this.userDisconnectedSubscription.dispose();
    }
  }

  private getConversations() {
    this.service.getConversations()
      .then(conversations => {
        // Unsubscribe before in case of connection state changed to connected
        this.Unsubscribe();

        if (!conversations) {
          return;
        }
        this.conversations = conversations;

        this.userDisconnectedSubscription = this.ea.subscribe(UserDisconnected, e => {
          this.conversations.forEach(c => {
            let attendees = c.attendees;

            attendees.forEach(a => {
              let user = (<UserDisconnected>e).user;
              if (user.isRemoved && a.userId === user.id) {

                if (c.attendees.length < 3) {
                  const index = this.conversations.indexOf(c);
                  this.conversations.splice(index, 1);

                  if (this.service.currentConversation === c) {
                    this.service.currentConversation = undefined;
                  }
                } else {
                  const index = attendees.indexOf(a);
                  attendees.splice(index, 1);

                  if (this.service.currentConversation === c) {
                    c.title = undefined;
                    this.service.showConversation(c, this.router);
                  }                   
                }
              }
            });
          });
        });

        this.conversationJoinedSubscription = this.ea.subscribe(ConversationJoined, e => {
          const conversation = (<ConversationJoined>e).conversation;
          this.conversations.unshift(e.conversation);
        });
      });
  }
}