import {COLORS, FONTS, PADDINGS, BORDERS} from './theme'
import styled from 'styled-components/native'
// import {LinearGradient} from 'expo-linear-gradient';
import { Text } from 'react-native';
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet} from "react-native";


// // select vs unselected button
export const ButtonSelection = styled.TouchableOpacity<{ $selected?:boolean}>`
    background-color: ${props => props.$selected ? "transparent": "transparent"};
    border: ${props => props.$selected ? "0px" : "1px"};
    border-color: ${COLORS.gradientSub1};
    border-radius: ${BORDERS.buttonSelectionRadius}px;
    margin: ${props => props.$selected ? "0px" : "10px"};
    padding: ${PADDINGS.buttonSelectionY}px ${PADDINGS.buttonSelectionX}px;
`;


export const ButtonAction = styled.TouchableOpacity<{ $isWhite?:boolean}>`
    background-color: ${props => props.$isWhite ?  "transparent" : COLORS.gradientSub1};
    border: 0.5px;
    border-color: ${props => props.$isWhite ?  COLORS.white : COLORS.gradientSub1};
    border-radius: ${BORDERS.buttonSelectionRadius}px;
    margin: 10px;
    padding: ${PADDINGS.buttonSelectionY}px ${PADDINGS.buttonSelectionX}px;
`;



export const GradientButtonSelection = (props) => {
    return (
        props.$selected ? 
        <LinearGradient style={[props.style, styles.gradientButtonSelection]}
          colors={COLORS.gradient1}
          useAngle={true} angle={45} angleCenter={{x:0.5,y:0.5}}
          locations={[0.14,0.49,0.83]}
        >
            <ButtonSelection {...props} />
        </LinearGradient>
        : <ButtonSelection {...props} />
    );
  };


  const styles = StyleSheet.create({
    gradientButtonSelection:{
        borderRadius: BORDERS.buttonSelectionRadius,
        borderWidth:1,
        margin: 10,
        // paddingHorizontal: PADDINGS.buttonSelectionY, 
        // paddingVertical:PADDINGS.buttonSelectionX,
        height: 33,
    } 
  });

  



// container for gradient
// export const ButtonGradient = ({selected,title}) => (
//             <LinearGradient colors={COLORS.gradient1}>
//                 <Text>BUTTON</Text>
//             </LinearGradient>
// );




