import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity } from "react-native";import { TABs } from "../../static/Constants";
import { useNavigation } from '@react-navigation/native';
import { getCart, setCart } from "../../utils/UserUtils";
import { useEffect } from "react";
import { ACTION_ICONS } from "../../styles/icons";
import { SubHeader,P } from "../../styles/texts";

export const GalleryCard = ({ item, style }) => {
  const { user, image } = item;
  const showUser = user && Object.keys(user).length > 0;
  const avatarSize = 16;
  const productImageStyle = {
    minHeight: 100,
    minWidth: 100,
    borderRadius: 15,
    backgroundColor: "white",
    marginBottom: 10,
  };
  const navigation = useNavigation();
  let cart
  useEffect(() => {
      async function _getCart() {
          cart = await getCart()
      }
      _getCart()
  })

  // remove after text in title after :
  const truncateTitle = (title) => {
    let titleList = title.split(':')
    console.log(titleList[0])
    return titleList[0]
  }
    
  return (
    <View
      style={{
        ...style,
        minHeight: 220,
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
        <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 8 }} 
        onPress={() => {
            let found = false;
            for (var i = 0; i < cart.length; i++) {
              if (cart[i].id == item.id) {
                found = true;
                setCart(item.id, cart[i].quantity+1)
              }
            }
            if (!found) {
              setCart(item.id, 1)
            }
          }}>
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