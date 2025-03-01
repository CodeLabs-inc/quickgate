import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import IconChevronUp from '../icons/chevronUp';
import IconChevronRight from '../icons/chevronRight';

interface ButtonSettingsProps {
    text: string;
    index: number;
    length: number;
    backgroundColor?: string;
    onPress?: () => void;
}

const ButtonSettings = ({text, index, length, backgroundColor, onPress}: ButtonSettingsProps) => {
  return (
    <TouchableOpacity
        onPress={onPress && onPress}
    >
        <View style={[
            styles.container,
            {
                borderBottomWidth: index === length - 1 ? 1 : 0,
                borderBottomRightRadius: index === length - 1 ? 10 : 0,
                borderBottomLeftRadius: index === length - 1 ? 10 : 0,
                
                borderTopWidth: index == 0 ? 1 : 0,
                borderTopRightRadius: index === 0 ? 10 : 0,
                borderTopLeftRadius: index === 0 ? 10 : 0,

                backgroundColor: backgroundColor ? backgroundColor : "#242424",
            }
        ]}>
            <Text style={styles.text}>{text}</Text>
            <IconChevronRight/>
        </View>
    </TouchableOpacity>
  )
}

export default ButtonSettings

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: "100%",
        backgroundColor: "#242424",
        fontFamily: "Poppins",
        borderColor: "#ffffff30",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        paddingHorizontal: 20,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 16,
        fontFamily: "Poppins",
    }
})