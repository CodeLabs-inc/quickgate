import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path, Rect } from 'react-native-svg';

interface GalleryHorizontalIconProps {
    color?: string;
}

const GalleryHorizontalIcon = ({ color }: GalleryHorizontalIconProps) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color ?? '#FFF'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <Path d="M2 7v10" />
            <Path d="M6 5v14" />
            <Rect width="12" height="18" x="10" y="3" rx="2" />
        </Svg>
    )
}

export default GalleryHorizontalIcon

const styles = StyleSheet.create({})