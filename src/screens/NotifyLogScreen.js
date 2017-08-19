import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text, TextInput, View, ScrollView, ListView, Image, TouchableOpacity, TouchableHighlight, StyleSheet,
    Alert, Platform
} from 'react-native';
import groupBy from 'lodash/groupBy';
import { connect } from "react-redux";
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LinkableMenuScreen from './LinkableMenuScreen';
import {mark_visible_read} from "../redux/notifylog/actions";

class NotifyLogScreen extends LinkableMenuScreen {
    constructor(props) {
        super(props);

        const initialShowRead = false;

        this.state = {
            unreadNotifyDS: this.createDataSource(props.notifications, false),
            readNotifyDS: this.createDataSource(props.notifications, true)
        };

        this.renderRow = this.renderRow.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);

        this.markAllRead = this.markAllRead.bind(this);
        this.showRead = this.showUnreadOrRead.bind(this, true);
        this.showUnread = this.showUnreadOrRead.bind(this, false);
    }

    static propTypes = {
        showRead: PropTypes.bool.isRequired
    };

    static defaultProps = {
        showRead: false
    };

    static navigatorButtons = {
        leftButtons: [{
            icon: (Platform.OS === 'ios') ? require('../../img/navicon_menu.png') : null,
            id: 'sideMenu'
        }]
    };

    showUnreadOrRead(showRead) {
        console.log(this.props.navigator);

        if (showRead) {
            this.props.navigator.push({
                title: "Notify Log (Read)",
                screen: "brca.NotifyLogScreen",
                passProps: {
                    showRead: true
                }
            });
        }
        else {
            this.props.navigator.pop();
        }
    }

    markAllRead() {
        // somehow dispatch updates to all the things we're viewing to be read
        if (this.state.unreadNotifyDS.getRowCount() > 0) {
            this.props.markVisibleRead();
            Toast.show("Notifications cleared");
        }
        else {
            Toast.show("No notifications to clear!");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.notifications != this.props.notifications) {
            this.setState({
                unreadNotifyDS: this.createDataSource(nextProps.notifications, false),
                readNotifyDS: this.createDataSource(nextProps.notifications, true)
            });
        }
    }

    createDataSource(notifications, showRead) {
        const filteredNotifies = notifications.filter(x => x.read == showRead);
        const groupedNotifies = groupBy(filteredNotifies, x => x.version || "(unknown)");

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1.version !== s2.version
        });

        return ds.cloneWithRowsAndSections(groupedNotifies, undefined);
    }

    renderSectionHeader(h, hID) {
        return (
            <View style={styles.sectionRow}>
                <Text style={styles.sectionRowText}>Updates for Version {hID}</Text>
            </View>
        );
    }

    renderRow(d) {
        return (
            <TouchableOpacity onPress={this.rowClicked.bind(this, d)}>
                <View style={[styles.row, styles.contentRow]}>
                    <View style={{flexGrow: 1, width: 0.9}}>
                        <Text style={styles.rowTitle}>{d.title} (v{d.version})</Text>
                        { d.received_at && <Text style={styles.rowDate}>{d.received_at.toLocaleString()}</Text> }
                        <Text style={styles.rowSubtitle}>{d.body}</Text>
                    </View>

                    <Icon
                        name="fiber-manual-record" size={16}
                        color={ !d.read ? "#1D9BF6" : "#aaa" }
                        style={{alignSelf: 'center', paddingLeft: 10}}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    rowClicked(d) {
        const target = 'updated/' + JSON.stringify({ variant_id: d.variant_id });
        console.log("Opened from tray, launching ", target);
        Navigation.handleDeepLink({
            link: target
        });
    }

    render() {
        const targetDS = this.props.showRead ? this.state.readNotifyDS : this.state.unreadNotifyDS;
        const hasUnreviewedNotifies = targetDS.getRowCount() > 0;

        return (
            <ScrollView style={{flex: 1, padding: 0, backgroundColor: 'white'}}>
                <View style={styles.row}>
                    {
                        !this.props.showRead
                        ? (
                            <Icon.Button name="close" backgroundColor={ hasUnreviewedNotifies ? "#007AFF" : "#aaa" } onPress={this.markAllRead}>
                                <Text style={styles.clearButtonText}>Mark Notifications as Read</Text>
                            </Icon.Button>
                        )
                        : (
                            <Icon.Button name="arrow-back" backgroundColor="#007AFF" onPress={this.showUnread}>
                                <Text style={styles.clearButtonText}>Return to Unread Notifications</Text>
                            </Icon.Button>
                        )
                    }

                </View>

                <ListView
                    style={styles.listContainer}
                    enableEmptySections={true}
                    dataSource={ targetDS }
                    renderRow={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader}
                />

                {
                    !hasUnreviewedNotifies
                        ? (
                            <View style={styles.row}>
                                <Text style={styles.emptySectionText}>no {this.props.showRead ? "read" : "unread"} notifications</Text>
                            </View>
                        )
                        : null
                }

                { this.props.showRead ? null : (
                    <View style={styles.row}>
                        <Icon.Button name="more-horiz" backgroundColor="#5a5" onPress={this.showRead}>
                            <Text style={styles.clearButtonText}>View Reviewed Notifications</Text>
                        </Icon.Button>
                    </View>
                ) }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    sectionRow: {
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#777',
    },
    sectionRowText: {
        color: 'white',
        fontWeight: 'bold'
    },
    emptySectionText: {
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#555'
    },
    row: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    contentRow: {
        flex: 1,
        flexDirection: 'row'
    },
    rowTitle: {
        fontWeight: 'bold', marginBottom: 2
    },
    rowDate: {
        fontSize: 12,
        margin: 3,
        color: '#333'
    },
    rowSubtitle: {

    },
    controlFrame: {
        padding: 20
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

/* define the component-to-store connectors */

const mapStateToProps = (state_immutable) => {
    const state = state_immutable.toJS();

    return {
        // subscription info
        notifications: state.notifylog.notifications
    }
};


const mapDispatchToProps = (dispatch) => {
    return {
        markVisibleRead: () => {
            dispatch(mark_visible_read());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotifyLogScreen);