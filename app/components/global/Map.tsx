import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import MapView, { MapUrlTile, Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location'; // Import Expo Location
import MapParking from '../animations/MapParking';
import ViewFinder from '../icons/ViewFinder';
import { Linking } from 'react-native';


interface MapProps {
    markers: {
        latitude: string,
        longitude: string,
        nameGate?: string,
        address: string,
    }[]
}

const Map = forwardRef(({ markers }: MapProps, ref) => {
    const mapRef = useRef<MapView>(null); // Create a ref for MapView
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [heading, setHeading] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isTracking, setIsTracking] = useState(true);

    // Updated `animate_point` with condition
    const animate_point = (newLocation: { latitude: number, longitude: number, heading: number }) => {
        if (isTracking && mapRef.current) {
            mapRef.current.animateCamera({
                heading: newLocation.heading,
                zoom: 20,
                altitude: 200,
                center: {
                    latitude: newLocation.latitude,
                    longitude: newLocation.longitude,
                },
                pitch: 85,
            });
        }
    };
    // Inside the `onRegionChange` function, stop tracking when the user moves the map
    const onRegionChange = () => {
        setIsTracking(false); // Stop auto-centering when the user manually interacts
    };


    // Method to center the map on the user's location exposed to the parent component
    const centerMapOnUserLocation = () => {
        if (mapRef.current && location) {
            mapRef.current.animateCamera({
                center: { latitude: location.latitude, longitude: location.longitude },
                heading: heading ?? 0,
                pitch: 85, // You can adjust this pitch
                altitude: 200, // You can adjust this altitude
            });
        }
    }
    // Method to animate to a specific marker
    const zoomToMarker = (latitude: number, longitude: number) => {
        if (mapRef.current) {
            mapRef.current.animateCamera({
                center: { latitude, longitude },
                heading: heading ?? 0,
                pitch: 85,
                zoom: 20,
                altitude: 200,
            });
        }
    };
    // Expose the `zoomToMarker` method
    useImperativeHandle(ref, () => ({
        zoomToMarker,
    }));

    const openAddress = (address: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        Linking.openURL(url).catch(err => console.error("Failed to open maps", err));
    };
    const openAddressNativeMaps = (address: string) => {
        const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:0,0?q=';
        const url = `${scheme}${encodeURIComponent(address)}`;
        Linking.openURL(url).catch(err => console.error("Failed to open maps", err));
    };
    const openInWaze = (address: string) => {
        const url = `https://waze.com/ul?q=${encodeURIComponent(address)}`;
        Linking.openURL(url).catch(err => console.error("Failed to open Waze", err));
    };



    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    distanceInterval: 10, // Update position every meter
                },
                (newLocation) => {
                    if (!isTracking) return; // If tracking is disabled, do not update the location

                    const { latitude, longitude, heading } = newLocation.coords;
                    const updatedLocation = { latitude, longitude, heading: heading ?? 0 };
                    setLocation(updatedLocation);
                    setHeading(heading);
                    animate_point(updatedLocation); // Update map camera on location change
                }
            );

            // Cleanup the subscription when the component is unmounted
            return locationSubscription.remove;
        };

        // Call the function to start tracking location
        getLocation();
        // Cleanup function
        return () => {
            setLocation(null); // Reset location on cleanup
        };
    }, []);





    return (
        <View style={styles.container}>


            <MapView
                ref={mapRef} // Attach the ref to the MapView
                style={styles.map}
                key={markers.length}
                pitchEnabled={false}
                camera={{
                    center: {
                        latitude: location?.latitude ?? 0,
                        longitude: location?.longitude ?? 0,
                    },
                    heading: heading ?? 0,
                    pitch: 85,
                    zoom: 20,
                    altitude: 200,
                }}
                onRegionChange={onRegionChange}
            >
                {/* Markers */}
                {markers && markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: Number(marker.latitude),
                            longitude: Number(marker.longitude),
                        }}
                        onPress={() => {

                            //openAddress(marker.address ?? '');
                            //openAddressNativeMaps(marker.address);
                            openInWaze(marker.address);
                        }}
                    >
                        <MapParking name={marker.nameGate} />
                    </Marker>
                ))}



                {/* User Location Marker */}
                {location
                    &&
                    (
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                        >
                            <Image
                                source={require('@/assets/pictures/point_location.png')}
                                style={{
                                    width: 30,
                                    height: 30,
                                    transform: [{ rotateX: `65deg` }],
                                }}
                            />
                        </Marker>
                    )}
            </MapView>

            <Fade style={{ bottom: 0 }} start={0} end={0.8} />
            <CenterButton
                isTracking={isTracking}
                onPress={() => {
                    setIsTracking(true);
                    centerMapOnUserLocation();
                }}
            />
        </View>
    );
});

export default Map;

const Fade = ({ style, start, end, heigth }: { style?: any, start?: number, end?: number, heigth?: number }) => {
    return (
        <LinearGradient
            style={[styles.fade, style, { height: heigth ?? 100 }]}
            colors={["#00000000", "#151A23"]}
            start={{ x: 0, y: start ?? 0 }}
            end={{ x: 0, y: end ?? 1 }}
        />
    );
};

const CenterButton = ({ onPress, isTracking }: { onPress: () => void, isTracking: boolean }) => {
    return (
        <View style={{
            position: 'absolute',
            bottom: 25,
            right: 0,
            zIndex: 1000,

            backgroundColor: isTracking ? '#52889F' : '',
            borderRadius: 50,
        }}>
            <TouchableOpacity onPress={onPress}>
                <View style={{ padding: 10, borderRadius: 5 }}>
                    <ViewFinder />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 410,
        width: '100%',
    },
    map: {
        width: '100%',
        height: '100%',

    },
    fade: {
        height: 100,
        width: '100%',
        position: 'absolute',
        zIndex: 100,
    },
});
