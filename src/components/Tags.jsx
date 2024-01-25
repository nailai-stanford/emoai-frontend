import React from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";

const imageUrl =
  "https://lh3.googleusercontent.com/a/ACg8ocJ_4W0g904G63FggpCwjxgtXCSDYebsGsGodISX-k9x0wk=s120";

const TAGS_DATA = [
  { id: 0, title: "Trending", image: imageUrl },
  { id: 1, title: "Art", image: imageUrl },
  { id: 2, title: "School", image: imageUrl },
];

const TagCard = ({ item }) => {
  const imageSize = 50;
  return (
    <View
      style={{
        minHeight: 80,
        minWidth: 120,
        backgroundColor: "#D9D9D9",
        flex: 1,
        borderRadius: 15,
        padding: 20,
        display: "inline-flex",
        flexDirection: "row",
        margin: 6,
      }}
    >
      <Image
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
        }}
        source={{ uri: item.image }}
      />
      <View>
        <Text
          style={{
            color: "white",
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 10,
          }}
        >
          {item.title}
        </Text>
      </View>
    </View>
  );
};

export const Tags = () => {
  return (
    <View style={styles.filterTags}>
      <FlatList
        horizontal={true}
        data={TAGS_DATA}
        renderItem={({ item }) => <TagCard item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
});
