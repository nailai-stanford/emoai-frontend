import { View, Text, FlatList } from "react-native";

import { GalleryCard } from "./GalleryCard";

export const Gallery = ({ title, data}) => {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 30,
      }}
    >
      {title && <Title title={title} />}
      <FlatList
        data={data}
        renderItem={({ item }) => <GalleryCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal={true}
      />
    </View>
  );
};

const Title = ({ title }) => {
  // TODO Refactor the titles to a common component
  return (
    <View>
      <Text style={{ fontSize: 18, marginBottom: 15 }}>{title}</Text>
    </View>
  );
};
