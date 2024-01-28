import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { TABs } from '../static/Constants';
import { useDesignContext } from '../providers/DesignProvider';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import axios from "axios";
import { APIs, BASE_URL, getHeader } from "../utils/API";
import { convertCompilerOptionsFromJson } from 'typescript';

export const LoadTab = ({ navigation, route }) => {
  console.log('LoadTab received params:', route.params.userTags);
  const [progress, setProgress] = useState(0);
  const { userInfo} = useAuthenticationContext();
  const { addDesignIds } = useDesignContext();
  // const { userTags } = route.params;

const generateImage = async (userPreferences) => {
    const prompt = `nails art with hand, round nail shape, short nails, ${userPreferences.THEME} theme, ${userPreferences.COLOR} tone, ${userPreferences.BRAND}, ${userPreferences.ELEMENT}, low contrast, high saturation, original design, ${userPreferences.TEXTURE} texture, minimalism, matte finish, oil painting brush texture, 8K`;

    console.log("prompTTT:", prompt);
    try {
      const response = await fetch(`${BASE_URL}/api/generate-image/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: prompt}),
      });
      
      const data = await response.json();
      
      if (data.imageUrls) {
        const designIds = await handleSaveImages(data.imageUrls, userPreferences, prompt);
        console.log("designIds from save images", designIds);

        const singleNailsList = await Promise.all(data.imageUrls.map(imageUrl => {
          return decomposeNails(imageUrl).catch(error => {
              console.error(`Error decomposing nail for image URL ${imageUrl}:`, error);
              return null; // or any other fallback value
          });
      }));
        
        await handleSingleNailSave(singleNailsList, designIds);
      } else {
        console.error('No image URL received from server.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };
  //using shopify api to save hand designs and return a list of design_id
async function handleSaveImages(imageUrls, userPreferences, g_prompt) {
    const payload = {
        prompt: g_prompt,
        credit_cost: 0.1,
        image_urls: imageUrls,
        tags: JSON.stringify(userPreferences),
    };

    const { idToken } = userInfo;
    const headers = getHeader(idToken);

    return new Promise((resolve, reject) => {
        axios
          .post(
            `${BASE_URL}/api/hand_designs/multiple/`,
            payload,
            { headers }
          )
          .then((response) => {
            const data = response.data;
            const shopifyProductIds = data.hand_designs.map(item => item.shopify_product_id);
            addDesignIds(shopifyProductIds);
            console.log("shopifyProductIds:", shopifyProductIds);
            resolve(shopifyProductIds); // Resolve with shopifyProductIds
          })
          .catch((error) => {
            console.error("Error saving hand design occurred:", error);
            reject(error); // Reject in case of an error
          });
    });
}
  const decomposeNails = async (img_url) => {
    try {
      const response = await fetch(`${BASE_URL}/api/decompose-single-nails/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: img_url }),
      });

      const data = await response.json(); // direcly recieve single nail image url
      
      if (data.nails) {  
        return data.nails;
      }
    } catch (error) {
      console.error('Error decomposing nails:', error);
    }
  };

  async function handleSingleNailSave(nailData, designIds) {
    // console.log(nailData);
    // console.log(designIds);
    try {
        const allNailDesigns = nailData.flatMap((images, index) =>
            images.map(image => ({
                hand_design_id: designIds[index],
                image: image
            }))
        );

        const { idToken } = userInfo;
        const headers = getHeader(idToken);
        
        const response = await axios.post(
            `${BASE_URL}/api/nail_designs/multiple/`,
            { nail_designs: allNailDesigns },
            { headers }
        );

        const data = response.data;
        console.log("Saved Nail Data Ids", data.nail_designs);
        return data.nail_designs;
    } catch (error) {
        console.error('Error saving single nail:', error);
        // Consider how you want to handle the error. Maybe rethrow it or return a specific value
        throw error;
    }
}


useEffect(() => {
    console.log("Navigate to here!!!");
  
    // Immediately-invoked async function
    (async () => {
      await generateImage(route.params.userTags); // Wait for generateImage to complete
      navigation.navigate(TABs.WORKSHOP, {userTags: route.params.userTags, key: new Date().getTime().toString()}); // Then navigate to the Workshop tab
      // console.log("passed from load:", route.params.userTags);
    })();
    
  }, [route]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading Images...</Text>
      <Progress.Bar progress={progress} width={200} />
    </View>
  );
};
