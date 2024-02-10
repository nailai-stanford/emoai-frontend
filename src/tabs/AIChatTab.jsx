import React, { useState, useRef, useEffect} from 'react';
import {
  View, TextInput, Image, Button, FlatList, Text,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Animated, Dimensions
} from 'react-native';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import {useTagsContext} from '../providers/TagsProvider';
import { TABs } from '../static/Constants';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Modal } from "react-native-modals"

import { ButtonAction, ButtonSelection, GradientButtonSelection } from "../styles/buttons";
import { P, ButtonP, ButtonH,TitleHeader, MenuHeader } from "../styles/texts";
import { InputView } from "../styles/inputs";
import { COLORS,PADDINGS, ICON_SIZES } from "../styles/theme";
import { FAB, Input } from 'react-native-elements';
import { BASE_URL, APIs, getHeader } from "../utils/API";

import {ACTION_ICONS} from '../styles/icons'
import { err } from 'react-native-svg';
import { disabled } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';

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
    <GradientButtonSelection onPress={onPress} $selected={selection} style={{ paddingTop:5, paddingRight:10, paddingLeft: 10, paddingBottom:5}} > 
      <ButtonP style={{fontSize:12}}>{title}</ButtonP>
    </GradientButtonSelection>
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
  const { setUserTags, userTags } = useTagsContext();

  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationStage, setConversationStage] = useState('THEME');
  const { userInfo, signout } = useAuthenticationContext();

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
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)
  const [fetchHistory, setFetchHistory] = useState(true)
  const [currentStage, setCurrentStage] = useState(null)
  const [assistantId, setAssistantId] = useState(null)
  const [threadingId, setThreadingId] = useState(null)
  
  const [pendingReply, setPendingReply] = useState(true)

  useEffect(() => {
    let intervalId;
    const fetchChatHistory = async () => {
      try {
        console.log('start call')
        const { idToken } = userInfo;
        const headers = getHeader(idToken)
        url = `${BASE_URL}/api/chat/history`
        if (threadingId != null && assistantId != null) {
          const queryParams = new URLSearchParams({
            threading_id: threadingId,
            assistant_id: assistantId,
          }).toString();
          url = `${BASE_URL}/api/chat/history?${queryParams}`
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        
        if (!response.ok) {
          console.log('fetch history failed')
          return
        }
        
        const resp = await response.json();
        setPendingReply(false)
        if(resp.assistant_id) {
          setAssistantId(resp.assistant_id)
        }
        if(resp.threading_id) {
          setThreadingId(resp.threading_id)
        }
        if (resp.completed) {
          console.log('stop call ')
          setFetchHistory(false)
        }
        if (resp.messages == null || resp.messages.length == 0) {
          setCurrentStage('THEME')
          sendMessage('THEME', {})
        } else {
          if (resp.completed) {
            let last_message = resp.messages[resp.messages.length - 1]
            let last_options = last_message.options
            setOptions(last_options)
            appendChatHistory(resp.messages)
          }
        }
        
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    if (intervalId) {
      clearInterval(intervalId);
    }
  
    if (fetchHistory) {
      intervalId = setInterval(() => {
        fetchChatHistory();
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  },[fetchHistory, userInfo]); 

  const appendChatHistory = (messages) => {
    last_user_msg = null
    for (i = 0; i < messages.length; i ++) {
      if(messages[i].role == 'user') {
        last_user_msg = messages[i]
      }
    }

    if (last_user_msg != null) {
      if (last_user_msg.next_stage) {
        console.log('next stage:', last_user_msg.next_stage)
        setCurrentStage(last_user_msg.next_stage)
        if (last_user_msg.next_stage === 'SUBMIT') {
          setOptions(['Yes', 'No'])
        }
      }
      if (last_user_msg.current_tags) {
        console.log('last_tags', last_user_msg.current_tags)
        setTags(JSON.parse(last_user_msg.current_tags.replace(/'/g, '"')))
      }      
    }
    console.log('current_tags:', tags, "current_stage:", currentStage)
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
    console.log('tags updated:', tags);
    console.log('options:', options)
  }, [tags, options]);


  const find_pre_stage = () => {
    stages = {
      'THEME': "",
      'COLOR': 'theme',
      'BRAND': 'color',
      'ELEMENT': 'brand',
      'TEXTURE': 'element',
      'FINISH': 'texture'
    }
    return stages[currentStage] || "unknow_stage"
  }
  
  const sendMessage = async (stage, request_tags) => {
    try {
      const { idToken } = userInfo;
      const headers = getHeader(idToken)
      
      console.log('send message', stage)
      if (stage == 'THEME') {
        content = null
      }
      console.log('start send message', stage, )
      setPendingReply(true)
      const response = await fetch(`${BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({stage: stage, content: JSON.stringify(request_tags), assistant_id: assistantId || "", threading_id: threadingId || ""}),
      })
      if (!response.ok) {
        console.log('send message failed', response)
        setPendingReply(false)
        return
      }
      data = response.json()
      console.log(data.messages)
      
      setFetchHistory(true)
      setOptions([])

    } catch (error) {
      setPendingReply(false)
      console.error('send message failed', error)
    }
  }


  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);



  const handleOptionPress = (option, userInfo) => {
    console.log('option press:', option)
    handleUserInput(option, userInfo);
    // setOptions([]);
    
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
      console.log('submit', finalInput)
      setTags({})
      if (finalInput === 'Yes') {
        // submit task and redirect to loading page
        sendMessage(currentStage, {'submit': 'Yes'})
        try{
          const { idToken } = userInfo;
          const headers = getHeader(idToken)
          console.log({tags: JSON.stringify(tags)})
          const response = await fetch(`${BASE_URL}/api/task/submit`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({tags: JSON.stringify(tags)}),
          })
          console.log(response)
          if (!response.ok) {
            console.error('submit ai design task failed')
          }
          setFetchHistory(false)
          data = await response.json()
          console.log('AI design task submitted, resp:', data)
          navigation.navigate(TABs.LOAD)
        } catch(error) {
          console.error('submit ai design task failed', error)
        }
    
      } else {
        sendMessage(currentStage, {'submit': 'No'})
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
    if (conversationStage != "TEXTURE") {
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
    if (conversationStage != "TEXTURE") {
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
    style={{ flex: 1, paddingHorizontal: PADDINGS.sm, marginTop: 60,  marginBottom: 80}}
    >
      <View style={{flexDirection: "row", flex: 0.1, alignItems: "center"}}>
        <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={()=>{setModalVisible(true)}}>
        <ACTION_ICONS.menu
          size={iconSize}
          color={COLORS.white}
            />
        </TouchableOpacity>
        {/* <HistoryModal navigation={navigation} 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible} /> */}
        <View style={{flex: 4, alignItems: "center"}}>
        <MenuHeader> EMO.AI</MenuHeader>
        </View>
        <TouchableOpacity style={{ alignItems: "center", flex: 1 }}
          onPress={() => { () => { navigation.navigate(TABs.HOME) } }}>
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
        placeholder="Type your message..."
        value={userInput}
        onChangeText={setUserInput}
        style={{flex:1, color:COLORS.white}}/>
        <TouchableOpacity style={{ alignSelf: "center", flex: 0.1 }} disabled={pendingReply}
             onPress={() => handlePotentialMultipleChoiceSend(userInput, userInfo)}>
          <ACTION_ICONS.send width={ICON_SIZES.standard} height={ICON_SIZES.standard} />
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



