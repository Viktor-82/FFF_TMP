/**
 * AccountPage
 * Главный компонент для отображения страницы аккаунта пользователя.
 * Взаимодействует с компонентом AccountItem для отображения списка пунктов.
 * Реализует переход на соответствующие страницы при нажатии на пункты.
 *
 * Использует:
 * - AccountItem для отображения элементов списка.
 * - Redux для выхода из аккаунта (диспатч логики выхода).
 */

import React from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from "styled-components/native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import AccountItem from "../components/Account/AccountItem";
import { logoutUser } from "../redux/actions/userActions";
import BottomNavigation from "../components/Shared/BottomNavigation";

import PersonalDataIcon from "../img/account_page/personal_data_36.svg";
import AddressesIcon from "../img/account_page/addresses_36.svg";
import PaymentMethodIcon from "../img/account_page/payment_method_36.svg";
import MyOrdersIcon from "../img/account_page/my_orders_36.svg";
// import LanguageIcon from "../img/account_page/language_36.svg";
import HelpIcon from "../img/account_page/help_36.svg";
import PrivacyIcon from "../img/account_page/privacy_36.svg";
import LogOutIcon from "../img/account_page/log_out_36.svg";


// Стили для контейнера страницы
const AccountPageContainer = styled.View`
  height: 100%;
`;

const PageContainer = styled.View`
  flex: 1;
  padding: 20px 0;
  background-color: #FDFDFD;
`;

// Заголовок страницы
const Header = styled.Text`
  font-size: 28.8px; 
  font-weight: bold;
  margin-bottom: 20px; 
  padding-left: 40px; 
`;

// Список элементов
const ItemList = styled.View`
  margin-top: 20px; 
`;

const AccountPage = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const username = useSelector((state) => state.user.username);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigation.navigate("Login");
    };

    return (
        <AccountPageContainer>
            <PageContainer>
                <Header>{username || "User"}</Header>
                <ItemList>
                    <AccountItem
                        icon={<PersonalDataIcon width={36} height={36} />}
                        label="Personal data"
                        onClick={() => navigation.navigate('Profile')}
                    />
                    <AccountItem
                        icon={<AddressesIcon width={36} height={36} />}
                        label="Addresses"
                        onClick={() => navigation.navigate('MyAddress')}
                    />
                    <AccountItem
                        icon={<PaymentMethodIcon width={36} height={36} />}
                        label="Payment method"
                        onClick={() => navigation.navigate('PaymentMethod')}
                    />
                    <AccountItem
                        icon={<MyOrdersIcon width={36} height={36} />}
                        label="My orders"
                        onClick={() => navigation.navigate('Orders')}
                    />
                    {/*<AccountItem*/}
                    {/*    icon={<LanguageIcon width={36} height={36} />}*/}
                    {/*    label="Language"*/}
                    {/*    onClick={() => navigation.navigate('Language')}*/}
                    {/*/>*/}
                    <AccountItem
                        icon={<HelpIcon width={36} height={36} />}
                        label="Help"
                        onClick={() => navigation.navigate('Help')}
                    />
                    <AccountItem
                        icon={<PrivacyIcon width={36} height={36} />}
                        label="Privacy and data"
                        onClick={() => navigation.navigate('PrivacyAndData')}
                    />
                    <AccountItem
                        icon={<LogOutIcon width={36} height={36} />}
                        label="Log out"
                        onClick={handleLogout}
                    />
                </ItemList>
            </PageContainer>
            <BottomNavigation />
        </AccountPageContainer>
    );
};

export default AccountPage;
