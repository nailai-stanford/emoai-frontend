import { React, useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { Banner } from "../components/Banner";
import { Themes } from "../components/Themes";
import { APIs, GET} from "../utils/API";

import { GradientButtonSelection } from "../styles/buttons";
import { ButtonP ,GradientMenuHeader } from "../styles/texts";

export const HomeTab = (navigation) => {
  const [index, setIndex] = useState(0)
  const [original, setOriginal] = useState([])
  const [community, setCommunity] = useState([])
  const [productList, setProductList] = useState([])
  const [activeProducts, setActiveProduct] = useState([])


  useEffect(() => {
    async function _loadProducts() {
      resp = await GET(`${APIs.GET_PRODUCTS}by_tags?original=true&community=true`)
      if (resp.status === 200) {
        const copy = JSON.parse(JSON.stringify(resp.data))
        setProductList(copy)
        setOriginal(copy.filter((e) => e["user"]["fullName"] === "emoai-original"));
        setCommunity(copy.filter(e => e["user"]["fullName"] !== "emoai-original"));
      }
    }
    if (productList.length == 0) { _loadProducts() }
  }, [])
  
  useEffect(() => {
    if (index === 0) {
      setActiveProduct(original);
    } else if (index === 1) {
      setActiveProduct(community);
    } else if (index === 2) {
      setActiveProduct(productList);
    }
  },[index, productList, original, community])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Banner style={{ flex: 1 }} />
      <Themes style={{ flex: 1 }} />
      <GradientMenuHeader style={{ flex:1, alignSelf:"flex-start", marginLeft:12}} >Category</GradientMenuHeader>
        <View style={styles.buttonRow}>
          <GradientButtonSelection onPress={() => setIndex(0)} $selected={index===0 && true} ><ButtonP>Original</ButtonP></GradientButtonSelection>
          <GradientButtonSelection onPress={() => setIndex(1)}  $selected={index===1 && true}><ButtonP>Community</ButtonP></GradientButtonSelection>
          <GradientButtonSelection onPress={() => {setIndex(2)}} $selected={index===2 && true}><ButtonP>All</ButtonP></GradientButtonSelection>
    
        </View>

        <View
          style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          }} >
          {
            activeProducts && activeProducts.map((e, idx) => <GalleryCard key={idx} item={e} style={{flex: 1, height: 100}} />)
          }
        </View>
        

    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80
  },
  buttonRow:{
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
});
