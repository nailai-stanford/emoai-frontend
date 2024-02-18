import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Image, TouchableOpacity, Animated, PanResponder, Button, StyleSheet, ScrollView } from 'react-native';
import { TABs } from "../static/Constants";

import { ImageBackground, PixelRatio } from 'react-native';
import { Dimensions } from 'react-native';
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
// import Svg, { Path } from 'react-native-svg';
import { ButtonAction, ButtonSelection, GradientButtonAction, GradientButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS } from "../styles/theme";
import { LEFTHAND_NAILS } from '../styles/nails';
import { BlurView } from "@react-native-community/blur";
import { BASE_URL, APIs, getHeader } from "../utils/API";
import { useFocusEffect } from '@react-navigation/native';



import MaskedView from "@react-native-masked-view/masked-view";
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import axios from 'axios';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

const DROPZONE_WIDTH = 60;
const DROPZONE_HEIGHT = 60;
const TOP_BAR = 130;
const leftHandDropZonePositions = [
  { top: 171, left: 20, width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 98, left: 80 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 63, left: 148 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 76, left: 230 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 225, left: 308 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
];

const rightHandDropZonePositions = [
  { top: 225, left: 25 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 76, left: 103 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 63, left: 185 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
  { top: 98, left: 253, width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT },
  { top: 171, left: 313 , width: DROPZONE_WIDTH, height: DROPZONE_HEIGHT},
];
const leftHandMasks = [<LEFTHAND_NAILS.left5/>, <LEFTHAND_NAILS.left4/>, <LEFTHAND_NAILS.left3/>, <LEFTHAND_NAILS.left2/>, <LEFTHAND_NAILS.left1/>];
const rightHandMasks = [<LEFTHAND_NAILS.left1 style={{  transform:[{ scaleX: -1 }]}}/>, <LEFTHAND_NAILS.left2 style={{ transform:[{ scaleX: -1 }]}}/>, <LEFTHAND_NAILS.left3 style={{ transform:[{ scaleX: -1 }] }}/>, <LEFTHAND_NAILS.left4 style={{ transform:[{ scaleX: -1 }] }}/>, <LEFTHAND_NAILS.left5 style={{ transform:[{ scaleX: -1 }] }}/>]


export const HandDesignTab = ({ route, navigation }) => {

  const selectedNails = route.params?.selectedNails || [];
  const handProducts = route.params?.handProducts || [];
  const taskId = route.params?.task_id || "";
  const userInfo = route.params?.userInfo || null;

  const [currentHand, setCurrentHand] = useState('left');
  const [nailCategory, setNailCategory] = useState('selected');
  const [nails, setNails] = useState(selectedNails.map(() => new Animated.ValueXY()));
  const [leftHandModel, setLeftHandModel] = useState(require('../../assets/workshop/hand_left.png'));
  const [rightHandModel, setRightHandModel] = useState(require('../../assets/workshop/hand_right.png'));
  const [leftHandNails, setLeftHandNails] = useState(Array(5).fill(''));
  const [rightHandNails, setRightHandNails] = useState(Array(5).fill(''));
  const [originalCollect, setOriginalCollect] = useState([]);
  const [panResponders, setPanResponders] = useState([]);

  // Event handlers and logic

  const handleNailCategorySelection = useCallback((category) => {
    setNailCategory(category);
  }, []);

  const switchHand = useCallback(() => {
    setCurrentHand(prevHand => prevHand === 'left' ? 'right' : 'left');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setLeftHandNails(Array(5).fill('')); 
        setRightHandNails(Array(5).fill('')); 
      };
    }, [])
  );


  useEffect(() => {
    const newPanResponders = nails.map((_, index) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
          null, { dx: nails[index].x, dy: nails[index].y }
        ], { useNativeDriver: false }),
        onPanResponderRelease: (e, gesture) => { 
          Animated.spring(nails[index], {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false
          }).start();

          const droppedFinger = isDropZone(gesture, index);
          if (droppedFinger >= 0) {
            if (currentHand === "left"){
              let tempArray = [...leftHandNails];
              tempArray[droppedFinger] = {
                id: selectedNails[index].nailId,
                url: selectedNails[index].nailDesignImageUrl
              };
              setLeftHandNails(tempArray);
            } else {
              let tempArray = [...rightHandNails];
              tempArray[droppedFinger] = {
                id: selectedNails[index].nailId,
                url: selectedNails[index].nailDesignImageUrl
              };
              setRightHandNails(tempArray);
            }
          }
        }
      });
    });
    setPanResponders(newPanResponders);
  }, [nails, currentHand, leftHandNails, rightHandNails, selectedNails]); // Dependencies

  

  const updateNailImage = useCallback((hand, index, newImage) => {
    if (hand === 'left') {
      setLeftHandNails(prevNails => {
        const updatedNails = [...prevNails];
        updatedNails[index] = newImage;
        return updatedNails;
      });
    } else {
      setRightHandNails(prevNails => {
        const updatedNails = [...prevNails];
        updatedNails[index] = newImage;
        return updatedNails;
      });
    }
  }, []);

  // Render methods

  const renderNailCategoryButtons = () => {
    // ... (render logic for nail category buttons)
  };

  // ... (other render methods)
  const renderClickableZones = () => {
    const dropZonePositions = currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;
    const nailListRender = currentHand === 'left' ? leftHandNails : rightHandNails;
    return dropZonePositions.map((position, index) => (
        <MaskedView
        key={index}
        style={[styles.clickableZone, position]}
        maskElement={
            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            {/* Define the mask shape */}
            {currentHand === 'left' ? leftHandMasks[index] : rightHandMasks[index]}
            </View>
        }>
        {/* <TouchableOpacity
            onPress={() => {
            const selectedNailData = nailListRender[index];
            navigation.navigate(TABs.NAIL_DESIGN, { 
                currentHand: currentHand,
                nailIndex: index,
                nailImage: selectedNailData,
                selectedNails: selectedNails,
                updateNailImage: (newImage) => updateNailImage(currentHand, index, newImage),
            });
            }}
            activeOpacity={1}
        > */}
            {nailListRender[index] ? 
            <Image source={{ uri: nailListRender[index].url }} style={styles.nailImage} />
            : <View style={[styles.nailImage, { backgroundColor: COLORS.dark }]} />
            }
        {/* </TouchableOpacity> */}
        </MaskedView>
    ));
};

