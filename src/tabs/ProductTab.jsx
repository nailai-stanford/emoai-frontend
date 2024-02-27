import React from "react";
import axios from "axios";
import { TouchableOpacity, View, StyleSheet, SafeAreaView,   Dimensions, FlatList, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { useState, useEffect, useRef} from "react";
import { APIs, GET, getHeader } from "../utils/API";
import { handleError } from "../utils/Common";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useCartContext } from "../providers/CartContextProvider";
import { Image, Button, Text } from '@rneui/themed';
import { MenuHeader,ButtonH, ButtonP, TitleHeader,P, SubHeader, TermTitle, GradientP } from "../styles/texts";
import { ButtonAction,ButtonSelection, GradientButtonAction } from "../styles/buttons";
import { BORDERS, COLORS, PADDINGS } from "../styles/theme";
import { ACTION_ICONS } from "../styles/icons";
import { useToast } from "react-native-toast-notifications";
import { HeadImages } from "../components/ProductHeader";
import LinearGradient from "react-native-linear-gradient";

const size = 50;
const iconSize = 20;
const { width: screenWidth } = Dimensions.get("window");


const Recommend = ({ }) => {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    async function get_recommend_products() {
      resp = await GET(`${APIs.GET_PRODUCTS}recommended/`)
      if (resp.status === 200) {
        setProductList(JSON.parse(JSON.stringify(resp.data.products)));
      } 
    }
    if (productList.length == 0) {
       get_recommend_products(); 
    }
  });
    return <View>
      <View>
        <SubHeader style={{marginTop: 10}}>You Might Also Like </SubHeader>
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


const ButtonGroup = ({ productID}) => {
  productID = String(productID)
  const { userInfo, signout} = useAuthenticationContext();
  const [collected, setCollected] = useState(false)
  const {setCart} = useCartContext()
  const toast = useToast();
  useEffect(() => {
    async function _getCollect() {
      resp = await GET(`${APIs.LIKE_COLLECT}collected_product?product_id=${String(productID)}`, userInfo)
      if (resp.status === 200) {
        setCollected(resp.data.exists)
      }
    }
    if (userInfo) {
      _getCollect()
    }
  },[productID, userInfo]);

  let cart
 
  return <View style={{ 
      flexDirection: "row", alignSelf: "center", justifyContent:'center', postion: "absolute", bottom: 0, width: screenWidth, height: 50,
    }}>
        <GradientButtonAction style={{
            display: "inline-flex",
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center"
          }} 
          onPress={() => {
            // todo : login popwindow
            if (!userInfo) {
              return
            }
            const headers = getHeader(userInfo.idToken);
            let URL = collected? APIs.DELETE_LIKE_COLLECT: APIs.LIKE_COLLECT
            axios.post(
              URL,
              {
                shopify_product_id: String(productID),
                action: 2,
              }, { headers }
            ).then().catch((e) => {
              handleError(e, signout);
            });
            setCollected(!collected);
          }}>
            <ButtonH>{collected ? "UnCollect" : "Add to Collection"}</ButtonH>
        </GradientButtonAction>
           
      <GradientButtonAction style={{ display: "inline-flex", flexDirection: "row", alignItems: "center"}}
        onPress={() => {
          if (!userInfo) {
            return
          }
          const headers = getHeader(userInfo.idToken);
          payload = {actions: [{id: String(productID), count: 1}]}
          axios.post(APIs.ORDER_UPDATE, payload, { headers })
          .then(resp => {
            if (resp.status === 200) {
              setCart(resp.data)
              toast.show("Added to cart", {
                type: "normal",
                placement: "bottom",
                duration: 1000,
                animationType: "zoom-in",
                style : {
                  marginBottom: 150
                }
              })
            }
          }).catch((e) => {
            handleError(e, signout);
          });
        }}>
       
            <ButtonH>Add to Cart</ButtonH>
            <ACTION_ICONS.shop
                size={iconSize}
                style={{color:COLORS.white, paddingLeft:PADDINGS.sm}}/>
            
        </GradientButtonAction>
    </View>
}

const Like = ({ productID }) => {
  const { userInfo, signout } = useAuthenticationContext();
  const [liked, setLiked] = useState(false)
  
  useEffect(() => {
    async function _getLike() {
      const headers = getHeader(userInfo.idToken);
      axios.get(
        `${APIs.LIKE_COLLECT}liked_product?product_id=${String(productID)}`,
        { headers }
      ).then(res => {
        setLiked(res.data.exists)
      }).catch(e => handleError(e, signout))
    }
    if (userInfo) {
      _getLike()
    }
  },[productID]);

  return <ButtonSelection $isWhite={true} style={{height:30, flex:0.5, paddingTop: 0}}
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
        <ACTION_ICONS.like
          fill={liked? "red": "white"}/>
          <ButtonP style={{ alignSelf: "center"}}>{liked? "unlike": "like"}</ButtonP>

    </View>
  </ButtonSelection>
}

