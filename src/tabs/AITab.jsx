import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";

import { ButtonAction, ButtonSelection, GradientButtonAction } from "../styles/buttons";
import { P, ButtonP, ButtonH, TitleHeader } from "../styles/texts";
import { TABs } from "../static/Constants";
import { BlurView } from "@react-native-community/blur";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { useTaskStatus } from "../providers/TaskContextProvider";
import { BASE_URL, APIs, getHeader } from "../utils/API";



export const AITab = ({ navigation }) => {

  const { userInfo} = useAuthenticationContext();
  const {taskStatus, setTaskStatus, taskGlobalID, setTaskGlobalID} = useTaskStatus();

  const { idToken } = userInfo;
  const headers = getHeader(idToken);

  const check_last_task_status = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/task/last_status`, {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) {
        console.error('Failed to fetch task status');
        return;
      }
      const data = await response.json();
      task_id = data.task_id
      task_status = data.status
      console.log(task_id, task_status)
      if (task_status === 1 || task_status === 2) {
        setTaskStatus("PROCESSING");
        setTaskGlobalID(task_id);
        navigation.navigate(TABs.LOAD)
      }
      if (task_status === 3) {
        console.log('task_status is 3', task_id)
        setTaskStatus("WORKSHOP_INIT");
        setTaskGlobalID(task_id);
        navigation.navigate(TABs.WORKSHOP, {task_id: task_id})
      } else if (task_status === 4 || task_status === 5) {
        console.log('task_status is 4/5', task_id)
        setTaskStatus("NO_TASK");
        navigation.navigate(TABs.AICHAT)
      } else {
        // more status?
        setTaskStatus("PROCESSING");
        navigation.navigate(TABs.LOAD)
      }
    } catch (error) {
      console.error('Error fetching task status:', error);
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
          Start Generating Images Using EMO.AI
        </TitleHeader>
        <P style={{ textAlign: "center", marginBottom: 20, width: 150 }}>
          Embrace the power of AI magic to nail your style
        </P>
        <View>
          <GradientButtonAction onPress={() => check_last_task_status()}>
            <ButtonH>Start Now</ButtonH>
          </GradientButtonAction>
        </View>
        </> 
        :  
        <>
        <TitleHeader >
        {taskStatus==="WORKSHOP_INIT" ? "Your Design is Here!" : "Welcome Back!"}
      </TitleHeader>
      <View>
      <GradientButtonAction onPress={() => check_last_task_status()}>
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
