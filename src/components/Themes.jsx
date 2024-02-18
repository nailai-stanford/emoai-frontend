import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {TABs} from '../static/Constants';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {APIs, getHeader} from '../utils/API';
import {Image} from '@rneui/themed';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState, useEffect} from 'react';
import {handleError} from '../utils/Common';


import { ButtonSelection } from "../styles/buttons";
import { P, ButtonP, MenuHeader, TitleHeader, SubHeader, GradientMenuHeader} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";
import { ACTION_ICONS } from '../styles/icons';
import {Dimensions} from 'react-native';


const iconSize = 20;
const windowWidth = Dimensions.get('window').width;

export const Themes = props => {
  const [themes, setThemes] = useState([]);
  data = {};
  useEffect(() => {
    async function _getThemes() {
      axios
        .get(`${APIs.GET_PRODUCTS}categoriesByThemes/`)
        .then(res => {
          let copy = JSON.parse(JSON.stringify(res.data));
          setThemes(copy);
        })
        .catch(e => console.log(e));
    }
    if (themes.length == 0) {
      _getThemes();
    }
  }, []);

  return (
    <View
      {...props}
      style={{
        minWidth: '100%',
        paddingHorizontal: 20,
        marginBottom: 30,
      }}>
      <Title />

      <SafeAreaView style={{display: 'flex', flexDirection: 'row', width:windowWidth}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          {!!themes &&
            themes.map((item, idx) => (
              <ThemeCard key={idx} item={item} {...props} />
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Title = () => {
  const navigation = useNavigation();
  return (

    <View style={{flexDirection: "row", alignItems: "center",paddingBottom: 10, paddingHorizontal: 20}}>
      <GradientMenuHeader style={{ flex:2 }} >Themes</GradientMenuHeader>
      <TouchableOpacity style={{flex:4, justifyContent:"flex-end", flexDirection: "row", alignItems: "center", }}
        onPress={() => {navigation.navigate(TABs.THEME)}}>
          <P $colored={false}>
            All
          </P>

        <ACTION_ICONS.right
          size={iconSize}
          style={{ marginLeft: PADDINGS.sm}}
        />
      </TouchableOpacity>
    </View>
  );  
};

const ThemeCard = ({item}) => {
  return (
    <View
      style={{
        minWidth: 200,
        backgroundColor: 'transparent',
        borderColor: COLORS.white,
        borderWidth: 0.5,
        flex: 1,
        marginLeft: 20,
        borderRadius: 15,
        padding: 20,
      }}>
      <View style={{paddingBottom: 10, alignSelf: 'flex-start'}}>
        <SubHeader>{item['theme'].split('-')[1]}</SubHeader>
      </View>
      <View style={{flexDirection: "row"}}>
      {item['category'] &&
        item['category'].map((e, idx) => {
          return <ThemePreview key={idx} item={e} />;
        })}
        {/* TODO: need to add a navigation to this arrow right */}
        <ACTION_ICONS.right
          size={iconSize}
          style={{ marginLeft: PADDINGS.sm, alignSelf: "center"}}
        />
      </View>
    </View>
  );
};

const ThemePreview = ({item}) => {
  const size = 60;
  const navigation = useNavigation();
  const [pic, setPic] = useState('');
  useEffect(() => {
    async function _loadPictures() {
      axios
        .get(
          `${APIs.GET_PRODUCTS}by_ids?ids=${encodeURIComponent([
            item['pic_ids'],
          ])}`,
        )
        .then(res => {
          setPic(res.data.products[0]['image']['src']);
        })
        .catch(e => {
          handleError(e);
        });
    }
    _loadPictures();
  }, [pic]);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 60,
        flex: 1,
        marginRight: 10,
      }}>
      {pic && (
        <Image
          source={{uri: pic}}
          containerStyle={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'white',
            marginBottom: 6,
            flex: 1,
          }}
          onPress={() => {
            navigation.navigate(TABs.COLLECTION, {item: item.name, uri: pic});
          }}
        />
      )}
      <P style={{textAlign: 'center', flex: 1}}>{item.name.split('-')[1]}</P>
    </View>
  );
};
