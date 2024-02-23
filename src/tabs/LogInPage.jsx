import React from 'react';
import { StyleSheet, View, Image, Linking, TouchableOpacity,} from 'react-native';
import { StatusBar, Text, Dimensions} from "react-native";
import {
    getUserInfoFromStore,
    onPressSignIn,
    onPressLogout,
  } from './../utils/UserUtils';

import { GradientButtonAction } from '../styles/buttons';
import { ButtonH, ButtonP, P, GradientP, TermTitle} from '../styles/texts';
import { OTHER_ICONS } from '../styles/icons';


const { width: screenWidth } = Dimensions.get("window");
const { height: ScreenHeight } = Dimensions.get("window");


export const LogInPage = (props) => {  
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/others/logoLarge.png')} 
             style={styles.logoImage}/>
      <TermTitle style={styles.slogan}>
      EMO AI: Wear Your Emotions, Crafted by AI.
      </TermTitle>
      <GradientButtonAction
        onPress={() => {
          onPressSignIn()
            .then(({response, userInfo}) => {
              props.setIsLoggedInState(true);
              props.setUserInfo(userInfo);
            })
            .catch(e => {});
        }}
      >
        <View style={{flexDirection:"row", justifyContent:"start"}}>
          <OTHER_ICONS.google width={20} height={20} style={{paddingHorizontal:15}}/>
          <ButtonP>Sign In with Google</ButtonP>
        </View>
      </GradientButtonAction>
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
    marginBottom: 180,
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
  termsLink: {
    // Add any specific styling for the link text here
  },
});
