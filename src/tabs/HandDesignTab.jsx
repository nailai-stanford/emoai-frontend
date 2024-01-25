



import React, { Component } from 'react';
import { ImageBackground, PixelRatio } from 'react-native';
import { StyleSheet, View, PanResponder, Animated, Image, Text, Button, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { TABs } from "../static/Constants";
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
// import Svg, { Path } from 'react-native-svg';

const TOP_BAR = 130;
const leftHandDropZonePositions = [
  { top: 115, left: 3, width: 60, height: 60 },
  { top: 25, left: 75, width: 60, height: 60 },
  { top: 5, left: 155, width: 60, height: 60 },
  { top: 20, left: 270, width: 60, height: 60 },
  { top: 210, left: 370, width: 60, height: 60 },
];

const rightHandDropZonePositions = [
  { top: 210, left: 3, width: 60, height: 60 },
  { top: 35, left: 90, width: 60, height: 60 },
  { top: 5, left: 200, width: 60, height: 60 },
  { top: 50, left: 300, width: 60, height: 60 },
  { top: 150, left: 370, width: 60, height: 60 },
];

export default class HandDesignTab extends Component {
  constructor(props) {
    super(props);
    const selectedNails = this.props.route.params?.selectedNails || [];
    console.log("selectedNails", selectedNails);
    this.state = {
      currentHand: 'left', 
      nails: selectedNails.map(() => new Animated.ValueXY()),
      selectedNails: selectedNails,
      droppedZone: null,
      leftHandModel: require('../../assets/left_hand_model.png'),
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
            <Button title="Selected Nails" onPress={() => this.handleNailCategorySelection('selected')} />
            <Button title="EMO Single Nails" onPress={() => this.handleNailCategorySelection('emoSingle')} />
            <Button title="EMO Original Nails" onPress={() => this.handleNailCategorySelection('emoOriginal')} />
            <Button title="Community" onPress={() => this.handleNailCategorySelection('community')} />
        </ScrollView>
    );
};

  renderClickableZones() {
    let dropZonePositions = this.state.currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;
    let nailListRender = this.state.currentHand === 'left' ? this.state.leftHandNails : this.state.rightHandNails;
    let hand = this.state.currentHand;
    console.log("nail render" + nailListRender);
    
    return dropZonePositions.map((position, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.clickableZone, position]}
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
        <Image source={{uri:nailListRender[index]}} style={styles.nailImage} ></Image>

      </TouchableOpacity>
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
    //   <ScrollView 
    //   horizontal 
    //   showsHorizontalScrollIndicator={true} 
    //   contentContainerStyle={{width: '100%'}}
    // >
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
      // </ScrollView>
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
      <Button title={switch_text} onPress={this.switchHand} />
          </View>
         <ImageBackground
         ref={this.backgroundRef}
        source={handImage}
        style={styles.background}
        resizeMode="cover"
    >
      {this.renderClickableZones()}
      
      {/* <Svg xmlns="http://www.w3.org/2000/svg" width="19" height="36" viewBox="0 0 19 36" fill="none">
        <Path d="M4.05349 2.01505C2.30322 2.92518 1.00774 4.41449 0.621848 6.49676C-0.632286 13.1848 0.33243 20.2728 0.732099 27.0161C0.801007 28.2709 0.883701 29.5534 1.24203 30.7669C1.97245 33.1663 4.10861 34.7659 6.54797 35.1107C8.29825 35.3589 10.1036 35.0142 11.7575 34.3798C13.2459 33.8007 14.6516 33.0008 15.8093 31.8839C18.9653 28.8225 19.0755 23.8444 18.9791 19.735C18.9101 16.522 18.8137 13.2952 18.7586 10.0821C18.7172 7.57236 18.4829 4.70407 16.5397 2.88381C13.9212 0.415431 9.40078 0.456801 6.10696 1.2704C5.37653 1.44967 4.68745 1.71168 4.05349 2.04264V2.01505Z" fill="black"/>
      </Svg> */}
      {/* <Svg height="50" width="50">
        <Circle cx="25" cy="25" r="20" stroke="purple" strokeWidth="2.5" fill="yellow" />
      </Svg> */}

      {/* SVG 2: Rectangle */}
      {/* <Svg height="50" width="50">
        <Rect x="5" y="5" width="40" height="40" stroke="blue" strokeWidth="2" fill="green" />
      </Svg> */}
      {/* <View>{this.renderDropZones()}</View> */}
      </ImageBackground>
      <Text style={styles.dragNailsText}>Drag Nails from Collections</Text>
      {this.renderNailCategoryButtons()}
        {this.renderNails()}
        
        <Button title='Preview' onPress={this.navigateToPreview}/>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    // backgroundColor: 'transparent', // Uncomment for complete invisibility
    // ... (other styles as needed)
  },
  dropZone: {
    position: 'absolute',
    // backgroundColor: 'lightgrey',
    // borderRadius: 10,
    borderWidth: 2,
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
    position: 'absolute',
    bottom: 0,
  },
  nailImage: {
    width: 60,
    height: 60,
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
  },
  dragNailsText: {
    marginTop: 600, // Adjust as necessary for spacing
    fontSize: 16, 
    textAlign: 'left',
    width: '100%', // Adjust as necessary for font size
    // Add any additional styling you need
},
});
export { HandDesignTab };

