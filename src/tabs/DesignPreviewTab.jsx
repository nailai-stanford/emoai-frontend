import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useDesignContext } from '../providers/DesignProvider';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import axios from "axios";
import { APIs, BASE_URL, getHeader } from "../utils/API";
import { TABs } from '../static/Constants';


import { ButtonAction, ButtonSelection, GradientButtonAction } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS } from "../styles/theme";
import { ACTION_ICONS } from '../styles/icons';


export const DesignPreviewTab = ({ navigation, route }) => {
    const [quantity, setQuantity] = React.useState(1);
    const [designIds, setDesignIds] = useState([]);
    const [enableAddToCart, setEnableAddToCart] = useState(false)
    const { userInfo } = useAuthenticationContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("Embrace your exclusive nail design! Add it to your cart now for crafting and share your unique creation with the community by naming it. Let's get your one-of-a-kind nails in production pronto!");
    const [productImage, setProductImage] = useState('');
    const [price, setPrice] = useState('')
    const [designSetId, setDesignSetId] = useState(null)
    const [productImageList, setProductImageList] = useState('');
    const { leftHandNails, rightHandNails, handProducts, taskId} = route.params;

    const onBack = () => {
      navigation.goBack();
    };

      useEffect(() => {
          nails = leftHandNails.concat(rightHandNails)
          const save_design_set = async() => {
            try {
              const { idToken } = userInfo;
              const headers = getHeader(idToken);
              console.log('headers:', headers)
              body = JSON.stringify({
                    task_id: taskId,
                    nail_designs: nails,
                    hand_designs: handProducts
                  }),
              console.log(body)
              const response = await fetch(`${BASE_URL}/api/design_sets/`, {
                method: 'POST',
                headers: headers,
                body: body,
              });
              if (!response.ok){
                alert('save designset failed, please try again')
                return
              }
              const data = await response.json();
              design_set = data.design_set
              setTitle(design_set.title); 
              setDescription(design_set.description)
              setProductImage(design_set.image_url)
              setPrice(design_set.price)
              setDesignSetId(design_set.shopify_product_id)
              setEnableAddToCart(true)
            } catch (error) {
              alert('save designset failed, please try again')
            }
          }
          save_design_set()
        
      }, [leftHandNails, rightHandNails, handProducts, userInfo])


      /* -------------------------------------------------------------------------- */
      /*                              render this page                              */
      /* -------------------------------------------------------------------------- */
      return (
        <View style={{height: '90%'}}>
        <ScrollView style={{ paddingHorizontal: 20, display:'flex', flexDirection:'column' }}>
          <View style={{
        left: 10,
        }}>
            <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <ACTION_ICONS.back width={5} />
            <P style={{paddingLeft:PADDINGS.sm}}>Back to hand design</P>

            </TouchableOpacity>

        </View>

        {productImage ==='' ? 
        <View>
          <SubHeader>
            Generating Your Final Product Image, Please Don't Leave This Page
          </SubHeader>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View> :
        <View>
        <Image source={{ uri: productImage }} style={{ width: '100%', height: 350 }} />
        <MenuHeader style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</MenuHeader>
        <P $alignLeft={true} style={{ marginVertical: 10 }}> {description}</P>
       
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
          <SubHeader style={{ fontSize: 16, fontWeight: 'bold' }}>${price}</SubHeader>
          
          {enableAddToCart &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <SubHeader style={{ marginRight: 10 }}>-</SubHeader>
              </TouchableOpacity>
              <TextInput 
                style={{ borderWidth: 1, width: 50, textAlign: 'center', borderColor:COLORS.white, color:COLORS.white }} 
                keyboardType='numeric'
                onChangeText={(text) => setQuantity(Number(text))}
                value={String(quantity)}
              />
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <SubHeader style={{ marginLeft: 10 }}>+</SubHeader>
              </TouchableOpacity>
            </View>
          }
        </View>
        {enableAddToCart &&
          <View style={{ marginVertical: 10, flexDirection:'row' }}>
            <GradientButtonAction >
              <ButtonP>Add to Cart</ButtonP>
            </GradientButtonAction> 
          </View>
        }

        </View>}


      </ScrollView>
      </View>
    );
  };