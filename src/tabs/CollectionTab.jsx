import React, {useState, useEffect} from "react";
import {  View, Text, FlatList, Image, StyleSheet} from "react-native";
import { GalleryCard } from "../components/gallery/GalleryCard";
import axios from "axios";
import { APIs } from "../utils/API";
import { TitleHeader } from "../styles/texts";
import { COLORS,BORDERS } from "../styles/theme";
import { BlurView } from "@react-native-community/blur";

 
export const CollectionTab = ({ route }) => {
    const [categoryItems, setCategoryItems] = useState([])

    useEffect(() => {
        async function _loadProducts() {
            axios.get(
                `${APIs.GET_PRODUCTS}by_tags?tags=${encodeURIComponent(route.params.item)}&original=true`,
            ).then(
                res => {
                    setCategoryItems(res.data);
                }
            ).catch(e => handleError(e))
        }
         _loadProducts() 
    }, [route.params.item]);
    
    return <View >
            <View>
                <Image
                    source={{uri: route.params.uri}}
                    style={styles.image}
                />
                <BlurView style={styles.blur} blurType="dark"
            blurAmount={2}
            blurRadius={5}/>
                
                <TitleHeader style={{...StyleSheet.absoluteFillObject, top: 80, fontSize: 50, alignSelf: "center", color:COLORS.white}}>{route.params.item.split('-')[1]}</TitleHeader>
            </View>
            
            <FlatList data={categoryItems} renderItem={({ item }) => 
                <GalleryCard item={item} style={{width: 200}} />} keyExtractor={(item) => item.id}
                numColumns={2}
            />
      </View>
  
}

const styles = StyleSheet.create({
    image: {
        height: 200,
        borderRadius: BORDERS.standartRadius,
        margin: 10,
    },
    blur: {
        ...StyleSheet.absoluteFillObject,
        height: 200,
        borderRadius: BORDERS.standartRadius,
        margin: 10,

    },
});