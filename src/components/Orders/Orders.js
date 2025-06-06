import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
} from '../../redux/actions/orderActions';
import { getOrdersByStatus } from '../../services/orderService';
import OrderList from './OrderList';
import Tabs from '../Shared/Tabs';
import { showToast } from '../Shared/Notification';

const Orders = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('new');
    const addresses = useSelector((state) => state.addresses?.list || []);
    const activeAddress = addresses.find((item) => item.isActive === true);
    const farmId = activeAddress?.farmId;

    useEffect(() => {
        if (!farmId) return;
        dispatch(fetchOrdersRequest(activeTab));
        getOrdersByStatus(activeTab, farmId)
            .then((orders) => {
                dispatch(fetchOrdersSuccess(activeTab, orders));
            })
            .catch((error) => {
                dispatch(fetchOrdersFailure(activeTab, error.message));
                console.error('Ошибка при загрузке заказов:', error);
            });
    }, [activeTab, farmId, dispatch]);

    const newOrders     = useSelector((state) => state.orders.newOrders);
    const packedOrders  = useSelector((state) => state.orders.packedOrders);
    const shippedOrders = useSelector((state) => state.orders.shippedOrders);

    let currentOrders;
    if (activeTab === 'new') {
        currentOrders = newOrders;
    } else if (activeTab === 'packed') {
        currentOrders = packedOrders;
    } else {
        currentOrders = shippedOrders;
    }

    // Обработка ошибок
    useEffect(() => {
        if (currentOrders.error) {
            showToast(<Text>Error loading orders:: {currentOrders.error}</Text>, 'error');
        }
    }, [currentOrders.error]);

    // Сортируем заказы (от новых к старым)
    const sortedOrders = [...currentOrders.data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Массив вкладок для компонента Tabs
    const tabs = [
        {
            title: <Text>New</Text>,
            content: <OrderList orders={sortedOrders} />,
        },
        {
            title: <Text>Packed</Text>,
            content: <OrderList orders={sortedOrders} />,
        },
        {
            title: <Text>Shipped</Text>,
            content: <OrderList orders={sortedOrders} />,
        },
    ];

    // Преобразуем 'active'/'completed' в индекс: 0 = active, 1 = completed
    let activeIndex = 0;
    if (activeTab === 'new') activeIndex = 0;
    else if (activeTab === 'packed') activeIndex = 1;
    else if (activeTab === 'shipped') activeIndex = 2;


    // Функция, которую вызовет Tabs при клике на вкладку
    const handleTabChange = (newIndex) => {
        if (newIndex === 0) setActiveTab('new');
        else if (newIndex === 1) setActiveTab('packed');
        else setActiveTab('shipped');
    };


    // if (currentOrders.loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                tabs={tabs}
                activeIndex={activeIndex}
                onChange={handleTabChange}
            />
        </View>
    );
};

export default Orders;