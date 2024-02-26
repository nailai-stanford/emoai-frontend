import { TABs } from "../static/Constants";
import {Image, View,StyleSheet } from "react-native";


import { P, TitleHeader, MenuHeader, ButtonH } from "../styles/texts";
import { PADDINGS } from "../styles/theme";
import { GradientButtonAction } from "../styles/buttons";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { getHeader, BASE_URL } from "../utils/API";

export const WorkshopIdleTab = ({navigation, route}) => {
    const { userInfo, signout} = useAuthenticationContext();
    const [buttonText, setButtonText] = useState('Explore in Chatbot')

    const check_last_task_status = async (init_check) => {
        if (!userInfo) {
          signout()
          return
        }
        const headers = getHeader(userInfo.idToken);
        try {
          const response = await fetch(`${BASE_URL}/api/task/last_status`, {
            method: 'GET',
            headers: headers,
          });
          if (!response.ok) {
            console.error('Failed to fetch task status');
            if (response.status == 401) {
              signout()
            }
            return;
          }
          const data = await response.json();
          task_id = data.task_id
          let task_status = data.status
          console.log(task_id, task_status)
          if (task_status === 1 || task_status === 2) {
            if (!init_check) {
              navigation.navigate(TABs.LOAD)
            }
            setButtonText('See AI Progress')

          } else if (task_status === 3) {
            console.log('task_status is 3', task_id)
            setButtonText('Go To Workshop')
            if (!init_check) {
              navigation.navigate(TABs.WORKSHOP, {task_id: task_id})
            }
          } else if (task_status === 4 || task_status === 5) {
            console.log('task_status is 4/5', task_id)
            setButtonText('Explore in Chatbot')
            if (!init_check) {
              navigation.navigate(TABs.AICHAT)
            }
          } else {
            setButtonText('Explore in Chatbot')
            if (!init_check) {
              navigation.navigate(TABs.AICHAT)
            }
          }
        } catch (error) {
          console.error('Error fetching task status:', error);
        }
      };

      
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          check_last_task_status(true);
        });
        return unsubscribe;
      }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/others/workshop_idle.png')} 
                style={{width:'80%', height:'60%'}} />
            <MenuHeader style={{paddingBottom:PADDINGS.md}}>EMO.Ai Workshop</MenuHeader>
            <P style={{width:'75%'}}>Upload your own photos in the workshop and create nail 
                designs that are uniquely yours – experience personalized 
                nail art like never before!</P>
            <GradientButtonAction onPress={()=> check_last_task_status(false)} > 
                <ButtonH>{buttonText}</ButtonH>
            </GradientButtonAction>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 20,
      height: '100%',
    },
});
