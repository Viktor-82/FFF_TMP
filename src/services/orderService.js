import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateReservationResult, removeFromCart, updateProductStock } from '../redux/actions/cartActions';
// import Toast from 'react-native-toast-message';
import { showToast } from '../components/Shared/Notification';
// import store from '../redux/store';
import store from '../redux/store';

// Подтверждение заказа и старт таймера
export const confirmOrder = async (cartItems) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.post(
            'https://marketplace-usa-backend-1.onrender.com/api/orders/confirm',
            { items: cartItems },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const { result } = response.data;
        console.log(result, 'CALL FROM ORDER SERVICE');



        // Получаем список продуктов из Redux
        const state = store.getState();
        const products = state.product.items || [];

        // Создаем карту productId -> productName
        const productNameMap = {};
        for (const p of products) {
            productNameMap[p.id] = p.name;
        }

        // Дополняем result именами товаров
        // Если товар не найден в products, будет fallback ID:
        for (const productId of Object.keys(result)) {
            const pid = Number(productId);
            const productName = productNameMap[pid] || `ID:${productId}`;
            result[productId].productName = productName;
        }

        store.dispatch(updateReservationResult(result));

        const orderId = result.orderId;
        // const startTime = Date.now();
        // Запускаем отсчёт (например, 30 минут = 1800000 мс)
        // startPaymentCountdown(orderId, cartItems, store.dispatch, 1800000);
        startPaymentCountdown(orderId, cartItems, store.dispatch, 60000); // ставлю 3 минуты для теста.

        return response.data;
    } catch (error) {
        console.error('Ошибка при подтверждении заказа:', error);
        throw error;
    }
};

export const cancelReservation = async (orderId, reservationResult, dispatch) => {
    console.log("Store:", store);
    try {
        const token = await AsyncStorage.getItem('authToken');
        console.log('CALL FROM CANCEL RESERVATION');
        console.log("Переданный reservationResult:", reservationResult);

        const itemsToCancel = Object.entries(reservationResult).map(([productId, data]) => ({
            product_id: productId,
            reservedQuantity: data.reservedQuantity,
            reservationId: data.reservationId,
        }));
        console.log("Отправка данных на сервер для отмены резерва:", itemsToCancel);

        const response = await axios.post(
            'https://marketplace-usa-backend-1.onrender.com/api/orders/cancel-reservation',
            { orderId, items: itemsToCancel },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error("Ошибка отмены резерва на сервере");
        }

        console.log("Резерв успешно отменен на сервере:", response.data);

        // Очистить таймер
        const intervalId = store.getState().cart.paymentIntervalId;
        console.log('intervalId', intervalId);
        if (intervalId) {
            clearInterval(intervalId);
            dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: null });
            console.log('ТАЙМЕР ОТМЕНЫ РЕЗЕРВА ОЧИЩЕН');
        }

        Object.entries(reservationResult).forEach(([productId, data]) => {
            const currentStock = store.getState().cart.productStock[productId] || 0;
            store.dispatch(updateProductStock(Number(productId), currentStock));
        });

        // Очистка AsyncStorage
        await AsyncStorage.multiRemove(['orders', 'pageState', 'paymentCountdown']);
        console.log('AsyncStorage очищен');

        // Сброс reservationResult в Redux
        store.dispatch(updateReservationResult({}));
        showToast('The reservation was successfully canceled', 'success');
        // showToast('Order service', 'success');
    } catch (error) {
        console.error('Ошибка при отмене резерва:', error);
        console.log('CALL FROM ORDER SERVICE');
        showToast('Failed to cancel the reservation. Try again.', 'error');
    }
};

export const startPaymentCountdown = async (orderId, cartItems, dispatch, duration = 1800000) => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    await AsyncStorage.setItem(
        "paymentCountdown",
        JSON.stringify({ orderId, startTime, endTime, cartItems })
    );

    const intervalId = setInterval(async () => {
        const now = Date.now();
        const remainingTime = endTime - now;

        if (remainingTime <= 0) {
            clearInterval(intervalId);
            await AsyncStorage.removeItem("paymentCountdown");
            const reservationResult = store.getState().cart.reservationResult;
            await cancelReservation(orderId, reservationResult, dispatch);
            store.dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: null }); // Сброс в Redux
            showToast('The time for payment has expired. The order has been cancelled.', 'error');
        }
    }, 1000);

    // Сохранение идентификатора в Redux
    store.dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: intervalId });

    return intervalId;
};

export const saveOrderToLocalStorage = async (order) => {
    try {
        await AsyncStorage.setItem("orders", JSON.stringify([order]));
        console.log("Заказ успешно записан в AsyncStorage");
    } catch (error) {
        console.error("Ошибка при записи заказа в AsyncStorage:", error);
    }
};

export const getOrdersByStatus = async (status, farmId) => {
    console.log('getOrdersByStatus', status, farmId);
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
        throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
    }
    try {
        const response = await axios.get(
            `https://marketplace-usa-backend-1.onrender.com/api/orders/get-farm-orders`,
            {
                params: { status, farmId },
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('responseData', response.data);

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }
        return response.data; // Ожидаем массив заказов
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        throw error;
    }
};

export const changeOrdersStatus = async (status, orderFarmId, farmId) => {
    console.log('getOrdersByStatus', status, orderFarmId, farmId);
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
        throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
    }
    try {
        const response = await axios.get(
            `https://marketplace-usa-backend-1.onrender.com/api/orders/change-farm-orders-status`,
            {
                params: { status, orderFarmId, farmId },
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('changeOrdersStatus', response.data);

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }
        return response.data; // Ожидаем массив заказов
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        throw error;
    }
};