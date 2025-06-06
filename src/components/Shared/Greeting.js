import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

const Greeting = ({ userName }) => {
    // Получаем текущее время для определения времени суток
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return 'Good morning';
        if (currentHour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <View style={{ padding: 10 }}>
            <Text>{getGreeting()}, {userName}!</Text>
        </View>
    );
};

Greeting.propTypes = {
    userName: PropTypes.string.isRequired,
};

export default Greeting;
