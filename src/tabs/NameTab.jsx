import React, {useState} from "react";
import {KeyboardAvoidingView, ScrollView, View} from "react-native";
import { Input, Icon, Text, Button, Overlay } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export const NameTab = () => {
    const navigation = useNavigation();
    const [name, setName] = useState("")
    return <KeyboardAvoidingView>
        <ScrollView>
        <View>
        <Text>User Name</Text>
        <Input
            placeholder={name}
            onChangeText={value => { setName(value);  }}   
        />
        <Button title="Save" onPress={() => { navigation.goBack()}}/>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
    
}