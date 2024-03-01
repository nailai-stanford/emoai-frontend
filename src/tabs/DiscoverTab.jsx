import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, ScrollView} from 'react-native';

import {useAuthenticationContext} from '../providers/AuthenticationProvider';
import {handleError} from '../utils/Common';
import {GalleryCard} from '../components/gallery/GalleryCard';
import {Tab} from '@rneui/themed';
import { APIs, GET} from '../utils/API';
import { format_theme } from '../utils/TextUtils';

import {GradientButtonSelection} from '../styles/buttons';
import {P, ButtonP, MenuHeader, TitleHeader, GradientMenuHeader} from '../styles/texts';
import {COLORS, PADDINGS} from '../styles/theme';

const ThemeHeader = ({index, setIndex}) => {
  const {userInfo} = useAuthenticationContext();
  const [themeList, setThemeList] = useState([]);
  const [themeItems, setThemeItems] = useState([]);

  useEffect(() => {
    async function _getThemes() {
      resp = await GET(`${APIs.GET_PRODUCTS}themes/`)
      if (resp.status === 200) {
        setThemeList(resp.data);
      }
    }
    _getThemes();
  }, []);

  useEffect(() => {
    async function _loadProducts() {
      resp = await GET(`${APIs.GET_PRODUCTS}by_tags?tags=${encodeURIComponent(
        themeList[index],
      )}&original=true`)

      if (resp.status === 200) {
        setThemeItems(resp.data);
      }
    }
    _loadProducts();
  }, [index, themeList]);

  return (
    <View >
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          {themeList.map((e, idx) => (
            <GradientButtonSelection
              $selected={index == idx}
              key={idx}
              onPress={() => setIndex(idx)}>
              <ButtonP>{format_theme(e.split('-')[1])}</ButtonP>
            </GradientButtonSelection>
          ))}
        </ScrollView>
      </View>

      <View style={styles.gridList}>
        <FlatList
          data={themeItems}
          renderItem={({item}) => <GalleryCard item={item} />}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </View>
    </View>
  );
};

export const DiscoverTab = ({ route }) => {
  const [productList, setProductList] = useState([]);
  const {userInfo} = useAuthenticationContext();
  const [index, setIndex] = useState(0);
  const [tagIdx, setTagIdx] = useState(route.params?.tagIdx? route.params.tagIdx: 0);

  useEffect(() => {
    if (route.params?.tagIdx !== undefined) {
      setTagIdx(route.params.tagIdx);
    }
  }, [route.params?.tagIdx]);

  useEffect(() => {
    async function _loadProducts() {
      resp = await GET(`${APIs.GET_PRODUCTS}by_tags?community=true`)
      if (resp.status === 200) {
        setProductList(resp.data)
      }
    }
    if (userInfo && productList && productList.length == 0) {
      _loadProducts();
    }
  });

  return (
    <View style={styles.container}>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={{
          backgroundColor: COLORS.gradientSub1,
          height: 3,
          borderRadius: 3,
        }}>
        <Tab.Item>
          <GradientMenuHeader $colored={index === 0}>Original</GradientMenuHeader>
        </Tab.Item>
        <Tab.Item>
          <GradientMenuHeader $colored={index === 1}>Community</GradientMenuHeader>
        </Tab.Item>
      </Tab>
      {index == 0 && <ThemeHeader index={tagIdx} setIndex={setTagIdx} />}
      {index == 1 && (
        <View style={styles.gridList}>
          <FlatList
            data={productList}
            renderItem={({item}) => <GalleryCard item={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    paddingHorizontal: PADDINGS.sm,

  },
});
