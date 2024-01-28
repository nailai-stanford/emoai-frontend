import React, { useState, useRef, useEffect} from 'react';
import {
  View, TextInput, Image, Button, FlatList, Text,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Animated, Dimensions
} from 'react-native';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useDesignContext } from '../providers/DesignProvider';
import {useTagsContext} from '../providers/TagsProvider';
import { TABs } from '../static/Constants';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Modal } from "react-native-modals"

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, ButtonH,TitleHeader, MenuHeader } from "../styles/texts";
import { InputView } from "../styles/inputs";
import { COLORS,PADDINGS, ICON_SIZES } from "../styles/theme";
import { Input } from 'react-native-elements';
import { APIs, getHeader } from "../utils/API";
import { BASE_URL } from '../utils/API';

import {ACTION_ICONS} from '../styles/icons'

const PRE_PROMPT = [
  {state:"THEME", prompt:"Generate a short greeting for users as a nail art designer asking the user what nail art theme do they want, you can suggest users to choose from the themes such as: Concrete items, Institutions, Seasons, Domestic and international holidays, Art styles, Decorative materials, Clothing patterns, etc. Please reply less than 35 words. Reply with a JSON file with key named 'query'."}, 
  {state:"COLOR", prompt:"Generate an ask to user to specify a related color tone for the $THEME theme, please be artistic and engaging. Reply with a JSON file containing the keys 'query' and 'options'. In the 'query' key, provide the ask statement. In the 'options' key, list the color tones in the format: [color tone 1, color tone 2, ...] without any additional words. "}, 
  {state:"BRAND", prompt:"Ask the user to specify a relavant brand name for the $THEME theme and $COLOR color tone, for example, Dior, Chanel, Gucci, and Prada, please always generate variant brands, please be artistic and engaging. Reply with a JSON file containing the keys 'query' and 'options'. In the 'query' key, provide the ask statement. In the 'options' key, list the color tones in the format: [brand name 1, brand name 2, ...] without any additional words."}, 
  {state:"ELEMENT", prompt:"Ask the user to specify some nail art elements for the $THEME theme, $COLOR color tone and $BRAND brand vide nail art, please be artistic and engaging. Reply with a JSON file containing the keys 'query' and 'options'. In the 'query' key, provide the ask statement. In the 'options' key, list your suggested elements in the format: [element 1, element 2, ...] without any additional words. Ths list length should be less than 10."}, 
  {state:"TEXTURE", prompt: "Ask the user to specify a nail art texture for the $THEME theme, $COLOR color tone, $BRAND brand vide and $ELEMENT elements nail art, please be artistic and engaging. Reply with a JSON file containing the keys 'query' and 'options'. In the 'query' key, provide the ask statement. In the 'options' key, list the textures in the format: [texture 1, texture 2, ...] without any additional words."}, 
  {state:"FINISH", prompt:"Generate an ask to user if they are ready to generate an image, please be artistic, friendly and engaging. "},
]
const iconSize = 20;
// const IMAGE_PROMPT = f"nails art with hand, oval nail shape,  {item.THEME} theme,  {item.COLOR} tone,  {item.BRAND}, {item.ELEMENT}, low contrast, high saturation, original design, {item.TEXTURE} texture,  minimalism, glossy, 8K";

const imageUrl = "https://lh3.googleusercontent.com/a/ACg8ocJ_4W0g904G63FggpCwjxgtXCSDYebsGsGodISX-k9x0wk=s120";
const CHAT_IMAGE_PATH = "../../assets/portrait-robot_1.png";

const ChatMessage = ({ item }) => {

  const isSystemMessage = Boolean(item.from === 'system');
  const flexDirection = isSystemMessage ? 'row' : 'row-reverse';
  const imageSize = 40;
  const { userInfo, signout } = useAuthenticationContext();



  return (
    <View style={{ display: 'flex', flexDirection, marginBottom: 25 , alignItems:"flex-start"}}>
      {isSystemMessage && ( <Image style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          alignSelf: "flex-start",
        }} source={require(CHAT_IMAGE_PATH)}></Image>)}
      {!isSystemMessage && ( 
      <Image
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          alignSelf: "flex-start",
        }}
        source={{ uri:  userInfo && userInfo.user.photo }}
      />)}
      <View style={{ paddingHorizontal:24, paddingVertical:10, backgroundColor: 'transparent', 
        borderColor: isSystemMessage? COLORS.chatbot: COLORS.chatme, 
        borderWidth:1, borderRadius: imageSize/2, marginHorizontal: 10, maxWidth:"80%", 
        }}>
        {item.isImage ? (
    item.content.map((image, index) => (
      <View key={index} style={{ marginBottom: 10 }}>
        <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 10, resizeMode: 'contain' }} />
      </View>
    ))
      ) : (
        <P style={{textAlign:"left", shadowOffset:{width:0, height:0}}}>{item.content}</P>
      )}
      </View>
    </View>
  );
};
const ChatButton = ({ title, onPress, selection }) => {
  return (
    <ButtonSelection onPress={onPress} $selected={selection} > 
      <ButtonP>{title}</ButtonP>
    </ButtonSelection>
  );
};

