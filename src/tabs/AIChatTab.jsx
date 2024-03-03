import React, { useState, useRef, useEffect} from 'react';
import {
  View, TextInput, Image, Button, FlatList, Text,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Animated, Dimensions
} from 'react-native';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { TABs } from '../static/Constants';
import { useToast } from "react-native-toast-notifications";
import { ButtonAction, ButtonSelection, GradientButtonAction, GradientButtonChatSelection, GradientButtonSelection } from "../styles/buttons";
import { P, ChatText, ButtonP, ButtonH,TitleHeader, MenuHeader } from "../styles/texts";
import { InputView } from "../styles/inputs";
import { COLORS,PADDINGS, ICON_SIZES } from "../styles/theme";
import { FAB, Input } from 'react-native-elements';
import { BASE_URL, APIs, getHeader, GET, POST } from "../utils/API";

import {ACTION_ICONS} from '../styles/icons'

const iconSize = 20;

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
          source={{ uri:  userInfo && userInfo.user.photo ? userInfo.user.photo : 'https://emobackend.s3.amazonaws.com/app_assets/portrait-frog2.jpg'}}
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
        <ChatText style={{textAlign:"left", shadowOffset:{width:0, height:0}}}>{item.content}</ChatText>
      )}
      </View>
    </View>
  );
};
const ChatButton = ({ title, onPress, selection }) => {
  return (
    <GradientButtonChatSelection onPress={onPress} $selected={selection} 
   style={selection && {paddingTop:3, paddingBottom:0}} 
    > 
      <ButtonP style={{fontSize:13, textAlign: "left"}}>{title}</ButtonP>
    </GradientButtonChatSelection>
  );
};



