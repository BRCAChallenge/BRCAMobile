import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    ScrollView,
    Text, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from "react-redux";

// import {screens} from '../metadata/screens';

class SidebarMenuItems extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        navbuttonProps: PropTypes.object.isRequired,
        buttonStyle: PropTypes.number.isRequired,
        onNavigateRequest: PropTypes.func.isRequired
    };

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <Icon.Button name="home" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Home', 'brca.HomeScreen', true) }>
                    <Text style={this.props.buttonStyle}>Home</Text>
                </Icon.Button>

                <Icon.Button name="search" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Search', 'brca.SearchScreen', false) }>
                    <Text style={this.props.buttonStyle}>Search Variants</Text>
                </Icon.Button>

                <Icon.Button name="bookmark" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Following', 'brca.SubscriptionsScreen', false) }>
                    <Text style={this.props.buttonStyle}>Followed Variants</Text>
                </Icon.Button>

                <Icon.Button name="speaker-notes" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Notify Log', 'brca.NotifyLogScreen', false) }>
                    <Text style={this.props.buttonStyle}>Notify Log</Text>
                </Icon.Button>

                <Icon.Button name="info" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('About', 'brca.AboutScreen', false) }>
                    <Text style={this.props.buttonStyle}>About This App</Text>
                </Icon.Button>

                <Icon.Button name="help" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('Usage Guide', 'brca.HelpScreen', false) }>
                    <Text style={this.props.buttonStyle}>User Guide</Text>
                </Icon.Button>

                {
                    this.props.isDebugging &&
                    <Icon.Button name="bug-report" {...this.props.navbuttonProps}
                        onPress={ () => this.props.onNavigateRequest('Dev Settings', 'brca.DebugScreen', false) }>
                        <Text style={this.props.buttonStyle}>Dev Settings</Text>
                    </Icon.Button>
                }

                {/*
                    screens.filter(x => x.hasOwnProperty('sidebar') && x.sidebar != null)
                        .map((x, idx) => {
                            const sideOpts = x.sidebar;

                            return (
                                <Icon.Button key={idx} name={sideOpts.icon} {...this.props.navbuttonProps}
                                    onPress={ () => this.props.onNavigateRequest(sideOpts.title, screen.name, sideOpts.resetStack) }>
                                    <Text style={this.props.buttonStyle}>{sideOpts.title}</Text>
                                </Icon.Button>
                            );
                        })
                */}

                {/*
                <Icon.Button name="help" {...this.props.navbuttonProps}
                    onPress={ () => this.props.onNavigateRequest('View Test', 'brca.ViewTestScreen', false) }>
                    <Text style={this.props.buttonStyle}>View Test</Text>
                </Icon.Button>
                */}
            </ScrollView>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isDebugging: state.debugging.isDebugging
    };
};

export default connect(
    mapStateToProps
)(SidebarMenuItems);
