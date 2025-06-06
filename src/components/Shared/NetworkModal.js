import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkModal = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const delayTime = 3500; // ⏳ Задержка перед появлением модалки (в миллисекундах)

    useEffect(() => {
        let timeout;

        const handleNetworkChange = (state) => {
            setIsConnected(state.isConnected);

            if (!state.isConnected) {
                // Если соединение потеряно, ждем 3.5 секунды перед показом модального окна
                timeout = setTimeout(() => {
                    setShowModal(true);
                }, delayTime);
            } else {
                // Если соединение восстановлено, скрываем модалку и сбрасываем таймер
                clearTimeout(timeout);
                setShowModal(false);
            }
        };

        const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

        return () => {
            clearTimeout(timeout);
            unsubscribe();
        };
    }, []);

    const handleRetry = () => {
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                setShowModal(false); // Закрываем модалку при успешном подключении
            }
        });
    };

    return (
        <Modal
            visible={showModal} // ⬅️ Используем `showModal`, а не `isConnected`
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>No Internet Connection</Text>
                    <Text style={styles.text}>Please check your network settings.</Text>
                    {/*<Button title="Retry" onPress={() => NetInfo.fetch().then((state) => setIsConnected(state.isConnected))} />*/}
                    <Button title="Retry" onPress={handleRetry} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default NetworkModal;
