import {StyleSheet, Dimensions} from 'react-native'

export const DIMENSIONS = {
    fullHeight: Dimensions.get('window').height,
    fullWidth: Dimensions.get('window').width
  }



export const COLORS = {
    // color theme here
    dark: '#101012', // only for testing
    white: '#FFFFFF',
    grey: '#9FA09B',
    gradient1:['#B419EA', '#432FE4', '#06A4C7'],
    gradient2: ['#D55CFF','#2ED9FF'],
    gradientSub1: '#B419EA',
    gradientSub2: '#432FE4',
    gradientSub3: '#06A4C7',
    chatbot: '#B686C0',
    chatme: '#FD9563',
    
}

export const ICON_SIZES = {
    // icon sizes here
    standard: 20,
    small: 15,
}



// paddings
export const PADDINGS = {
    sm: 8,
    x: 16,
    md: 24,
    buttonActionX: 30,
    buttonActionY: 10,
    buttonSelectionX: 24,
    buttonSelectionY: 6,

}

// spacing: 24
export const MARGINs = {

}


export const FONTS = {
    // font here
    buttonSelection: 16,
    subHeader: 16,
    sm: 12,
    md: 18,
    header: 20,
    lg: 24,
}

export const FONT_FAMILYS = {
    // font family here
    regular: 'Tahoma',
    bold: 'TAHOMABD',
    rubik: 'RubikOne-Regular',

}

export const BORDERS = {
    // border here
    buttonSelectionRadius: 16,
    inputRadius: 24,
}