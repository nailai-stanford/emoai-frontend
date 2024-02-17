import { React, useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import axios from "axios";
import { handleError } from "../utils/Common";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { Banner } from "../components/Banner";
import { Themes } from "../components/Themes";
import { getHeader, APIs } from "../utils/API";


import { GradientButtonSelection } from "../styles/buttons";
import { ButtonP ,GradientMenuHeader } from "../styles/texts";
import { PADDINGS } from "../styles/theme";


export const HomeTab = (navigation) => {
  // TODO use auth later
  // const { userInfo } = useAuthenticationContext();
  // const headers = getHeader(userInfo.idToken);
  const [index, setIndex] = useState(0)
  const options = ["All", "Original", "Community"]
  const [original, setOriginal] = useState([])
  const [community, setCommunity] = useState([])
  const [productList, setProductList] = useState([])
  const [activeProducts, setActiveProduct] = useState([])


  useEffect(() => {
    async function _loadProducts() {
      axios.get(
          `${APIs.GET_PRODUCTS}by_tags?original=true&community=true`,
          // { headers }
      ).then(
        res => {
          const copy = JSON.parse(JSON.stringify(res.data))
          setProductList(copy)
          setOriginal(copy.filter((e) => e["user"]["fullName"] === "emoai-original"));
          setCommunity(copy.filter(e => e["user"]["fullName"] !== "emoai-original"));
        }
      ).catch(e => handleError(e))
    }
    if (productList.length == 0) { _loadProducts() }
  }, [])
  
  useEffect(() => {
    if (index === 0) {
      setActiveProduct(productList);
    }
    if (index === 1) {
      setActiveProduct(original);
    }
    if (index === 2) {
      setActiveProduct(community);
    }
  },[index, productList, original, community])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Banner style={{ flex: 1 }} />
      <Themes style={{ flex: 1 }} />
      <GradientMenuHeader style={{ flex:1, alignSelf:"flex-start", marginLeft:12}} >Category</GradientMenuHeader>
        <View style={styles.buttonRow}>
          <GradientButtonSelection onPress={() => {setIndex(0)}} $selected={index===0 && true}><ButtonP>All</ButtonP></GradientButtonSelection>
          <GradientButtonSelection onPress={() => setIndex(1)} $selected={index===1 && true} ><ButtonP>Original</ButtonP></GradientButtonSelection>
          <GradientButtonSelection onPress={() => setIndex(2)}  $selected={index===2 && true}><ButtonP>Community</ButtonP></GradientButtonSelection>
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
