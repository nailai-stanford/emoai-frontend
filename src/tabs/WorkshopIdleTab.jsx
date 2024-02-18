import { TABs } from "../static/Constants";
import {Image, View,StyleSheet } from "react-native";


import { P, TitleHeader, MenuHeader, ButtonH } from "../styles/texts";
import { PADDINGS } from "../styles/theme";
import { GradientButtonAction } from "../styles/buttons";

import { useTaskStatus } from "../providers/TaskContextProvider";
import { useEffect } from "react";

export const WorkshopIdleTab = ({navigation, route}) => {

    const {taskStatus, setTaskStatus} = useTaskStatus();

    const navigate_to_AI = () => {
        if (taskStatus === "WORKSHOP_INIT") {
            navigation.navigate(TABs.WORKSHOP)
        } else {
            navigation.navigate(TABs.AI)
        }
    }

    const TASK_TEXT_MAPPING = {
        "WORKSHOP_INIT": {
            "action": () => navigation.navigate(TABs.WORKSHOP),
            "text": "Go To Workshop",
        },
        "PROCESSING": {
            "action": () => navigation.navigate(TABs.LOAD),
            "text": "See AI Progress",
        },
        "NO_TASK": {
            "action": () => navigation.navigate(TABs.AICHAT),
            "text": "Explore in Chatbot",
        },
    }

    useEffect(() => {
        console.log('taskStatus:', taskStatus)
        console.log('TASK_TEXT_MAPPING:', TASK_TEXT_MAPPING[taskStatus])
    }, [taskStatus])


    return (
        <View style={styles.container}>
            <Image source={require('../../assets/others/workshop_idle.png')} 
                style={{width:'80%', height:'60%'}} />
            <MenuHeader style={{paddingBottom:PADDINGS.md}}>EMO.Ai Workshop</MenuHeader>
            <P style={{width:'75%'}}>Upload your own photos in the workshop and create nail 
                designs that are uniquely yours – experience personalized 
                nail art like never before!</P>
            <GradientButtonAction onPress={TASK_TEXT_MAPPING[taskStatus]?.action || (() => {})} > 
                <ButtonH>{TASK_TEXT_MAPPING[taskStatus]?.text}</ButtonH>
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
