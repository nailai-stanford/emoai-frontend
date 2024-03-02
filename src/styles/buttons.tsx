import {COLORS, FONTS, PADDINGS, BORDERS} from './theme'
import styled from 'styled-components/native'
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

export const ButtonActionNew = styled.TouchableOpacity<{ $isWhite?:boolean}>`
    background-color: transparent;
    border: ${props => props.$isWhite ? "0px":"0.5px"};
    border-color: ${props => props.$isWhite ?  COLORS.white : COLORS.gradientSub1};
    border-radius: ${BORDERS.buttonSelectionRadius}px;
    padding: ${PADDINGS.buttonSelectionY}px ${PADDINGS.buttonSelectionX}px;
`;

export const ButtonSelectionChat = styled.TouchableOpacity<{ $selected?:boolean}>`
    background-color: ${props => props.$selected ? "transparent": "transparent"};
    border: ${props => props.$selected ? "0px" : "1px"};
    border-color: ${COLORS.gradientSub1};
    border-radius: ${BORDERS.buttonSelectionRadius}px;
    margin: ${props => props.$selected ? "0px" : "5px"};
    padding: ${PADDINGS.buttonSelectionY}px 15px;
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

  export const GradientButtonAction = (props) => {
    return (
        <LinearGradient style={[props.style, styles.gradientButtonSelection]}
          colors={COLORS.gradient1}
          useAngle={true} angle={45} angleCenter={{x:0.5,y:0.5}}
          locations={[0.14,0.49,0.83]}
        >
            <ButtonActionNew {...props}  $isWhite={true}/>
        </LinearGradient>
    );
  };

  export const GradientDivider = (props) => {
    return (
        <LinearGradient style={[props.style, styles.gradientDivider]}
          colors={COLORS.gradient1}
          useAngle={true} angle={45} angleCenter={{x:0.5,y:0.5}}
          locations={[0.14,0.49,0.83]}
        >
            <ButtonActionNew {...props}  $isWhite={true}/>
        </LinearGradient>
    );
  };

  export const GradientButtonChatSelection = (props) => {
    return (
        props.$selected ? 
        <LinearGradient style={[props.style, styles.gradientButtonChatSelection]}
          colors={COLORS.gradient1}
          useAngle={true} angle={45} angleCenter={{x:0.5,y:0.5}}
          locations={[0.14,0.49,0.83]}
        >
            <ButtonSelectionChat {...props} />
        </LinearGradient>
        : <ButtonSelectionChat {...props} />
    );
  };


  const styles = StyleSheet.create({
    gradientDivider: {
      borderWidth:1,
      height: 4,
    },
    gradientButtonSelection:{
        borderRadius: BORDERS.buttonSelectionRadius,
        borderWidth:1,
        padding: 0,
        margin: 10,
        // paddingHorizontal: PADDINGS.buttonSelectionY, 
        // paddingVertical:PADDINGS.buttonSelectionX,
        height: 33,
    },
    gradientButtonChatSelection:{
      borderRadius: BORDERS.buttonSelectionRadius,
      borderWidth:1,
      padding: 0,
      margin: 5,
      // paddingHorizontal: PADDINGS.buttonSelectionY, 
      // paddingVertical:PADDINGS.buttonSelectionX,
      height: 30,
  }  
  });

  



// container for gradient
// export const ButtonGradient = ({selected,title}) => (
//             <LinearGradient colors={COLORS.gradient1}>
//                 <Text>BUTTON</Text>
//             </LinearGradient>
// );




