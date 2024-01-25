import React, {useState} from "react";
import {KeyboardAvoidingView, ScrollView, View} from "react-native";
import { Input, Icon, Text, Button } from '@rneui/themed';

export const AddressTab = ({ navigation }) => {
    // const navigation = useNavigation();
    const [name, setName] = useState("")
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [zip, setZip] = useState("")
    const [phone, setPhone] = useState("") 
    const [street, setStreet] = useState("")
    let display = `${name}, ${phone}
    ${street}, ${state}, ${zip}, ${country} `

    return <KeyboardAvoidingView>
        <ScrollView>
        <Text>Name</Text>
            <Input
                placeholder={name}
                onChangeText={value => { setName(value);  }}
            />
            {/* TODO: need to use dropdown picker */}
            <Text>Country or Region</Text>
            <Input
                placeholder={country}
                onChangeText={value => { setCountry(value);  }}
            />
            {/* need to use dropdown picker */}
        <Text>Province/State</Text>
            <Input
                placeholder={state}
                onChangeText={value => { setState(value);  }}
        />
        <Text>City</Text>
            <Input
                placeholder={city}
                onChangeText={value => { setCity(value);  }}
        />
          <Text>Postal Code</Text>
            <Input
                placeholder={zip}
                onChangeText={value => { setZip(value);  }}
        />
          <Text>Phone Number</Text>
            <Input
                placeholder={phone}
                onChangeText={value => { setPhone(value);  }}
        />
        <Text>Street Address</Text>
            <Input
                placeholder={street}
                onChangeText={value => { setStreet(value);  }}
            />
            {/* need to send the data using api */}
            <Button title="Save" onPress={() => {}}/>
        </ScrollView>
    </KeyboardAvoidingView>
}