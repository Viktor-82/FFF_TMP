import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../assets/styles/colors';
import BackButton from '../components/Buttons/BackButton';

const ProfilePage = () => {
    const user = useSelector((state) => state.user); // Получаем данные пользователя из Redux
    const { id, username, email } = user || {}; // Деструктурируем данные

    return (
        <View style={styles.container}>
            <BackButton/>
            <Text style={styles.title}>Personal data</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>User ID:</Text>
                <Text style={styles.value}>{id || 'N/A'}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{username || 'Not set'}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{email || 'Not set'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.white,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        // color: colors.green.olive,
        marginBottom: 20,
        marginTop: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.brown.lightEarth,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        // color: colors.brown.earth,
        // color: colors.green.grass,
    },
    value: {
        fontSize: 16,
        // color: colors.green.grass,
        // color: colors.brown.earth,
    },
});

export default ProfilePage;
