
import { StyleSheet, View, TextInput, Text, TouchableOpacity} from 'react-native';
import { GradientButtonSelection, GradientButtonAction } from '../styles/buttons';
import { useState, useEffect } from 'react';
import { APIs, POST } from '../utils/API';
import { useToast } from 'react-native-toast-notifications';
import { setUserInfoInStore } from '../utils/UserUtils';


export const EmailLoginView = (props) => {
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);

    const [code, setCode] = useState('');
    const [isCodeValid, setIsCodeValid] = useState(true);
    
    const [countdown, setCountdown] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const toast = useToast();

    useEffect(() => {
        let interval = null;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else {
            setIsButtonDisabled(false);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const login = async() => {
        console.log('login')
        let valid = true;

        if (!validateEmail(email)) {
            setIsEmailValid(false);
            valid = false;
            console.log('Invalid email');
        }

        if (!validateCode(code)) {
            setIsCodeValid(false);
            valid = false;
            console.log('Invalid code');
        }

        if (valid) {
            console.log('Login with', email);
            // Proceed with login
            resp = await POST(APIs.EMAIL_LOGIN, {email: email, code: code})
            if (resp.status === 200) {
                userInfo = {
                    jwt: resp.data.user.jwt,
                    user: resp.data.user
                  }
                setUserInfoInStore(userInfo);
                props.setLocalLogin(true);
                props.setUserInfo(userInfo);
                console.log('login by email success:', userInfo)
            } else if(resp.status === 402) {
                setIsCodeValid(false)
            } else {
                toast.show("Login failed, please try again", {
                    type: "normal",
                    placement: "bottom",
                    duration: 1000,
                    animationType: "zoom-in",
                    style : {
                      marginBottom: 150
                    }
                  })
            }
        }
    }

    const send_code = async() => {
        if (validateEmail(email)) {
            console.log('Valid email:', email);
            setIsEmailValid(true);
            resp = await POST(APIs.EMAIL_CODE, {email: email})
            if (resp.status === 200) {
                // down counter 
                console.log('send success')
                setCountdown(60); // Set countdown duration (e.g., 60 seconds)
                setIsButtonDisabled(true);
            } else {
                toast.show("Send verification code failed, please try again", {
                    type: "normal",
                    placement: "bottom",
                    duration: 1000,
                    animationType: "zoom-in",
                    style : {
                      marginBottom: 150
                    }
                  })
            }
        } else {
            setIsEmailValid(false);
        }
    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/; // Basic regex for email validation
        return re.test(email);
    };

    const validateCode = (code) => {
        return code.length === 6 && /^\d+$/.test(code);
    };


    return (
        <View style={styles.container}>
            <GradientButtonSelection>
                <TextInput 
                    placeholder="Your email address" 
                    placeholderTextColor={isEmailValid ? "#ffffff90" : "red"}
                    keyboardType="email-address"
                    style={[styles.input, !isEmailValid && { color: 'red', borderColor: 'red' }]}
                    onChangeText={(text) => {
                        setEmail(text);
                        setIsEmailValid(true); // Reset validation when user starts typing
                    }}
                    value={email}
                />
            </GradientButtonSelection>
            <View>
                <GradientButtonSelection>
                    <TextInput 
                        placeholder="Verification code" 
                        placeholderTextColor={isCodeValid ? "#ffffff90" : "red"}
                        keyboardType='numeric'
                        maxLength={6}
                        style={[styles.codeInput, !isCodeValid && { color: 'red', borderColor: 'red' }]}
                        onChangeText={(text) => {
                            setCode(text);
                            setIsCodeValid(true); // Reset validation when user starts typing
                        }}
                        value={code}
                    />

                    
                </GradientButtonSelection>
                <GradientButtonAction
                    style={styles.sendAction} 
                    onPress={send_code}    
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.sendCode}>
                        {isButtonDisabled ? `Resend (${countdown})` : 'Send Code'}
                    </Text>
                </GradientButtonAction>
            </View>
            <GradientButtonAction onPress={login}>
                <Text style={styles.loginButtonText}>Login</Text>
            </GradientButtonAction>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    input: {
        fontSize: 14,
        color: 'white',
        width: 220,
        height: 22
    },
    codeInput: {
        fontSize: 14,
        color: 'white',
        width: 220,
        paddingRight: 40,
        height: 22
    },
    sendAction: {
        position: 'absolute',
        right: 0,
        width: 100,
        justifyContent: 'center', // Centers content horizontally in flexbox
        alignItems: 'center',   
    },
    sendCode: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        width: 100
    },
    
    loginButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    }
});