export const AIChatTab = ({ navigation }) => {
  // const { currentUser } = useAuthenticationContext();

  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationStage, setConversationStage] = useState('THEME');
  const { userInfo, signout } = useAuthenticationContext();
  const toast = useToast();
  const [userPreferences, setUserPreferences] = useState({
    THEME: null,
    COLOR: null,
    BRAND: null,
    ELEMENT: null,
    TEXTURE: null,
    FINISH: null,
  });
  const scrollViewRef = useRef();
  const [options, setOptions] = useState([]);
  const [tags, setTags] = useState({})
  const [multipleInputs, setMultipleInputs] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [currentStage, setCurrentStage] = useState(null)
  const [pendingReply, setPendingReply] = useState(true)
  const [fetchHistory, setFetchHistory] = useState(false)


  const fetchChatHistory = async () => {
    resp = await GET(`${BASE_URL}/api/chat/chat_history`, userInfo, signout)
      if (resp.status === 200) {
        console.log(resp)
        resp = resp.data
        if (resp.completed) {
          let last_message = resp.messages[resp.messages.length - 1]
          let last_options = last_message.options
          setOptions(last_options)
          appendChatHistory(resp.messages)
          setPendingReply(false);
          setFetchHistory(false);
        }
      } else {
        console.error('Failed to fetch chat history:', error);
      }
  };

  useEffect(() => {
    if (userInfo) {
      fetchChatHistory()
    }
  },[fetchHistory, userInfo]); 

  const appendChatHistory = (messages) => {
    last_user_msg = null
    last_role = 'user'
    for (i = 0; i < messages.length; i ++) {
      if(messages[i].role == 'user') {
        last_user_msg = messages[i]
      }
      last_role = messages[i].role
      last_content = messages[i].content
    }

    if (last_user_msg != null) {
      if (last_user_msg.next_stage) {
        setCurrentStage(last_user_msg.next_stage)
      }
      if (last_user_msg.current_tags) {
        setTags(JSON.parse(last_user_msg.current_tags.replace(/'/g, '"')))
      }      
    }
    setChatHistory(() => {
      const newMessages = messages.filter(msg => msg.show && msg.content).map(msg => {
        const content = msg.role !== "user" && (!msg.content || msg.content === "") ? "thinking..." : msg.content;
        return {
          from: msg.role === 'user' ? 'user' : 'system', 
          content: msg.content,
          id: msg.messageId
        };
      });
      return newMessages;
    });
  }


  function add_tag(key, value) {
    const newTags = {
      ...tags,
      [key]: value
    };
    setTags(newTags);
    return newTags;
  }

  useEffect(() => {
  }, [tags, options]);


  const find_pre_stage = () => {
    stages = {
      'THEME': '',
      'THEME_SECOND': 'theme',
      'COLOR': 'theme_second',
      'BRAND': 'color',
      'ELEMENT': 'brand',
      'TEXTURE': 'element',
      'FINISH': 'texture'
    }
    return stages[currentStage] || "unknow_stage"
  }
  
  const sendMessage = async (stage, request_tags) => {
      if (stage == 'THEME') {
        content = null
      }
      console.log('start send message', stage, )
      let payload = JSON.stringify({stage: stage, content: JSON.stringify(request_tags), assistant_id: "", threading_id: ""}),

      resp = await POST(`${BASE_URL}/api/chat/chat`,payload, userInfo, signout)

      if (resp.status === 200) {
        setPendingReply(true)
        setFetchHistory(true)
        console.log('send message resp:', resp.data)
        setOptions([])
      } else {
        toast.show("Send message failed, please retry", {
          type: "normal",
          placement: "bottom",
          duration: 1000,
          animationType: "zoom-in",
          style : {
            marginBottom: 150
          }
        })
        setFetchHistory(true)
        setPendingReply(false)
        return
      }
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

  const handleOptionPress = (option, userInfo) => {
    console.log('option press:', option)
    handleUserInput(option, userInfo);    
  };

  function append_tmp_chat(content) {
    console.log('append tmp')
    setChatHistory(currentHistory => {
      const formattedMessage = {
        from: 'user',
        content: content,
      };
      return [...currentHistory, formattedMessage]
    })
  }
  const handleUserInput = async (input = '', userInfo) => {
    let finalInput = '';
    if (input) {
        finalInput = input;
    } else {
        finalInput = userInput;
    }
    append_tmp_chat(finalInput)
    setOptions([])
    if (currentStage === 'SUBMIT') {
      currentStage === 'THEME'
      setTags({})
      if (finalInput === 'Yes') {
        // submit task and redirect to loading page
        sendMessage('THEME', {'submit': 'Yes'})
        resp = await POST(`${BASE_URL}/api/task/submit`, JSON.stringify({tags: JSON.stringify(tags)}), userInfo)
        if (resp.status === 200) {
          setFetchHistory(false)
          data = resp.data
          navigation.navigate(TABs.LOAD)
        } else {
          console.error('submit ai design task failed')
        }
      } else {
        sendMessage('THEME', {'submit': 'No'})
      }
      return
    }
    console.log(currentStage, finalInput)
    console.log('currentStage:', currentStage)
    new_tags = add_tag(find_pre_stage(currentStage), finalInput)
    sendMessage(currentStage, new_tags)
    setUserInput('');
  };

  const handlePotentialMultipleSelection = (input = '', userInfo) => {
    if (currentStage != "TEXTURE") {
      handleOptionPress(input, userInfo);
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

  const handlePotentialMultipleChoiceSend = (input = '', userInfo) => {
    if (currentStage != "TEXTURE") {
      handleUserInput(input, userInfo);
      return
    } 
    multipleInputs.push(input)
    const processedInput = multipleInputs.join(",")
    handleUserInput(processedInput, userInfo)
    setMultipleInputs([])
  }


  return (
    <KeyboardAvoidingView 
    behavior={"padding"}
    style={{ flex: 1, paddingHorizontal: PADDINGS.sm, marginTop: 60, marginBottom:30}}
    >
      <View style={{flexDirection: "row", flex: 0.1, alignItems: "center"}}>
        <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={()=>{setModalVisible(true)}}>
        {/* <ACTION_ICONS.menu
          size={iconSize}
          color={COLORS.white}
            /> */}
        </TouchableOpacity>
        {/* <HistoryModal navigation={navigation} 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible} /> */}
        <View style={{flex: 4, alignItems: "center"}}>
        <MenuHeader> EMO.AI</MenuHeader>
        </View>
        <TouchableOpacity style={{ alignItems: "center", flex: 1 }}
          onPress={() => { navigation.navigate(TABs.HOME)} }>
        <ACTION_ICONS.home
                size={iconSize}
                stroke={COLORS.white}
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
          <ChatButton key={index} title={option} disabled={pendingReply}
            onPress={() =>  handlePotentialMultipleSelection(option, userInfo) } 
            selection={multipleInputs.find(e => e == option)?true:false}
           />
        )
      })}
    </View>

    <InputView $isFullLength={true} style={{height:40}}> 
        <TextInput 
        placeholder="Type your own answer..."
        placeholderTextColor={COLORS.grey}
        value={userInput}
        onChangeText={setUserInput}
        style={{flex:1, color:COLORS.white}}/>
        <TouchableOpacity style={{ alignSelf: "center", flex: 0.1 }} disabled={pendingReply}
             onPress={() => handlePotentialMultipleChoiceSend(userInput, userInfo)}>
              {multipleInputs.length===0 &&<ACTION_ICONS.send width={ICON_SIZES.standard} height={ICON_SIZES.standard}/>}
        </TouchableOpacity>
    </InputView> 
    {multipleInputs.length>0 &&<GradientButtonAction onPress={() => handlePotentialMultipleChoiceSend(userInput, userInfo)}>
      <ButtonP>Send Multi Selections</ButtonP>
      </GradientButtonAction>} 


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
    padding: 5,
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



