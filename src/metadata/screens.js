/**
 * Created by Faisal on 7/17/17.
 */

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AboutScreen from '../screens/AboutScreen';
import DetailScreen from '../screens/DetailScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import SettingsScreen from "../screens/SettingsScreen";
import SideMenu from '../screens/SideMenu';
import NotifyLogScreen from "../screens/NotifyLogScreen";
import HelpScreen from "../screens/HelpScreen";
import DebugScreen from "../screens/DebugScreen";

export const screens = [
    {
        name: 'brca.HomeScreen',
        component: HomeScreen,
        sidebar: {
            title: 'Home',
            icon: 'home',
            resetStack: true
        },
    },
    {
        name: 'brca.SearchScreen',
        component: SearchScreen,
        sidebar: {
            title: 'Search Variants',
            icon: 'search',
            resetStack: false
        },

    },
    {
        name: 'brca.SubscriptionsScreen',
        component: SubscriptionsScreen,
        sidebar: {
            title: 'Followed Variants',
            icon: 'bookmark',
            resetStack: false
        },
    },
    {
        name: 'brca.NotifyLogScreen',
        component: NotifyLogScreen,
        sidebar: {
            title: 'Notify Log',
            icon: 'speaker-notes',
            resetStack: false
        },
    },
    {
        name: 'brca.AboutScreen',
        component: AboutScreen,
        sidebar: {
            title: 'About',
            icon: 'info',
            resetStack: false
        },
    },
    {
        name: 'brca.HelpScreen',
        component: HelpScreen,
        sidebar: {
            title: 'User Guide',
            icon: 'help',
            resetStack: false
        },
    },
    {
        name: 'brca.DebugScreen',
        component: DebugScreen,
        sidebar: {
            title: 'Dev Settings',
            icon: 'bug-report',
            resetStack: false
        },
    },

    {
        name: 'brca.SettingsScreen',
        component: SettingsScreen,
        sidebar: null,
    },
    {
        name: 'brca.DetailScreen',
        component: DetailScreen,
        sidebar: null,
    },
    {
        name: 'brca.SideMenu',
        component: SideMenu,
        sidebar: null,
    },
];
