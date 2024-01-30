import React, {useState} from 'react';

import {View, ScrollView, Alert} from 'react-native';
import {ButtonH, ButtonP, TitleHeader, P, SubHeader} from '../styles/texts';

export const OrderConfirmationTab = ({ route, navigation }) => {
   
    return <View
   >
        <TitleHeader>
            Thank you, {route.params.name}!
        </TitleHeader>
        <P>Your order is confirmed</P>
        <P>You'll get a confirmation email with your order number soon.</P>
    </View>
}