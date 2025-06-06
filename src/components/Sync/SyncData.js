import React, { useEffect } from 'react';
import { showToast } from '../Shared/Notification';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const SyncData = ({ dataKey, apiEndpoint, successMessage, method = 'POST' }) => {
    useEffect(() => {
        const syncUnsyncedData = async () => {
            try {
                // Получаем данные из AsyncStorage
                const unsyncedData = await AsyncStorage.getItem(dataKey);
                if (unsyncedData) {
                    const token = await AsyncStorage.getItem('authToken');
                    const parsedData = JSON.parse(unsyncedData);

                    // Определяем тип запроса
                    if (method === 'POST') {
                        await axios.post(apiEndpoint, parsedData, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    } else if (method === 'PUT') {
                        await axios.put(apiEndpoint, parsedData, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    } else if (method === 'DELETE') {
                        await axios.delete(apiEndpoint, {
                            data: parsedData, // Передаем данные для удаления, если требуется
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    }

                    // Очистка синхронизированных данных
                    await AsyncStorage.removeItem(dataKey);

                    // Показываем уведомление об успешной синхронизации
                    showToast('Data synced successfully.', 'success' );
                }
            } catch (error) {
                console.log(`Failed to sync ${dataKey}. Will retry when connection is restored.`);
            }
        };

        // Подписываемся на изменения состояния сети
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected) {
                syncUnsyncedData();
            }
        });

        // Отписываемся от слушателя при размонтировании компонента
        return () => {
            unsubscribe();
        };
    }, [dataKey, apiEndpoint, successMessage, method]);

    return null;
};

export default SyncData;