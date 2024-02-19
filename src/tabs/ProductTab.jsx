import React from "react";
import axios from "axios";
import { TouchableOpacity, View, StyleSheet, SafeAreaView,   Dimensions, FlatList, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { useState, useEffect, useRef} from "react";
import { APIs, getHeader } from "../utils/API";
import { handleError } from "../utils/Common";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { CartContextProvider, useCartContext } from "../providers/CartContextProvider";
import { Image, Button, Text } from '@rneui/themed';
import { MenuHeader,ButtonH, ButtonP, TitleHeader,P, SubHeader, TermTitle } from "../styles/texts";
import { ButtonAction,ButtonSelection, GradientButtonAction } from "../styles/buttons";
import { BORDERS, COLORS, PADDINGS } from "../styles/theme";
import { ACTION_ICONS } from "../styles/icons";
import { useToast } from "react-native-toast-notifications";
import Carousel, {Pagination} from 'react-native-snap-carousel';



const size = 50;
const iconSize = 20;
const { width: screenWidth } = Dimensions.get("window");


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

export const HeadImages = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isCarousel = useRef(null);
  console.log("images", images)
  const _renderItem = ({ item, index }, parallaxProps) => {
    console.log('_renderItem:', item)
    return (
      <View
      
        style={{
          backgroundColor: "transparent",
          borderRadius: BORDERS.boxRadius,
      }}
      >
        <Image source={{ uri: item }} 
        style={{
            width: screenWidth / 5 * 3,
            borderRadius: BORDERS.standartRadius, 
            marginTop: 10, 
            height: screenWidth / 5 * 3,
        }}
      />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ 
        alignSelf: "center", postion: "absolute", bottom: 0, width: screenWidth, 
        flex: 1, backgroundColor: "transparent",
      }}
    >
        <Carousel
          layout={"default"}
          ref={isCarousel}
          data={images}
          sliderWidth={screenWidth}
          itemWidth={screenWidth / 5 * 3}
          renderItem={_renderItem}
          onSnapToItem={(index) => setActiveIndex(index)}
          hasParallaxImages={true}
          style ={{   marginBottom:0, paddingBottom:0}}
        />
        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeIndex}
          carouselRef={isCarousel}
          dotStyle={{
            width: 20,
            height: 4,
            borderRadius: 2,
            marginHorizontal: -5,
            marginTop: 10,
            backgroundColor: COLORS.gradientSub1,
          }}
          tappableDots={true}
          inactiveDotStyle={{
            backgroundColor: COLORS.white,
            width: 6,
            borderRadius: 3,
            marginHorizontal: -10,
            height: 6,
            // Define styles for inactive dots here
          }}
          inactiveDotOpacity={1}
          containerStyle ={{   marginTop:0, paddingTop:0}}

      />
    </SafeAreaView>
  );
};


const ButtonGroup = ({ productID }) => {
  productID = String(productID)
  const { userInfo } = useAuthenticationContext();
  const headers = getHeader(userInfo.idToken);
  const [collected, setCollected] = useState(false)
  const {setCart} = useCartContext()
  const toast = useToast();
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
        </GradientButtonAction>
           
      <GradientButtonAction style={{ display: "inline-flex", flexDirection: "row", alignItems: "center"}}
        onPress={() => {
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
            handleError(e);
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
  const { userInfo } = useAuthenticationContext();
  const headers = getHeader(userInfo.idToken);
  const item = route.params.product
  const productId = item.id
  const [title, setTitle] = useState(item.title ? item.title : "")
  const [price, setPrice] = useState(item.price ? item.price : "")
  const [description, setDescription] = useState(item.body_html ? item.body_html : "")
  const [images, setImages] = useState(item.image && item.image.src ? [item.image.src] : [])
  const [terms, setTerms] = useState([])
  const [creator, setCreator] = useState()
  useEffect(() => {
    async function get_product_detail() {
      axios.get(
        `${APIs.GET_PRODUCTS}${String(productId)}`,
        { headers }
      ).then(res => {
        data = res.data
        setTitle(data.title)
        setPrice(data.price)
        setDescription(data.description)
        setImages(data.images)
        setTerms(data.terms)
      }).catch(e => {
        console.log('error', e)
      })
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
            <P style={{flex: 0.3}} $alignLeft={true}>${price}</P>
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
        <Explore  />
        </View>
        </ScrollView>
      <ButtonGroup productID={item.id} />
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