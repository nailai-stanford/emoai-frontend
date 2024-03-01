import React, { useState } from 'react';

import {TouchableOpacity, View, Image, TextInput, Button, StyleSheet, Share, Text } from 'react-native';
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { ButtonAction, ButtonSelection } from "../styles/buttons";
import { P, ButtonP, ButtonH, MenuHeader, TitleHeader, SubHeader} from "../styles/texts";
import { COLORS, PADDINGS } from "../styles/theme";

const prompt = "Can you generate an abstract and artistic short title as well as a short description of how is the design inspired of nail art design with these description: [message]. Please only return the result in this format: { 'title':  title generated within 10 words, 'description': description generated within 50 words}. Please do not return any other words."


export const ShareDesignTab = ({navigation, route}) => {

    const { title, description, product_url } = route.params;
    const { userInfo} = useAuthenticationContext();
    const [ptitle, setTitle] = useState(title);
    const [pdescription, setDescription] = useState(description);
    const onBack = () => {
      navigation.goBack();
  };
    // const onShare = async () => {
    //   try {
    //     const result = await Share.share({
    //       message:
    //         `Check out this design!\nTitle: ${title}\nDescription: ${description}\nImage: ${imageUrl}`,
    //     });
    //     if (result.action === Share.sharedAction) {
    //       if (result.activityType) {
    //         // shared with activity type of result.activityType
    //       } else {
    //         // shared
    //       }
    //     } else if (result.action === Share.dismissedAction) {
    //       // dismissed
    //     }
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // };
    const onShare = async () => {
      try {
        const result = await Share.share({
          message:
            `Check out this design!\nTitle: ${title}\nDescription: ${description}\nImage: `,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <View style={styles.container}>

        <View style={styles.backButtonContainer}>
              <TouchableOpacity onPress={onBack}>
                  <TitleHeader>{'<'}</TitleHeader>
              </TouchableOpacity>
        </View>

      <SubHeader >
       Add a title
      </SubHeader>
        <TextInput
          style={styles.title_input}
          onChangeText={setTitle}
          value={ptitle}
          placeholder="Add a title"
        />

        <SubHeader >
       Add a description
      </SubHeader>

        <TextInput
          style={styles.description_input}
          onChangeText={setDescription}
          value={pdescription}
          placeholder="Add a description"
          multiline
        />
         <Image source={{ uri: `data:image/png;base64,${product_url}`  }} style={styles.image} />
         <ButtonAction onPress={onShare} $colored={true} style={{alignSelf:"center", width:"60%"}}><ButtonH>Share</ButtonH></ButtonAction>

      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    //   alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    image: {
      width: '100%',
      height: 200,
      marginBottom: 10,
    },
    title_input: {
      width: '100%',
      height: 80,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: PADDINGS.md,
      borderRadius: 24,
      color:COLORS.white
    },
    description_input:{
      width: '100%',
      height: 200,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: PADDINGS.md,
      color:COLORS.white,
      borderRadius: 24,

    },
    backButtonContainer: {
      position: 'absolute',
      top: 20,
      left: 10,
  }
  });
    