import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, Image, Pressable, Button, ScrollView } from "react-native";
import { TABs } from "../static/Constants";
import { NailSelector } from "../components/NailSelector";
import { useDesignContext } from '../providers/DesignProvider';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { BASE_URL } from "../utils/API";

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS } from "../styles/theme";

const prompt = "Can you generate an abstract and artistic short title as well as a short description of how is the design inspired of nail art design with these description: $message"

export const NailDesignTab = ({ navigation, route }) => {
  const { designIds } = useDesignContext();
  const [title, setTitle] = useState(null);
  const [tags, setTags] = useState({});
  const { userInfo} = useAuthenticationContext();
  // const { selectedNailData } = route.params;
  // const { currentHand, nailIndex, nailImage, selectedNails } = route.params;
  const { currentHand, nailIndex, nailImage, selectedNails, updateNailImage } = route.params;
  const [selectedNail, setSelectedNail] = useState(nailImage);

  const handleNailSelect = (nail) => {
    setSelectedNail(nail);
  };

  const handleBack = () => {
    if (updateNailImage && selectedNail) {
      updateNailImage(selectedNail);
    }
    navigation.goBack();
  };

  // useEffect(() => {
  //   // designIds.forEach(async id => {
  //   //   fetchImageTags(id);
  //   // });
  //   fetchImageTags(designIds[0]);
  // }, [designIds]);

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


  const sendToServer = async () => {
    // message = prompt + ;
    
    try {
      const response = await fetch(`${BASE_URL}/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: message}),
      });
      
      if (!response.ok) {
        console.error('Server responded with status:', response.status);
        const errorText = await response.text(); // Read the text (or Blob) response
        console.error('Error response text:', errorText);
        return;
      }
      
      const data = await response.json();
      console.log("server response:", data.content.content);
      try{
        const json_data = JSON.parse(data.content.content);
        setChatHistory(currentHistory => [...currentHistory, { from: 'system', content: json_data.query }]);
        if (json_data.options) {
          // console.log('options', json_data.options);
          setOptions(json_data.options); // Set the options state

        }
      } catch(error){
        setChatHistory(currentHistory => [...currentHistory, { from: 'system', content: data.content.content }]);
      }

    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/nail_model.png")}
        style={{
          marginTop: "0%",
          width: '100%',
          height: '75%',
          resizeMode: 'contain',
        }}
      />
      {selectedNail && selectedNail.trim() !== '' && (
          <Image
            source={{ uri: selectedNail }} // Overlay the selected nail image
            style={styles.nailOverlayImage}
          />
        )}
      <View style={{ marginVertical: 20 }}>
        <SubHeader style={{alignSelf:"center", marginBottom:10}}>Select Nails from Collection</SubHeader>
        {/* <View style={styles.nailsContainer}>
          {selectedNails.map((nail, index) => (
            <Pressable key={index} onPress={() => handleNailSelect(nail)}>
              <Image source={{ uri: nail }} style={styles.nailImage} />
            </Pressable>
          ))}
        </View> */}
         <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nailsScrollView}
        >
          {selectedNails.map((nail, index) => (
            nail && nail.trim() !== '' && (
            <Pressable key={index} onPress={() => handleNailSelect(nail)} style={{paddingHorizontal:5}}>
              <Image source={{ uri: nail }} style={styles.nailImage} />
            </Pressable>
            )
          ))}
        </ScrollView>
        <ButtonAction onPress={handleBack} $colored={true}><ButtonH>Back</ButtonH></ButtonAction>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  nailOverlayImage: {
    position: 'absolute',
    // Adjust these styles to position the nail image correctly over the model
    top: 20,
    left: 20,
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  nailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  nailImage: {
    width: 50,
    height: 50,
    margin: 5,
    resizeMode: 'contain',
  },
  nailsScrollView: {
    flexDirection: "row",
    alignItems: "center",
  },
});
