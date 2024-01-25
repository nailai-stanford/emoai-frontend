import {COLORS, FONTS, PADDINGS, BORDERS} from './theme'
import styled from 'styled-components/native'
// import {LinearGradient} from 'expo-linear-gradient';
import { Text } from 'react-native';


// select vs unselected button
export const ButtonSelection = styled.TouchableOpacity<{ $selected?:boolean}>`
    background-color: ${props => props.$selected ? COLORS.gradientSub1: "transparent"};
    border: 1px;
    border-color: ${COLORS.gradientSub1};
    border-radius: ${BORDERS.buttonSelectionRadius}px;
    margin: 10px;
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




// container for gradient
// export const ButtonGradient = ({selected,title}) => (
//             <LinearGradient colors={COLORS.gradient1}>
//                 <Text>BUTTON</Text>
//             </LinearGradient>
// );




