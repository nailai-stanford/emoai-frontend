import React, {useState} from 'react';
import {useStripe, AddressSheet} from '@stripe/stripe-react-native';
import {getHeader, APIs} from '../utils/API';
import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import {Image} from '@rneui/themed';
import axios from 'axios';

import {View, ScrollView, Alert} from 'react-native';
import {ButtonH, ButtonP, TitleHeader, P, SubHeader} from '../styles/texts';
import {ButtonAction, ButtonSelection} from '../styles/buttons';
import {handleError} from '../utils/Common';
import {TABs} from '../static/Constants';
import {clearCart} from '../utils/UserUtils';

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

  const getPaymentSheet = async total => {
    const res = await axios.post(
      `${APIs.PAYMENT}payment-sheet`,
      // note that shipping should be a dictionary tho
      {amount: total, name: name, shipping: addrDetails, phone: phone},
      {headers},
    );
    const {paymentIntent, ephemeralKey, customer} = res.data;
    const {error} = await initPaymentSheet({
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
    const {error1} = await presentPaymentSheet();
    if (error1) {
      Alert.alert(`Error code: ${error1.code}`, error1.message);
      axios.post(APIs);
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
  //  Stripe UI guide:
  // https://stripe.com/docs/elements/appearance-api?platform=react-native
  return (
    <View>
      <ScrollView>
        <OrderSummary
          products={route.params.products}
          total={route.params.total}
        />
        <View style={{margin: 10}}>
          <SubHeader>Shipping Address</SubHeader>
          <P>{display}</P>
        </View>

        <ButtonAction
          onPress={() => {
            setAddrVisible(true);
          }}>
          <ButtonP>Set Shipping Address</ButtonP>
        </ButtonAction>
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
            Alert.alert('There was an error.', 'Check the logs for details.');
            setAddressSheetVisible(false);
          }}
        />
        <ButtonAction
          //   disabled={!loading}
          onPress={() => {
            getPaymentSheet(route.params.total);
          }}>
          <ButtonP>Pay Now</ButtonP>
        </ButtonAction>
      </ScrollView>
    </View>
  );
};
