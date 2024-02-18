import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { TABs } from '../static/Constants';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { BASE_URL, APIs, getHeader } from "../utils/API";
import LottieView from "lottie-react-native";

import {TitleHeader, P, GradientMenuHeader, ButtonP} from '../styles/texts.tsx'
import { PADDINGS, COLORS } from '../styles/theme.jsx';
import { GradientButtonAction } from '../styles/buttons.tsx';

export const LoadTab = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  const { userInfo} = useAuthenticationContext();
  // const { userTags } = route.params;


  useEffect(() => {
    const { idToken } = userInfo;
    const headers = getHeader(idToken);
  
    const get_last_task_status = async () => {
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
        console.log(task_id, task_status, 'progress:', data.progress)
        setProgress(data.progress)
        if (task_status === 3) {
          // task_id = "506b07a3-84e2-4545-8840-ddb17da54193"
          navigation.navigate(TABs.WORKSHOP, {task_id: task_id})
          clearInterval(intervalId);
          setProgress(0);
        } else if (task_status === 4 || task_status === 5) {
          clearInterval(intervalId);
          setProgress(0);
          // how to deal with failed?  need talk with PM
          navigation.navigate(TABs.AICHAT)
        }
      } catch (error) {
        console.error('Error fetching task status:', error);
      }
    };
  
    const intervalId = setInterval(() => {
      get_last_task_status();
    }, 5000); // 5000 milliseconds = 5 seconds
  
    return () => {
      clearInterval(intervalId);
    };

  }, [progress]); // Dependencies array
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal:PADDINGS.md}}>
      <GradientMenuHeader style={{textAlign:'center', paddingHorizontal:PADDINGS.md, marginBottom:20}}>Our Nail AI is creating your own nail design...</GradientMenuHeader>
      <Progress.Circle progress={progress/100} size={120} showsText={true} color={COLORS.white}/>
      <P style={{padding:PADDINGS.md, width:290, marginBottom:50}}>Please check back soon. 
      Meanwhile, you can tour around the nail design by other creators!</P>
      <View style={{flexDirection:'row'}}>
      <GradientButtonAction onPress={() => {navigation.navigate(TABs.DISCOVER)}}><ButtonP>Explore</ButtonP></GradientButtonAction>
      <GradientButtonAction onPress={() => {navigation.navigate(TABs.HOME)}}><ButtonP>Home</ButtonP></GradientButtonAction>
      </View>
    </View>
  );
};