const Creator = ({ user }) => {
    return <View style={{flexDirection: "row", flex: 0.8}}>
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
  const { userInfo, signout } = useAuthenticationContext();
  const item = route.params.product
  const productId = item.id
  const [title, setTitle] = useState(item.title ? item.title : "")
  const [price, setPrice] = useState(item.you_pay_price ? item.you_pay_price : "")
  const [originalPrice, setOriginalPrice] = useState(item.price ? item.price : "" )
  const [promotion, setPromotion] = useState(item.promotion ? item.promotion : false )
  const [description, setDescription] = useState(item.body_html ? item.body_html : "")
  const [images, setImages] = useState(item.image && item.image.src ? [item.image.src] : [])
  const [terms, setTerms] = useState([])
  const [creator, setCreator] = useState()
  useEffect(() => {
    async function get_product_detail() {
      resp = await GET(`${APIs.GET_PRODUCTS}${String(productId)}`)
      if (resp.status === 200) {
        data = resp.data
        setTitle(data.title)
        setPrice(data.you_pay_price)
        setOriginalPrice(data.price)
        setPromotion(data.promotion)
        setDescription(data.description)
        setImages(data.images)
        setTerms(data.terms)
      }
    }
    get_product_detail()
  }, [productId]) 

 
  const ListItem = ({ title, content }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <View>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.titleContainer}>
          <TermTitle $alignLeft={true} style={{ flex: 1 ,paddingBottom: 10}} >{title}</TermTitle>
          <MaterialCommunityIcons size={30} name={expanded ? 'chevron-down' : 'chevron-right'} style={{ color: '#FFFFFF', marginRight: -5}}  />
        </TouchableOpacity>
        {expanded && <P style={{ paddingBottom: 10 }} $alignLeft={true} >{content}</P>}
      </View>
    );
  };

  const makePrice = () => {
    if (promotion) {
      return (
        <View style={{ flex: 0.3, flexDirection:'row', marginTop:10 }}>
          <P $alignLeft style={{ color: "white", textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>${originalPrice}</P>
          <GradientP $alignLeft $hideBold={false}> ${price}</GradientP>
          <LinearGradient style={{borderRadius: BORDERS.buttonSelectionRadius, paddingHorizontal: 10, marginLeft: 5}}
          colors={COLORS.gradient1}
          useAngle={true} angle={45} angleCenter={{x:0.5,y:0.5}}
          locations={[0.14,0.49,0.83]}
        >
           <P>Limited Time Sale!</P>
        </LinearGradient>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 0.3, marginTop:10 }}>
          <P $alignLeft> ${price}</P>
        </View>
      )
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             render product page                            */
  /* -------------------------------------------------------------------------- */
  return (
    <View style={{height:"88%"}}>
        <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => {
                navigation.goBack();
              }}>
              <ACTION_ICONS.back
              size={iconSize}
              style={{ color:COLORS.white, right: 0 }}
              />
          </TouchableOpacity>
          <HeadImages images={images}></HeadImages>
        <View style={{ flexGrow: 1, marginBottom: PADDINGS.sm }}>
            <View style={{flex: 0.8, flexDirection: "row", }}>
              <SubHeader style={{flex: 2}}>{title}</SubHeader>
              {/* some optional like when params go in */}
              {/* {item.user && item.user.fullName !== "emoai-original" && <Like productID={productId} />} */}
            </View>
            {makePrice()}
            {!!description && <P style={{ flex: 1, paddingTop: 10, paddingBottom:10 }} $alignLeft={true}>{ description }</P>}
            {terms && (
              <View style={styles.termsContainer}>
                <FlatList
                  data={terms}
                  renderItem={({ item }) => <ListItem title={item.title} content={item.content} />}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
            
         </View>
        {item.user && item.user.fullName !== "emoai-original" &&  <SubHeader style={{alignSelf:"flex-start", paddingTop:0}}>Creator</SubHeader>}
            {/* some optional creator info */}
          {item.user && item.user.fullName !== "emoai-original" && <Creator user={item.user} />}
        <Recommend />
        </View>
        </ScrollView>
      <ButtonGroup productID={item.id}/>
      </View>

    ) 
}
const styles = StyleSheet.create({
    container: {
      flex: 4,
      paddingHorizontal: 20,
      flexDirection: "column",
    },

    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });