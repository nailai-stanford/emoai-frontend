import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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
    const [tags, setTags] = useState({});
    const [description, setDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [price, setPrice] = useState('')
    const [productImageList, setProductImageList] = useState('');
    const [generatedProductImages, setGeneratedProductImages] = useState([]);
    const { leftHandNails, rightHandNails, handProducts, taskId} = route.params;


    /* -------------------------------------------------------------------------- */
    /*                               when init page                               */
    /* -------------------------------------------------------------------------- */
  
  
    /* -------------------------------------------------------------------------- */
    /*                              handle page logic                             */
    /* -------------------------------------------------------------------------- */

    const onBack = () => {
      navigation.goBack();
    };

   
    /* -------------------------------------------------------------------------- */
    /*                       handle product image generation                      */
    /* -------------------------------------------------------------------------- */
  //   useEffect(() => {
  //     console.log('preview logs', leftHandNails, rightHandNails, handProducts)

  //     const fetchGeneratedImage = async () => {
  //       const generatedData = await generateProductImages();
  //       setGeneratedProductImages(generatedData.blend_images);
  //     };
    
  //     fetchGeneratedImage();
  // }, [leftHandNails, rightHandNails, designIds]);

    // useEffect(() => {
    //   if (generatedProductImages && generatedProductImages.length > 0) {
    //     setProductImage(generatedProductImages[0]);
    //     console.log('productImage has updated');
    //   }
    // }, [generatedProductImages]);

    // const generateProductImages = async () => {
    //   const leftHandUrls = leftHandNails.map(nail => nail.url);
    //   const rightHandUrls = rightHandNails.map(nail => nail.url);
    //   const imageUrls = [...leftHandUrls, ...rightHandUrls];
    //   let payload = {
    //       image_urls: imageUrls,
    //       hand_design_urls: Object.values(handProducts)
    //   };
    //   try {
    //     const response = await fetch(`${BASE_URL}/api/product_image_generation/`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(payload),
    //     });
    //     const data = await response.json();
    //     return data;

    //   } catch (error) {
    //       console.error("Error generating product images:", error);
    //   }
    //   return null;
    // };


      useEffect(() => {
          nails = leftHandNails.concat(rightHandNails)
          const save_design_set = async() => {
            try {
              const { idToken } = userInfo;
              const headers = getHeader(idToken);
              console.log('headers:', headers)

              // const response = await fetch(`${BASE_URL}/api/design_sets`, {
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/json',
              //   },
              //   body: JSON.stringify({
              //     task_id: taskId,
              //     nail_designs: nails,
              //     hand_designs: handProducts
              //   }),
              // });
              
              // if (!response.ok){
              //   alert('save designset failed, please try again')
              //   return
              // }
              
              // const data = await response.json();
              console.log(data)
              setEnableAddToCart(true)
            } catch (error) {
            
            }
          }
          save_design_set()
          
      }, [leftHandNails, rightHandNails, handProducts, userInfo])

    /* -------------------------------------------------------------------------- */
    /*                            handle product title                            */
    /* -------------------------------------------------------------------------- */
    // useEffect(() => {
    //   const fetchTitle = async () => {
    //     let message = `nails art with hand, oval nail shape, ${tags.THEME} theme, ${tags.COLOR} tone, ${tags.BRAND}, ${tags.ELEMENT}, low contrast, high saturation, original design, ${tags.TEXTURE} texture, minimalism, glossy, 8K`;;
    //     console.log("message here", message);
    //     let finalPrompt = PROMPT.replace('[message]', message);
    //     console.log("final Prompt", finalPrompt);
    //     try {
    //       const response = await fetch(`${BASE_URL}/api/message`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           prompt: finalPrompt,
    //         }),
    //       });

    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }

    //       const data = await response.json();
    //       console.log("server response:", typeof data.content.content);
    //       // console.log("server response:", data.content.content.title);
    //       const json_data = JSON.parse(data.content.content.replace(/'/g, '"'));
    //       console.log("data.content.content", json_data);
    //       setTitle(json_data.title); 
    //       setDescription(json_data.description);
    //     } catch (error) {
    //       console.error('Error fetching title:', error);
    //     }
    //   };

    //   fetchTitle();
    // }, [tags]);

  


      /* -------------------------------------------------------------------------- */
      /*                              render this page                              */
      /* -------------------------------------------------------------------------- */
      return (
        <ScrollView style={{ paddingHorizontal: 20, display:'flex', flexDirection:'column' }}>
          <View style={{
        left: 10,
        }}>
            <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <ACTION_ICONS.back width={5} />
            <P style={{paddingLeft:PADDINGS.sm}}>Back to hand design</P>

            </TouchableOpacity>

        </View>
        <TitleHeader style={{ color:COLORS.white }}>
            Preview
        </TitleHeader>
        {productImageList.length > 1 && <p>has generated image</p>}
        <Image source={{ uri: `data:image/png;base64,${productImage}` }} style={{ width: '100%', height: 350 }} />
        <MenuHeader style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</MenuHeader>
        <P $alignLeft={true} style={{ marginVertical: 10 }}>
          Embrace your exclusive nail design! Add it to your cart now for crafting and share your unique creation with the community by naming it. Let's get your one-of-a-kind nails in production pronto!
        </P>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
          <SubHeader style={{ fontSize: 16, fontWeight: 'bold' }}>{price}</SubHeader>
          
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

      </ScrollView>
    );
  };