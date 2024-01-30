import React from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";

import { ButtonAction, ButtonSelection, GradientButtonAction } from "../styles/buttons";
import { P, ButtonP, ButtonH, TitleHeader } from "../styles/texts";
import { TABs } from "../static/Constants";
import { BlurView } from "@react-native-community/blur";



export const AITab = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Image source={require("../../assets/bg/AI_circle.png")} style={styles.image} />
      <BlurView
        blurType="dark"
        blurAmount={30}
        style={{
          marginTop: 150,
          borderRadius: 25,
          paddingHorizontal: 35,
          paddingVertical: 50,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "absolute",
          top: 200,

        }}
      >
        <TitleHeader >
          Start Generating Images Using EMO.AI
        </TitleHeader>
        <P style={{ textAlign: "center", marginBottom: 20, width: 150 }}>
          Embrace the power of AI magic to nail your style
        </P>
        <View>
          <GradientButtonAction onPress={() => navigation.navigate(TABs.AICHAT)}>
            <ButtonH>Start Now</ButtonH>
          </GradientButtonAction>
          {/* <Button
            title="Start Now"
            onPress={() => navigation.navigate(TABs.AICHAT)}
          /> */}
        </View>
      </BlurView>
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
