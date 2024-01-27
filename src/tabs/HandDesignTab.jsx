



import React, { Component } from 'react';
import { ImageBackground, PixelRatio } from 'react-native';
import { StyleSheet, View, PanResponder, Animated, Image, Text, Button, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { TABs } from "../static/Constants";
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
// import Svg, { Path } from 'react-native-svg';
import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS } from "../styles/theme";
import { LEFTHAND_NAILS } from '../styles/nails';

import MaskedView from "@react-native-masked-view/masked-view";
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';




const TOP_BAR = 130;
const leftHandDropZonePositions = [
  { top: 111, left: 20, width: 60, height: 60 },
  { top: 38, left: 80, width: 60, height: 60 },
  { top: 3, left: 148, width: 60, height: 60 },
  { top: 16, left: 230, width: 60, height: 60 },
  { top: 165, left: 308, width: 60, height: 60 },
];

const rightHandDropZonePositions = [
  { top: 210, left: 3, width: 60, height: 60 },
  { top: 35, left: 90, width: 60, height: 60 },
  { top: 5, left: 200, width: 60, height: 60 },
  { top: 50, left: 300, width: 60, height: 60 },
  { top: 150, left: 370, width: 60, height: 60 },
];

const leftHandMasks = [<LEFTHAND_NAILS.left5/>, <LEFTHAND_NAILS.left4/>, <LEFTHAND_NAILS.left3/>, <LEFTHAND_NAILS.left2/>, <LEFTHAND_NAILS.left1/>];

export default class HandDesignTab extends Component {
  constructor(props) {
    super(props);
    // const selectedNails = ['../../assets/nail_model.png','../../assets/left_hand_model.png','../../assets/8.jpeg','../../assets/8.jpeg','../../assets/8.jpeg' ];
    const selectedNails = this.props.route.params?.selectedNails || [];
    console.log("selectedNails", selectedNails);
    this.state = {
      currentHand: 'left', 
      nails: selectedNails.map(() => new Animated.ValueXY()),
      selectedNails: selectedNails,
      droppedZone: null,
      leftHandModel: require('../../assets/workshop/hand_left.png'),
      rightHandModel: require('../../assets/right_hand_model.png'),
      leftHandNails: Array(5).fill(''),
      rightHandNails: Array(5).fill(''),
      // nailRenderList: Array
    };

  }
  
