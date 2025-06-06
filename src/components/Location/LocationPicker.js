import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationPicker = () => {
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: 37.7749,
                    longitude: -122.4194,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
                />
            </MapView>
        </View>
    );
};

export default LocationPicker;