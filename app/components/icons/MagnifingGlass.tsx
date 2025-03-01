import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface MagnifingGlassIconProps {
    color: string;
}

const MagnifingGlassIcon = ({color}: MagnifingGlassIconProps) => {
    return (
        <Svg fill="none" viewBox="0 0 24 24" height={20} width={20} stroke-width="1.5" stroke={color}>
            <Path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </Svg>

    )
}

export default MagnifingGlassIcon

const styles = StyleSheet.create({})