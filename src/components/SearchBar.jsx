import { View, Text, TextInput, StyleSheet } from "react-native";
import {InputView} from "../styles/inputs"
export const SearchBar = () => {
  return (
    <InputView>
      <TextInput
        style={styles.input}
        onChangeText={() => {}}
        placeholder="Search"
      />
    </InputView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 400,
    // color: "white",
    height: 40,
    backgroundColor: "#B1AFAF",
  },
});
