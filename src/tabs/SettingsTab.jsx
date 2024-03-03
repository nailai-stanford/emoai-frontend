import React, {useEffect, useState} from "react";
// import { Input, Icon, Text, Button, Overlay } from '@rneui/themed';
import { StyleSheet, View, ScrollView, Dimensions, Text, Button, Image} from "react-native";
import { TABs } from "../static/Constants";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { GradientButtonAction } from "../styles/buttons";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import { POST, APIs} from "../utils/API";
import { useToast } from "react-native-toast-notifications";
import { BlurView } from '@react-native-community/blur';
import { P, ButtonH, TitleHeader } from "../styles/texts";


const ConfirmPop = (props) => {
    const { setShowConfirmPop, signOut } = props;
    const navigation = useNavigation();
    const {userInfo} = useAuthenticationContext()
    const toast = useToast();
    const IMG_PATH = "../../assets/warning.png";


    useEffect(()=> {
        console.log('show pop')
    })
    const handleKeepAccount =() => {
        setShowConfirmPop(false)
        navigation.navigate(TABs.PROFILE)
    }

    const handleConfirmDeletion = async() => {
        // Logic to confirm account deletion
        resp = await POST(APIs.DELETE_ACCOUNT, null, userInfo)
        if (resp.status === 200) {
            console.log('delete account success')
            signOut()
            setShowConfirmPop(false)
            navigation.navigate(TABs.HOME)
        } else {
            toast.show("Operation failed, please try again", {
                type: "normal",
                placement: "bottom",
                duration: 1000,
                animationType: "zoom-in",
                style : {
                  marginBottom: 150
                }
              })
        }
    };

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

const DeleteConfirm = (props) => {
    const { setShowConfirm, setShowConfirmPop } = props;
    const navigation = useNavigation();

    const IMG_PATH = "../../assets/pngc.png";

    const handleKeepAccount = () => {
        setShowConfirm(false)
        navigation.navigate(TABs.PROFILE)
    };

    const handleConfirmDeletion = async() => {
        setShowConfirm(false)
        setShowConfirmPop(true)
    };

    return (
        <View style={styles.deleteConfirmContainer}>
            <BlurView  style={styles.blurViewStyle}
                blurType="dark" // or 'dark', 'xlight', etc.
                blurAmount={5}  // blur intensity
            >
                <Image source={require(IMG_PATH)} style={{ width: 120, height: 120, borderRadius: 10, resizeMode: 'contain', marginTop: 50}} />
                <View style={styles.content}>
                    <Text style={styles.title}>Consider Before Deleting Your Account</Text>
                    <Text style={styles.description}>
                        Permanent Data Removal: Deleting your account will permanently erase all your data, including personal information, settings, and any content you've created.
                    </Text>
                    <Text style={styles.description}>
                        Content Deletion: All your posts, photos, videos, and other created content will be irretrievably lost.
                    </Text>
                    <Text style={styles.description}>
                        Think Twice: We value your presence in our community. Are you sure you want to leave and delete your account?
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <GradientButtonAction onPress={handleKeepAccount} style={{width: 200}}>
                            <Text style={styles.buttonText}>Keep Account</Text>
                    </GradientButtonAction>
                    <Text onPress={handleConfirmDeletion} style={styles.deleteButton}>Confirm Delete</Text>
                </View>
            </BlurView>
        </View>
    )
}

export const SettingsTab = (props) => {
    // need to fetch from db and also get from addr/name tabs
    const navigation = useNavigation();
    const [showConfirm, setShowConfirm] = useState(false)
    const [showConfirmPop, setShowConfirmPop] = useState(false)
    const isFocused = useIsFocused()

    useEffect(()=> {
        if (!isFocused) {
            setShowConfirm(false)
        }
    })

    const signOut = () =>{
        props.onSignout()
        navigation.navigate(TABs.HOME)
    }    

    const showConfirmPage = () => {
        setShowConfirm(true)
        console.log('delete account')
    }

   

    return (
        <View style={{alignItems: "center", position: "absolute", left: 0, right: 0, top: 0, bottom: 0}}>
            <GradientButtonAction onPress={signOut} style={{width: 200}}>
                    <Text style={styles.buttonText}>Sign Out</Text>
            </GradientButtonAction>
            <Text style={{color: "#999999", marginTop: 20}} onPress={showConfirmPage}>Delete Account</Text>
            {showConfirm && 
                <View style={{zIndex: 2, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                    <DeleteConfirm setShowConfirm={setShowConfirm} setShowConfirmPop={setShowConfirmPop}/>
                </View>
            }
            {showConfirmPop && 
                <View style={{zIndex: 2, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                    <ConfirmPop setShowConfirmPop={setShowConfirmPop} signOut={props.onSignout}/>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    blurViewStyle: {
        position: 'absolute',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    deleteConfirmContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    warningHeader: {
        // Style for the header with the warning icon
    },
    warningTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    content: {
        width: '100%',
        color: "white",
    },
    title: {
        color: "#cccccc",
        fontSize: 16,
        fontWeight: 'bold',
        padding: 20,
    },
    description: {
        color: "#cccccc",
        fontSize: 16,
        padding: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        // textAlign: 'left', // Align text to the start
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        alignItems: "center",
        alignSelf: "flex-end",
        marginRight: 20
        
    },
    keepButton: {
        // Style for the keep account button
    },
    deleteButton: {
        // Style for the confirm deletion button
        color: "#cccccc"
    },
    popContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,   
    },
});