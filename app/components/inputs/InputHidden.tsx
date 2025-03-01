import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';


const InputHidden = (props: {label: string, placeholder: string, onChangeText: any, value: string, icon?: any}) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    

    const handlePress = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }
    

    return (
        <View style={styles.inputPasswordAll}>
            {
                props.label &&
                <Text style={styles.inputLabelPassword}>{props.label}</Text>
            }
            <View style={[styles.inputContainer, {borderWidth: isFocused ? 0.5 : 0}, {padding: isFocused ? 9.5 : 10}]}>
                <TextInput
                style={styles.inputPassword}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                secureTextEntry={!isPasswordVisible}
                value={props.value}
                onFocus={() => {setIsFocused(true)}}
                onBlur={() => {setIsFocused(false)}}
                placeholderTextColor={'#ffffff90'}
                />
                <TouchableWithoutFeedback onPress={handlePress}>
                    <Text style={{color: '#ffffff90'}}>
                        {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );

}

export default InputHidden


const styles = StyleSheet.create({
    inputLabel: {
        height: 25,
        color: '#ffffff',
        fontSize: 15,
        fontFamily: 'Poppins',
    },
    inputEmail:{
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    inputContainer: {
        height: 60,
        width: "100%",


        color: '#ffffff80',
        borderColor: '#ffffff80',
        paddingLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        
        backgroundColor: '#42464D',
        borderRadius: 15,
    },
    input: {
        height: '100%',
        width: '100%',

        padding: 10,
        fontSize: 15,
        color: '#ffffff',

        borderColor: '#000000',
        borderRadius: 30,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        fontFamily: 'Poppins',
    },
    inputPassword: {
        height: '100%',
        width: '85%',

        padding: 10,
        fontSize: 15,
        color: '#ffffff',

        borderColor: '#000000',
        borderRadius: 30,
        shadowColor: '#000000',
        fontFamily: 'Poppins',
        
    },
    inputPasswordAll: {
        
    },
    inputLabelPassword: {
        
    },
})