import React, {useState, useEffect} from "react";
import { TouchableOpacity, View, Text, FlatList, Image, ImageBackground,} from "react-native";
import { GalleryCard } from "../components/gallery/GalleryCard";
import axios from "axios";
import { getHeader, APIs } from "../utils/API";

 
export const CollectionTab = ({ route }) => {
    console.log("collection tab", route.params)
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
            <ImageBackground
                source={{uri: route.params.uri}}
                style={{height: 200, borderRadius: 4, justifyContent: "center", margin: 10}}
            >
            <Text style={{fontSize: 50, alignSelf: "center"}}>{route.params.item.split('-')[1]}</Text>
            </ImageBackground>
            
            <FlatList data={categoryItems} renderItem={({ item }) => 
                <GalleryCard item={item} style={{width: 200}} />} keyExtractor={(item) => item.id}
                numColumns={2}
            />
      </View>
  
}