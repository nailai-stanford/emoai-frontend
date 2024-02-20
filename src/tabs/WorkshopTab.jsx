import { TABs } from "../static/Constants";
import { NailSelector } from "../components/NailSelector";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import axios from "axios";
import { APIs, BASE_URL, getHeader } from "../utils/API";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import generateMoreImage from '../../assets/generate_more.png';
import React, { useRef,useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';


import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  Dimensions,
  Button,
  ScrollView,
  Image,
  TouchableOpacity, 
  ImageBackground,
  TouchableHighlight, 
  Pressable,
} from 'react-native';


import {
  ExpandingDot,
} from 'react-native-animated-pagination-dots';

import { GradientButtonAction } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, ButtonH} from "../styles/texts";
import { COLORS, PADDINGS, FONTS, ICON_SIZES } from "../styles/theme";
import { ACTION_ICONS } from "../styles/icons";
import { err } from "react-native-svg";
import { handleError } from "../utils/Common";
import { UserInfo } from "../components/UserInfo";

// const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);


const generateMoreImage = "../../assets/generate_more.png";

export const WorkshopTab = ({ navigation, route }) => {
  const { userInfo, signout} = useAuthenticationContext();
  const width = Dimensions.get('window').width - 2*PADDINGS.sm;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [editMode, setEditMode] = useState(false);
  const [handProducts, setHandProducts] = useState({}); // hand design urls
  const [nails, setNails] = useState([]);// nail urls
  const [combinedData, setCombinedData] = useState([]); // State for combined image data
  const [taskProducts, setTaskProducts] = useState([])
  const [selectedNails, setSelectedNails] = useState(new Array(10).fill(''));
  const [originalCollect, setOriginalCollect] = useState([]);
  // Initialize default values for userTags and key
  let task_id = null;

  // Check if route.params exists and has properties before destructuring
  if (route.params) {
    task_id = route.params['task_id']
  }

 

  const getTaskProducts = async(task_id) => {
    const { idToken } = userInfo;
    const headers = getHeader(idToken);
    try {
      const response = await axios.get(`${BASE_URL}/api/task/${task_id}/products`, { headers });
      return response.data
    } catch(error) {
      console.error(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (task_id && userInfo) {
        getTaskProducts(task_id).then(data => {
          products = data;
          hand_designs = products.data
          setTaskProducts(products.data)
        }).catch(error => {
          console.error('error when calling getTaskProducts', error)
        })
      }
      return () => {
        setCombinedData([])
        setTaskProducts([])
        setSelectedNails(new Array(10).fill(''))
      };
    }, [task_id, route])
  );

  useEffect(() => {
    setSelectedNails(new Array(10).fill(''))
    const newHandProducts = taskProducts.reduce((acc, product) => {
        acc[product.hand_design_id] = product.img_src;
        return acc;
    }, {});
    // setHandProducts(prevUrls => ({ ...prevUrls, ...newHandProducts }));
    setHandProducts(newHandProducts);
    taskProducts.forEach((product, index) => {
      console.log(`Product ${index}:`, product);
    });
    
    setNails([])
    let newNails = {};
    taskProducts.forEach(product => {
      newNails[product.hand_design_id] = product.nail_products.map(nailProduct => nailProduct.img_src);
    });
    
    setNails(newNails);

    setCombinedData([])
    let newCombinedData = taskProducts.map(product => {
      return {
          handDesignImageUrl: product.img_src,
          handDesignId: product.hand_design_id,
          nails: product.nail_products.map(nailProduct => ({
            nailId: nailProduct.nail_design_id, 
            nailDesignImageUrl: nailProduct.img_src
          }))
      };
    });
  //  newCombinedData.push({
  //     handDesignImageUrl: generateMoreImage,
  //     handDesignId: null,
  //     nails: []
  //   });
    setCombinedData(newCombinedData);

  }, [taskProducts, route]);


  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    console.log(' nails state:');
  }, [nails]);
  
  useEffect(() => {
    console.log("combinedData updated");
  }, [combinedData]);



  const getOriginalCollect = async () => {
    if (!userInfo) {
      return
    }
    const { idToken } = userInfo;
    const headers = getHeader(idToken);
    try {
      const response = await axios.get(
        `${APIs.GET_PRODUCTS}collections/original_single_nails/`,
        { headers }
      );
      // console.log("query collections single nails", response.data.products);
      // let copy = JSON.parse(JSON.stringify(response.data.products));
      const productImages = response.data.products.map(product => product.image.src);
      setOriginalCollect(productImages);
    } catch (e) {
      handleError(e, signout)
    }
  };

  useEffect(() => {
    if (userInfo) {
      getOriginalCollect();
    }
  }, []); // Empty dependency array means this runs once on mount



