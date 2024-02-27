import React, {useEffect, useState} from "react";
import { TouchableOpacity, View, Text, FlatList} from "react-native";
import { GalleryCard } from "../components/gallery/GalleryCard";
import { ButtonSelection, GradientButtonSelection } from "../styles/buttons";
import { P, ButtonP,ButtonH, MenuHeader, TitleHeader} from "../styles/texts";
import { format_theme } from "../utils/TextUtils";
import { APIs, GET } from "../utils/API";


const Tab = ({ content, selected, setSelected, setSubList }) => {
    useEffect(() => {
        async function _getElements() {
            resp = await GET(`${APIs.GET_PRODUCTS}${selected}/categories/`)
            if (resp.status === 200) {
                let copy = JSON.parse(JSON.stringify(resp.data));
                setSubList(copy);
            }
        }
        _getElements()
    }, [selected])
    
    let currSelected = selected == content ? true : false
        return <GradientButtonSelection $selected={currSelected} onPress={()=>{setSelected(content);}}>
                    <ButtonH>{format_theme(content.split('-')[1])}</ButtonH>
                </GradientButtonSelection>
}

const SubElement = ({content, selected, setSelected}) => {
    let currSelected = selected == content ? true : false
    return <GradientButtonSelection $selected={currSelected} onPress={()=>setSelected(content)} >
                <ButtonP style={{fontSize:12}}>{format_theme(content.split('-')[1])}</ButtonP>
            </GradientButtonSelection>
}

const ThemeHeader = () => {
    const [themeSelected, setThemeSelected] = useState("")
    const [elementSelected, setElementSelected] = useState("")
    const [currSelected, setCurrSelected] = useState([themeSelected, elementSelected])
    const [subList, setSubList] = useState([])
    const [themeList, setThemeList] = useState([])
    useEffect(() => {
        async function _getThemes() {
            resp = await GET(`${APIs.GET_PRODUCTS}themes/`)
            if (resp.status === 200) {
                let copy = JSON.parse(JSON.stringify(resp.data))
                setThemeList(copy)
                if (copy && copy.length > 0) {
                    setThemeSelected(copy[0])
                }
            }
        }
        _getThemes()
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
    const [themeItems, setThemeItems] = useState([])
    useEffect(() => {
        async function _loadProducts() {
            resp = await GET(`${APIs.GET_PRODUCTS}by_tags?tags=${encodeURIComponent(elementSelected)}&original=true`)
            if (resp.status === 200) {
                setThemeItems(resp.data)
            }
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

