import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage'; // Корзина
// import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import FAQPage from './pages/FAQPage';
import ContactUsPage from './pages/ContactUsPage';
import WelcomeSlider from './components/Slider/WelcomeSlider';
import GoogleAuthHandler from './components/Auth/GoogleAuthHandler';
// import storage from './utils/storage';
import LocationFormPage from "./pages/LocationFormPage";
import LocationPermissionPage from "./pages/LocationPermissionPage";
import MyAddressPage from "./pages/MyAddressPage";
import CategoriesPage from "./pages/CategoriesPage";
import MyEssentialsPage from "./pages/MyEssentialsPage";
import AccountPage from "./pages/AccountPage";
import SubcategoryProductsPage from "./pages/SubcategoryProductsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import UploadPage from "./pages/UploadPage";
import StripeConnectPage from "./pages/StripeConnectPage";
import StripeSuccessPage from "./pages/StripeSuccessPage";
import StripeRefreshPage from "./pages/StripeRefreshPage";
import WarehousePage from "./pages/WarehousePage";
import EditableWarehousePage from "./pages/EditableWarehousePage";
import CameraScreen from "./components/Camera/CameraScreen";
import PrintLabelScreenPage from "./pages/PrintLabelScreenPage";
import SalesStatisticsPage from "./pages/SalesStatisticsPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityAddInfoPage from "./pages/CommunityAddInfoPage";
import CommunityCameraScreen from"./components/Community/CommunityCameraScreen"

const Stack = createStackNavigator();

const AppRoutes = () => {
    const [isNewUser, setIsNewUser] = useState(null);
    console.log('call from routes');

    useEffect(() => {
        const checkIfVisited = async () => {
            const hasVisited = await AsyncStorage.getItem('hasVisited');
            setIsNewUser(!hasVisited);  // Если визита не было, помечаем как нового пользователя
            if (!hasVisited) {
                await AsyncStorage.setItem('hasVisited', 'true');  // Помечаем пользователя как "не нового" после показа слайдера
            }
        };

        checkIfVisited();
    }, []);

    if (isNewUser === null) return null;

    return (
            <Stack.Navigator initialRouteName={isNewUser ? 'WelcomeSlider' : 'Login'}>
                <Stack.Screen
                    name="WelcomeSlider"
                    component={WelcomeSlider}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Products"
                    component={ProductPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProductDetail"
                    component={ProductPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Cart"
                    component={CartPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfilePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Orders"
                    component={OrdersPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Warehouse"
                    component={WarehousePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditableWarehouse"
                    component={EditableWarehousePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CameraScreen"
                    component={CameraScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="FAQ"
                    component={FAQPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Contact"
                    component={ContactUsPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="NotFound"
                    component={NotFoundPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="GoogleAuthHandler"
                    component={GoogleAuthHandler}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LocationPermission"
                    component={LocationPermissionPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LocationForm"
                    component={LocationFormPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Upload"
                    component={UploadPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StripeConnect"
                    component={StripeConnectPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StripeSuccess"
                    component={StripeSuccessPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StripeRefresh"
                    component={StripeRefreshPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MyAddress"
                    component={MyAddressPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Categories"
                    component={CategoriesPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MyEssentials"
                    component={MyEssentialsPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Account"
                    component={AccountPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SubcategoryProducts"
                    component={SubcategoryProductsPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SearchResults"
                    component={SearchResultsPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PrintLabel"
                    component={PrintLabelScreenPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Stats"
                    component={SalesStatisticsPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Community"
                    component={CommunityPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CommunityAddInfo"
                    component={CommunityAddInfoPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CommunityCamera"
                    component={CommunityCameraScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
    );
};

export default AppRoutes;
