import Carousel, {Pagination} from 'react-native-snap-carousel';
import { useState, useRef} from "react";
import {View, SafeAreaView, Dimensions } from "react-native";
import { BORDERS, COLORS, PADDINGS } from "../styles/theme";
import { Image, Button, Text } from '@rneui/themed';

const { width: screenWidth } = Dimensions.get("window");


export const HeadImages = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const isCarousel = useRef(null);
    console.log("images", images)
    const _renderItem = ({ item, index }, parallaxProps) => {
      return (
        <View
          style={{
            backgroundColor: "transparent",
            borderRadius: BORDERS.boxRadius,
        }}
        >
          <Image source={{ uri: item }} 
          style={{
              width: screenWidth / 5 * 3,
              borderRadius: BORDERS.standartRadius, 
              marginTop: 10, 
              height: screenWidth / 5 * 3,
          }}
        />
        </View>
      );
    };
  
    return (
      <SafeAreaView
        style={{ 
          alignSelf: "center", postion: "absolute", bottom: 0, width: screenWidth, 
          flex: 1, backgroundColor: "transparent",
        }}
        >
          <Carousel
            layout={"default"}
            ref={isCarousel}
            data={images}
            sliderWidth={screenWidth}
            itemWidth={screenWidth / 5 * 3}
            renderItem={_renderItem}
            onSnapToItem={(index) => setActiveIndex(index)}
            hasParallaxImages={true}
            style ={{   marginBottom:0, paddingBottom:0}}
          />
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeIndex}
            carouselRef={isCarousel}
            dotStyle={{
              width: 20,
              height: 4,
              borderRadius: 2,
              marginHorizontal: -5,
              marginTop: 10,
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
  