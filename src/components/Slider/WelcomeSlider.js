import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from 'react-native';
import Carousel from './Carousel';

const WelcomeSlider = ({ onRegister }) => {
    const [showSlider, setShowSlider] = useState(false);

    useEffect(() => {
        const checkIfVisited = async () => {
            try {
                const hasVisited = await AsyncStorage.getItem('hasVisited');
                if (!hasVisited) {
                    setShowSlider(true);
                    await AsyncStorage.setItem('hasVisited', 'true');
                } else {
                    onRegister();
                }
            } catch (error) {
                console.error('Error accessing AsyncStorage:', error);
            }
        };

        checkIfVisited();
    }, [onRegister]);

    const handleSkip = () => {
        setShowSlider(false);
        onRegister();
    };

    return (
        <View style={styles.container}>
            {showSlider && <Carousel onSkip={handleSkip} onRegister={onRegister} />}
        </View>
    );
};

export default WelcomeSlider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
