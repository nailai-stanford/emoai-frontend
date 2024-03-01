import React from 'react';
import { Button, Text, View } from 'react-native';
import Modal from 'react-native-modal';

export const LoginPopup = ({ isVisible, toggleVisibility }) => {
    return (
        <View style={{ flex: 1 }}>
            <Modal isVisible={isVisible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Hello!</Text>
                    <Button title="Hide modal" onPress={toggleVisibility} />
                </View>
            </Modal>
        </View>
    );
};
