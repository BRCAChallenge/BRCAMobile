import React from 'react';
import {
    Text, Button, TouchableHighlight, View, StyleSheet, Linking, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class extends View {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }

    handlePress() {
        const targetURL = `http://brcaexchange.org/variant/${this.props.variantID}`;

        Alert.alert(
            'Open External Link',
            `View variant details on brcaexchange.org?`,
            [
                { text: 'OK', onPress: () => {
                    console.log("Attempting to open ", targetURL);
                    Linking.openURL(targetURL);
                } },
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            ],
            { cancelable: true }
        );
    }

    render() {
        return (
            <TouchableHighlight style={styles.brcalink} onPress={this.handlePress}>
                <Icon name="link" size={28} color="white" />
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    brcalink: {
        position: 'absolute',
        right: 10,
        top: 10,

        borderRadius: 5,
        padding: 5,
        backgroundColor: '#ccc'
    }
});