import { View, Text, Touchable, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TAB_TITLES, TABs } from "../static/Constants";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useCartContext } from "../providers/CartContextProvider";
import { Input, Icon, Button } from '@rneui/themed';
import { COLORS, PADDINGS } from "../styles/theme";
import { MenuHeader } from "../styles/texts";
import { ACTION_ICONS } from "../styles/icons";
import { useEffect, useState } from "react";
import { getHeader, APIs } from "../utils/API";
import axios from "axios";
import { handleError } from "../utils/Common";


const iconSize = 20;
const GoBackScreens = [TABs.THEME, TABs.COLLECTION, TABs.CART, TABs.SETTINGS, TABs.ADDRESS]
export const Header = (props) => {
  // TODO Refactor CSS styles
  const route = props.route;
  const showButtons = Boolean(route.name !== TABs.AICHAT && route.name != TABs.PROFILE && (route.name != TABs.SETTINGS) && route.name != TABs.ADDRESS ) ;
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

  let title;
  if (tabName == TABs.HOME) {
    title = TAB_TITLES[tabName].replace(
      "{NAME}",
      userInfo ? userInfo.user.name : "user"
    );
  } else {
    title = TAB_TITLES[tabName];
  }
  return (
    <View style={{ flex: 1 }}>
      <MenuHeader>{title}</MenuHeader>
    </View>
  );
};

const ButtonGroup = (props ) => {
  const {cart, setCart} = useCartContext();
  const { userInfo } = useAuthenticationContext();
  const [productCount, setProductCount] = useState(0)
  const navigation = props.navigation;
  const route = props.route;

  useEffect(() => {
    console.log(route.name)
  }, [route])
  
  useEffect(() => {
    if(userInfo && userInfo.idToken) {
      const headers = getHeader(userInfo.idToken);
      async function _fetchCart() {
        axios.get(
          `${APIs.ORDER_FETCH}`,
          { headers }
        ).then(
          res => {
            const cart = JSON.parse(JSON.stringify(res.data))
            setCart(cart)
          }
        ).catch(e => {
          handleError(e)
        })
      }
      _fetchCart()
    }
  }, [userInfo])

  useEffect(()=> {
    if (cart && cart.products && cart.products.length > 0) {
      setProductCount(cart.products.length)
    } else {
      setProductCount(0)
    }
  }, [cart])

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
      {route.name !== TABs.Home && 
      <TouchableOpacity size={iconSize} style={{ position: "absolute", right: 30 }} onPress={() => navigation.navigate(TABs.HOME)}>
        <ACTION_ICONS.home
          stroke={COLORS.white}
          size={iconSize}
        />
      </TouchableOpacity>
      }
      <TouchableOpacity style={{ position: "absolute", right: 0 }} onPress={() => navigation.navigate(TABs.CART)}>
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

    </View>
  );
};
