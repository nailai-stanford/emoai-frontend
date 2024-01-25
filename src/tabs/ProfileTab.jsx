import React, {useEffect, useState} from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Tab } from '@rneui/themed';
import { UserInfo } from "../components/UserInfo";
import axios from "axios";
import { GalleryCard } from "../components/gallery/GalleryCard";

import { APIs, getHeader } from "../utils/API";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useIsFocused } from '@react-navigation/native';

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";

export const ProfileTab = ({ onSignout }) => {
  const [index, setIndex] = useState(0);
  const [design, setDesign] = useState([])
  const [collected, setCollected] = useState([])
  const [singleNail, setSingleNail] = useState([])
  const { userInfo } = useAuthenticationContext();
  const headers = getHeader(userInfo.idToken);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function _getMy() {
      axios.get(
        `${APIs.GET_PRODUCTS}my/`,
        {headers}
      ).then(
        res => {
          let copy = JSON.parse(JSON.stringify(res.data.products))
          setDesign(copy)
          }
      ).catch(e => console.log(e))
    }
     _getMy() 
  },[isFocused]);

  useEffect(() => {
    async function _getCollected() {
      axios.get(
        `${APIs.LIKE_COLLECT}collections/`,
        {headers}
      ).then(
        res => {
          if (res.data.length != 0) {
            let copy = JSON.parse(JSON.stringify(res.data.products))
            setCollected(copy)
          } 
        }
      ).catch(e => console.log(e))
    }
    _getCollected()
  },[isFocused]);

  useEffect(() => {
    async function _getCollected() {
      axios.get(
        `${APIs.GET_PRODUCTS}single_nail/`,
        {headers}
      ).then(
        res => {
          // console.log("query single nails",res.data.products)
          let copy = JSON.parse(JSON.stringify(res.data.products))
          console.log("get product, ", copy)
          setSingleNail(copy)
          }
      ).catch(e => console.log(e))
    }
    _getCollected() 
  },[isFocused]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UserInfo onSignout={onSignout} />
      <MenuHeader $colored={true} style={{alignSelf:"flex-start", paddingHorizontal: PADDINGS.md}}>My Gallery</MenuHeader>
      <View style={styles.buttonRow}>
          <ButtonSelection onPress={() => {setIndex(0)}} style={styles.buttonSelectionStyle} $selected={index===0 && true}><ButtonP>My Design</ButtonP></ButtonSelection>
          <ButtonSelection onPress={() => setIndex(1)} style={styles.buttonSelectionStyle} $selected={index===1 && true} ><ButtonP>Collection</ButtonP></ButtonSelection>
          <ButtonSelection onPress={() => setIndex(2)}  style={styles.buttonSelectionStyle} $selected={index===2 && true}><ButtonP>Single Nail</ButtonP></ButtonSelection>
      </View>
      <View
          style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          }} >
      {
        index==0 && design.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
      }
      {
          index==1 && collected.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
      }
      {
        index==2 && singleNail.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
      }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow:{
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonSelectionStyle:{
    paddingLeft: 15,
    paddingRight: 15,
  }
});
