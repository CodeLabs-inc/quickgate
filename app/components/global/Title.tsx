import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ChevronRight from '../icons/ChevronRight'
import { transform } from '@babel/core'
import { useRouter } from 'expo-router'

interface TitleProps {
    goBack?: boolean,

    line1?: string,
    line2?: string,
    style?: object,
    styleText?: object
}

const Title = ({goBack, line1, line2, style, styleText}: TitleProps) => {
    const router = useRouter()

    return (
        <View style={[styles.component]}>
            {
                goBack &&
                <TouchableOpacity
                    onPress={() => {
                        if (goBack) {
                            router.back()
                      }
                    }}
                    style={{
                        marginRight: 10
                    }}
                >
                    <ChevronRight style={{
                        transform: [{ rotate: '180deg' }],
                    }}/>
                </TouchableOpacity>
            }
            <View style={style}>
                <Text style={[styles.title,styleText ]}>{line1}</Text>
                <Text style={[styles.title,styleText ]}>{line2}</Text>
            </View>
        </View>
    )

}

export default Title

const styles = StyleSheet.create({
    component: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#FFFFFF',
        textAlign: 'left',
        fontFamily: 'SemiBold',
    },
})