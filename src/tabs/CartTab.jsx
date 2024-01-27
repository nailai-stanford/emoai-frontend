import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getCart, setCart} from '../utils/UserUtils';
import {getHeader, APIs} from '../utils/API';
import {handleError} from '../utils/Common';
import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import axios from 'axios';
import {Image, Button} from '@rneui/themed';
import {useIsFocused} from '@react-navigation/native';

import {ButtonAction, ButtonSelection} from '../styles/buttons';
import {P, ButtonP, MenuHeader, TitleHeader, SubHeader} from '../styles/texts';
import {COLORS, PADDINGS} from '../styles/theme';
import {TABs} from '../static/Constants';

const iconSize = 20;
const pictureHeight = 60;
const pictureWidth = 60;
const pictureRadius = 10;

const CheckoutItem = ({item, total, setTotal, cartItems, setCartItems}) => {
  maybeItem = cartItems.filter(e => e.id == item.id);
  if (maybeItem.length == 0) {
    return;
  }
  let num = maybeItem[0].quantity;
  const [quantity, setQuantity] = useState(num);

  useEffect(() => {
    setTotal(prevTotal => prevTotal + item.price * quantity);
  }, []);

  return (
    <View>
      {quantity > 0 && (
        <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
          <Image
            source={{uri: item.image.src}}
            containerStyle={{
              flex: 1,
              backgroundColor: 'gray',
              height: pictureHeight,
              width: pictureWidth,
              margin: 20,
              borderRadius: pictureRadius,
            }}
          />
          <View style={{flexDirection: 'column', flex: 2}}>
            <P $alignLeft={true}>{item.title}</P>
            <P $alignLeft={true}>{item.price}</P>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons
                name="minus"
                size={iconSize}
                color={COLORS.white}
                onPress={() => {
                  let copy = JSON.parse(JSON.stringify(cartItems));
                  if (quantity > 0) {
                    setTotal(
                      prevTotal =>
                        prevTotal - (quantity === 0 ? 0 : item.price),
                    );
                    copy.forEach(element => {
                      if (element.id == item.id) {
                        element.quantity = quantity - 1;
                        setCart(element.id, element.quantity);
                      }
                    });
                    setQuantity(quantity - 1);
                  }
                  setCartItems(copy);
                }}
              />
              <P>{quantity}</P>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="plus"
                  size={iconSize}
                  color={COLORS.white}
                  onPress={() => {
                    let copy = JSON.parse(JSON.stringify(cartItems));
                    setTotal(prevTotal => prevTotal + item.price);
                    copy.forEach(element => {
                      if (element.id == item.id) {
                        element.quantity = quantity + 1;
                        setCart(element.id, element.quantity);
                      }
                    });
                    setQuantity(quantity + 1);
                    setCartItems(copy);
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export const CartTab = ({navigation}) => {
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const {userInfo} = useAuthenticationContext();

  const headers = getHeader(userInfo.idToken);
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function _fetchCart() {
      const res = await getCart();
      setCartItems(JSON.parse(JSON.stringify(res)));
    }
    _fetchCart();
  }, [isFocused]);

  useEffect(() => {
    let ids = Array();
    cartItems.forEach(e => {
      if (e.quantity > 0) {
        ids.push(String(e.id));
      }
    });
    async function _loadProducts() {
      cartItems.length > 0 &&
        axios
          .get(`${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent(ids)}`, {
            headers,
          })
          .then(res => {
            setProducts(JSON.parse(JSON.stringify(res.data.products)));
          })
          .catch(e => {
            handleError(e);
          });
    }
    _loadProducts();
  }, [cartItems]);

  return (
    <View style={styles.container}>
      {products.length > 0 && (
        <View style={styles.container}>
          <SafeAreaView style={{flex: 7}}>
            <FlatList
              data={products}
              renderItem={({item}) => (
                <CheckoutItem
                  item={item}
                  total={total}
                  setTotal={setTotal}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              )}
              keyExtractor={item => item.id.toString()} // Updated key extractor
              numColumns={1}
            />
          </SafeAreaView>
          <P style={{flex: 1}}>Total: {Number(total).toFixed(2)} </P>

          <ButtonAction
            onPress={() => {
              const confirmedItems = products.map(e => {
                maybeItem = cartItems.filter(item => e.id == item.id);
                if (maybeItem.length == 0) {
                  return;
                }
                return {
                  image: e.image.src,
                  title: e.title,
                  price: e.price,
                  quantity: maybeItem[0].quantity,
                  id: e.id,
                };
              });
              navigation.navigate(TABs.PAYMENT, {
                products: confirmedItems,
                total: total,
              });
            }}>
            <ButtonP>Check Out</ButtonP>
          </ButtonAction>
        </View>
      )}
      {products.length === 0 && (
        <View>
          <TitleHeader>Oops, your cart is empty</TitleHeader>
          <P>Go and discover something new!</P>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
  },
});
