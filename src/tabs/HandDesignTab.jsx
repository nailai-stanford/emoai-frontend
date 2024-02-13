import React, { Component } from 'react';
import { ImageBackground, PixelRatio } from 'react-native';
import { StyleSheet, View, PanResponder, Animated, Image, Text, Button, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { TABs } from "../static/Constants";
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';
// import Svg, { Path } from 'react-native-svg';
import { ButtonAction, ButtonSelection, GradientButtonAction, GradientButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS } from "../styles/theme";
import { LEFTHAND_NAILS } from '../styles/nails';
import { BlurView } from "@react-native-community/blur";
import { BASE_URL, APIs, getHeader } from "../utils/API";


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

export default class HandDesignTab extends Component {

  constructor(props) {

    super(props);
    const selectedNails = this.props.route.params?.selectedNails || [];
    const handProducts = this.props.route.params?.handProducts || [];
    const taskId = this.props.route.params?.task_id || "";


    const userInfo = this.props.route.params?.userInfo || null;

    console.log('HandDesignTab, taskId', taskId, selectedNails)
    this.state = {
      currentHand: 'left', 
      nailCategory: 'selected',
      nails: selectedNails.map(() => new Animated.ValueXY()),
      selectedNails: selectedNails,
      handProducts: handProducts,
      taskId: taskId,
      droppedZone: null,
      leftHandModel: require('../../assets/workshop/hand_left.png'),
      rightHandModel: require('../../assets/workshop/hand_right.png'),
      leftHandNails: Array(5).fill(''),
      rightHandNails: Array(5).fill(''),
      originalCollect: [],
      userInfo: userInfo
      // nailRenderList: Array
    };

  }



  handleNailCategorySelection = (category) => {
    this.setState({ nailCategory: category });
  };
  
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


            // update leftHandNail or rightHandNails with newly dragged image
            if (this.state.currentHand === "left"){
              let tempArray = [].concat(this.state.leftHandNails);
              tempArray[dropedFinger] = {
                id: this.state.selectedNails[index].nailId,
                url: this.state.selectedNails[index].nailDesignImageUrl
              }
              // tempArray[dropedFinger] = this.state.selectedNails[index].nailDesignImageUrl;
              this.setState({leftHandNails:tempArray});
            } else {
              let tempArray = [].concat(this.state.rightHandNails);
              // tempArray[dropedFinger] = this.state.selectedNails[index].nailDesignImageUrl;
              tempArray[dropedFinger] = {
                id: this.state.selectedNails[index].nailId,
                url: this.state.selectedNails[index].nailDesignImageUrl
              }
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
          {this.state.currentHand === 'left' ? leftHandMasks[index] : rightHandMasks[index]}
          </View>}>
      <TouchableOpacity
        key={index}
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
        {nailListRender[index] ? 
          <Image source={{uri:nailListRender[index].url}} style={styles.nailImage} ></Image>
           : <View style={[styles.nailImage, {backgroundColor:COLORS.dark}]}/> }
        <Image source={{uri:nailListRender[index]}.url} style={styles.nailImage} ></Image>

      </TouchableOpacity>
      </MaskedView>
    ));
  }



  isDropZone(gesture, index) {
    let dropIndex = -1;
    const dropZonePositions = this.state.currentHand === 'left' ? leftHandDropZonePositions : rightHandDropZonePositions;
    const draggedItemCenterX = gesture.moveX;
    const draggedItemCenterY = gesture.moveY - TOP_BAR;
    const dropZonePadding = 20;
    for (let i=0; i<dropZonePositions.length; i++) {
      zone = dropZonePositions[i];
      const isWithinX = draggedItemCenterX >= zone.left-dropZonePadding && draggedItemCenterX <= zone.left + zone.width +dropZonePadding;
      const isWithinY = draggedItemCenterY >= zone.top-dropZonePadding && draggedItemCenterY <= zone.top + zone.height+dropZonePadding;
  
      if (isWithinX && isWithinY) {
        dropIndex = i;
        return dropIndex;
      }
    }

    return dropIndex;
  }

  renderNails() {
    let nailsToRender = [];
    if (this.state.nailCategory === 'emoSingle') {
      nailsToRender = this.state.originalCollect;
    } else {
      nailsToRender = this.state.selectedNails.map(nail => nail.nailDesignImageUrl);

      // nailsToRender = this.state.selectedNails;
    }
    return (

      <View style={styles.nailContainer}>
        {nailsToRender.map((nail, index) => {
          if (!nail || nail.trim() === '') {
            // If the image URI is empty or undefined, do not render this item
            return null;
          }
          const panStyle = {
            transform: this.state.nails[index].getTranslateTransform(),
          };
          return (
            <Animated.View
              key={index}
              {...this.panResponders[index].panHandlers}
              style={[panStyle]}
            >
              <Image source={{ uri: nail }} style={styles.nailImage} />
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

  // check if nails are all selected, if true, navigate to preview
  checkIfAllNailsAreSelected = () => {
    let { leftHandNails, rightHandNails } = this.state;
    let missingNails = 0;
    for (let i=0; i<5; i++) {
      if (leftHandNails[i] === '') {
        missingNails++;
      }
      if (rightHandNails[i] === '') {
        missingNails++;
      }
    }
    return missingNails;
  }

  navigateToPreview = () => {
    let { leftHandNails, rightHandNails, handProducts, taskId } = this.state;
    console.log('taskId:', taskId)
    if (this.checkIfAllNailsAreSelected() !== 0) {
      alert(`Please ensure all nails for both hands are assigned. Currently, there are ${this.checkIfAllNailsAreSelected()} nails empty.`);
      return;
    }
    // let payload = {
    //   task_id: this.state.taskId,
    //   status: 5
    // };
    // const { idToken } = this.state.userInfo;
    // const headers = getHeader(idToken); 
    // axios
    // .post(`${BASE_URL}/api/task/status`, payload, { headers }) // Replace 'your-endpoint' with the actual endpoint
    // .then(response => {
    //   const data = response.data;
    //   console.log(data)
    // })
    // .catch(error => {
    //   console.log(error)
    // });

    this.props.navigation.navigate(TABs.DESIGN_PREVIEW, { 
      leftHandNails: leftHandNails,
      rightHandNails: rightHandNails, 
      handProducts: handProducts,
      taskId: taskId
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
          <View style={{backgroundColor:COLORS.dark, width:'100%', top:'100%'}}/>
          {this.renderClickableZones()}
      
          </View>
        <View style={{flexDirection:"column", position:"absolute", bottom:120, paddingHorizontal:PADDINGS.sm}}>
          {/* <View style={{position:"absolute", width:"100%",backgroundColor:COLORS.dark, opacity:0.9, height:180,bottom:0}}></View> */}
          <BlurView
            blurType="dark"
            blurAmount={30}
            style={{height:160, width:"100%", position:"absolute", bottom:0}}
          />
            
          <SubHeader style={{paddingHorizontal: PADDINGS.sm}}>Drag Nails from Collections</SubHeader>
          <P style={{paddingHorizontal: PADDINGS.sm, paddingBottom: PADDINGS.md}}  $alignLeft>Assign nail styles to specific fingers. Mix and match as you like!</P>
          {/* {this.renderNailCategoryButtons()} */}
          {this.renderNails()}
        </View>
        <View style={{position:"absolute", bottom: 75, width:"60%"}}>
        <GradientButtonSelection $selected onPress={this.navigateToPreview} 
        style={{marginVertical:PADDINGS.sm,  borderWidth:0}}>
          <ButtonP>Next</ButtonP>
        </GradientButtonSelection>
        </View>
      </View>
    );
  }
}

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
export { HandDesignTab };

