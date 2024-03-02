import React from 'react';
import { StyleSheet, View, Image, Linking, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { StatusBar, Text, Dimensions} from "react-native";
import {
    onPressSignIn,
  } from './../utils/UserUtils';

import { GradientButtonAction, GradientButtonSelection } from '../styles/buttons';
import { ButtonH, ButtonP, P, GradientP, TermTitle} from '../styles/texts';
import { OTHER_ICONS } from '../styles/icons';
import { useLocalLoginStatusContext } from '../providers/LocalLoginStatusContextProvider';
import { useAuthenticationContext } from '../providers/AuthenticationProvider';
import { EmailLoginView } from '../components/EmailLoginView';

const { width: screenWidth } = Dimensions.get("window");
const { height: ScreenHeight } = Dimensions.get("window");


export const LogInPage = () => {  

  const {isPopupVisible,
    localLogin,
    isLoginPageVisible,
    setPopupVisibility,
    setLoginPageVisibility,
    setLocalLogin}
    = useLocalLoginStatusContext()

  const {userInfo, setUserInfo} = useAuthenticationContext()

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>

    <View style={styles.container}>
      <Image source={require('../../assets/others/logoLarge.png')} 
             style={styles.logoImage}/>
      <TermTitle style={styles.slogan}>
      EMO AI: Wear Your Emotions, Crafted by AI.
      </TermTitle>
      <EmailLoginView setLocalLogin={setLocalLogin} setUserInfo={setUserInfo}/>
      <Text style={styles.divider}>
        Login with Google
      </Text>
      <GradientButtonSelection
        onPress={() => {
          onPressSignIn()
            .then(({response, userInfo}) => {
              console.log('onPressSignIn', resp)
              setUserInfo(userInfo);
              setLocalLogin(true)
              setLoginPageVisibility(false)
              setPopupVisibility(false)
              console.log('login by google success:', userInfo)
            })
            .catch(e => {});
        }}
      >
        <View style={{flexDirection:"row", justifyContent:"start", width: 220}}>
          <OTHER_ICONS.google width={20} height={20} style={{paddingHorizontal:15}}/>
          <ButtonP>Sign In with Google</ButtonP>
        </View>
      </GradientButtonSelection>
      <P style={styles.termsText}>
          By clicking Sign In With Google, you are agreeing to
        </P>
      <View style={styles.textContainer}>
        <P>
        EMO AI's 
        </P>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.e-m-o.ai/terms')}>
          <GradientP style={styles.termsLink} >
            {" Terms and conditions "}
          </GradientP>
        </TouchableOpacity>
        <P>
        And
        </P>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.e-m-o.ai/privacy')}>
          <GradientP style={styles.termsLink} >
            {" Privacy policy."}
          </GradientP>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: ScreenHeight * 0.15
    // justifyContent: 'center'
  },
  logoImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    resizeMode: 'contain',
  },
  slogan: {
    marginBottom: 40,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%', // Adjust this to match the width of your GradientButtonAction
  },
  termsText: {
    marginTop: 15,
    color: "white",
    textDecorationStyle: 'solid',
  },
  divider: {
    marginTop: 60,
    color: 'white'
  },
});
