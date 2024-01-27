import React, {useEffect, useState} from "react";
import { TouchableOpacity, View, Text, FlatList} from "react-native";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader} from "../styles/texts";
import axios from "axios";
import { getHeader, APIs } from "../utils/API";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { handleError } from "../utils/Common";

const Tab = ({ content, selected, setSelected, setSubList }) => {
    const { userInfo } = useAuthenticationContext();
    const headers = getHeader(userInfo.idToken);
    useEffect(() => {
        async function _getElements() {
            axios.get(
                `${APIs.GET_PRODUCTS}${selected}/categories/`,
                {headers}
            ).then(
                res => {
                    let copy = JSON.parse(JSON.stringify(res.data));
                    setSubList(copy);
                }
            ).catch(e => console.log(e))
        }
        _getElements();
    }, [selected])
    
    let currSelected = selected == content ? true : false
        return <ButtonSelection $selected={currSelected} onPress={()=>{setSelected(content);}}>
                    <ButtonP>{content}</ButtonP>
                </ButtonSelection>
}

const SubElement = ({content, selected, setSelected}) => {
    let currSelected = selected == content ? true : false
    return <ButtonSelection $selected={currSelected} onPress={()=>setSelected(content)}>
                <ButtonP>{content.split('-')[1]}</ButtonP>
            </ButtonSelection>
}

const ThemeHeader = () => {
    const [themeSelected, setThemeSelected] = useState("")
    const [elementSelected, setElementSelected] = useState("")
    const [subList, setSubList] = useState([])
    const { userInfo } = useAuthenticationContext();
    const headers = getHeader(userInfo.idToken);
    const [themeList, setThemeList] = useState([])
    useEffect(() => {
        async function _getThemes() {
            axios.get(
                `${APIs.GET_PRODUCTS}themes/`,
                {headers}
            ).then(
                res => {
                    let copy = JSON.parse(JSON.stringify(res.data))
                    setThemeList(copy)
                }
            ).catch(e => console.log(e))
        }
        _getThemes()
    },[])
    return <View style={{flexDirection: "column"}}>
        <View style={{ flexDirection: "row" }}>
        <FlatList
            data={themeList}
                renderItem={({ item }) =>
                    <Tab content={item}
                    selected={themeSelected} setSelected={setThemeSelected}
                    setSubList={setSubList}
                    />}
        horizontal
      />
        </View>
        <View style={{flexDirection: "row"}}>
            <FlatList
                data={subList}
                renderItem={({ item }) => <SubElement content={item}
                    selected={elementSelected}
                    setSelected={setElementSelected}
                />}
                horizontal
            />
        </View>
        <ThemeItems elementSelected={[elementSelected]}/>
    </View>
    
}

const ThemeItems = ({ elementSelected }) => {
    const { userInfo } = useAuthenticationContext();
    const headers = getHeader(userInfo.idToken);
    const [themeItems, setThemeItems] = useState([])
    useEffect(() => {
        async function _loadProducts() {
            axios.get(
                `${APIs.GET_PRODUCTS}by_tags?tags=${encodeURIComponent(elementSelected)}&original=true`,
                { headers }
            ).then(
                res => {
                    setThemeItems(res.data)
                }
            ).catch(e => handleError(e))
        }
        _loadProducts()
    },[elementSelected]);

    return <View>
    <FlatList data={themeItems} renderItem={({ item }) => 
        <GalleryCard item={item} style={{width: 200}} />} keyExtractor={(item) => item.id}
        numColumns={2}
    />
    </View>
}

export const ThemeTab = () => {
    return <ThemeHeader />

}

