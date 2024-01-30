import { TABs } from "../static/Constants";
import { NailSelector } from "../components/NailSelector";
import { useDesignContext } from '../providers/DesignProvider';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import axios from "axios";
import { APIs, BASE_URL, getHeader } from "../utils/API";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import generateMoreImage from '../../assets/generate_more.png';
import React, { useRef,useState, useEffect } from 'react';
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

// const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const TEST_IMAGE_URL = {0:'https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416'};
const TEST_NAIL_URL = ['https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416','https://cdn.shopify.com/s/files/1/0699/2750/1847/products/img-m1GOvvVr6mStTyrE7X2z6HW9.png?v=1706295416']

const INTRO_DATA = [
  {
    key: '1',
    img_url: '',
  },
  {
    key: '2',
    title: 'Introduction screen 🎉',
    description:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
  },
  {
    key: '3',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
  {
    key: '4',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
  {
    key: '5',
    title: 'And can be anything 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
];

const generateMoreImage = "../../assets/generate_more.png";

export const WorkshopTab = ({ navigation, route }) => {
  const { designIds } = useDesignContext();
  const { userInfo} = useAuthenticationContext();
  const width = Dimensions.get('window').width - 2*PADDINGS.sm;
  const scrollX = useRef(new Animated.Value(0)).current;
  // const [nailsData, setNailsData] = useState([]); // State to store decomposed nails data
  const [editMode, setEditMode] = useState(false);
  // const [imageUrls, setImageUrls] = useState({}); // hand design urls
  // const [nailImages, setNailImages] = useState([]);// nail urls
  const [imageUrls, setImageUrls] = useState({}); // hand design urls
  const [nailImages, setNailImages] = useState([]);// nail urls
  const [combinedData, setCombinedData] = useState([]); // State for combined image data
  const [selectedNails, setSelectedNails] = useState(new Array(10).fill(''));
  const [originalCollect, setOriginalCollect] = useState([]);
  const { userTags, key } = route.params;
  // console.log(userTags);
  // console.log("workshop: route.params", route.params.userTags);
  const [hasChatData, setHasChatData] = useState(false);

  useEffect(() => {
    designIds.forEach(async id => {
      // fetchImageUrl(id);
      // decomposeNails(id); 
      fetchImageUrl(id, userInfo.idToken);
    });
  }, [designIds, userInfo.idToken]);
  useEffect(() => {
    const fetchNailsData = async () => {
      try {
        for (const designId of designIds) {
          const singleNailIds = await fetchSingleNailIds(designId);
          const imageUrlsPromises = singleNailIds.map(nailId => fetchNailData(nailId));
          const imageUrls = await Promise.all(imageUrlsPromises);
          setNailImages(prevNailImages => ({
            ...prevNailImages,
            [designId]: imageUrls
          }));
        }
      } catch (error) {
        console.error("Error fetching nails data:", error);
      }
    };

    fetchNailsData();
  }, [designIds, route]);
  const goBackToLoadTab = () => {
    navigation.goBack();
  };
  useEffect(() => {
    if(designIds.length > 0){
      setHasChatData(true);
      console.log("hasChatData", hasChatData )
    }
  }, [designIds]);

  useEffect(() => {
    // Assuming designIds, imageUrls, and nailImages are populated
    console.log("imageUrls", imageUrls);
  }, [designIds, imageUrls, nailImages]);

  useEffect(() => {
    // Assuming designIds, imageUrls, and nailImages are populated
    const newCombinedData = designIds.map((designId, index) => {
      return {
        imageUrl: imageUrls[designId], // Assuming imageUrls and designIds are aligned
        nailImages: nailImages[designId] || [],
      };
    });
    newCombinedData.push({
      imageUrl: generateMoreImage,
      nailImages: []
    });
    setCombinedData(newCombinedData); // Update the state
  }, [imageUrls, nailImages, route]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    console.log('Current nailImages state:', nailImages);
  }, [nailImages]);
  
  useEffect(() => {
    console.log("designIds", designIds);
    console.log("Current combinedData:", combinedData);
  }, [combinedData]);

  const fetchSingleNailIds = async (designId) => {
    return new Promise((resolve, reject) => {
      const { idToken } = userInfo;
      const headers = getHeader(idToken);
      axios
        .get(`${BASE_URL}/api/hand_designs/${designId}/`, { headers })
        .then((response) => {
          const singleNailIds = response.data.hand_design.nail_design_id_list;
          console.log("query single nails:", singleNailIds);
          resolve(singleNailIds);
        })
        .catch((error) => {
          console.error(`Error fetching single nail IDs for design ID ${designId}:`, error);
          reject(error);
        });
    });
  };

  const getOriginalCollect = async () => {

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
      console.log("product Images:", productImages);
      setOriginalCollect(productImages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getOriginalCollect();
  }, []); // Empty dependency array means this runs once on mount

  const fetchNailData = async (nailId) => {
    try {
      const { idToken } = userInfo; // Make sure userInfo is defined and accessible
      const headers = getHeader(idToken);
      const response = await axios.get(`${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent([nailId])}`, { headers });
      console.log("response.data.products", response.data);
      if (!response || !response.data || !response.data.products || response.data.products.length === 0) {
        console.error(`No data returned for nail ID ${nailId}`);
        return null; // Or handle this scenario appropriately
      }
      const product = response.data.products[0];
      if (!product || !product.image || !product.image.src) {
        console.error(`Image data is missing for product ID ${nailId}`);
        return null; // Or handle this scenario appropriately
      }
      // return response.data.products[0].image.src;
      return product.image.src;
    } catch (error) {
      console.error(`Error fetching nail data for nail ID ${nailId}:`, error);
      throw error; // Re-throw the error so it can be handled further up the call chain
    }
  };
  

  const fetchImageUrl = async (productId, idToken) => {
    try {
      const headers = getHeader(idToken);
      const response = await axios.get(`${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent(productId)}`, { headers });
  
      const product = response.data.products[0];
      if (!product || !product.image || !product.image.src) {
        throw new Error(`Image URL not found for product ID ${productId}`);
      }
  
      const imageUrl = product.image.src;
      setImageUrls(prevUrls => ({ ...prevUrls, [productId]: imageUrl }));
  
      return imageUrl;
    } catch (error) {
      console.error(`Error fetching product details for product ID ${productId}:`, error);
      throw error; // Re-throw the error for further handling if necessary
    }
  };
  



// const handleNailSelect = (nailUrl) => {
//   setSelectedNails(prevNails => [...prevNails, nailUrl]);
// };
const handleNailSelect = (nailUrl) => {
  // Update one of the placeholders with the selected nail
  const updatedNails = selectedNails.map((nail, index) => {
    if (nail === '' && index === selectedNails.findIndex(n => n === '')) {
      return nailUrl;
    }
    return nail;
  });
  setSelectedNails(updatedNails);
};
useEffect(() => {
  console.log('originalCollect has changed:', originalCollect);
}, [originalCollect]);

  const handleNailDeletion = (index) => {
    const updatedNails = [...selectedNails];
    updatedNails[index] = ''; // Remove the selected nail
    setSelectedNails(updatedNails);
  };
  return (
    <View testID="safe-area-view" style={{flexDirection: 'column', padding:PADDINGS.sm}}>
      
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
            if (data.imageUrl === generateMoreImage) {
              let src = require(generateMoreImage);
              console.log("passed from workshop:", userTags);
              return (
                <TouchableOpacity key={index} onPress={() => navigation.navigate(TABs.LOAD, { userTags: userTags, key: new Date().getTime().toString()})}>
                  <Image source={src} style={styles.imageStyle} />
                  {/* Optionally, add other styles or elements to indicate it's a button */}
                </TouchableOpacity>
              );
            }



        return(
          <View key={index} style={[styles.center, { width}]}>
            <Image source={{ uri: data.imageUrl }} style={styles.imageStyle} />
            <View style={{flexDirection: 'row', width:"100%", alignSelf:"center"}}>

              {data.nailImages.map((nailUrl, nIndex) => (
                <Pressable key={nIndex} onPress={() => handleNailSelect(nailUrl)}>
                  <Image source={{ uri: nailUrl }} style={styles.nailStyle} />
                </Pressable>
              ))}
            </View>
          </View>
        )
        // ))}
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
      <P style={{paddingBottom:PADDINGS.md}} $alignLeft={true}>Select five nails if you don't like them you can click edit to cancel and replace them!</P>
      
      {/* <TouchableOpacity onPress={toggleEditMode}> */}
        {/* <ButtonP>{editMode ? 'Done' : 'Edit'}</ButtonP> */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flexDirection: 'row', marginBottom: PADDINGS.md}}
      >
        {selectedNails.map((nail, index) => (
          <View key={index} style={styles.selectedNailContainer}>
            {nail ? (
              <View>
                <Image source={{ uri: nail }} style={styles.image} />
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
          onPress={() => navigation.navigate(TABs.HAND_DESIGN, { selectedNails, originalCollect })}>
            <ButtonP>Start Selection</ButtonP>
        </GradientButtonAction>
        

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
    backgroundColor: '#63a4ff',
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