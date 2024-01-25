import React, {useState} from "react";
import {View} from "react-native";
import { Input, Icon, Text, Button, Overlay } from '@rneui/themed';
import { TABs } from "../static/Constants";
import { useNavigation } from '@react-navigation/native';

export const SettingsTab = (route) => {
    // need to fetch from db and also get from addr/name tabs
    const navigation = useNavigation();
    const [name, setName] = useState('New User');
    const [addr, setAddr] = useState("A wonderful world");
    const [payment, setPayment] = useState('');

    // need to get api call
    return <View style={{ padding: 10 }}>
        <Text>Profile</Text>
        <Input
            rightIcon={<Icon name='edit' />}
            onChangeText={value => setName(value)}
            disabled
        />
        <Text>User Name</Text>
        <Input
            placeholder={name}
            rightIcon={<Icon name='edit' onPress={()=>{navigation.navigate(TABs.NAME)}}/>}
            disabled
            disabledInputStyle={{backgroundColor: "#ddd"}}
        />
       
        <Text>Shipping Address</Text>
        <Input
            placeholder={addr}
            rightIcon={<Icon name='edit' onPress={()=>{navigation.navigate(TABs.ADDRESS) }}/>}
            // onChangeText={() => {  }}
            disabled
            disabledInputStyle={{ backgroundColor: "#ddd" }}
        />

        {/* <Text>Payment Method</Text>
        <Input
            placeholder={payment}
            rightIcon={<Icon name='edit' onPress={()=>{setPaymentDisabled(false)}}/>}
            onChangeText={value => { setPayment(value);  }}
            disabled
            disabledInputStyle={{ backgroundColor: "#ddd" }}
        /> */}
        <Button title="Sign Out" type="outline" />
    </View>
}

