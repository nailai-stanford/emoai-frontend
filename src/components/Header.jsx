import { View, Text, Touchable, TouchableOpacity } from "react-native";

import { TAB_TITLES, TABs } from "../static/Constants";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useCartContext } from "../providers/CartContextProvider";
import { Input, Icon, Button } from '@rneui/themed';
import { COLORS, PADDINGS } from "../styles/theme";
import { MenuHeader } from "../styles/texts";
import { ACTION_ICONS } from "../styles/icons";
import { useEffect, useState } from "react";
import { APIs, GET } from "../utils/API";
import { useLocalLoginStatusContext } from "../providers/LocalLoginStatusContextProvider";


const iconSize = 20;
const GoBackScreens = [TABs.THEME, TABs.COLLECTION, TABs.CART, TABs.SETTINGS, TABs.ADDRESS]
export const Header = (props) => {
  // TODO Refactor CSS styles
  const route = props.route;
  const showButtons = Boolean(route.name !== TABs.AICHAT && (route.name != TABs.SETTINGS) && route.name != TABs.ADDRESS ) ;
  const goBack = (route.name == TABs.THEME) || (route.name == TABs.COLLECTION) || (route.name == TABs.CART)
    || (route.name == TABs.SETTINGS) || (route.name == TABs.ADDRESS) || (route.name == TABs.NAME)
  const profileIcon = (route.name == TABs.PROFILE)
  return (
    route.name !== TABs.AICHAT &&
    <View
      style={{
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom:20,
        height: 80,
        display: "flex",
        flexDirection: "row",
        background: "transparent",
      }}
    >
      {!!goBack && <BackButton {...props} />}
      <Title {...props} />
      {!!showButtons && <ButtonGroup {...props} />}
      {!!profileIcon && <ProfileIconGroup {...props} />}
    </View>
  );
};
// TODO: make touch opacity so that the area is bigger to press
const BackButton = ({navigation}) => {
  return (<TouchableOpacity size={iconSize} onPress={() => {navigation.goBack();}}>
    <ACTION_ICONS.back
      style={{ right: 0, color: COLORS.white, marginRight: PADDINGS.sm }}
    />
  </TouchableOpacity>)
}

const ProfileIconGroup = ({ navigation }) => {
  return <View style={{
    position: "absolute",
    bottom: 0,
    right: iconSize,
    height: iconSize,
    flexDirection: "row",
  }}>
     
    {/* <TouchableOpacity   style={{ position: "absolute", right: 40 }} onPress={() => navigation.navigate(TABs.SETTINGS)}>
    <ACTION_ICONS.measure name='straighten'
      color={COLORS.white}
    />
     </TouchableOpacity>
     <TouchableOpacity  onPress={() => navigation.navigate(TABs.SETTINGS)}>
      <ACTION_ICONS.setting name='settings'
        color={COLORS.white}
      />
    </TouchableOpacity> */}
    
  </View>
}


const Title = (props) => {
  const tabName = props.route.name;
  const { userInfo } = useAuthenticationContext();
  const {localLogin} = useLocalLoginStatusContext()

  let title;
  if (tabName == TABs.HOME) {
    title = TAB_TITLES[tabName].replace(
      "{NAME}",
      localLogin && userInfo ? userInfo.user.name : "Visitor"
    );
  } else {
    title = TAB_TITLES[tabName];
  }
  return (
    <View style={{ flex: 1, height: 22}}>
      <MenuHeader>{title}</MenuHeader>
    </View>
  );
};

const ButtonGroup = (props ) => {
  const {cart, setCart} = useCartContext();
  const { userInfo, signout } = useAuthenticationContext();
  const [productCount, setProductCount] = useState(0)
  const navigation = props.navigation;
  const route = props.route;
  const showCart = Boolean(route.name !== TABs.DESIGN_PREVIEW)
  const {localLogin, setPopupVisibility } = useLocalLoginStatusContext()

  useEffect(() => {
    console.log(route.name)
  }, [route])
  
  useEffect(() => {
    async function _fetchCart() {
      resp = await GET(`${APIs.ORDER_FETCH}`, userInfo)
      if (resp.status === 200) {
        const cart = JSON.parse(JSON.stringify(resp.data))
        setCart(cart)
        setProductCount(cart.products.reduce((total, product) => total + product.quantity, 0))
      }
    }
    if(showCart && userInfo) {
      _fetchCart()
    }
  }, [userInfo])

  useEffect(()=> {
    if (cart && cart.products && cart.products.length > 0) {
      setProductCount(cart.products.reduce((total, product) => total + product.quantity, 0))
    } else {
      setProductCount(0)
    }
  }, [cart])

  const open_cart = () => {
    if (localLogin && userInfo) {
      navigation.navigate(TABs.CART)
    } else {
      setPopupVisibility(true)
    }
  }

  const iconColor = COLORS.white;
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        right: iconSize,
        height: iconSize,
      }}
    >
      {route.name !== TABs.HOME && route.name !== TABs.PROFILE && 
      <TouchableOpacity size={iconSize} style={{ position: "absolute", right: 30 }} onPress={() => navigation.navigate(TABs.HOME)}>
        <ACTION_ICONS.home
          stroke={COLORS.white}
          size={iconSize}
        />
      </TouchableOpacity>
      }
      {route.name !== TABs.DESIGN_PREVIEW && route.name !== TABs.PROFILE && 
      <TouchableOpacity style={{ position: "absolute", right: 0 }} onPress={open_cart}>
        <View>
          <ACTION_ICONS.shop
            color={iconColor}
            size={iconSize}/>
            {productCount > 0 && (
              <View style={{
                position: 'absolute',
                right: -5,
                bottom: -5,
                backgroundColor: '#7488eb',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {productCount > 99 ? '99+' : productCount.toString()}
                </Text>
              </View>
            )}
        </View>
      </TouchableOpacity>
      }
      {route.name === TABs.PROFILE && localLogin && 
        <TouchableOpacity  style={{ position: "absolute", right: 0 }} onPress={() => navigation.navigate(TABs.SETTINGS)}>
         <ACTION_ICONS.setting name='settings'
           color={COLORS.white}
         />
       </TouchableOpacity>
      }
    </View>
  );
};
