import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Line, Path, Polyline } from 'react-native-svg'

interface LogInIconProps {
    color?: string;
}

const LogInIcon = ({color}: LogInIconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
            <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <Polyline points="10 17 15 12 10 7" />
            <Line x1="15" x2="3" y1="12" y2="12" />
        </Svg>
    )
}

export default LogInIcon

const styles = StyleSheet.create({})