import React, {useEffect, useState} from 'react';
import {useStripe, AddressSheet} from '@stripe/stripe-react-native';
import {getHeader, APIs, POST, GET} from '../utils/API';
import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import { useCartContext } from '../providers/CartContextProvider';

import {Image} from '@rneui/themed';

import {View, ScrollView, Alert, StyleSheet} from 'react-native';
import {ButtonH, ButtonP, TitleHeader, P, SubHeader} from '../styles/texts';
import {
  ButtonAction,
  ButtonSelection,
  GradientButtonAction,
} from '../styles/buttons';
import {handleError} from '../utils/Common';
import {TABs} from '../static/Constants';
import {isAwaitKeyword} from 'typescript';

export const PaymentTab = ({route, navigation}) => {
  const [addrVisible, setAddrVisible] = useState(false);
  const {userInfo, signout} = useAuthenticationContext();
  const {cart, clearCart} = useCartContext();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [addrDetails, setAddrDetails] = useState({});
  let display = `${name}, ${phone}
  ${line1} ${line2} \n ${city}, ${state}, ${zip}, \n ${country} `;
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState("0")
  const [products, setProducts] = useState([])
  const [orderId, setOrderId] = useState("")

  
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const size = 50;

  useEffect(() => {
    if (cart && cart.products && cart.products.length > 0){
      setTotal(cart.total_price)
      setProducts(cart.products)
      setOrderId(cart.order_id)
    }
  }, [cart])

  useEffect(()=> {
    const fetch_address = async () => {
      resp = await GET(APIs.ADDRESS, userInfo, signout)
      if (resp.status !== 200) {
        console.log('get address failed')
        return
      }
      console.log('address:', resp.data)
      address = resp.data
      setAddrVisible(false);
      setName(address.name);
      setCountry(address.country);
      setState(address.province);
      setCity(address.city);
      setZip(address.zip);
      setPhone(address.phone);
      setLine1(address.address1);
      setLine2(address.address2);
      newAddressDetails = {
        name: address.name,
        phone: address.phone, 
        address: {
          country: address.country,
          state: address.province,
          city: address.city,
          postalCode: address.zip,
          line1: address.address1,
          line2: address.address2
        }
      }
      setAddrDetails(newAddressDetails);
    }
    if (userInfo && !(line1 && city && name && country && phone && state && zip)) {
      fetch_address()
    } else if (!userInfo) {
      signout()
    }
  }, [userInfo])

  const OrderSummary = () => {
    return (
      <View>
        {products &&
          products.map((e, idx) => (
            <View key={idx} style={{flexDirection: 'row'}}>
              <Image
                source={{uri: e.img_url}}
                containerStyle={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: 'gray',
                  marginRight: 6,
                }}
              />
              <View style={{flexDirection: 'column'}}>
                <P>{e.title}</P>
                <P>{e.you_pay_price}</P>
                <P>{e.quantity}</P>
              </View>
            </View>
          ))}
        <P>Total: {total}</P>
      </View>
    );
  };

  const showPaymentSheet = async (orderPaymentId) => {
    const {error} = await presentPaymentSheet();
    const sanitizedAddr = {...addrDetails};
    delete sanitizedAddr['target'];
    delete sanitizedAddr['isCheckboxSelected'];
    if (error) {
      console.log('presentPaymentSheet result:', error)
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      payload = {
        payment_order_id: orderPaymentId,
        shipping: sanitizedAddr
      }
      resp = await POST(APIs.ORDER, payload, userInfo, signout)
      if (resp.status === 200) {
        Alert.alert('Success', 'Your order is confirmed!');
        clearCart()
        navigation.navigate(TABs.CONFIRMATION, {name: name});
      } else {
        console.log('pay order failed:', resp)
      }
    }
  };

  const saveAddress = async(address1, address2, city, name, country, phone, province, zip) => {
    console.log('save address:', address1, address2, city, name, country, phone, province, zip)
    if (!(address1 && city && name && country && phone && province && zip)) {
      console.log('missing address info, could not save')
      return
    }
    idToken = ''
    if (userInfo) {
      idToken = userInfo.idToken
    }
    const headers = getHeader(idToken);
    
    payload = {
      address1: address1,
      address2: address2,
      city: city,
      name: name,
      country: country,
      phone: phone,
      province: province,
      zip: zip,
    }
    resp = await POST(APIs.ADDRESS, payload, userInfo, signout)
    if (resp.status !== 200) {
      console.log('save address failed')
    }
  }

  const getPaymentSheet = async orderId => {
    const sanitizedAddr = {...addrDetails};
    delete sanitizedAddr['target'];
    delete sanitizedAddr['isCheckboxSelected'];
    let addressClean = {...sanitizedAddr['address']};
    delete sanitizedAddr['address'];
    let zip_code = addressClean['postalCode'];
    delete addressClean['postalCode'];
    addressClean['postal_code'] = zip_code;
    sanitizedAddr['address'] = addressClean;
  
    const resp = await POST(`${APIs.PAYMENT}payment-sheet`, 
    {orderId: orderId, name: name, shipping: sanitizedAddr, phone: phone}, userInfo)
    
    if (resp.status !== 200) {
      console.log('getPaymentSheet failed')
      return
    }
    const {paymentIntent, ephemeralKey, customer, orderPaymentId} = resp.data;
    let {error} = await initPaymentSheet({
      merchantDisplayName: 'EMOAI, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: false,
      // returnUrl: 'yourapp://post-payment',
      defaultBillingDetails: {
        name: name,
        country: country,
        postalCode: zip,
      },
      defaultShippingDetails: addrDetails,
    });
    if (!error) {
      setLoading(true);
    }
    showPaymentSheet(orderPaymentId);
  };

  //  Stripe UI guide:
  // https://stripe.com/docs/elements/appearance-api?platform=react-native
  return (
    <View style={styles.container}>
      <ScrollView>
        <OrderSummary
          products={products}
          total={total}
        />
        <View style={{margin: 10}}>
          <SubHeader>Shipping Address</SubHeader>
          <P>{display}</P>
        </View>

        <GradientButtonAction
          onPress={() => {
            setAddrVisible(true);
          }}>
          <ButtonP>Set Shipping Address</ButtonP>
        </GradientButtonAction>
        <AddressSheet
          appearance={{
            colors: {
              primary: '#fcfdff',
              background: '#272822',
              componentBackground: '#f3f8fa',
            },
          }}
          additionalFields={{
            phoneNumber: 'required',
          }}
          defaultValues={addrDetails}
          allowedCountries={['US', 'CA']}
          sheetTitle={'Shipping Address'}
          primaryButtonTitle={'Use this address'}
          visible={addrVisible}
          onSubmit={async addressDetails => {
            setAddrVisible(false);
            setName(addressDetails.name);
            setCountry(addressDetails.address.country);
            setState(addressDetails.address.state);
            setCity(addressDetails.address.city);
            setZip(addressDetails.address.postalCode);
            setPhone(addressDetails.phone);
            setLine1(addressDetails.address.line1);
            setLine2(addressDetails.address.line2);
            setAddrDetails(addressDetails);
            saveAddress(addressDetails.address.line1, 
              addressDetails.address.line2, addressDetails.address.city, 
              addressDetails.name, addressDetails.address.country, 
              addressDetails.phone, addressDetails.address.state, 
              addressDetails.address.postalCode)
          }}
          onError={error => {
            setAddrVisible(false);
          }}
        />
        <GradientButtonAction
          onPress={() => {
            if (name && country && state && city && zip && phone && line1 && orderId) {
              getPaymentSheet(orderId);
            } else {
              Alert.alert(
                'Make sure you have complete shipping address filled out!',
              );
            }
          }}>
          <ButtonP>Pay Now</ButtonP>
        </GradientButtonAction>
      </ScrollView>
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
