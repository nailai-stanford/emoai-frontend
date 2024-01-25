import {COLORS, FONTS, PADDINGS, BORDERS, FONT_FAMILYS} from './theme'
import styled from 'styled-components/native'


// button select text
// export const ButtonSelectionText = styled.Text<{ $selected?:boolean}>`
//     color: ${COLORS.white};
//     font-size: ${FONTS.p}px;
//     font-weight: ${FONTS.buttonSelectionWeight};
//     text-align: center;
// `;


// light p as the smallest and lightest text
export const P = styled.Text<{ $colored?:boolean, $alignLeft?:boolean}>`
    color: ${props => props.$colored ? COLORS.gradientSub1 : COLORS.white};
    font-size: ${FONTS.sm}px;
    font-family:${FONT_FAMILYS.regular};
    text-align: ${props => props.$alignLeft ? "left" : "center"};
`;


export const SubHeader = styled.Text<{ $colored?:boolean}>`
    color: ${props => props.$colored ? COLORS.gradientSub1 : COLORS.white};
    font-size: ${FONTS.subHeader}px;
    font-weight: 700;
`;

export const ButtonP = styled(P)`
    font-size: ${FONTS.buttonSelection}px;
`

export const ButtonH = styled.Text`
    color: ${COLORS.white};
    font-size: ${FONTS.buttonSelection}px;
    font-family:${FONT_FAMILYS.bold};
    font-weight: 700;
    text-align: center;
`;

export const MenuHeader = styled.Text<{ $colored?:boolean}>`
    color:  ${props => props.$colored ? COLORS.gradientSub1 : COLORS.white};
    font-size: ${FONTS.header}px;
    font-family:${FONT_FAMILYS.regular};
    font-weight: 700;

    line-height: 24px;
`;

export const TitleHeader = styled.Text<{$alignLeft?:boolean}>`
    font-size: ${FONTS.lg}px;
    font-family:${FONT_FAMILYS.regular};
    color: ${COLORS.white};
    margin-bottom: 10px;
    text-align: ${props => props.$alignLeft ? "left" : "center"};
`; 