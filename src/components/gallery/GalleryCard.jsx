import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, ImageBackground } from "react-native";import { TABs } from "../../static/Constants";
import { useNavigation } from '@react-navigation/native';
import { useAuthenticationContext } from "../../providers/AuthenticationProvider";
import { useCartContext } from "../../providers/CartContextProvider";
import { APIs, POST, getHeader} from "../../utils/API";
import LinearGradient from "react-native-linear-gradient";


import { ACTION_ICONS } from "../../styles/icons";
import { SubHeader,P, GradientP, GradientMenuHeader } from "../../styles/texts";
import { COLORS } from "../../styles/theme";

import axios from "axios";
import { useEffect } from "react";
import { GradientButtonAction } from "../../styles/buttons";
import { handleError } from "../../utils/Common";

export const GalleryCard = ({ item, style }) => {
  const { user, image } = item;
  const showUser = user && Object.keys(user).length > 0;

  const avatarSize = 16;
  const productId = item && item.id? item.id : ""
  const { userInfo, signout} = useAuthenticationContext();
  const {setCart} = useCartContext();

  const productImageStyle = {
    minHeight: 95,
    minWidth: 100,
    borderRadius: 15,
    backgroundColor: "white",
    marginBottom: 10,
  };
  const navigation = useNavigation();

  // remove after text in title after :
  const truncateTitle = (title) => {
    let titleList = title.split(':')
    return (titleList[0] ? titleList[0] : title)
  }
    

  const add_to_cart = async () => {
    if (!userInfo) {
      // todo: show login pop  window
      return
    }
    if(productId) {
      payload = {actions: [{id: String(productId), count: 1}]}
      resp = await POST(APIs.ORDER_UPDATE, payload, userInfo, signout)
      if (resp.status === 200) {
        setCart(resp.data)
      } else {
        console.log('GalleryCard: add_to_cart failed:', resp) 
      }
    }
  }



  // make price according to promotion
  const makePrice = () => {
    if (item.promotion) {
      return (
        <View style={{ flex: 1, flexDirection:'row' }}>
          <P $alignLeft style={{ color: "white", textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>${item.price}</P>
          <GradientP $alignLeft $hideBold={false}> ${item.you_pay_price}</GradientP>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <P $alignLeft> ${item.you_pay_price}</P>
        </View>
      )
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             render gallery card                            */
  /* -------------------------------------------------------------------------- */
  return (
    <View
      style={{
        ...style,
        minHeight: 200,
        minWidth: 140,
        backgroundColor: "transparent",
        flex: 1,
        borderRadius: 15,
        padding: 10,
        display: "inline-flex",
        flexDirection: "column",
        margin: 6,
        }}
    >

      <TouchableOpacity onPress={() => {
        navigation.navigate(TABs.PRODUCT, {product: item})
      }}
      >
        {image ? 
          <ImageBackground style={productImageStyle} imageStyle={{borderRadius:15}} source={{ uri: image.src }} > 
          { !!item.promotion && 
              <LinearGradient style={{bottom:0, position:'absolute', width:'70%', height: 20, borderBottomLeftRadius:15, borderTopRightRadius:15, justifyContent:'center', alignItems:'center'}}
                colors={COLORS.gradient1}
                useAngle={true} angle={45} angleCenter={{x:0.5,y:0.5}}
                locations={[0.14,0.49,0.83]}
              >
                  <P style={{fontSize:10}}>Limited Time Sale!</P>
              </LinearGradient>}
        </ImageBackground> 

        : <View style={productImageStyle} />}

      </TouchableOpacity>

      
      <View style={{ flex: 0.8 }}>
        <SubHeader $alignLeft style={{ color: "white", fontSize: 14}} numberOfLines={1}>{truncateTitle(item.title)}</SubHeader>
      </View>

      {showUser && (
        <View
          style={{
            flex: 0.8,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Image
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            }}
            source={{ uri: user.avatar }}
          />
          <P style={{ marginLeft: 8, color: "white", fontSize:12 }}>{user.fullName}</P>
        </View>
      )}

      <View style={{ flex: 1 }}>
        
        {makePrice()}
        <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 10 }} 
        onPress={add_to_cart}>

        <ACTION_ICONS.addSmall
          name="plus-circle" color="white"
          height={25}
          width={25}
        />
        </TouchableOpacity>
      </View>
    </View>
  );
};