import React, { useEffect, useState } from 'react';
import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Tabs from '../components/Shared/Tabs';
import CommunityList from "../components/Community/CommunityList";
import { getCommunityInfo } from "../services/communityService";
import { fetchCommunityFailure, fetchCommunitySuccess } from "../redux/actions/communityActions";
import { showToast } from '../components/Shared/Notification';
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "../assets/styles/colors";
import BottomNavigation from "../components/Shared/BottomNavigation";

// Стили для контейнера страницы заказов
const CommunityPageContainer = styled(View)`
  flex: 1;
  background-color: #fff;
`;

const ScrollContainer = styled(ScrollView).attrs(() => ({
    contentContainerStyle: {
        padding: 18,
    },
}))`
  flex: 1;
`;

const CommunityPage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('plans');
    // const isLoading = useSelector((state) => state.community[activeTab]?.data.loading);
    const addresses = useSelector((state) => state.addresses?.list || []);
    const activeAddress = addresses.find((item) => item.isActive === true);
    const farmId = activeAddress?.farmId;

    useEffect(() => {
        if (!farmId) return;
        // dispatch(fetchOrdersRequest(activeTab));
        getCommunityInfo(activeTab, farmId)
            .then((data) => {
                dispatch(fetchCommunitySuccess(activeTab, data));
            })
            .catch((error) => {
                dispatch(fetchCommunityFailure(activeTab, error.message));
                console.error('Ошибка при загрузке информации community:', error);
            });
    }, [activeTab, farmId, dispatch]);

    const plans = useSelector((state) => state.community.plans);
    const reviews = useSelector((state) => state.community.reviews);
    const history = useSelector((state) => state.community.history);

    let current;
    if (activeTab === 'plans') {
        current = plans;
    } else if (activeTab === 'reviews') {
        current = reviews;
    } else {
        current = history;
    }

    // Обработка ошибок
    useEffect(() => {
        if (current.error) {
            showToast(<Text>Error loading info:: {current.error}</Text>, 'error');
        }
    }, [current.error]);

    // Сортируем публикации (от новых к старым)
    const sortedItems = Array.isArray(current.data?.items)
        ? [...current.data.items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

    const historyHasOne = history?.data?.items?.length >= 1;

    // Массив вкладок для компонента Tabs
    const tabs = [
        {
            title: <Text>Plans</Text>,
            content: <CommunityList items={sortedItems} addButton={true}/>,
        },
        {
            title: <Text>Reviews</Text>,
            content: <CommunityList items={sortedItems} />,
        },
        {
            title: <Text>History</Text>,
            content: <CommunityList items={sortedItems} addButton={true}/>,
        },
    ];

    // Преобразуем 'active'/'completed' в индекс: 0 = active, 1 = completed
    let activeIndex = 0;
    if (activeTab === 'plans') activeIndex = 0;
    else if (activeTab === 'reviews') activeIndex = 1;
    else if (activeTab === 'history') activeIndex = 2;

    // Функция, которую вызовет Tabs при клике на вкладку
    const handleTabChange = (newIndex) => {
        if (newIndex === 0) setActiveTab('plans');
        else if (newIndex === 1) setActiveTab('reviews');
        else setActiveTab('history');
    };

    if (current.data?.loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <CommunityPageContainer>
            <ScrollContainer keyboardShouldPersistTaps="handled">
                <Tabs
                    tabs={tabs}
                    isCommunity={true}
                    communityType={activeTab}
                    activeIndex={activeIndex}
                    onChange={handleTabChange}
                    history={historyHasOne}
                />
            </ScrollContainer>
            <BottomNavigation/>
        </CommunityPageContainer>
    );
};

export default CommunityPage;
