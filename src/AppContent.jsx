
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Image } from "react-native";
// import Svg, { Path, SvgXml,SvgUri } from 'react-native-svg';
import { BlurView } from "@react-native-community/blur";


import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import {TABs} from './static/Constants';
import {useAuthenticationContext} from './providers/AuthenticationProvider';
import { useLocalLoginStatusContext } from "./providers/LocalLoginStatusContextProvider";
import { useCartContext } from "./providers/CartContextProvider";

import {
  getUserInfoFromStore,
  onPressSignIn,
  onPressLogout,
} from './utils/UserUtils';

import {LogInPage} from './tabs/LogInPage';

import {HomeTab} from './tabs/HomeTab';
import {DiscoverTab} from './tabs/DiscoverTab';
import {AITab} from './tabs/AITab';
import {AIChatTab} from './tabs/AIChatTab';
import {WorkshopTab} from './tabs/WorkshopTab';
import {WorkshopIdleTab} from './tabs/WorkshopIdleTab';
import {HandDesignTab} from './tabs/HandDesignTab';

import {NailDesignTab} from './tabs/NailDesignTab';
import {DesignPreviewTab} from './tabs/DesignPreviewTab';
import {ShareDesignTab} from './tabs/ShareDesignTab';
import {ProfileTab} from './tabs/ProfileTab';
import {LoadTab} from './tabs/LoadTab';


import {CartTab} from './tabs/CartTab';
import {Header} from './components/Header';
import {ProductTab} from './tabs/ProductTab';
import {ThemeTab} from './tabs/ThemeTab';
import {CollectionTab} from './tabs/CollectionTab';
import {SearchTab} from './tabs/SearchTab';
import {SettingsTab} from './tabs/SettingsTab';
import {AddressTab} from './tabs/AddressTab';
import {NameTab} from './tabs/NameTab';
import {PaymentTab} from './tabs/PaymentTab';
import {OrderConfirmationTab} from './tabs/OrderConfirmationTab';

import { COLORS, ICON_SIZES } from "./styles/theme";

// import svg icons

import { TAB_BAR_ICONS } from "./styles/icons";
import { LoginPopup } from "./components/LoginPopup";
import { useLocalLoginStatus } from "./providers/LocalLoginStatusContextProvider";


const Tab = createBottomTabNavigator();


