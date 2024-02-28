import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {getHeader, APIs, GET, POST} from '../utils/API';
import {handleError} from '../utils/Common';
import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import { useCartContext } from '../providers/CartContextProvider';
import {Image, Button} from '@rneui/themed';

import {ButtonAction, ButtonSelection, GradientButtonAction} from '../styles/buttons';
import {P, ButtonP, MenuHeader, TitleHeader, SubHeader} from '../styles/texts';
import {COLORS, PADDINGS} from '../styles/theme';
import {TABs} from '../static/Constants';
import { ACTION_ICONS } from '../styles/icons';

const iconSize = 20;
const pictureHeight = 60;
const pictureWidth = 60;
const pictureRadius = 10;

const CheckoutItem = ({userInfo, signout, item, setCart, updateTotal}) => {

  const [quantity, setQuantity] = useState(item.quantity);
  const id = item.product_id
  

  const update_quantity = async (value) => {
    if (!userInfo) {
      // todo: show login pop window
      return
    }
    if(id) {
      payload = {actions: [{id: String(id), count: value}]}
      resp = await POST(APIs.ORDER_UPDATE, payload, userInfo, signout)
      if (resp.status === 200) {
        setCart(resp.data)
      }
    }
  }

  return (
    <View>
      {quantity > 0 && (
        <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
          <Image
            source={{uri: item.img_url}}
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
            <P $alignLeft={true}>{item.you_pay_price}</P>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity 
                style={{paddingHorizontal: 3, height:iconSize, width:iconSize, justifyContent:'center'}}
                onPress={() => {
                  // let copy = JSON.parse(JSON.stringify(cartItems));
                  if (quantity > 0) {
                    setQuantity(quantity - 1);
                    update_quantity(-1)
                    updateTotal(-Number(item.you_pay_price).toFixed(2))
                  }
                }}>
                <ACTION_ICONS.minus
                  color={COLORS.white}
                />
              </TouchableOpacity>
              <P>{quantity}</P>
              <TouchableOpacity 
                  style={{paddingHorizontal: 10, height:iconSize, width:iconSize, justifyContent:'center'}}
                  onPress={() => {
                    setQuantity(quantity + 1);
                    update_quantity(1)
                    updateTotal(Number(item.you_pay_price).toFixed(2))
                  }}>
                  <ACTION_ICONS.plus
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
  const {userInfo, signout} = useAuthenticationContext();
  const {cart, setCart} = useCartContext();
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function _fetchCart() {
      resp = await GET(`${APIs.ORDER_FETCH}`, userInfo)
      if (resp.status === 200) {
        const cart = JSON.parse(JSON.stringify(resp.data))
        setCart(cart)
      }
    }
    
    if (userInfo) {
      _fetchCart()
    }
  }, [userInfo]);

  useEffect(()=> {
    if(cart && cart.total_price) {
      setTotal(Number(cart.total_price))
    }
  }, [cart])

  const updateTotal = (value) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue) && !isNaN(total)) {
        setTotal(previousTotal => previousTotal + numericValue);
    } else {
        console.error("Invalid number input:", value);
    }
  }

  return (
    <View style={styles.container}>
      {cart && cart.products && cart.products.length > 0 ? (
        <View style={styles.container}>
          <SafeAreaView style={{flex: 7}}>
            <FlatList
              data={cart.products}
              renderItem={({item}) => (
                <CheckoutItem
                  userInfo = {userInfo}
                  signout={signout}
                  item={item}
                  setCart={setCart}
                  updateTotal={updateTotal}
                />
              )}
              keyExtractor={item => item.product_id.toString()} // Updated key extractor
              numColumns={1}
            />
          </SafeAreaView>
          <P style={{flex: 1}}>Total: $ {Number(total).toFixed(2)} </P>

          <GradientButtonAction
            onPress={() => {
              navigation.navigate(TABs.PAYMENT);
            }}>
            <ButtonP>Check Out</ButtonP>
          </GradientButtonAction>
        </View>
      ) : (
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
    paddingBottom: 60,
    flexDirection: 'column',
  },
});
