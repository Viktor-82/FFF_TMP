import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";

export default function ToggleSwitch() {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: "#767577", true: "green" }} // Цвет фона
                thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}  // Цвет переключателя
                ios_backgroundColor="#3e3e3e" // Фон для iOS
                onValueChange={() => setIsEnabled(!isEnabled)}
                value={isEnabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
