import React, {useState} from "react";
// import { Input, Icon, Text, Button, Overlay } from '@rneui/themed';
import { StyleSheet, View, ScrollView, Dimensions, Text, Button} from "react-native";
import { TABs } from "../static/Constants";
import { useNavigation } from '@react-navigation/native';
import { GradientButtonAction } from "../styles/buttons";
import { useLocalLoginStatusContext } from "../providers/LocalLoginStatusContextProvider";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { POST, APIs} from "../utils/API";
import { useToast } from "react-native-toast-notifications";


export const SettingsTab = (props) => {
    // need to fetch from db and also get from addr/name tabs
    const navigation = useNavigation();
    const [name, setName] = useState('New User');
    const [addr, setAddr] = useState("A wonderful world");
    const [payment, setPayment] = useState('');
    const { isPopupVisible,localLogin,isLoginPageVisible,setPopupVisibility,setLoginPageVisibility,setLocalLogin} = useLocalLoginStatusContext()
    const toast = useToast();
    const {userInfo} = useAuthenticationContext()

    const signOut = () =>{
        props.onSignout()
        navigation.navigate(TABs.HOME)
    }    

    const delete_account = async () => {
        // todo: delete account
        resp = await POST(APIs.DELETE_ACCOUNT, null, userInfo)
        if (resp.status === 200) {
            console.log('delete account success')
            props.onSignout()
            navigation.navigate(TABs.HOME)
        } else {
            toast.show("Operation failed, please try again", {
                type: "normal",
                placement: "bottom",
                duration: 1000,
                animationType: "zoom-in",
                style : {
                  marginBottom: 150
                }
              })
        }
        
    }

    return <View style={{ padding: 10, alignItems: "center"}}>
        {/* <Text>Profile</Text>
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
        /> */}
       
        {/* <Text>Shipping Address</Text>
        <Input
            placeholder={addr}
            rightIcon={<Icon name='edit' onPress={()=>{navigation.navigate(TABs.ADDRESS) }}/>}
            // onChangeText={() => {  }}
            disabled
            disabledInputStyle={{ backgroundColor: "#ddd" }}
        /> */}

        {/* <Text>Payment Method</Text>
        <Input
            placeholder={payment}
            rightIcon={<Icon name='edit' onPress={()=>{setPaymentDisabled(false)}}/>}
            onChangeText={value => { setPayment(value);  }}
            disabled
            disabledInputStyle={{ backgroundColor: "#ddd" }}
        /> */}
            <GradientButtonAction onPress={signOut} style={{width: 200}}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </GradientButtonAction>
        <Text style={{color: "#999999", marginTop: 20}} onPress={delete_account}>Delete Account</Text>
        {/* <Button title="Sign Out" type="outline" /> */}
        {/* <Button title="Delete Account" type="outline" /> */}

    </View>
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20
}
});