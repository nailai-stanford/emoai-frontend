import { View, Text, FlatList, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { TABs } from "../static/Constants";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { APIs, getHeader } from "../utils/API";
import { Image } from '@rneui/themed';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import { handleError } from "../utils/Common";

import { ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, GradientMenuHeader} from "../styles/texts";
import { COLORS } from "../styles/theme";

const iconSize = 20;


export const Themes = (props) => {
  const [themes, setThemes] = useState([]);
  data = {}
  useEffect(() => {
    async function _getThemes() {
        axios.get(
            `${APIs.GET_PRODUCTS}categoriesByThemes/`,
        ).then(
            res => {
            let copy = JSON.parse(JSON.stringify(res.data))
            setThemes(copy)
            }
        ).catch(e => console.log(e))
    }
    if (themes.length == 0) { _getThemes() }
  }, [])

  return (
    <View
      {...props}
      style={{
        minWidth: "100%",
        paddingHorizontal: 20,
        marginBottom: 30,
      }}
    >
      <Title />
      <SafeAreaView style={{ display: "flex", flexDirection: "row" }}>
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        {
          // TODO: fix the scroll issue
          !!themes && themes.map((item, idx) => (
          <ThemeCard  key={idx} item={item} {...props} />
          ))
        }
    </ScrollView>
      </SafeAreaView >
    </View>
  );
};

const Title = () => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: "row", alignItems: "center",paddingVertical: 10}}>
      <GradientMenuHeader style={{ flex:2 }} >Themes</GradientMenuHeader>
      <TouchableOpacity style={{flex:4, justifyContent:"flex-end", flexDirection: "row", alignItems: "center", }}
        onPress={() => {navigation.navigate(TABs.THEME)}}>
          <P $colored={false}>
            All
          </P>
        <MaterialCommunityIcons
        name="chevron-right"
        size={iconSize}
        style={{color:COLORS.gradientSub1}}/>
        </TouchableOpacity>
    </View>
  );
};

const ThemeCard = ({ item }) => {
  // TODO Fix the overflow problem
  return (
    <View
      style={{
        minWidth: 200,
        backgroundColor: "transparent",
        borderColor: COLORS.white,
        borderWidth: 0.5,
        flex: 1,
        marginRight: 20,
        borderRadius: 15,
        padding: 20,
      }}
    >
      <View style={{paddingBottom: 10, alignSelf:"flex-start"}}>
        <SubHeader>{item["theme"].split('-')[1]}</SubHeader>
      </View>
      <FlatList
        data={item["category"]}
        renderItem={(e, idx) => <ThemePreview key={idx} item={e.item} />}
        horizontal
      />
    </View>
  );
};

const ThemePreview = ({ item }) => {
  const size = 60;
  const navigation = useNavigation();
  const [pic, setPic] = useState("")
  useEffect(() => {
    async function _loadPictures() {
      axios.get(
        `${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent([item["pic_ids"]])}`,
      ).then(
        res => {
          // console.group("get pic", res.data.products[0]["image"]["src"])
          setPic(res.data.products[0]["image"]["src"]);
        }
      ).catch(e => {
        handleError(e)
      })
    };
    _loadPictures();
  }, [pic]);

  return (

    <View
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 60,
        flex: 1,
        marginRight: 10,
      }}
    >
      {pic && <Image
        source={{ uri: pic }}
        containerStyle={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "white",
          marginBottom: 6,
          flex: 1,
        }}
        onPress={() => {
          navigation.navigate(TABs.COLLECTION, { item: item.name, uri: pic });
        }}
      />}
      <P style={{ textAlign: "center", flex: 1 }}>{item.name.split('-')[1]}</P>
    </View>

  );
};
