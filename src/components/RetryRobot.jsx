import { View, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { P, ButtonH, TitleHeader} from "../styles/texts";
import { Text } from 'react-native-elements';
import { GradientButtonAction } from '../styles/buttons';


export const RetryRobot = ({ title, subtitle, buttonText, description, action }) => {
    const IMG_PATH = "../../assets/error.png";
  
    return (
      <View style={styles.container}>
        <BlurView
            blurType="dark"
            blurAmount={30}
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
            }}
        >
        <Image source={require(IMG_PATH)} style={{ width: 200, height: 200, borderRadius: 10, resizeMode: 'contain', zIndex: 2, marginTop: -400}} />
        { <View
            style={{
                borderRadius: 25,
                paddingHorizontal: 35,
                paddingVertical: 40,
                marginLeft: 180,
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
                position: "absolute",
                backgroundColor: '#282828',
                zIndex: 1
            }}
            >
            <>
            <TitleHeader style={{color: "white", marginTop: 30}}>
                {title}
            </TitleHeader>
            <P style={{ textAlign: "center", marginBottom: 20, width: 150 }}>
                {subtitle}
            </P>
            { <View>
                <GradientButtonAction onPress={action}>
                <ButtonH>{buttonText}</ButtonH>
                </GradientButtonAction>
                <Text style={{color: "#cccccc", textAlign: 'center', marginTop: 5}}>{description}</Text>
            </View> }
            </>
          </View>}
        </BlurView>
      </View>
    )
  }

const styles = StyleSheet.create({
    centeredView: {

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },

    blurViewStyle: {
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default RetryRobot;