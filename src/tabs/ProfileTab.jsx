import React, {useEffect, useState} from "react";
import { StyleSheet, View, ScrollView, Dimensions, Text} from "react-native";
import { Tab } from '@rneui/themed';
import { UserInfo } from "../components/UserInfo";
import { GalleryCard } from "../components/gallery/GalleryCard";

import { APIs, GET, getHeader } from "../utils/API";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useLocalLoginStatusContext } from "../providers/LocalLoginStatusContextProvider";
import { useIsFocused } from '@react-navigation/native';

import { ButtonAction, ButtonSelection, GradientDivider, GradientButtonSelection, GradientButtonAction } from "../styles/buttons";
import { P, ButtonP, GradientMenuHeader,GradientP} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";

const { width: screenWidth } = Dimensions.get("window");


export const ProfileTab = ({ onSignout }) => {
  const [index, setIndex] = useState(0);
  const [design, setDesign] = useState([])
  const [collected, setCollected] = useState([])
  const { userInfo, signout } = useAuthenticationContext();
  const isFocused = useIsFocused();
  const { isPopupVisible,localLogin,isLoginPageVisible,setPopupVisibility,setLoginPageVisibility,setLocalLogin} = useLocalLoginStatusContext()


  useEffect(() => {
    async function _getMy() {
      resp = await GET(`${APIs.GET_PRODUCTS}my/`, userInfo, signout)
      if (resp.status === 200) {
        if (resp.data && resp.data.products) {
          setDesign(resp.data.products)
        }
      }
    }
    if (userInfo) {
     _getMy() 
    }
  },[isFocused, userInfo]);

  useEffect(() => {
    async function _getCollected() {
      resp = await GET(`${APIs.LIKE_COLLECT}collections/`, userInfo, signout)
      if (resp.status === 200) {
        if (resp.data && resp.data.products) {
          setCollected(resp.data.products)
        }
      }
    }
    if (userInfo) {
      _getCollected()
    }
  },[isFocused, userInfo]);

  const login = () => {
    setLoginPageVisibility(true)
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <UserInfo onSignout={onSignout} myDesignNum={design.length} myCollectionNum={collected.length}/>
      {!localLogin && <View style={{alignItems: "center"}}>
        <GradientDivider style={{width: screenWidth, height: 1, marginBottom: 80}}></GradientDivider>
            <GradientButtonAction onPress={login}>
                <Text style={styles.loginButtonText}>Sign Up Now!</Text>
            </GradientButtonAction>
        </View>}
      {localLogin && <View>
        <GradientMenuHeader $colored={true} style={{alignSelf:"flex-start", paddingHorizontal: PADDINGS.md}}>My Gallery</GradientMenuHeader>
        <View style={styles.buttonRow}>
            <GradientButtonSelection onPress={() => {setIndex(0)}} style={styles.buttonSelectionStyle} $selected={index===0 && true}><ButtonP>My Design</ButtonP></GradientButtonSelection>
            <GradientButtonSelection onPress={() => setIndex(1)} style={styles.buttonSelectionStyle} $selected={index===1 && true} ><ButtonP>Collection</ButtonP></GradientButtonSelection>
            {/* <GradientButtonSelection onPress={() => setIndex(2)}  style={styles.buttonSelectionStyle} $selected={index===2 && true}><ButtonP>Single Nail</ButtonP></GradientButtonSelection> */}
        </View>
        <View
            style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            flexWrap: "wrap",
            }} >
        {
          index==0 && design.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
        }
        {
            index==1 && collected.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
        }
        {/* {
          index==2 && singleNail.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
        } */}
        </View>
      </View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  buttonRow:{
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  buttonSelectionStyle:{
    paddingLeft: 30,
    paddingRight: 30,
  },
  loginButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20
}
});
