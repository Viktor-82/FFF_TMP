import React from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/styles/colors";

// Импорт SVG-иконок
import CategoryIcon from "../../img/bottom_navigation/tb_category.svg";
import CategoryFilledIcon from "../../img/bottom_navigation/tb_category_filled.svg";
// import HomeIcon from "../../img/bottom_navigation/tb_home.svg";
// import HomeFilledIcon from "../../img/bottom_navigation/tb_home_filled.svg";
import ShoppingCartIcon from "../../img/bottom_navigation/tb_shopping_cart.svg";
import ShoppingCartFilledIcon from "../../img/bottom_navigation/tb_shopping_cart_filled.svg";
import HeartIcon from "../../img/bottom_navigation/tb_heart.svg";
import HeartFilledIcon from "../../img/bottom_navigation/tb_heart_filled.svg";
import UserIcon from "../../img/bottom_navigation/tb_user.svg";
import UserFilledIcon from "../../img/bottom_navigation/tb_user_filled.svg";
import StatsIcon from "../../img/bottom_navigation/io5_stats_chart_outline_ll.svg";
import StatsFilledIcon from "../../img/bottom_navigation/io5_stats_chart_ll.svg";
import CommunityIcon from "../../img/bottom_navigation/tb_message.svg";
import CommunityFilledIcon from "../../img/bottom_navigation/tb_message_filled.svg";

// Стили для тени
const shadowStyle = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    android: {
        elevation: 5,
    },
});

const BottomNavigation = () => {
    const navigation = useNavigation();
    const currentRoute = navigation.getState().routes[navigation.getState().index].name;

    const isActive = (routeName) => currentRoute === routeName;

    return (
        <View style={[styles.navigationContainer, shadowStyle]}>
            {/* Заказы */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Orders")}>
                {isActive("Orders") ? (
                    <ShoppingCartFilledIcon width={24} height={24} fill={colors.green.grass} />
                ) : (
                    <ShoppingCartIcon width={24} height={24} fill="none" stroke={colors.brown.lightEarth} strokeWidth={2} />
                )}
                <Text style={[styles.navText, isActive("Orders") && styles.activeText]}>Orders</Text>
            </TouchableOpacity>

            {/* Продукты */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Warehouse")}>
                {isActive("Warehouse") ? (
                    <CategoryFilledIcon width={24} height={24} fill={colors.green.grass} />
                ) : (
                    <CategoryIcon width={24} height={24} fill="none" stroke={colors.brown.lightEarth} strokeWidth={2} />
                )}
                <Text style={[styles.navText, isActive("Warehouse") && styles.activeText]}>Products</Text>
            </TouchableOpacity>

            {/* Статистика */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Stats")}>
                {isActive("Stats") ? (
                    <StatsFilledIcon width={24} height={23} fill={colors.green.grass} />
                ) : (
                    <StatsIcon width={24} height={23} fill="none" stroke={colors.brown.lightEarth} strokeWidth={2} />
                )}
                <Text style={[styles.navText, isActive("Stats") && styles.activeText]}>Stats</Text>
            </TouchableOpacity>

            {/* CommunityAddInfo */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Community")}>
                {isActive("Community") ? (
                    <CommunityFilledIcon width={24} height={24} fill={colors.green.grass} />
                ) : (
                    <CommunityIcon width={24} height={24} fill="none" stroke={colors.brown.lightEarth} strokeWidth={2} />
                )}
                <Text style={[styles.navText, isActive("Community") && styles.activeText]}>Community</Text>
            </TouchableOpacity>

            {/* Account */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Account")}>
                {isActive("Account") ? (
                    <UserFilledIcon width={24} height={24} fill={colors.green.grass} />
                ) : (
                    <UserIcon width={24} height={24} fill="none" stroke={colors.brown.lightEarth} strokeWidth={2} />
                )}
                <Text style={[styles.navText, isActive("Account") && styles.activeText]}>Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navigationContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.neutral.white,
        paddingVertical: 10,
        position: "absolute",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: colors.brown.lightEarth,
    },
    activeText: {
        color: colors.green.olive,
    },
});

export default BottomNavigation;