export const AppContent = () => {
  const {isLoggedIn, setUserInfo} = useAuthenticationContext();
  const {isPopupVisible, localLogin, isLoginPageVisible, 
    setPopupVisibility, setLoginPageVisibility, setLocalLogin} = useLocalLoginStatusContext()
  
  const {clearCart} = useCartContext()

  useEffect(() => {
    async function _fetchUserInfo() {
      if (isLoggedIn) {
        setLocalLogin(false)
        setLoginPageVisibility(false)
        setPopupVisibility(false)
      }
      const userInfo = await getUserInfoFromStore();
      if (userInfo != null) {

        setUserInfo(userInfo);
        setLocalLogin(true);
        setLoginPageVisibility(false)
        setPopupVisibility(false)
      } else {
        setLocalLogin(false)
        setLoginPageVisibility(false)
        setPopupVisibility(false)
      }
    }
    _fetchUserInfo();
  }, [isLoggedIn]);


  // https://reactnavigation.org/docs/tab-based-navigation/
  return (

    <ImageBackground
      source={require('../assets/bg/bg.png')}
      resizeMode="cover"
      style={styles.imageContainer}>
      {isLoginPageVisible ? <LogInPage setLocalLogin={setLocalLogin} setUserInfo={setUserInfo}/> : 
      <NavigationContainer theme={navTheme}>
          {isPopupVisible && <View style={styles.overlay}>
              <LoginPopup isVisible={isPopupVisible} toggleVisibility={togglePopupVisibility} />
            </View>
          }
        <Tab.Navigator
        backBehavior="history"
        screenOptions={({ route }) => ({
          header: (props) => {
            return <Header {...props} route={route} />;
          },
          tabBarIcon: ({ focused, color, size }) => {
            let stroke = focused ? "transparent" : COLORS.grey;
            let fill = focused ? COLORS.white : "transparent";
            switch (route.name) {
              case TABs.HOME:
                return (
                  focused ?  <TAB_BAR_ICONS.homeSelected width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={fill}  stroke={stroke}  /> 
                  : <TAB_BAR_ICONS.home width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={fill}  stroke={stroke}  /> 
                )

              case TABs.DISCOVER:
              return focused ?  <TAB_BAR_ICONS.discoverSelected width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={fill}  stroke={stroke}  /> 
              : <TAB_BAR_ICONS.discover width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={COLORS.grey}  /> 
              
              case TABs.AI:
                let currFill = focused ? COLORS.white : COLORS.grey;

                return <TAB_BAR_ICONS.aiChat width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={currFill}  stroke={stroke}  />

              case TABs.WORKSHOP_IDLE:
                currFill = focused ? COLORS.white : COLORS.grey;
                
                return <TAB_BAR_ICONS.workshop width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={fill}  stroke={currFill}  />

              case TABs.PROFILE:
                return <TAB_BAR_ICONS.profile width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={fill}  stroke={stroke}  />

            }

            // return <TAB_BAR_ICONS.home width={ICON_SIZES.standard} height={ICON_SIZES.standard} fill={fill}  stroke={stroke}  />
          },
          tabBarStyle:{
            backgroundColor: 'rgba(52, 52, 52, 0.7)',
            height:75,
            position: 'absolute'
          },
          tabBarBackground: () => (
            // <BottomBar width="100%" height="100%" />
            <BlurView
        style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 1000}}
        blurType="dark"
        blurAmount={2}
        blurRadius={5}
      />

          ),
          tabBarActiveTintColor: COLORS.white,
          tabBarInactiveTintColor: COLORS.grey,
        })}
      >
          <Tab.Screen
            name={TABs.HOME}
            component={HomeTab}
            options={{
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen
            name={TABs.PRODUCT}
            component={ProductTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.SEARCH}
            component={SearchTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen name={TABs.DISCOVER} component={DiscoverTab} />
          <Tab.Screen name={TABs.AI} component={AITab} />
          <Tab.Screen
            name={TABs.AICHAT}
            component={AIChatTab}
            options={{
              tabBarButton: () => null,
              tabBarStyle: {display: 'none'}
            }}
          />
          <Tab.Screen
            name={TABs.SETTINGS}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          >
            {() => (
              <SettingsTab
                onSignout={() => {
                  onPressLogout();
                  setLocalLogin(false);
                  clearCart();
                }}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name={TABs.ADDRESS}
            component={AddressTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.NAME}
            component={NameTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.LOAD}
            component={LoadTab}
            options={{
              tabBarButton: () => null,
              tabBarStyle: {display: 'none'}
            }}
          />
          <Tab.Screen 
            name={TABs.WORKSHOP} 
            component={WorkshopTab}
            options={{
              tabBarButton: () => null,
              tabBarStyle: {display: 'none'}
            }} />
          <Tab.Screen
            name={TABs.WORKSHOP_IDLE}
            component={WorkshopIdleTab}
            options={{ tabBarLabel: 'WORKSHOP' }}
          />
          <Tab.Screen
            name={TABs.CART}
            component={CartTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.PAYMENT}
            component={PaymentTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.CONFIRMATION}
            component={OrderConfirmationTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.HAND_DESIGN}
            component={HandDesignTab}
            options={{
              tabBarButton: () => null,
              tabBarStyle: {display: 'none'}
            }}
          />
          <Tab.Screen
            name={TABs.NAIL_DESIGN}
            component={NailDesignTab}
            options={{
              tabBarButton: () => null,
              tabBarStyle: {display: 'none'}
            }}
          />
          <Tab.Screen
            name={TABs.DESIGN_PREVIEW}
            component={DesignPreviewTab}
            options={{
              tabBarButton: () => null,
              tabBarStyle: {display: 'none'}
            }}
          />
          <Tab.Screen
            name={TABs.SHARE_DESIGN}
            component={ShareDesignTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.THEME}
            component={ThemeTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.COLLECTION}
            component={CollectionTab}
            options={{
              tabBarButton: () => null,
              tabBarVisible: false,
            }}
          />
          <Tab.Screen
            name={TABs.PROFILE}
            children={() => (
              <ProfileTab
                onSignout={() => {
                  onPressLogout();
                  setLocalLogin(false);
                  clearCart()
                }}
              />
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
      } 
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 2, // higher zIndex
    width: '100%',
    height: '100%',
  },
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

// to set background to transparent to use bg color
const navTheme = {
  ...DefaultTheme,
  colors: {
    background: 'transparent',
  },
};

// set tab bar style
const screenOptions = {
  tabBarStyle: {
    background: 'transparent',
    height: 70,
  },
  tabBarItemStyle: {
    margin: 5,
    borderRadius: 10,
  },
};
