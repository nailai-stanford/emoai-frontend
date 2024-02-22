import React from 'react';
import { StyleSheet, View, Image, Linking, TouchableOpacity } from 'react-native';
import { StatusBar, Text } from "react-native";
import {
    getUserInfoFromStore,
    onPressSignIn,
    onPressLogout,
  } from './../utils/UserUtils';

import { GradientButtonAction } from '../styles/buttons';
import { ButtonH, ButtonP, P, GradientP} from '../styles/texts';
import { OTHER_ICONS } from '../styles/icons';

export const LogInPage = (props) => {  
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/others/logoLarge.png')} 
             style={styles.logoImage}/>
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
          By clicking Sign In With Google, you are 
        </P>
      <View style={styles.textContainer}>
        <P>
        agreeing to EMO AI's 
        </P>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.e-m-o.ai/terms')}>
          <GradientP style={styles.termsLink} >
            {" terms and conditions"}
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
    justifyContent: 'center',
  },
  logoImage: {
    marginBottom: 150,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    maxWidth: '70%', // Adjust this to match the width of your GradientButtonAction
  },
  termsText: {
    marginTop: 5,
    color: "white",
    textDecorationStyle: 'solid',
  },
  termsLink: {
    // Add any specific styling for the link text here
  },
});
