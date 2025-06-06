import { Dimensions, Platform } from "react-native";

function getDeviceType() {
    if (typeof window !== "undefined") {
        return window.innerWidth <= 768 ? "mobile" : "desktop";
    }

    if (typeof Platform !== "undefined") {
        const windowWidth = Dimensions.get("window").width;
        return Platform.OS === "ios" || Platform.OS === "android"
            ? (windowWidth <= 768 ? "mobile" : "desktop")
            : "desktop";
    }

    return "desktop";
}

export { getDeviceType };