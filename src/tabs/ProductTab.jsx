import React from "react";
import axios from "axios";
import { TouchableOpacity, View, StyleSheet, SafeAreaView,   Dimensions, FlatList, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { useState, useEffect } from "react";
import { APIs, getHeader } from "../utils/API";
import { handleError } from "../utils/Common";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { Image, Button, Text } from '@rneui/themed';
import { MenuHeader,ButtonH, ButtonP, TitleHeader,P, SubHeader } from "../styles/texts";
import { ButtonAction } from "../styles/buttons";
import { COLORS, PADDINGS } from "../styles/theme";
import { getCart, setCart } from "../utils/UserUtils";

const size = 50;
const iconSize = 20;
const { width: screenWidth } = Dimensions.get("window");

const Pictures = ({ url }) => {
  const [activeIndex, setActiveIndex] = useState(0);
    return(
    <SafeAreaView style={{flex: 17, marginBottom:PADDINGS.sm }}>
    <View>
        <Image
          containerStyle={{
            borderRadius: 5,
            padding: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}
            source={{uri: url}}
          />
    </View>
  </SafeAreaView>)
}

const Explore = ({ }) => {
  const { userInfo } = useAuthenticationContext();
  const headers = getHeader(userInfo.idToken);
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    async function _loadProducts() {
      axios
        .get(
          `${APIs.GET_PRODUCTS}recommended/`,
          { headers }
        )
        .then((res) => {
          setProductList(JSON.parse(JSON.stringify(res.data.products)));
        })
        .catch((e) => {
          handleError(e);
        });
    }
    if (productList.length == 0) { _loadProducts(); }
    
  });
    return <View>
      <View>
        <SubHeader >You Might Also Like </SubHeader>
      </View>
      <ScrollView horizontal >
        <View style={{ flexDirection: "row" }}>
        {
          productList.map((e, idx) => <GalleryCard key={idx} item={e} style={{width: 100}} />)
        }
        </View>
     
      </ScrollView>
      
    </View>
}

const ButtonGroup = ({ productID }) => {
  productID = String(productID)
  const { userInfo } = useAuthenticationContext();
  const headers = getHeader(userInfo.idToken);
  const [collected, setCollected] = useState(false)

  useEffect(() => {
    async function _getCollect() {
      axios.get(
        `${APIs.LIKE_COLLECT}collected_product?product_id=${String(productID)}`,
        { headers }
      ).then(res => {
        setCollected(res.data.exists)
      }).catch(e => handleError(e))
    }
    _getCollect()
  },[productID]);

  useEffect(() => {
    async function _getCollect() {
      axios.get(
        `${APIs.LIKE_COLLECT}collected_product?product_id=${String(productID)}`,
        { headers }
      ).then(res => {
        setCollected(res.data.exists)
      }).catch(e => handleError(e))
    }
    _getCollect()
  },[productID]);

  let cart
  useEffect(() => {
      async function _getCart() {
          cart = await getCart()
      }
      _getCart()
  })
  return <View style={{ 
      flexDirection: "row", alignSelf: "center"
    }}>
        <ButtonAction style={{
            display: "inline-flex",
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center"
          }} 
        onPress={() => {
          let URL = collected? APIs.DELETE_LIKE_COLLECT: APIs.LIKE_COLLECT
          axios.post(
            URL,
            {
              shopify_product_id: String(productID),
              action: 2,
            }, { headers }
          ).then().catch((e) => {
            handleError(e);
          });
          setCollected(!collected);
      }}>
            <ButtonH>{collected ? "UnCollect" : "Add to Collection"}</ButtonH>
        </ButtonAction>
           
      <ButtonAction style={{ display: "inline-flex", flexDirection: "row", alignItems: "center"}}
        onPress={() => {
          let found = false;
          for (var i = 0; i < cart.length; i++) {
            if (cart[i].id == productID) {
              found = true;
              setCart(productID, cart[i].quantity+1)
            }
          }
          if (!found) {
            setCart(productID, 1)
          }
        }}>
       
            <ButtonH>Add to Cart</ButtonH>
            <MaterialCommunityIcons
                name="cart-outline"
                size={iconSize}
                style={{color:COLORS.white, paddingLeft:PADDINGS.sm}}/>
            
        </ButtonAction>
    </View>
}

const Like = ({ productID }) => {
  const { userInfo } = useAuthenticationContext();
  const headers = getHeader(userInfo.idToken);
  const [liked, setLiked] = useState(false)
  
  useEffect(() => {
    async function _getLike() {
      axios.get(
        `${APIs.LIKE_COLLECT}liked_product?product_id=${String(productID)}`,
        { headers }
      ).then(res => {
        setLiked(res.data.exists)
      }).catch(e => handleError(e))
    }
    _getLike()
  },[productID]);

  return <ButtonAction $isWhite={true} style={{height:30, flex:0.5}}
    onPress={() => {
      let URL = liked? APIs.DELETE_LIKE_COLLECT: APIs.LIKE_COLLECT
      axios.post(
        URL,
        {
          shopify_product_id: String(productID),
          action: 1,
        }, { headers }
      ).then().catch((e) => {
        handleError(e);
      });
      setLiked(!liked);
    }}>
      <View
        style={{
        display: "inline-flex",
        flexDirection: "row",
        alignSelf: "center",}}
      >
          <ButtonP style={{ alignSelf: "center"}}>Like</ButtonP>
          <MaterialCommunityIcons
          name={liked ? "heart": "heart-outline"}
          size={iconSize}
          color={COLORS.white}/>
    </View>
  </ButtonAction>
}

const Creator = ({ user }) => {
    return <View style={{flexDirection: "row",margin: 10, flex: 5}}>
      <Image source={{uri: user.avatar}}  containerStyle={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "gray",
            marginRight: 6,
            }}/>
        <View style={{alignItems: "center"}}>
        <SubHeader style={{marginBottom: 5,alignSelf: "flex-start"}}>{user.fullName}</SubHeader>
        <P>Modern Artist</P>
        </View>
    </View>
   
}

export const ProductTab = ({ route, navigation }) => {
  const item = route.params.product
  console.log("product tab", item)
  return (
        <View style={styles.container}>
         <TouchableOpacity>
            <MaterialCommunityIcons
            name="chevron-left"
            size={iconSize}
            style={{ color:COLORS.white, right: 0 }}
            onPress={() => {
              navigation.goBack();
            }}/>
        </TouchableOpacity>
        <Pictures url={item.image.src}/> 
        <View style={{ flex: 6, marginBottom:PADDINGS.sm }}>
            <View style={{flex: 4, flexDirection: "row", }}>
              <SubHeader style={{flex: 4 }}>{item.title}</SubHeader>
              {/* some optional like when params go in */}
          {item.user && item.user.fullName !== "emoai-original" && <Like productID={item.id} />}
            </View>
            <Text style={{flex: 1}}>${item.price}</Text>
        <Text style={{ flex: 3 }}>{ item.body_html }</Text>
        </View>
        <SubHeader style={{alignSelf:"flex-start"}}>Creator</SubHeader>
           
            {/* some optional creator info */}
          {item.user && item.user.fullName !== "emoai-original" && <Creator user={item.user} />}
            <Explore/>
            <ButtonGroup productID={item.id}/>
        </View>
    ) 
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    flexDirection: "column",
    },
  });