  switchHand = () => {
    this.setState(prevState => ({
      currentHand: prevState.currentHand === 'left' ? 'right' : 'left'
    }));
  }
  UNSAFE_componentWillMount() {
    this.panResponders = this.state.nails.map((_, index) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
          null, { dx: this.state.nails[index].x, dy: this.state.nails[index].y }
        ], { useNativeDriver: false }),
        onPanResponderRelease: (e, gesture) => { 
            Animated.spring(this.state.nails[index], {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false
            }).start();
          let dropedFinger = this.isDropZone(gesture, index);
          if (dropedFinger >= 0) {
              
            console.log("dropedFinger:" + dropedFinger);
            // update leftHandNail or rightHandNails with newly dragged image
            if (this.state.currentHand === "left"){
              let tempArray = [].concat(this.state.leftHandNails);
              tempArray[dropedFinger] = this.state.selectedNails[index];
              this.setState({leftHandNails:tempArray});
            }else{
              let tempArray = [].concat(this.state.rightHandNails);
              tempArray[dropedFinger] = this.state.selectedNails[index];
              this.setState({rightHandNails:tempArray});
            }
          }
        }
      });
    });
  }

  updateNailImage = (hand, index, newImage) => {
    if (hand === 'left') {
      const updatedLeftHandNails = [...this.state.leftHandNails];
      updatedLeftHandNails[index] = newImage;
      this.setState({ leftHandNails: updatedLeftHandNails });
    } else {
      const updatedRightHandNails = [...this.state.rightHandNails];
      updatedRightHandNails[index] = newImage;
      this.setState({ rightHandNails: updatedRightHandNails });
    }
  };
  renderNailCategoryButtons = () => {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{flexDirection: 'row'}}
        >
          <ButtonSelection onPress={() => this.handleNailCategorySelection('selected')} $selected={this.state.nailCategory === 'selected'}>
            <ButtonP>Selected Nails</ButtonP>
          </ButtonSelection>
          <ButtonSelection onPress={() => this.handleNailCategorySelection('emoSingle')} $selected={this.state.nailCategory === 'emoSingle'}>
            <ButtonP>EMO Single Nails</ButtonP>
          </ButtonSelection>
          <ButtonSelection onPress={() => this.handleNailCategorySelection('emoOriginal')} $selected={this.state.nailCategory === 'emoOriginal'}>
            <ButtonP>EMO Original Nails</ButtonP>
          </ButtonSelection>
          <ButtonSelection onPress={() => this.handleNailCategorySelection('community')} $selected={this.state.nailCategory === 'community'}>
            <ButtonP>Community</ButtonP>
          </ButtonSelection>
        </ScrollView>
    );
};

  renderClickableZones() {
    let dropZonePositions = this.state.currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;
    let nailListRender = this.state.currentHand === 'left' ? this.state.leftHandNails : this.state.rightHandNails;
    let hand = this.state.currentHand;
    console.log("nail render" + nailListRender);
    
    return dropZonePositions.map((position, index) => (
     <MaskedView
     style={[styles.clickableZone, position]}
      maskElement={
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Define the mask shape */}
          {leftHandMasks[index]}
          </View>}>
      <TouchableOpacity
        key={index}
        // style={[styles.clickableZone, position]}
        // onPress={() => this.props.navigation.navigate(TABs.NAIL_DESIGN)}
        onPress={() => {
          const selectedNailData = nailListRender[index];

          this.props.navigation.navigate(TABs.NAIL_DESIGN, { 
            currentHand: hand, // 'left' or 'right'
            nailIndex: index, // 0 to 4, representing each finger
            nailImage: selectedNailData, // current image of the selected nail
            selectedNails: this.state.selectedNails, // array of all nails for the current hand
            updateNailImage: (newImage) => this.updateNailImage(hand, index, newImage), });
        }}
        activeOpacity={1}
      >
        {nailListRender[index] ? <Image source={{uri:nailListRender[index]}} style={styles.nailImage} ></Image> : <View style={[styles.nailImage, {backgroundColor:COLORS.dark}]}/> }
        <Image source={{uri:nailListRender[index]}} style={styles.nailImage} ></Image>

      </TouchableOpacity>
      </MaskedView>
    ));
  }



  isDropZone(gesture, index) {
    let dropIndex = -1;
    const dropZonePositions = this.state.currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;

    const draggedItemCenterX = gesture.moveX;
    const draggedItemCenterY = gesture.moveY - TOP_BAR;

    for (let i=0; i<dropZonePositions.length; i++) {
      zone = dropZonePositions[i];
      const isWithinX = draggedItemCenterX >= zone.left && draggedItemCenterX <= zone.left + zone.width;
      const isWithinY = draggedItemCenterY >= zone.top && draggedItemCenterY <= zone.top + zone.height;
  
      if (isWithinX && isWithinY) {
        dropIndex = i;
        return dropIndex;
      }
    }

    return dropIndex;
  }

  renderNails() {

    return (

      <View style={styles.nailContainer}>
        {this.state.selectedNails.map((image, index) => {
          if (!image || image.trim() === '') {
            // If the image URI is empty or undefined, do not render this item
            return null;
          }
          console.log("image in renderNails", image);
          const panStyle = {
            transform: this.state.nails[index].getTranslateTransform(),
          };
          return (
            <Animated.View
              key={index}
              {...this.panResponders[index].panHandlers}
              style={[panStyle]}
            >
              
              <Image source={{ uri: image }} style={styles.nailImage} />
              
            </Animated.View>
          );
        })}
      </View>

    );
  }


  renderDropZones() {
    const dropZonePositions = this.state.currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;

    return dropZonePositions.map((position, index) => (
      <View key={index} style={[styles.dropZone, position]} />
    ));
  }

  navigateToPreview = () => {
    let { leftHandNails, rightHandNails } = this.state;
    this.props.navigation.navigate(TABs.DESIGN_PREVIEW, { 
      leftHandNails: leftHandNails,
      rightHandNails: rightHandNails, 
    });
  }

  render() {
    const handImage = this.state.currentHand === 'left' ? this.state.leftHandModel : this.state.rightHandModel;
    const switch_text = this.state.currentHand === 'left' ? 'right hand >': 'left hand >';
    return (

      <View style={styles.container}>
        <View style={styles.switchHandButton}>
            <Button title={switch_text} color={COLORS.white} onPress={this.switchHand} />
          </View>
         <View style={styles.background}
          >
          <Image source={handImage} ref={this.backgroundRef} style={styles.handImage} />

          {this.renderClickableZones()}
      
          </View>
        <View style={{flexDirection:"column", position:"absolute", bottom:90}}>
          <View style={{position:"absolute", width:"100%",backgroundColor:COLORS.dark, opacity:0.9, height:180,bottom:0}}></View>
          <SubHeader style={{paddingHorizontal: PADDINGS.sm}}>Drag Nails from Collections</SubHeader>
          {this.renderNailCategoryButtons()}
          {this.renderNails()}
        </View>
        <ButtonAction onPress={this.navigateToPreview} style={{marginVertical:PADDINGS.md, position:"absolute", bottom:20, width:"60%"}}><ButtonH>Preview</ButtonH></ButtonAction>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 50,
    width: '100%',
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handImage: {
    position: 'absolute',
    top: -60,
    width: "100%",
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
    borderWidth: 1, // Set to 0 for invisibility
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
    width: 60,
    height: 60,
    borderWidth: 2,
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
export { HandDesignTab };

