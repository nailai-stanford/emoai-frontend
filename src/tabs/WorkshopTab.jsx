import { TABs } from "../static/Constants";
import { NailSelector } from "../components/NailSelector";
import { useDesignContext } from '../providers/DesignProvider';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import axios from "axios";
import { APIs, BASE_URL, getHeader } from "../utils/API";

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

// const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

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
];



export const WorkshopTab = ({ navigation }) => {
  const { designIds } = useDesignContext();
  const { userInfo} = useAuthenticationContext();
  const width = Dimensions.get('window').width;
  const scrollX = useRef(new Animated.Value(0)).current;
  // const [nailsData, setNailsData] = useState([]); // State to store decomposed nails data
  const [editMode, setEditMode] = useState(false);
  const [imageUrls, setImageUrls] = useState({}); // hand design urls
  const [nailImages, setNailImages] = useState([]);// nail urls
  const [combinedData, setCombinedData] = useState([]); // State for combined image data
  const [selectedNails, setSelectedNails] = useState(new Array(10).fill(''));

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
    setCombinedData(newCombinedData); // Update the statenn
  }, [designIds, imageUrls, nailImages]);



  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    console.log('Current nailImages state:', nailImages);
  }, [nailImages]);
  
  useEffect(() => {
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

  const fetchNailData = async (nailId) => {
    try {
      const { idToken } = userInfo; // Make sure userInfo is defined and accessible
      const headers = getHeader(idToken);
      const response = await axios.get(`${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent(nailId)}`, { headers });
  
      // It's a good practice to check if the data exists
      if (!response.data.products || response.data.products.length === 0 || !response.data.products[0].image) {
        throw new Error('No product data found');
      }
  
      return response.data.products[0].image.src;
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

  const handleNailDeletion = (index) => {
    const updatedNails = [...selectedNails];
    updatedNails[index] = ''; // Remove the selected nail
    setSelectedNails(updatedNails);
  };
  return (
    <View testID="safe-area-view" style={{flexDirection: 'column',}}>
      
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
          {combinedData.map((data, index) => (
          <View key={index} style={[styles.center, { width }]}>
            <Image source={{ uri: data.imageUrl }} style={styles.imageStyle} />
            <View style={{flexDirection: 'row',}}>
              {data.nailImages.map((nailUrl, nIndex) => (
                <Pressable key={nIndex} onPress={() => handleNailSelect(nailUrl)}>
                  <Image source={{ uri: nailUrl }} style={styles.nailStyle} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

          </ScrollView>
       
      <View style={styles.dotsContainer}>
        <View style={styles.dotContainer}>
          <ExpandingDot
            testID={'expanding-dot'}
            data={INTRO_DATA}
            expandingDotWidth={30}
            //@ts-ignore
            scrollX={scrollX}
            inActiveDotOpacity={0.6}
            dotStyle={{
              width: 10,
              height: 10,
              backgroundColor: '#347af0',
              borderRadius: 5,
              marginHorizontal: 5,
            }}
            containerStyle={{
              top: -15,
            }}
          />
        </View>       
      </View>
      <Text>My Selection</Text>
      <Text>Select five nails if you don't like them you can click edit to cancel and replace them!</Text>
      <TouchableOpacity onPress={toggleEditMode}>
        <Text>{editMode ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flexDirection: 'row'}}
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
                    <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.nailPlaceholder} />
            )}
          </View>
        ))}

      </ScrollView>

      <View
        style={{
          padding: 10,
          borderRadius: 16,
          borderWidth: 3,
          borderColor: "white",
        }}
      >
        <Button
          title="Start Designing"
          onPress={() => navigation.navigate(TABs.HAND_DESIGN, { selectedNails })}
        />
      </View>
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
    padding: 20,
  },
  nailStyle:{
    width: 53.2, // Fill the container
    height: 102.4, // Fill the container
    resizeMode: 'cover', // This will ensure the image covers the area without stretching
  },
  nailPlaceholder: {
    width: 50, // width of the placeholder
    height: 50, // height of the placeholder
    backgroundColor: '#e0e0e0', // a light grey color for the background
    borderRadius: 10, // rounded corners
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
    justifyContent: 'space-around',
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
    top: 10,
    right: 10,
    backgroundColor: 'red',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButtonText: {
    color: 'green',
  },
  image: {
    width: 53.2, // Fill the container
    height: 102.4, // Fill the container
    resizeMode: 'cover', // This will ensure the image covers the area without stretching
  },

});