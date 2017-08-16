import {
    Platform, DeviceEventEmitter
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist-immutable'
import { AsyncStorage } from 'react-native'
import { browsingReducer, subscriptionsReducer, notifylogReducer } from './redux';
import * as Immutable from "immutable";

let reducer = combineReducers({
    browsing: browsingReducer,
    subscribing: subscriptionsReducer,
    notifylog: notifylogReducer
});
let store = createStore(reducer, applyMiddleware(thunk), autoRehydrate());

// redux-persist will save the store to local storage via react-native's AsyncStorage
persistStore(store, {storage: AsyncStorage});

// screen related book keeping
import {registerScreens} from './screens';
registerScreens(store);

// stuff for FCM
import FCM, {
    FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType
} from "react-native-fcm";

import { fetch_fcm_token, receive_fcm_token } from './redux/actions';
import { receive_notification } from "./redux/notifylog/actions";

export default class App {
    constructor() {
        this.startApp();
        this.registerWithFCM();

        this.subscriptions = Immutable.Seq();

        store.subscribe(() => {
            this.subscriptions = store.getState().getIn(['subscribing','subscriptions']).keySeq();
            // console.log("subscribing: ", JSON.stringify(this.subscribing));
        });
    }

    startApp() {
        console.log("Starting app");

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'brca.HomeScreen',
                title: 'Home'
            },
            drawer: {
                left: {
                    screen: 'brca.SideMenu'
                }
            }
        });
    }

    registerWithFCM() {
        FCM.requestPermissions(); // on iOS, prompts for permission to receive push notifications

        // replace with dispatch to fetch token from actions
        store.dispatch(fetch_fcm_token());

        // ensure that we don't have any existing listeners hanging around
        DeviceEventEmitter.removeAllListeners(FCMEvent.Notification);
        DeviceEventEmitter.removeAllListeners(FCMEvent.RefreshToken);

        // set up some handlers for incoming data and control messages
        this.notificationListner = FCM.on(FCMEvent.Notification, this.handleNotification.bind(this));
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, this.handleTokenRefresh.bind(this));

        // subscribe to get variant notices
        // we subscribe to everything and filter out what we don't care about
        // FIXME: verify if we actually need to
        FCM.subscribeToTopic('/topics/variant_updates');

        FCM.getInitialNotification()
            .then(notif => {
                // getInitialNotification() actually gives us the notification that launched us
                if (notif) {
                    console.log("initial notification: ", notif);
                    this.handleNotification(notif);
                }
                else {
                    console.log("no initial notification");
                }
            })
            .catch(error => {
                console.warn("error: ", error.message);
            });
    }

    handleNotification(notif) {
        console.log(`handleNotification() called: (tray?: ${notif.opened_from_tray}, local?: ${notif.local_notification})`);

        // ways we can enter this method:
        // 1) we receive a wakeup notification from the OS (android)
        // 2) we receive an actual notification from FCM
        // 3) we receive a notification, raise a "local" notification (to see the message up top), and receive a repeated notification
        // 4) we click the notification (either from cold-start or when the app is running)

        // if the notification has a variant_id, then it's either one from FCM or from the user pressing a notification
        if (notif.hasOwnProperty('variant_id')) {
            console.log("* Detected notification with variant_id field");

            if (notif.opened_from_tray) {
                // notif.local_notification is true even if we're coming in from clicking it, apparently
                // so we have to check notif.opened_from_tray first
                const target = 'updated/' + JSON.stringify({ variant_id: notif.variant_id });

                console.log("Opened from tray, launching ", target);
                Navigation.handleDeepLink({
                    link: target
                });

                return;
            }
            else if (notif.local_notification) {
                console.log("* Disregarding self-raised notification");

                // notif.local_notification being true indicates that we raised this event in
                // response to receiving a non-local notification, so we abort
                return;
            }
            else {
                // it's probably from FCM, let's raise a notification if we're actually subscribed to this
                if (this.subscriptions.includes(parseInt(notif.variant_id))) {
                    console.log("* FCM notification for subscribed variant, raising local notification...");

                    // log the notification
                    store.dispatch(receive_notification(notif));

                    this.showLocalNotification(notif);
                }
            }
        }
        else {
            console.log("* Notification without variant_id (OS-raised?): ", notif);
        }

        // if we haven't returned by now, we want to dismiss the note
        if (notif.hasOwnProperty("finish") && typeof notif.finish === "function") {
            notif.finish();
        }
    }

    handleTokenRefresh(token) {
        console.log("TOKEN (refreshUnsubscribe)", token);
        store.dispatch(receive_fcm_token(token));
    }

    showLocalNotification(notif) {
        console.log("Showing: ", notif);

        FCM.presentLocalNotification({
            opened_from_tray: 0,
            title: notif.title,
            body: notif.body,
            variant_id: notif.variant_id,
            priority: "high",
            click_action: (Platform.OS === "android") ? "fcm.ACTION.HELLO" : notif.click_action,
            show_in_foreground: true,
            // local: true
        });
    }
}
