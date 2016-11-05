import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { Message } from '../model/message';
import { Conversation } from '../model/conversation';
import { MessageReceived } from '../events/messageReceived';
import { ConversationJoined } from '../events/conversationJoined';
import { NotificationClicked } from '../events/notificationClicked';

interface NotificationOptions {
    dir?: string;
    lang?: string;
    body?: string;
    tag?: string;
    icon?: string;
    data?: any;
    vibrate?: number[];
    renotify?: boolean;
    silent?: boolean;
    sound?: string;
    noscreen?: boolean;
    sticky?: boolean;
}

interface Notification {
    readonly title: string;
    readonly dir: string;
    readonly lang: string;
    readonly body: string;
    readonly tag: string;
    readonly icon: string;
    readonly data: any;
    readonly silent: boolean;
    readonly timestamp: string;
    readonly noscreen: boolean;
    readonly renotify: boolean;
    readonly sound: string;
    readonly sticky: boolean;
    readonly vibrate: number[];
    onclick: Function;
    onerror: Function;
    close(): void;
}

declare var Notification: {
    prototype: Notification;
    readonly permission: string;
    new(title: string, options?: NotificationOptions): Notification;
    requestPermission(): Promise<string>;
}

export class NotificationService {
    private messageSubscription: Subscription;
    private conversationSubscription: Subscription;

    constructor(private ea: EventAggregator) { }

    start() {
        if (window['Notification']) {
            if (Notification.permission === 'granted') {
                this.listen();
            } else if (Notification.permission !== 'denied') {
                Notification
                    .requestPermission()
                    .then(permission => {
                        if (permission === 'granted') {
                            this.listen();
                        }
                    });
            }
        }
    }

    stop() {
        if(this.messageSubscription) {
            this.messageSubscription.dispose();
        }
        if(this.conversationSubscription) {
            this.conversationSubscription.dispose();
        }
    }

    private listen() {
        this.messageSubscription = this.ea.subscribe(MessageReceived, e => {
            this.notify((<MessageReceived>e).message);
        });

        this.conversationSubscription = this.ea.subscribe(ConversationJoined, e => {
            const conversation = (<ConversationJoined>e).conversation;
            const message = conversation.messages[0];
            if (message) {
                this.notify(message);
            }
        });
    }

    private notify(message: Message) {
        const option = {
                body: message.text,
                icon: "favicon.ico"
            };

        const n = new Notification(message.from, option);
            n.onclick = () => {
                this.ea.publish(new NotificationClicked(message));
                n.close.bind(n);
            };
        
        setTimeout(n.close.bind(n), 5000);
    }
}