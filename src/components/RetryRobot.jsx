import { View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { P, ButtonH, TitleHeader } from "../styles/texts";


export const RetryRobot = () => {
    const IMG_PATH = "../../assets/error.png";
  
    return (
      <View style={styles.popContainer}>
        <BlurView 
        blurType="dark"
        blurAmount={5}
        style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "absolute",
        }}
        >
        <Image source={require(IMG_PATH)} style={{ width: 200, height: 200, borderRadius: 10, resizeMode: 'contain', zIndex: 2, marginTop: -350}} />
        <View
            style={{
            marginBottom: 10,
            borderRadius: 25,
            paddingHorizontal: 35,
            paddingVertical: 30,
            marginLeft: 150,
            alignContent: "center",
            alignItems: "center",
            textAlign: "center",
            position: "absolute",
            backgroundColor: '#282828',
            zIndex: 1
            }}
        >
            <>
            <TitleHeader style={{marginTop: 35}}>
                Are you sure you want to Delete Account?
            </TitleHeader>
          
            <View>
                <GradientButtonAction onPress={handleKeepAccount}>
                <ButtonH>Keep Account</ButtonH>
                </GradientButtonAction>
                <Text style={{color:"#cccccc", textAlign: 'center', marginTop: 5}} onPress={handleConfirmDeletion}>Confirm Deletion</Text>
            </View> 
            </> 
          </View>
        </BlurView>
      </View>
    )
  
  }