const handleNailSelect = (nail) => {
  // Update one of the placeholders with the selected nail
  const updatedNails = selectedNails.map((currentNail, index) => {
    if (currentNail === '' && index === selectedNails.findIndex(n => n === '')) {
      return nail;
    }
    return currentNail;
  });  
  setSelectedNails(updatedNails);
};
useEffect(() => {
  console.log('originalCollect has changed:');
}, [originalCollect]);

  const handleNailDeletion = (index) => {
    const updatedNails = [...selectedNails];
    updatedNails[index] = ''; // Remove the selected nail
    setSelectedNails(updatedNails);
  };

  const navigate_to_load = () => {
    navigation.navigate(TABs.LOAD, { userTags: userTags, key: new Date().getTime().toString()})
  }

  return (
    <View >
    <ScrollView testID="safe-area-view" contentContainerStyle={{flexDirection: 'column', padding:PADDINGS.sm}}>
      
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={1}
            style={{flexDirection:'row'}}
          >
          {combinedData.map((data, index) => {
            if (data.handDesignImageUrl === generateMoreImage) {
              let src = require(generateMoreImage);
              return (
                <View key={index} style={[styles.center, { width}]}>
                <TouchableOpacity key={index} onPress={navigate_to_load}>
                  <Image source={src} style={styles.imageStyle} />
                  {/* Optionally, add other styles or elements to indicate it's a button */}
                </TouchableOpacity>
                </View>

              );
            }

            return(
              <View key={index} style={[styles.center, { width}]}>
                <Image source={{ uri: data.handDesignImageUrl }} style={styles.imageStyle} />
                <ScrollView horizontal style={{ flexDirection: 'row', flexGrow: 2, alignSelf: "center", flexWrap: 'wrap'}}>
                  {data.nails.map((nail, nIndex) => (
                    <Pressable key={nIndex} onPress={() => handleNailSelect(nail)}>
                      <Image source={{ uri: nail.nailDesignImageUrl }} style={styles.nailStyle} />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )
          })}
          </ScrollView>
       
      <View style={styles.dotsContainer}>
        <View style={styles.dotContainer}>
          <ExpandingDot
            testID={'expanding-dot'}
            data={combinedData}
            scrollX={scrollX}
            expandingDotWidth={20}
            inactiveDotOpacity={1}
            dotStyle={{
              width: 4 ,
              height: 4,
              borderRadius: 2,
              marginHorizontal: 5,
              backgroundColor: COLORS.gradientSub1,
            }}
            containerStyle={{
              top: -15,
            }}
            inActiveDotColor={COLORS.white}
          />
        </View>
          
      </View>
      <View style={{flexDirection:"row", paddingTop:PADDINGS.md, paddingBottom:PADDINGS.sm}}>
          <SubHeader style={{flex:1}}>My Selection</SubHeader>
          <TouchableOpacity onPress={toggleEditMode} style={{paddingRight:10}}>
            {editMode ? <SubHeader>Done</SubHeader> : <ACTION_ICONS.edit size={ICON_SIZES.standard}/> }
          </TouchableOpacity>
      </View>
      <P style={{paddingBottom:PADDINGS.md}} $alignLeft={true}>Select 10 nails if you don't like them you can click edit to cancel and replace them!</P>
      
      {/* <TouchableOpacity onPress={toggleEditMode}> */}
        {/* <ButtonP>{editMode ? 'Done' : 'Edit'}</ButtonP> */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        indicatorStyle="white"
        style={{flexDirection: 'row', marginBottom: PADDINGS.md}}
      >
        {selectedNails.map((nail, index) => (
          <View key={index} style={styles.selectedNailContainer}>
            {nail ? (
              <View>
                <Image source={{ uri: nail.nailDesignImageUrl }} style={styles.image} />
                {editMode && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleNailDeletion(index)}
                  >
                    {/* You can use an icon or text for the delete button */}
                    <ACTION_ICONS.remove/> 

                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.nailPlaceholder}>
                <ACTION_ICONS.addLarge
                  size={40}
                /> 
            </View>
            )}
          </View>
        ))}

      </ScrollView>

        <GradientButtonAction style={{alignSelf:"center"}}
          onPress={() => navigation.navigate(TABs.HAND_DESIGN, { selectedNails, originalCollect, handProducts, task_id, userInfo: userInfo})}>
            <ButtonP>Start Design</ButtonP>
        </GradientButtonAction>    
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'column',
  },
  PagerView: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
  },
  progressContainer: { flex: 0.1, backgroundColor: '#63a4ff' },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    // alignContent: 'center',
    padding: 16,
  },
  nailStyle:{
    width: 35, // Fill the container
    height: 70, // Fill the container
    resizeMode: 'cover', // This will ensure the image covers the area without stretching
    marginHorizontal: 3,
  },
  nailPlaceholder: {
    width: 60, // width of the placeholder
    height: 60, // height of the placeholder
    backgroundColor: 'transparent', // a light grey color for the background
    justifyContent: 'center', // center the content inside the placeholder
    alignItems: 'center', // align the content
    marginHorizontal: 5, // horizontal margin for spacing between items
  },
  text: {
    fontSize: 30,
  },
  separator: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  touchableTitle: {
    textAlign: 'center',
    color: '#000',
  },
  touchableTitleActive: {
    color: '#fff',
  },
    imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  nailsContainer: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 20,
  },
  designContainer: {
    marginBottom: 20,
  },
  dotsContainer: {
    // flex: 0.3,
    // justifyContent: 'space-around',
  },
  dotContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },

  dots: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 900,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2,
    margin: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: -1,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButtonText: {
    color: 'green',
  },
  image: {
    width: 53.2, // Fill the container
    height: 102.4, // Fill the container
    marginHorizontal: 5,
    resizeMode: 'cover', // This will ensure the image covers the area without stretching
  },

});