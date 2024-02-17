import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TABs } from "../../static/Constants";
import { useNavigation } from '@react-navigation/native';
import { getCart, setCart } from "../../utils/UserUtils";
import { useEffect } from "react";
import { ACTION_ICONS } from "../../styles/icons";

export const GalleryCard = ({ item, style }) => {
  const { user, image } = item;
  const showUser = user && Object.keys(user).length > 0;
  const avatarSize = 20;
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
            flex: 1,
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
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
          <Text style={{ marginLeft: 8, color: "white" }}>{user.fullName}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white" }}>{item.title}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white" }}>${item.price}</Text>
        <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 1 }} 
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