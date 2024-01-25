import {COLORS, FONTS, PADDINGS, BORDERS} from './theme'
import styled from 'styled-components/native'
// import {LinearGradient} from 'expo-linear-gradient';
import { TextInput } from 'react-native';



export const InputView = styled.View<{ $isFullLength?:boolean}>`
    background-color: transparent;
    border: 1px;
    border-radius: ${BORDERS.inputRadius}px;
    border-color: ${COLORS.white};
    margin: 10px;
    height: 40px;
    width: ${props => props.$isFullLength ? "auto" : "80%"};
    flex-direction: row;
    align-items: center;
    padding-left: ${PADDINGS.x}px;
`;
