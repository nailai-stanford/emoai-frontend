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
import {getHeader, APIs} from '../utils/API';
import {handleError} from '../utils/Common';
import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import { useCartContext } from '../providers/CartContextProvider';
import axios from 'axios';
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

const CheckoutItem = ({userInfo, item, setCart, updateTotal}) => {

  const [quantity, setQuantity] = useState(item.quantity);
  const id = item.product_id
  

  const update_quantity = (value) => {
    const headers = getHeader(userInfo.idToken);
    if(id) {
      payload = {actions: [{id: String(id), count: value}]}
      axios.post(APIs.ORDER_UPDATE, payload, { headers })
      .then(resp => {
        if (resp.status === 200) {
          setCart(resp.data)
        }
      }).catch((e) => {
        handleError(e);
      });
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
  const {userInfo} = useAuthenticationContext();

  const headers = getHeader(userInfo.idToken);
  const {cart, setCart} = useCartContext();
  const [total, setTotal] = useState(0)


  useEffect(() => {
    const headers = getHeader(userInfo.idToken);
    async function _fetchCart() {
      axios.get(
        `${APIs.ORDER_FETCH}`,
        { headers }
    ).then(
      res => {
        if (res.status == 200 && res.data) {
          const cart = JSON.parse(JSON.stringify(res.data))
          setCart(cart)
        } else {
          console.log('_fetchCart empty resp: ', res.status, res)
        }
      }
    ).catch(e => {
      console.log("_fetchCart error")
      console.log(e)
    })
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
