import React, {useState} from 'react';
import {useStripe, AddressSheet} from '@stripe/stripe-react-native';
import {getHeader, APIs} from '../utils/API';
import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import {Image} from '@rneui/themed';
import axios from 'axios';

import {View, ScrollView, Alert, StyleSheet} from 'react-native';
import {ButtonH, ButtonP, TitleHeader, P, SubHeader} from '../styles/texts';
import {
  ButtonAction,
  ButtonSelection,
  GradientButtonAction,
} from '../styles/buttons';
import {handleError} from '../utils/Common';
import {TABs} from '../static/Constants';
import {clearCart} from '../utils/UserUtils';
import {isAwaitKeyword} from 'typescript';

export const PaymentTab = ({route, navigation}) => {
  const [addrVisible, setAddrVisible] = useState(false);
  const {userInfo} = useAuthenticationContext();

  const headers = getHeader(userInfo.idToken);
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

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const size = 50;

  const OrderSummary = ({products, total}) => {
    return (
      <View>
        {products &&
          products.map((e, idx) => (
            <View key={idx} style={{flexDirection: 'row'}}>
              <Image
                source={{uri: e.image}}
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
                <P>{e.price}</P>
                <P>{e.quantity}</P>
              </View>
            </View>
          ))}
        <P>Total: {total}</P>
      </View>
    );
  };

  const showPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    const sanitizedAddr = {...addrDetails};
    delete sanitizedAddr['target'];
    delete sanitizedAddr['isCheckboxSelected'];
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      route.params.products.forEach(e => {
        if (e.id && e.quantity > 0) {
          clearCart();
          navigation.navigate(TABs.CONFIRMATION, {name: name});
          axios
            .post(
              APIs.ORDER,
              {
                design_set_id: e.id,
                quantity: e.quantity,
                shipping: sanitizedAddr,
              },
              {headers},
            )
            .then()
            .catch(e => {
              handleError(e);
            });
        }
      });
    }
  };

  const getPaymentSheet = async total => {
    const sanitizedAddr = {...addrDetails};
    delete sanitizedAddr['target'];
    delete sanitizedAddr['isCheckboxSelected'];
    let addressClean = {...sanitizedAddr['address']};
    delete sanitizedAddr['address'];
    let zip_code = addressClean['postalCode'];
    delete addressClean['postalCode'];
    addressClean['postal_code'] = zip_code;
    sanitizedAddr['address'] = addressClean;
    const res = await axios.post(
      `${APIs.PAYMENT}payment-sheet`,
      {amount: total, name: name, shipping: sanitizedAddr, phone: phone},
      {headers},
    );
    const {paymentIntent, ephemeralKey, customer} = res.data;
    let {error} = await initPaymentSheet({
      merchantDisplayName: 'EMOAI, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: false,
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
    showPaymentSheet();
  };

  //  Stripe UI guide:
  // https://stripe.com/docs/elements/appearance-api?platform=react-native
  return (
    <View style={styles.container}>
      <ScrollView>
        <OrderSummary
          products={route.params.products}
          total={route.params.total}
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
          }}
          onError={error => {
            setAddressSheetVisible(false);
          }}
        />
        <GradientButtonAction
          onPress={() => {
            if (name && country && state && city && zip && phone && line1) {
              getPaymentSheet(route.params.total);
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
