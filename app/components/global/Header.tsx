import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Input from '../inputs/Input'
import MagnifingGlassIcon from '../icons/MagnifingGlass'
import { AuthContext } from '@/context/AuthContext'
import formatNumberWithQuote from '@/utils/currencyFormatConverter'
import { TextInput } from 'react-native-gesture-handler'
import Banknotes from '../icons/Banknotes'


interface HeaderProps {
    type?: 'default' | 'search'
    onSearch?: (text: string) => void
}


const Header = ({ type, onSearch }: HeaderProps) => {
    const { name, balance } = useContext(AuthContext)
    const [searchValue, setSearchValue] = useState('')

    //Balance, name from context
    if (!type || type === 'default') {
        return (
            <View style={styles.container}>

                <View style={styles.bubbleXL}>
                    <View style={styles.bubble}>
                        <View
                            style={[
                                styles.bubbleImage,
                                { backgroundColor: '#52889F' }
                            ]}
                        >
                            <Text style={{ fontSize: 30, color: 'white' }}>{name?.charAt(0)}</Text>
                        </View>

                        <View style={styles.bubbleText}>
                            <Text style={styles.bubbleLabel}>Saludos</Text>
                            <Text style={styles.bubbleValue}>{name ? name.split(" ")[0] : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.bubbleReverse}>
                        <View style={styles.bubbleTextReverse}>
                            <Text style={styles.bubbleLabel}>Balance</Text>
                            <Text style={styles.bubbleValue}>RD$ {balance && formatNumberWithQuote(balance)}</Text>
                        </View>
                        <View
                            style={[
                                styles.bubbleImage
                            ]}
                        >
                            <Banknotes/>
                        </View>

                    </View>
                </View>


            </View>
        )
    }


    const [search, setSearch] = React.useState('')
    if (type === 'search') {
        return (
            <View style={styles.container}>

                <View style={styles.bubbleXL}>

                    <View
                        style={[
                            styles.bubbleImage,
                            { backgroundColor: '#52889F' }
                        ]}
                    >
                        <Text style={{ fontSize: 30, color: 'white' }}>{name && name.charAt(0)}</Text>
                    </View>


                    <TextInput
                        style={styles.input}
                        onChangeText={setSearchValue}
                        value={searchValue}
                        onFocus={() => {}}
                        onBlur={() => {Keyboard.dismiss()}}
                        keyboardType={'default'}
                        placeholderTextColor={'#ffffff90'}
                        focusable={true}
                        secureTextEntry={false}
                        autoComplete='off'
                        autoCorrect={true}
                        placeholder='Buscar direccion o nombre parqueo'
                    />
                </View>




            </View>
        )
    }
}

export default Header

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    bubble: {
        width: '49%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        borderRadius: 30,
    },
    bubbleReverse: {
        width: '49%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        borderRadius: 30,
    },
    bubbleXL: {
        width: '100%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF17',
        gap: 10,
        borderRadius: 30,
        padding: 7,

    },

    bubbleImage: {
        width: 50,
        height: 50,
        backgroundColor: '#333842',
        borderRadius: 50,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubbleText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    bubbleTextReverse: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    bubbleLabel: {
        fontSize: 12,
        fontFamily: 'Regular',
        color: '#FFFFFF90'
    },
    bubbleValue: {
        fontSize: 14,
        fontFamily: 'SemiBold',
        color: '#FFFFFF'
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
})