import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Image} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { P, ButtonH, TitleHeader } from "../styles/texts";

import { GradientButtonAction } from '../styles/buttons';
import { useLocalLoginStatusContext } from '../providers/LocalLoginStatusContextProvider';



export const LoginPopup = ({ isVisible, toggleVisibility }) => {
    const IMG_PATH = "../../assets/pnga.png";
    const {setPopupVisibility, setLoginPageVisibility}= useLocalLoginStatusContext()

    const login = () => {
        setPopupVisibility(false)
        setLoginPageVisibility(true)
    }
    return (
        <View style={styles.container}>
            <BlurView 
            blurType="dark"
            blurAmount={5}
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                position: "absolute",
            }}
            >
            <Image source={require(IMG_PATH)} style={{ width: 200, height: 200, borderRadius: 10, resizeMode: 'contain', zIndex: 2, marginTop: -280}} />
            <View
                style={{
                marginBottom: 10,
                borderRadius: 25,
                paddingHorizontal: 35,
                paddingVertical: 30,
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
                position: "absolute",
                backgroundColor: '#181818',
                zIndex: 1
                }}
            >
                <>
                <TitleHeader style={{marginTop: 40}}>
                    Account Required
                </TitleHeader>
                <P style={{marginBottom: 20, width: 200 }}>
                    Access additional features by logging in with us.
                </P>
                <View>
                    <GradientButtonAction onPress={login}>
                    <ButtonH>Sign Up</ButtonH>
                    </GradientButtonAction>
                    <Text style={{color:"#cccccc"}} onPress={() => setPopupVisibility(false)}>Continue as a Guest</Text>
                </View>
                </> 
            </View>
        </BlurView>
    </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    blurViewStyle: {
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
 
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginPopup;
