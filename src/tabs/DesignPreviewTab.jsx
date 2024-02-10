import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { useDesignContext } from '../providers/DesignProvider';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import axios from "axios";
import { APIs, BASE_URL, getHeader } from "../utils/API";
import { TABs } from '../static/Constants';


import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS } from "../styles/theme";


const PROMPT = "Can you generate an abstract and artistic short title as well as a short description of how is the design inspired of nail art design with these description: [message]. Please only return the result in the json format: { 'title':  title generated within 10 words, 'description': description generated within 50 words}. Please do not return any other words."

export const DesignPreviewTab = ({ navigation, route }) => {
    const [quantity, setQuantity] = React.useState(1);
    const { designIds, setDesignIds} = useState([]);
    const { userInfo} = useAuthenticationContext();
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState({});
    const [description, setDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productImageList, setProductImageList] = useState('');
    const [handDesignUrls, setHandDesignUrls] = useState([]);
    const { leftHandNails, rightHandNails, nailsId} = route.params;
    const [apiCalled, setApiCalled] = useState(false);
    const [designSetId, setDesignSetId] = useState('');

    const price = "$19.9";

    useEffect(()=> {

    })
    useEffect(() => {
      fetchImageTags(designIds[0]);
    }, [designIds]);
    const onBack = () => {
      navigation.goBack();
  };
    useEffect(() => {
      console.log('leftHandNails', leftHandNails, 'rightHandNails', rightHandNails)
      if (designIds && designIds.length > 0) {
          designIds.forEach(id => {
              fetchImageUrl(id).then(url => {
                  setHandDesignUrls(prevUrls => [...prevUrls, url]);
              });
          });
      }
      generateProductImages();
  }, [leftHandNails, rightHandNails, designIds]);

  useEffect(() => {
    if (handDesignUrls.length > 0) {
      generateProductImages();
    }
  }, [handDesignUrls]); // Depend on handDesignUrls
  
  // const addToCart = async () => {
  //   if (!apiCalled) {
  //     const designSetData = {
  //       nailDesignIdList: nailsId,
  //       imageMain: productImage,
  //       imageList: productImageList,
  //       price: price,
  //       title: title,
  //       description: description,
  //     };
  //     try {
  //       const designSetId = await postDesignSet(designSetData, userInfo);
  //       setApiCalled(true);
  //       console.log("Design Set ID:", designSetId);
  //       // Assuming item.id represents the current item's ID
  //       let found = false;
  //       for (var i = 0; i < cart.length; i++) {
  //         if (cart[i].id === designIds[0]) { // Assuming designIds[0] is the current item's ID
  //           found = true;
  //           setCart(designIds[0], cart[i].quantity + 1);
  //           break;
  //         }
  //       }
  //       if (!found) {
  //         setCart(designIds[0], 1);
  //       }
  
  //     } catch (error) {
  //       console.error("Error in Add to Cart:", error);
  //     }
  //   }
  // };
  
  const postDesignSet = async (designSetData, userInfo) => {
      let payload = {
        nail_design_id_list: designSetData.nailDesignIdList,
        image_main: designSetData.imageMain,
        image_list: designSetData.imageList,
        title: designSetData.title,
        description: designSetData.description,

      };
    
      const { idToken } = userInfo;
      const headers = getHeader(idToken); // Assuming getHeader is a function you have that prepares the header
      console.log('Payload being sent:', payload);
      return new Promise((resolve, reject) => {
        axios
          .post(`${BASE_URL}/api/design_sets/`, payload, { headers }) // Replace 'your-endpoint' with the actual endpoint
          .then(response => {
            const data = response.data;
            console.log("Design set posted successfully:", data);
            setDesignSetId(data.design_set.shopify_product_id);
            console.log("Design set posted successfully:", data.design_set.shopify_product_id);
            resolve(data.design_set.shopify_product_id); // Resolve with the response data
          })
          .catch(error => {
            console.error("Error occurred while posting design set:", error);
            reject(error); // Reject in case of an error
          });
      });
    };
  const shareDesign = async () => {
      navigation.navigate(TABs.SHARE_DESIGN, {title: title, description: description, product_url: productImage});
  };
  

  const fetchImageUrl = async (productId) => {
    try {
      const { idToken } = userInfo;
      const headers = getHeader(idToken);
      const response = await axios.get(`${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent(productId)}`, { headers });
  
      const product = response.data.products[0];
      if (!product || !product.image || !product.image.src) {
        throw new Error(`Image URL not found for product ID ${productId}`);
      }
  
      const imageUrl = product.image.src;
  
      return imageUrl;
    } catch (error) {
      console.error(`Error fetching product details for product ID ${productId}:`, error);
      throw error; // Re-throw the error for further handling if necessary
    }

  };

    const generateProductImages = async () => {
      const imageUrls = [...leftHandNails, ...rightHandNails]; 
      console.log('image_urls', imageUrls);
      console.log('hand_design_urls', handDesignUrls);
      let payload = {
          image_urls: imageUrls,
          hand_design_urls: handDesignUrls
      };

      console.log('Sending payload to API:', payload);
        try {
          const response = await fetch(`${BASE_URL}/api/product_image_generation/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          const data = await response.json();
          setProductImage(data.blend_images[0]);
          setProductImageList(data.blend_images); 
          // console.log("Product Images Generated:", data);
      } catch (error) {
          console.error("Error generating product images:", error);
      }
  };


  const fetchImageTags = async (designId) => {
    return new Promise((resolve, reject) => {
      const { idToken } = userInfo;
      const headers = getHeader(idToken);
      axios
        .get(`${BASE_URL}/api/hand_designs/${designId}/`, { headers })
        .then((response) => {
          const tags = response.data.hand_design.tags;
          setTags(tags);
          console.log("tags fetched:", tags);
          resolve(tags);
        })
        .catch((error) => {
          console.error(`Error fetching tags for design ID ${designId}:`, error);
          reject(error);
        });
    });
  };

    useEffect(() => {
        const fetchTitle = async () => {
          let message = `nails art with hand, oval nail shape, ${tags.THEME} theme, ${tags.COLOR} tone, ${tags.BRAND}, ${tags.ELEMENT}, low contrast, high saturation, original design, ${tags.TEXTURE} texture, minimalism, glossy, 8K`;;
          console.log("message here", message);
          let finalPrompt = PROMPT.replace('[message]', message);
          console.log("final Prompt", finalPrompt);
          try {
            const response = await fetch(`${BASE_URL}/api/message`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: finalPrompt,
              }),
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log("server response:", typeof data.content.content);
            // console.log("server response:", data.content.content.title);
            const json_data = JSON.parse(data.content.content.replace(/'/g, '"'));
            console.log("data.content.content", json_data);
            setTitle(json_data.title); 
            setDescription(json_data.description);
          } catch (error) {
            console.error('Error fetching title:', error);
          }
        };
    
        fetchTitle();
      }, [tags]);

      /* -------------------------------------------------------------------------- */
      /*                              render this page                              */
      /* -------------------------------------------------------------------------- */
      return (
        <View style={{ padding: 20 }}>
          <View style={{
        position: 'absolute',
        top: 20,
        left: 10,
        }}>
            <TouchableOpacity onPress={onBack}>
                <TitleHeader >{'<'}</TitleHeader>
            </TouchableOpacity>
        </View>
        <TitleHeader style={{ color:COLORS.white }}>
            Share
        </TitleHeader>

        <Image source={{ uri: `data:image/png;base64,${productImage}` }} style={{ width: '100%', height: 400 }} />
        <MenuHeader style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</MenuHeader>
        <P $alignLeft={true} style={{ marginVertical: 10 }}>
          Embrace your exclusive nail design! Add it to your cart now for crafting and share your unique creation with the community by naming it. Let's get your one-of-a-kind nails in production pronto!
        </P>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
          <SubHeader style={{ fontSize: 16, fontWeight: 'bold' }}>{price}</SubHeader>
          
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
        </View>
        {/* <ButtonAction onPress={shareDesign}> */}
        <ButtonAction onPress={shareDesign}>
          <ButtonH >Share Design</ButtonH>
        </ButtonAction> 

      </View>
    );
  };