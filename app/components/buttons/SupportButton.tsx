import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import UserIcon from '../icons/User';

interface ButtonGlobalProps {
    text: string;
    onPress?: () => void;
    style?: object;
}

const SupportButton = ({text, onPress, style}:ButtonGlobalProps) => {
  return (
    <TouchableOpacity
        onPress={onPress && onPress}
        style={[
            styles.container,
            style
        ]}
    >
        <UserIcon color='white'/>
        <Text style={{fontSize: 16, color: 'white'}}>{text}</Text>
    </TouchableOpacity>
    
  )
}

export default SupportButton

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D24848',
        width: '35%',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',

        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    }

    
})        