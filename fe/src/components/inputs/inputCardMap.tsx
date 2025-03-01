'use client'

import React, { useEffect, useState } from 'react'
import style from './input.module.css'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

function InputMap(
    props: {
        label?: string,
        position?: {
            lat: string | null,
            lng: string | null,
        }
        style?: React.CSSProperties,
        onChange?: (lat: string, lng: string) => void
    }
) {
    // State to hold marker position
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(
        props.position &&
        props.position.lat && props.position.lng
        ? [parseFloat(props.position.lat), parseFloat(props.position.lng)]
        : [18.471375, -69.938496] // Default position
    );

    // Custom marker icon
    const customIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Replace with your icon URL
        iconSize: [40, 40], // Size of the icon
        iconAnchor: [15, 40], // Anchor point of the icon (middle bottom)
        popupAnchor: [0, -40] // Anchor point for the popup relative to the icon
    });
    // Component to handle map click events and set marker position
    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                setMarkerPosition([event.latlng.lat, event.latlng.lng]);
                props.onChange && props.onChange(event.latlng.lat.toString(), event.latlng.lng.toString());
            }
        });
        return null; // No visual component needed
    };

    useEffect(() => {
        if (props.position && props.position.lat && props.position.lng) {
            setMarkerPosition([parseFloat(props.position.lat), parseFloat(props.position.lng)]);
        }
    }, [props.position]);

    return (
        <div style={{
            background: 'var(--status-background)',
            padding: '10px',
            marginBottom: '0px',
            borderRadius: '7px',
        }}>
            <p style={{ fontSize: '13px' }}>
                {props.label && props.label}
            </p>

            <MapContainer
                center={markerPosition}
                zoom={10}
                scrollWheelZoom={true}
                style={{
                    height: '300px',
                    width: '100%',
                    borderRadius: '7px',
                    marginTop: '10px',
                    ...props.style
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    //url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                    //accessToken='e2d36a80-8e97-4158-86b8-f00f2d934845'
                    
                />

                {/* Add the click handler */}
                <MapClickHandler />

                {/* Marker at the current position */}
                <Marker position={markerPosition} icon={customIcon}>
                    <Popup>
                        Latitude: {markerPosition[0].toFixed(4)}, 
                        Longitude: {markerPosition[1].toFixed(4)}
                    </Popup>
                </Marker>
            </MapContainer>
            <div className='flex flex-row gap-2 mt-4'>
                <p className='text-[12px]'>{markerPosition[0].toFixed(4)}° N</p>
                <p className='text-[12px]'>{markerPosition[1].toFixed(4)}° W</p>
            </div>
        </div>
    );
}

export default InputMap;