const isDropZone = (gesture, index) => {
    let dropIndex = -1;
    const dropZonePositions = currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;
    const draggedItemCenterX = gesture.moveX;
    const draggedItemCenterY = gesture.moveY - TOP_BAR; // Ensure TOP_BAR is defined in your component
    const dropZonePadding = 20;

    for (let i = 0; i < dropZonePositions.length; i++) {
      const zone = dropZonePositions[i];
      const isWithinX = draggedItemCenterX >= zone.left - dropZonePadding && 
                        draggedItemCenterX <= zone.left + zone.width + dropZonePadding;
      const isWithinY = draggedItemCenterY >= zone.top - dropZonePadding && 
                        draggedItemCenterY <= zone.top + zone.height + dropZonePadding;

      if (isWithinX && isWithinY) {
        dropIndex = i;
        return dropIndex;
      }
    }

    return dropIndex;
  };

  const renderNails = () => {
    let nailsToRender = nailCategory === 'emoSingle' ? originalCollect : selectedNails.map(nail => nail.nailDesignImageUrl);
    return (
      <View style={styles.nailContainer}>
        {nailsToRender.map((nail, index) => {
          if (!nail || nail.trim() === '') {
            return null;
          }

          const panStyle = {
            transform: nails[index].getTranslateTransform(),
          };

          return (
            <Animated.View
              key={index}
              {...(panResponders[index] ? panResponders[index].panHandlers : {})} // Using panHandlers from the panResponders
              style={[panStyle]}
            >
              <Image source={{ uri: nail }} style={styles.nailImage} />
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderDropZones = () => {
    const dropZonePositions = currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;
    return dropZonePositions.map((position, index) => (
      <View key={index} style={[styles.dropZone, position]} />
    ));
  };

  const checkIfAllNailsAreSelected = () => {
    let missingNails = 0;
    for (let i = 0; i < 5; i++) {
      if (leftHandNails[i] === '') {
        missingNails++;
      }
      if (rightHandNails[i] === '') {
        missingNails++;
      }
    }
    return missingNails;
  };

  const navigateToPreview = () => {
    if (checkIfAllNailsAreSelected() !== 0) {
      alert(`Please ensure all nails for both hands are assigned. Currently, there are ${checkIfAllNailsAreSelected()} nails empty.`);
      return;
    }

    navigation.navigate(TABs.DESIGN_PREVIEW, { 
      leftHandNails: leftHandNails,
      rightHandNails: rightHandNails, 
      handProducts: handProducts,
      taskId: taskId
    });
  };


  
  const handImage = currentHand === 'left' ? leftHandModel : rightHandModel;
  const switch_text = currentHand === 'left' ? 'right hand >' : 'left hand >';

  // JSX layout
  return (
    <View style={styles.container}>
      <View style={styles.switchHandButton}>
        <Button title={switch_text} color={COLORS.white} onPress={switchHand} />
      </View>
      <View style={styles.background}>
        <Image source={handImage} /* ref={backgroundRef} */ style={styles.handImage} />
        <View style={{ backgroundColor: COLORS.dark, width: '100%', top: '100%' }} />
        {renderClickableZones()}
      </View>
      <View style={{ flexDirection: "column", position: "absolute", bottom: 120, paddingHorizontal: PADDINGS.sm }}>
        {/* Additional UI Elements */}
        <BlurView
          blurType="dark"
          blurAmount={30}
          style={{ height: 160, width: "100%", position: "absolute", bottom: 0 }}
        />
        <SubHeader style={{ paddingHorizontal: PADDINGS.sm }}>Drag Nails from Collections</SubHeader>
        <P style={{ paddingHorizontal: PADDINGS.sm, paddingBottom: PADDINGS.md }}  $alignLeft>Assign nail styles to specific fingers. Mix and match as you like!</P>
        {renderNails()}
      </View>
      <View style={{ position: "absolute", bottom: 75, width: "60%" }}>
        <GradientButtonSelection $selected onPress={navigateToPreview} 
          style={{ marginVertical: PADDINGS.sm, borderWidth: 0 }}>
          <ButtonP>Next</ButtonP>
        </GradientButtonSelection>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    background: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: 600,
    },
    handImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 393,
      height: 700,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropZoneContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      height: 200, // adjust as needed
    },
    clickableZone: {
      position: 'absolute',
      borderWidth: 0, // Set to 0 for invisibility
      borderColor: COLORS.white, 
      // backgroundColor: 'transparent', // Uncomment for complete invisibility
      // ... (other styles as needed)
    },
    dropZone: {
      position: 'absolute',
      // backgroundColor: 'lightgrey',
      // borderRadius: 10,
      borderWidth: 4,
      borderColor: 'red',
      // add any additional styling for the drop zones
    },
    switchHandButton: {
      position: 'absolute',
      top: 5,      // Adjust as needed for spacing from the top
      right: 10,    // Adjust as needed for spacing from the right
      zIndex: 10,   // Ensure the button is above other elements
    },
    nailContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      paddingBottom: 30,
    },
    nailImage: {
      width: 50,
      height: 60,
      resizeMode:'contain',
      marginHorizontal: 5,
      // Add any additional styles for the image if necessary
    },
    redBox_1: {
      top: 105,
      left: 55,
      width: 60,
      height:60,
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'red',
    },
    redBox_2: {
      top: 35,
      left: 90,
      width: 60,
      height:60,
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'red',
    },
    redBox_3: {
      top: 5,
      left: 155,
      width: 60,
      height:60,
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'red',
    },
    redBox_4: {
      top: 10,
      left: 220,
      width: 60,
      height:60,
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'red',
    },
    redBox_5: {
      top: 140,
      left: 280,
      width: 60,
      height:60,
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'red',
    }
  });  


