import React from 'react';
import { StyleSheet, View, Image, Linking, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { StatusBar, Text, Dimensions} from "react-native";
import {
    onPressGoogleSignIn,
    onAppleButtonPress
  } from './../utils/UserUtils';

import { GradientButtonAction, GradientButtonSelection } from '../styles/buttons';
import { ButtonH, ButtonP, P, GradientP, TermTitle} from '../styles/texts';
import { OTHER_ICONS } from '../styles/icons';
import { useLocalLoginStatusContext } from '../providers/LocalLoginStatusContextProvider';
import { useAuthenticationContext } from '../providers/AuthenticationProvider';
import { EmailLoginView } from '../components/EmailLoginView';
import { useEffect } from 'react';

import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';


const { width: screenWidth } = Dimensions.get("window");
const { height: ScreenHeight } = Dimensions.get("window");


export const LogInPage = () => {  
    useEffect(() => {
      // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
      return appleAuth.onCredentialRevoked(async () => {
        console.warn('If this function executes, User Credentials have been Revoked');
      });
    }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

    

  const { setPopupVisibility, setLoginPageVisibility, setLocalLogin } = useLocalLoginStatusContext()

  const {setUserInfo} = useAuthenticationContext()

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const login_success = (userInfo) => {
    setUserInfo(userInfo);
    setLocalLogin(true)
    setLoginPageVisibility(false)
    setPopupVisibility(false)
  }
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>

    <View style={styles.container}>
      <View style={{
        alignItems: "center",

      }}>
        <Image source={require('../../assets/others/logoLarge.png')} 
              style={styles.logoImage}/>
        <TermTitle style={styles.slogan}>
        EMO AI: Wear Your Emotions, Crafted by AI.
        </TermTitle>
        <EmailLoginView setLocalLogin={setLocalLogin} setUserInfo={setUserInfo}/>
      </View>
      <View style={styles.thirdPartyLoginContainer}>
        <View style={styles.loginWithGoogleContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.divider}>Or login with</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={{flexDirection:"row", width: 200, marginTop: 15, marginBottom:15, justifyContent: "space-between"}}>
          <TouchableOpacity style={styles.thirdPartyLogin}
              onPress={() => {
                onPressGoogleSignIn()
                  .then(({response, userInfo}) => {
                    login_success(userInfo)
                  })
                  .catch(e => console.log("login with google faild:", e));
              }}
              >
              <OTHER_ICONS.google width={25} height={25} style={{paddingHorizontal:15}}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.thirdPartyLogin}
              onPress={() => onAppleButtonPress()
                .then(({response, userInfo}) => {
                  login_success(userInfo)
                }).catch(e => console.log("login with apple faild:", e))}
              >
              <OTHER_ICONS.apple width={25} height={25} style={{paddingHorizontal:15}}/>
            </TouchableOpacity>
          </View>
          <P style={styles.termsText}>
            Your registration and use of this app signifies your acceptance 
          </P>
        <View style={styles.textContainer}>
          <P>
            of EMO AI's 
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
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: ScreenHeight * 0.1,
    justifyContent: "space-between"
  },
  logoImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    resizeMode: 'contain',
  },
  slogan: {
    marginBottom: 25,
  },

  thirdPartyLoginContainer: {
    width: screenWidth,
    alignItems: 'center',
    marginBottom: 70
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
  loginWithGoogleContainer: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    color: 'white',
  },
  dividerLine: {
    backgroundColor: 'white',
    height: 1,
    flex: 1,
    margin: 10
  },
  thirdPartyLogin: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
  }
});
