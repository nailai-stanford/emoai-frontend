import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity } from "react-native";import { TABs } from "../../static/Constants";
import { useNavigation } from '@react-navigation/native';
import { useAuthenticationContext } from "../../providers/AuthenticationProvider";
import { useCartContext } from "../../providers/CartContextProvider";
import { APIs, getHeader} from "../../utils/API";


import { ACTION_ICONS } from "../../styles/icons";
import { SubHeader,P } from "../../styles/texts";

import axios from "axios";

export const GalleryCard = ({ item, style }) => {
  const { user, image } = item;
  const showUser = user && Object.keys(user).length > 0;

  const avatarSize = 16;
  const productId = item && item.id? item.id : ""
  const { userInfo } = useAuthenticationContext();
  const {setCart} = useCartContext();

  const productImageStyle = {
    minHeight: 100,
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
    

  const add_to_cart = () => {
    const headers = getHeader(userInfo.idToken);
    if(productId) {
      payload = {actions: [{id: String(productId), count: 1}]}
      axios.post(APIs.ORDER_UPDATE, payload, { headers })
      .then(resp => {
        if (resp.status == 200) {
          setCart(resp.data)
        }
      }).catch((e) => {
        handleError(e);
      });
    }
  }
  return (
    <View
      style={{
        ...style,
        minHeight: 220,
        minWidth: 140,
        maxWidth: 185,
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
        {image ? <Image style={productImageStyle} source={{ uri: image.src }} /> : <View style={productImageStyle} />}

      </TouchableOpacity>

      {showUser && (
        <View
          style={{
            flex: 0.6,
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
      <View style={{ flex: 0.8 }}>
        <P $alignLeft style={{ color: "white", fontSize: 14}} numberOfLines={1}>{truncateTitle(item.title)}</P>
      </View>
      <View style={{ flex: 1 }}>
        <P $alignLeft style={{ color: "white" }}>${item.price}</P>
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