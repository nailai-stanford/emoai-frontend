import React, {useEffect, useState} from "react";
import { TouchableOpacity, View, Text, FlatList} from "react-native";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { ButtonSelection, GradientButtonSelection } from "../styles/buttons";
import { P, ButtonP,ButtonH, MenuHeader, TitleHeader} from "../styles/texts";
import axios from "axios";
import { getHeader, APIs } from "../utils/API";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { handleError } from "../utils/Common";
import { PADDINGS } from "../styles/theme";


const Tab = ({ content, selected, setSelected, setSubList }) => {
    const { userInfo, signout } = useAuthenticationContext();
    useEffect(() => {
        async function _getElements() {
            const headers = getHeader(userInfo.idToken);
            axios.get(
                `${APIs.GET_PRODUCTS}${selected}/categories/`,
                {headers}
            ).then(
                res => {
                    let copy = JSON.parse(JSON.stringify(res.data));
                    setSubList(copy);
                }
            ).catch(e => handleError(e, signout))
        }
        if (userInfo) {
            _getElements();
        }
    }, [selected])
    
    let currSelected = selected == content ? true : false
        return <GradientButtonSelection $selected={currSelected} onPress={()=>{setSelected(content);}}>
                    <ButtonH>{content}</ButtonH>
                </GradientButtonSelection>
}

const SubElement = ({content, selected, setSelected}) => {
    let currSelected = selected == content ? true : false
    return <GradientButtonSelection $selected={currSelected} onPress={()=>setSelected(content)} >
                <ButtonP style={{fontSize:12}}>{content.split('-')[1]}</ButtonP>
            </GradientButtonSelection>
}

const ThemeHeader = () => {
    const [themeSelected, setThemeSelected] = useState("")
    const [elementSelected, setElementSelected] = useState("")
    const [currSelected, setCurrSelected] = useState([themeSelected, elementSelected])
    const [subList, setSubList] = useState([])
    const { userInfo, signout } = useAuthenticationContext();
    const [themeList, setThemeList] = useState([])
    useEffect(() => {
        async function _getThemes() {
            const headers = getHeader(userInfo.idToken);
            axios.get(
                `${APIs.GET_PRODUCTS}themes/`,
                {headers}
            ).then(
                res => {
                    let copy = JSON.parse(JSON.stringify(res.data))
                    setThemeList(copy)
                }
            ).catch(e => handleError(e, signout))
        }
        if (userInfo) {
            _getThemes()
        }
    },[])

    useEffect(() => {
        setCurrSelected([themeSelected])
    }, [themeSelected])

    useEffect(() => {
        setCurrSelected([ elementSelected])
    }, [elementSelected])
    return <View style={{flexDirection: "column"}}>
        <View style={{ flexDirection: "row" }}>
        <FlatList
            data={themeList}
                renderItem={({ item }) => (
                    <Tab content={item}
                    selected={themeSelected} setSelected={setThemeSelected}
                    setSubList={setSubList}
                    />
                )}
                keyExtractor={(item, index) => `theme-${index}`} // Ensure unique key for each theme item
                horizontal
      />
        </View>
        <View style={{flexDirection: "row"}}>
            <FlatList
                data={subList}
                renderItem={({ item }) => (
                <SubElement 
                    content={item}
                    selected={elementSelected}
                    setSelected={setElementSelected}
                />
            )}
            keyExtractor={(item, index) => `subElement-${index}`} // Ensure unique key for each subElement item
            horizontal
            />
        </View>
        <ThemeItems elementSelected={currSelected}/>
    </View>
    
}

const ThemeItems = ({ elementSelected }) => {
    const { userInfo, signout } = useAuthenticationContext();
    const [themeItems, setThemeItems] = useState([])
    useEffect(() => {
        async function _loadProducts() {
            const headers = getHeader(userInfo.idToken);
            axios.get(
                `${APIs.GET_PRODUCTS}by_tags?tags=${encodeURIComponent(elementSelected)}&original=true`,
                { headers }
            ).then(
                res => {
                    setThemeItems(res.data)
                }
            ).catch(e => handleError(e, signout))
        }
        if (userInfo) {
            _loadProducts()
        }
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

