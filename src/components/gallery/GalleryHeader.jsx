import { View, Text } from "react-native";

export const GalleryHeader = ({ title }) => {
  // TODO Refactor the titles to a common component
  return (
    <View>
      <Text style={{ fontSize: 18, marginBottom: 15 }}>
        {title}
      </Text>
    </View>
  );
};
