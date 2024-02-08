import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { StatusBar } from "react-native";
import {
    getUserInfoFromStore,
    onPressSignIn,
    onPressLogout,
  } from './../utils/UserUtils';

import { GradientButtonAction } from '../styles/buttons';
import { ButtonH, ButtonP, P} from '../styles/texts';
import { OTHER_ICONS } from '../styles/icons';

export const LogInPage = (props) => {  
    return (
        <View style={styles.container}>
            <Image  source={require('../../assets/others/logoLarge.png')} 
            style={{marginBottom:150}}></Image>
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
          <StatusBar style="auto" />
        </View>
      );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: "#fff",
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });
