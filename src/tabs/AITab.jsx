import React from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";

import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, ButtonH, TitleHeader } from "../styles/texts";
import { TABs } from "../static/Constants";



export const AITab = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Image source={require("../../assets/bg/AI_circle.png")} style={styles.image} />
      <View
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.20)",
          marginTop: 200,
          borderRadius: 50,
          paddingHorizontal: 40,
          paddingVertical: 50,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "absolute",
          top: 200,

          // shadowColor: 'rgba(255, 255, 255, 0.50)',
          shadowColor: 'white',
          shadowOpacity:0.3,
          shadowOffset: {width: -1, height: 5},
          shadowRadius: 3,
          elevation: 10,
        }}
      >
        <TitleHeader >
          Start Generating Images Using EMO.AI
        </TitleHeader>
        <P style={{ textAlign: "center", marginBottom: 20, width: 150 }}>
          Embrace the power of AI magic to nail your style
        </P>
        <View>
          <ButtonAction onPress={() => navigation.navigate(TABs.AICHAT)}>
            <ButtonH>Start Now</ButtonH>
          </ButtonAction>
          {/* <Button
            title="Start Now"
            onPress={() => navigation.navigate(TABs.AICHAT)}
          /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    position:"absolute",
    top: 10,
    width: 510,
    height: 510,
    justifyContent: "center",
  },
});
