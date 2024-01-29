import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { TAB_TITLES, TABs } from "../static/Constants";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { Input, Icon, Button } from '@rneui/themed';
import { COLORS, PADDINGS } from "../styles/theme";
import { MenuHeader } from "../styles/texts";
import { ACTION_ICONS } from "../styles/icons";

const iconSize = 20;
const GoBackScreens = [TABs.THEME, TABs.COLLECTION, TABs.CART, TABs.SETTINGS, TABs.ADDRESS]
export const Header = (props) => {
  // TODO Refactor CSS styles
  const route = props.route;
  const showButtons = Boolean(route.name !== TABs.AICHAT && route.name != TABs.PROFILE && (route.name != TABs.SETTINGS) && route.name != TABs.ADDRESS) ;
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
  return <ACTION_ICONS.back
  size={iconSize}
  style={{ right: 0, color: COLORS.white, marginRight: PADDINGS.sm }}
  onPress={() => {
    navigation.goBack();
  }}/>
}

const ProfileIconGroup = ({ navigation }) => {
  return <View style={{
    position: "absolute",
    bottom: 0,
    right: iconSize,
    height: iconSize,
    flexDirection: "row",
  }}>
    <ACTION_ICONS.measure name='straighten'
      onPress={() => navigation.navigate(TABs.SETTINGS)}
      style={{ position: "absolute", right: 40 }}
      color={COLORS.white}
    />
    <ACTION_ICONS.setting name='settings'
      onPress={() => navigation.navigate(TABs.SETTINGS)}
      color={COLORS.white}

    />
    
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

const ButtonGroup = ({ navigation }) => {
  // TODO Different icons for the tabs
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
      <ACTION_ICONS.search
        color={iconColor}
        size={iconSize}
        onPress={() => navigation.navigate(TABs.SEARCH)}
        style={{ position: "absolute", right: 50 }}
      />
      {/* Uncomment the following code once the icons should be displayed */}
      <ACTION_ICONS.shop
        color={iconColor}
        size={iconSize}
        onPress={() => navigation.navigate(TABs.CART)}
        style={{ position: "absolute", right: 10 }}
      />
      {/* <MaterialCommunityIcons
        name="share-outline"
        color={iconColor}
        size={iconSize}
        onPress={() => navigation.navigate(TABs.SHARE_DESIGN)}
        style={{ position: "absolute", right: 0 }}
      /> */}
    </View>
  );
};
