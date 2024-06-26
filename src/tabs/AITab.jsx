import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";

import { ButtonAction, ButtonSelection, GradientButtonAction } from "../styles/buttons";
import { P, ButtonP, ButtonH, TitleHeader } from "../styles/texts";
import { TABs } from "../static/Constants";
import { BlurView } from "@react-native-community/blur";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { BASE_URL, APIs, getHeader, GET } from "../utils/API";
import { useLocalLoginStatusContext } from "../providers/LocalLoginStatusContextProvider";


export const AITab = ({ navigation }) => {

  const { userInfo, signout} = useAuthenticationContext();
  const [taskStatus, setTaskStatus] = useState('NO_TASK')
  const {localLogin, setLoginPageVisibility} = useLocalLoginStatusContext()

  const [title, setTitle] = useState(localLogin ? "Start Generating Images Using EMO.AI" : "Account Required")
  const [subtitle, setSubtitle] = useState(localLogin ? "Embrace the power of AI magic to nail your style" : "Setting up an account is required to run EMO AI.")
  const [buttonText, setButtonText] = useState(localLogin ? "Start Now" : "Sign Up")

  // const [title, setTitle] = useState("Start Generating Images Using EMO.AI" )
  // const [subtitle, setSubtitle] = useState("Embrace the power of AI magic to nail your style")
  // const [buttonText, setButtonText] = useState("Start Now")

  useEffect(() => {
    setTitle(localLogin ? "Start Generating Images Using EMO.AI" : "Account Required")
    setSubtitle(localLogin ? "Embrace the power of AI magic to nail your style" : "Setting up an account is required to run EMO AI.")
    setButtonText(localLogin ? "Start Now" : "Sign Up")
    // setTitle("Start Generating Images Using EMO.AI" : "Account Required")
    // setSubtitle("Embrace the power of AI magic to nail your style" : "Setting up an account is required to run EMO AI.")
    // setButtonText(localLogin ? "Start Now" : "Sign Up")
  }, [localLogin])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (userInfo && localLogin) {
        check_last_task_status(true);
      }
    });
    return unsubscribe;
  }, [navigation, localLogin, userInfo]);

  const check_last_task_status = async (init_check) => {
    if (!localLogin) {
      setLoginPageVisibility(true)
      // navigation.navigate(TABs.AICHAT)
      return
    }
    
    resp = await GET(`${BASE_URL}/api/task/last_status`, userInfo, signout)
    if (resp.status !== 200) {
      console.error('Error fetching task status:', error);
      return
    }
    const data = resp.data
    task_id = data.task_id
    let task_status = data.status
    console.log(task_id, task_status)
    if (task_status === 1 || task_status === 2) {
      setTaskStatus("PROCESSING");
      if (!init_check) {
        navigation.navigate(TABs.LOAD)
      }
    } else if (task_status === 3) {
      console.log('task_status is 3', task_id)
      setTaskStatus("WORKSHOP_INIT");
      if (!init_check) {
        navigation.navigate(TABs.WORKSHOP, {task_id: task_id})
      }
    } else if (task_status === 4 || task_status === 5) {
      console.log('task_status is 4/5', task_id)
      setTaskStatus("NO_TASK");
      if (!init_check) {
        navigation.navigate(TABs.AICHAT)
      }
    } else {
      // more status?
      setTaskStatus("NO_TASK");
      if (!init_check) {
        navigation.navigate(TABs.AICHAT)
      }
    }
  };


  return (
    <View style={styles.container}>
        <Image source={require("../../assets/bg/AI_circle.png")} style={styles.image} />
      <BlurView
        blurType="dark"
        blurAmount={30}
        style={{
          marginBottom: 10,
          borderRadius: 25,
          paddingHorizontal: 35,
          paddingVertical: 50,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "absolute",
          bottom: 100,
        }}
      >
        { taskStatus === "NO_TASK" ? 
          <>
          <TitleHeader >
            {title}
          </TitleHeader>
          <P style={{ textAlign: "center", marginBottom: 20, width: 150 }}>
            {subtitle}
          </P>
          <View>
            <GradientButtonAction onPress={() => check_last_task_status(false)}>
              <ButtonH>{buttonText}</ButtonH>
            </GradientButtonAction>
          </View>
          </> 
          :  
          <>
          <TitleHeader >
          {taskStatus==="WORKSHOP_INIT" ? "Your Design is Here!" : "Welcome Back!"}
        </TitleHeader>
        <View>
        <GradientButtonAction onPress={() => check_last_task_status(false)}>
          <ButtonH>{taskStatus==="WORKSHOP_INIT" ? "Go To Workshop" : "Check Status"}</ButtonH>
        </GradientButtonAction>
      </View>
      </>
    } 
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    position:"absolute",
    top: 10,
    width: 510,
    height: 510,
    justifyContent: "center",
  },
});