const HistoryModal = ({ navigation, modalVisible, setModalVisible }) => {
  return <Modal visible={modalVisible} animationIn="slideInRight"
    animationOut="slideOutRight" modalStyle={{ width: "120%", height: "100%"}} style={{ width: "70%" }}>
    <View style={{marginLeft: 70, }}>
       {/* <TouchableOpacity onPress={() => { navigation.navigate(TABs.AIChatTab) }}>
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={iconSize}
          />
        </TouchableOpacity> */}
      <View style={{marginTop: 70, flexDirection: "row"}}>
      <View style={{ flexDirection: "column" }}>
        <View >
        <Text style={{fontSize: 20}}> Nails In Progress</Text>
          <Text> Art, Monet, Blue</Text>
        </View>
        <View>
          <Text style={{fontSize: 20}}> Nails Design Completed</Text>
        </View>
       </View>
        
    
        <TouchableOpacity  onPress={() => { setModalVisible(false)  }}>
            <MaterialCommunityIcons
              name="close"
              size={iconSize}
            />
      </TouchableOpacity>
      </View>
      
    </View>
       
  </Modal>
}

export const AIChatTab = ({ navigation }) => {
  // const { currentUser } = useAuthenticationContext();
  const { addDesignIds } = useDesignContext();
  const { setUserTags, userTags } = useTagsContext();

  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationStage, setConversationStage] = useState('THEME');
  const [userPreferences, setUserPreferences] = useState({
    THEME: null,
    COLOR: null,
    BRAND: null,
    ELEMENT: null,
    TEXTURE: null,
    FINISH: null,
  });
  const scrollViewRef = useRef();
  const [options, setOptions] = useState(['LGBTQ', 'New Year', 'Geometry', 'Stanford']);
  const [multipleInputs, setMultipleInputs] = useState([])
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);


  
  const sendToServer = async (message) => {
    console.log('Sending to server:', message);
    
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
          setOptions(json_data.options); // Set the options state

        }
      } catch(error){
        setChatHistory(currentHistory => [...currentHistory, { from: 'system', content: data.content.content }]);
      }
    } catch (error) {
      console.error("Error while sending message:", error);
    }
    
  };

  const updatePreferences = (field, value) => {
    setUserPreferences(prevPreferences => ({
      ...prevPreferences,
      [field]: value
    }));
    // also update the prompt using the user Input/userPreference
    setUserTags({ [field]: value });
    PRE_PROMPT.forEach(item => {
      item.prompt = item.prompt.replace(new RegExp("\\$" + field, "g"), value);
  });
    
  };

  const handleOptionPress = (option) => {
    handleUserInput(option);
    setOptions([]);
    
  };

  const handleUserInput = (input = '') => {
    let finalInput = '';

    if (input) {
        finalInput = input;
    } else {
        finalInput = userInput;
    }

    
    console.log('final type', typeof finalInput);
    console.log('final input', finalInput);
    setChatHistory(currentHistory => [...currentHistory, { from: 'user', content: finalInput }]);
    
    switch (conversationStage) {
      
      case 'COLOR':
        updatePreferences('THEME', finalInput)
        //console.log('Pre prompt', userInput);
        setConversationStage('BRAND');
        // sendToServer(prompt);
        break;
      case 'BRAND':
        updatePreferences('COLOR', finalInput)
        setConversationStage('ELEMENT');
        // sendToServer(prompt);
        break;
      case 'ELEMENT':
        updatePreferences('BRAND', finalInput)
        setConversationStage('TEXTURE');
        // sendToServer(prompt);
        break;
      case 'TEXTURE':
        updatePreferences('ELEMENT', finalInput)
        setConversationStage('FINISH');
        // sendToServer(prompt);
        
        break;
      case 'FINISH':
        updatePreferences('TEXTURE', finalInput)
        setConversationStage('IMAGE');
        setOptions(['Yes', 'Not Ready']);
        // sendToServer(prompt);
        
        break;
    }
    if (conversationStage === 'IMAGE') {
      console.log("navigate to load");
      console.log('Navigating to:', TABs.LOAD, 'with tags:', userTags);
      navigation.navigate(TABs.LOAD, { userTags: userTags });

      setConversationStage('IDLE');
    }else{
      prompt = PRE_PROMPT.find(item => item.state === conversationStage).prompt;
     
      sendToServer(prompt);
    }
    

    setUserInput('');
  };

  const handlePotentialMultipleSelection = (input = '') => {
    if (conversationStage != "TEXTURE") {
      handleOptionPress(input);
      return
    } 
    if (multipleInputs.find(e => e == input)) {
      setMultipleInputs(multipleInputs.filter(e=> e!=input))
    } else {
      let newInput = multipleInputs.slice()
      newInput.push(input);
      setMultipleInputs(newInput);
    } 
  }

  const handlePotentialMultipleChoiceSend = (input = '') => {
    if (conversationStage != "TEXTURE") {
      handleUserInput(input);
      return
    } 
    multipleInputs.push(input)
    const processedInput = multipleInputs.join(",")
    handleUserInput(processedInput)
    setMultipleInputs([])
  }

  useEffect(() => {
    prompt = PRE_PROMPT.find(item => item.state === conversationStage).prompt;
    sendToServer(prompt);
    
    setConversationStage('COLOR');
  }, []);
  // useEffect(() => {
  //   console.log('Current Chat History:', chatHistory);
  // }, [chatHistory]);
   // Debug: UseEffect to log userPreferences whenever it changes
  //  useEffect(() => {
  //   console.log('Current userPreferences:', userPreferences);
  // }, [userPreferences]);
  useEffect(() => {
    console.log('Current options:', options);
  }, [options]);
  return (
    <KeyboardAvoidingView 
    behavior={"padding"}
    style={{ flex: 1, padding: PADDINGS.sm, marginTop: 60 }}
    >
      <View style={{flexDirection: "row", flex: 0.1, alignItems: "center"}}>
        <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={()=>{setModalVisible(true)}}>
        <MaterialCommunityIcons
          name="history"
          size={iconSize}
          color={COLORS.white}
            />
        </TouchableOpacity>
        <HistoryModal navigation={navigation} 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible} />
        <View style={{flex: 4, alignItems: "center"}}>
        <MenuHeader> EMO.AI</MenuHeader>
        </View>
        <TouchableOpacity style={{ alignItems: "center", flex: 1 }}
          onPress={() => { () => { navigation.navigate(TABs.HOME) } }}>
        <MaterialCommunityIcons
                name="home-account"
                size={iconSize}
                color={COLORS.white}
            />
        </TouchableOpacity>
     </View>
    <ScrollView 
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({animated: true})}
    >
      {chatHistory.map((item, index) => (
        <ChatMessage key={index} item={item} />
      ))}
    </ScrollView>
    
    <View style={styles.optionsContainer}>
        {options.map((option, index) => {
        
        return (
          <ChatButton key={index} title={option}
            onPress={() =>  handlePotentialMultipleSelection(option) } 
            selection={multipleInputs.find(e => e == option)?true:false}
             />
        )
      })}
      
    </View>

    <View style={{ flex: 1 }}>
    <TouchableOpacity style={{ alignSelf: "flex-start", flex: 0.1 }}
             onPress={() => handlePotentialMultipleChoiceSend(userInput)}>
    <ACTION_ICONS.send width={ICON_SIZES.standard} height={ICON_SIZES.standard}   />
    </TouchableOpacity>

    </View>
   
    <InputView $isFullLength={true}> 
        <TextInput 
        placeholder="Type your message..."
        value={userInput}
        onChangeText={setUserInput}
        style={{flex:1, color:COLORS.white}}/>
        <TouchableOpacity style={{ alignSelf: "flex-start", flex: 0.1 }}
             onPress={() => handlePotentialMultipleChoiceSend(userInput)}>
          <ACTION_ICONS.send width={ICON_SIZES.standard} height={ICON_SIZES.standard}   />

          {/* <MaterialCommunityIcons
            name="send"
            size={iconSize+3}
            color={COLORS.grey}
            transformOrigin= 'center'
            transform={[{ rotate: '-90deg' }]}
            /> */}
        </TouchableOpacity>
    </InputView> 

  </KeyboardAvoidingView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping of children
    justifyContent: 'flex-start', // Align children to start
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 5, // Add some padding if needed
  },
  chatMessage: {
    display: "flex",
    marginBottom: 25,
  },
  chatButton: {
    margin: 5,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 8,
    marginVertical: 3,
    maxWidth: '45%',
  },
  messageBubble: {
    padding: 20,
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    marginHorizontal: 10,
  },
  generatedImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  buttonGrid: {
    alignItems:  "flex-end",
  },
  modal: {
    height: "100%",
    width: "100%",
    position: 'absolute',
    top:0,
    left:0,
    backgroundColor: '#ededed',
    justifyContent: 'center',
  }
});



