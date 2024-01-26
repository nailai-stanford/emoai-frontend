import React from "react";
import { StyleSheet, View, ImageBackground, TouchableHighlight, Text } from "react-native";

export const NailSelector = ({ index, isActivated, image, showNails, onDelete, showDeleteButton}) => {
  const size = 50;
  const activatedStyle = isActivated
    ? {
        borderColor: "white",
        borderWidth: 3,
      }
    : {};
  return (
    
    <View
      style={{
        ...activatedStyle,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: isActivated ? 'transparent' : "#787878",
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!!isActivated && !!image ? (
        <ImageBackground
          source={{ uri: image }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        >
          {!!showNails && !!showDeleteButton && (
            <TouchableHighlight
              style={styles.deleteButton}
              onPress={() => onDelete(index)}
            >
              <Text style={styles.deleteButtonText}>-</Text>
            </TouchableHighlight>
          )}
        </ImageBackground>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({

  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'green',
  },
  image: {
    width: 53.2, // Fill the container
    height: 102.4, // Fill the container
    resizeMode: 'cover', // This will ensure the image covers the area without stretching
  },

});