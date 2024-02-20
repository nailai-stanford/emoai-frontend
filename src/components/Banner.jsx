import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import { APIs } from "../utils/API";
import { COLORS, PADDINGS, BORDERS } from "../styles/theme";
import { TABs } from "../static/Constants";


const { width: screenWidth } = Dimensions.get("window");

export const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [banner, setBanner] = useState([])
  const isCarousel = useRef(null);

  
  useEffect(() => {
    async function _getBanner() {
      axios.get(
        `${APIs.GET_PRODUCTS}banner/`,
      ).then(
        res => {
          let copy = JSON.parse(JSON.stringify(res.data.products))
          setBanner(copy)
          }
      ).catch(e => console.log(e))
    }
    if (banner.length == 0) { _getBanner() }
  });

  const navigation = useNavigation();

  const redirect = (schema) => {
    if(schema.action === 'app') {
      switch(schema.uri) {
        case 'chatbot/start':
          navigation.navigate(TABs.AI)
          break
        case 'discover/original':
          tag_index = schema.tagIdx
          navigation.navigate(TABs.DISCOVER, { index: 0, tagIdx: tag_index})
          break
        case 'hand_design':
          navigation.navigate(TABs.HAND_DESIGN)
          break
        case 'products':
          productId = schema.productId
          navigation.navigate(TABs.PRODUCT, {product: {'id': productId}})
          break
      }
    } else if(schema.action === 'url') {
    }
  }

  const _renderItem = ({ item, index },parallaxProps) => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          borderRadius: BORDERS.boxRadius,
          width: screenWidth - 60,
          height: screenWidth/2 - 25,
      }}
      >
        {
          item && item.image && item.image.src
          ?  <TouchableOpacity style={styles.imageContainer} onPress={() => redirect(item.schema)}>
              <Image source={{ uri: item.image.src }} style={styles.image}/>
             </TouchableOpacity>
          : <Text>What's new?</Text>  // or render a placeholder image
        }
        <Text>{item.title}</Text>
      </View>
    );
  };




  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "transparent", paddingTop: 50 }}
    >
        <Carousel
          layout={"default"}
          ref={isCarousel}
          data={banner}
          sliderWidth={screenWidth}
          itemWidth={screenWidth - 60}
          renderItem={_renderItem}
          onSnapToItem={(index) => setActiveIndex(index)}
          hasParallaxImages={true}
          style ={{   marginBottom:0, paddingBottom:0}}
        />
        <Pagination
          dotsLength={banner.length}
          activeDotIndex={activeIndex}
          carouselRef={isCarousel}
          dotStyle={{
            width: 20,
            height: 4,
            borderRadius: 2,
            marginHorizontal: -5,
            backgroundColor: COLORS.gradientSub1,
          }}
          tappableDots={true}
          inactiveDotStyle={{
            backgroundColor: COLORS.white,
            width: 6,
            borderRadius: 3,
            marginHorizontal: -10,
            height: 6,
            // Define styles for inactive dots here
          }}
          inactiveDotOpacity={1}
          containerStyle ={{   marginTop:0, paddingTop:0}}

      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "transparent",
    width: screenWidth - 60,
    height: screenWidth/2 - 25,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    borderRadius: 10
  },
});
