import { View, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '@rneui/themed';
import { useState } from "react";

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";

const History = ["Christmas", "Monet", "Van Gogh", "LGBTQ", "Compute Scientist"]

const Search = () => {
     const navigation = useNavigation();

    // https://reactnativeelements.com/docs/2.3.2/searchbar
    const [search, setSearch] = useState("")
    return <View style={{ flexDirection: "row", alignItems: "center", margin: 10, marginBottom:PADDINGS.md }}>
        
        <SearchBar
            placeholder="Type Here..."
            onChangeText={(entry) => setSearch(entry)}
            value={search}

            placeholderTextColor={'#g5g5g5'}
            inputContainerStyle={{ backgroundColor: "white" }}
            inputStyle={{backgroundColor: 'white'}}
            containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 24, flex: 5}}
        />
        <ButtonAction onPress={() => navigation.goBack()}
        >
            <ButtonP>Cancel</ButtonP>
        </ButtonAction>
    </View>
}
const IndividualQuery = ({ item }) => {
    //  need to add api call 
    const navigation = useNavigation();

    return <ButtonSelection onPress={() => { }}>
        <ButtonP>{item}</ButtonP>
     </ButtonSelection>
}

const PreviousQuery = () => {
    return <View style={{flexDirection: "column"}}>
        <SubHeader >History</SubHeader>
        <FlatList
            data={History}
            renderItem={(item) => <IndividualQuery item={item.item}/>}
            contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap"
            }}
        />
    </View>
}

export const SearchTab = () => {
    return <View style={{padding:PADDINGS.sm}}>
        <Search  />
        <PreviousQuery />
    </View>
}