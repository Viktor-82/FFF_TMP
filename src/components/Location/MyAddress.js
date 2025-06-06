import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showToast } from '../Shared/Notification';
import styled from 'styled-components/native';
import { colors } from '../../assets/styles/colors';
import { fetchAndSetDefaultAddress, activateAddress, deleteAddress } from '../../redux/actions/addressActions';
import { loadProductsData } from '../../services/productService';
import { clearCart } from '../../redux/actions/cartActions';
import Icon from 'react-native-vector-icons/Ionicons';

// Стилизованные компоненты
const MyAddressContainer = styled.View`
  width: 100%;
  padding: 10px;
  background-color: #FDFDFD;
  min-height: 100%;
`;

const BackButton = styled.TouchableOpacity`
  color: ${colors.green.grass};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const shadowStyles = Platform.select({
    ios: `
    shadow-color: rgba(0, 0, 0, 0.1);
    shadow-offset: 0px 4px;
    shadow-opacity: 1;
    shadow-radius: 12px;
  `,
    android: `
    elevation: 8;
  `,
});

const AddressCard = styled.TouchableOpacity`
  background-color: ${({ active }) => (active ? colors.green.grass : colors.neutral.white)};
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${shadowStyles};
`;

const AddressInfo = styled.View`
  color: ${({ active }) => (active ? colors.neutral.white : `#333`)};  
  flex: 1;
  flex-direction: column;
`;

const ActionIcons = styled.View`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-left: 10px;
`;

const StyledIcon = styled(Icon)`
  font-size: 20px;
  color: ${({ active }) => (active ? colors.neutral.white : colors.green.grass)};
  text-shadow: ${({ active }) =>
    active
        ? `-1px -1px 0 #fff, 
         1px -1px 0 #fff, 
        -1px  1px 0 #fff, 
         1px  1px 0 #fff`
        : 'none'};
`;

const AddAddressButton = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  background-color: ${colors.green.grass};
  color: ${colors.neutral.white};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  font-size: 16px;
  margin-top: 20px;
  align-items: center;
`;

const MyAddress = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const addresses = useSelector((state) => state.addresses.list);
    const activeAddressFromRedux = addresses.find((address) => address.isActive)?._id;
    const [activeAddressId, setActiveAddressId] = useState(null);

    const handleBack = () => {
        if (route.params?.fromLocationFormPage) {
            navigation.navigate('Home'); // Переход на главный экран
        } else {
            navigation.goBack(); // Возврат на предыдущий экран
        }
    };

    useEffect(() => {
        dispatch(fetchAndSetDefaultAddress());
    }, [dispatch]);

    useEffect(() => {
        if (activeAddressFromRedux) {
            setActiveAddressId(activeAddressFromRedux);
        }
    }, [activeAddressFromRedux]);

    useEffect(() => {
        if (activeAddressId) {
            const activeAddress = addresses.find((address) => address._id === activeAddressId);
            if (activeAddress && activeAddress.coordinates) {
                const userLocation = activeAddress.coordinates;
                const radiusInMiles = 10;
                loadProductsData(dispatch, userLocation, radiusInMiles);
            }
        }
    }, [activeAddressId, addresses, dispatch]);

    const handleActivateAddress = (id) => {
        if (id !== activeAddressId) {
            dispatch(clearCart());
            // Toast.show({
            //     type: 'info',
            //     text1: 'Your cart has been cleared due to address change.',
            // });
            showToast('Your cart has been cleared due to address change.', 'info');
            setActiveAddressId(id);
            dispatch(activateAddress(id));
            // Toast.show({
            //     type: 'success',
            //     text1: 'Active address selected for nearby products',
            // });
            showToast('Active address selected for nearby products', 'success');
        } else {
            // Toast.show({
            //     type: 'info',
            //     text1: 'This address is already active.',
            // });
            showToast('This address is already active.', 'info');
        }
    };

    const handleEditAddress = (id) => {
        navigation.navigate('LocationForm', { id });
    };

    const handleDeleteAddress = (id) => {
        Alert.alert(
            'Are you sure?', // Заголовок
            'This action cannot be undone.', // Сообщение
            [
                { text: 'Cancel', style: 'cancel' }, // Кнопка "Отмена"
                { text: 'Delete', onPress: () => dispatch(deleteAddress(id)) }, // Кнопка "Удалить"
            ]
        );
    };

    const handleAddNewAddress = () => {
        if (addresses.length < 5) {
            navigation.navigate('LocationForm');
        }
    };

    return (
        <MyAddressContainer>
            <BackButton onPress={handleBack}>
                <Icon name="arrow-undo-outline" size={24} color={colors.green.grass} />
            </BackButton>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, paddingLeft: 20 }}>My Farm Address</Text>
            {/*{addresses.filter(address => address.address).map((address) => (*/}
            {addresses.filter(address => address.fullAddress).map((address) => (
                <AddressCard
                    key={address._id}
                    active={address._id === activeAddressId}
                    onPress={() => handleActivateAddress(address._id)}
                >
                    <AddressInfo active={address._id === activeAddressId}>
                        <Text style={{ fontWeight: 'bold', color: address._id === activeAddressId ? colors.neutral.white : '#333' }}>
                            {/*{address.label}*/}
                            {address.farmName}
                        </Text>
                        <Text style={{ color: address._id === activeAddressId ? colors.neutral.white : '#333' }}>
                            {/*{address.address}*/}
                            {address.fullAddress}
                        </Text>
                    </AddressInfo>
                    <ActionIcons>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                handleEditAddress(address._id);
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>✏️</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity*/}
                        {/*    onPress={(e) => {*/}
                        {/*        e.stopPropagation();*/}
                        {/*        handleDeleteAddress(address._id);*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Text style={{ fontSize: 20 }}>🗑️</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </ActionIcons>
                </AddressCard>
            ))}
            <AddAddressButton
                onPress={handleAddNewAddress}
                disabled={addresses.length >= 3}
            >
                <Text style={{ color: colors.neutral.white, fontSize: 16 }}>Add New Farm</Text>
            </AddAddressButton>
        </MyAddressContainer>
    );
};

export default MyAddress;