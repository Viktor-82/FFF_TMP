import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    FlatList,
    Image,
    useWindowDimensions,
    Button,
    Platform,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import ImagePicker from "react-native-image-crop-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto } from "../../redux/actions/newProductAction";

export default function CameraScreen() {
    const navigation = useNavigation();
    const cameraRef = useRef(null);
    console.log("Камера", Camera);
    console.log("Камера", useCameraDevices);

    console.warn("Before calling useCameraDevices()");
    const devices = useCameraDevices();
    console.warn("After calling useCameraDevices(), devices:", devices);

    const [hasPermission, setHasPermission] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [isDevicesLoaded, setIsDevicesLoaded] = useState(false);

    const dispatch = useDispatch();
    const { width, height } = useWindowDimensions();
    const isPortrait = height > width;

    const storedPhotos = useSelector((state) => state.newProduct.photo) || [];
    const totalPhotos = storedPhotos.length + photos.length;
    const isMaxPhotos = totalPhotos >= 5;

    useEffect(() => {
        if (devices && Object.keys(devices).length > 0) {
            setIsDevicesLoaded(true);
            console.log("Devices loaded:", devices);
        }
    }, [devices]);

    useEffect(() => {
        console.warn("=== useEffect for permissions STARTED ===");
        (async () => {
            const currentStatus = await Camera.getCameraPermissionStatus();
            console.log("Current camera permission status:", currentStatus);

            if (currentStatus !== "granted") {
                console.log("Requesting camera permission...");
                const newStatus = await Camera.requestCameraPermission();
                console.log("New camera permission status:", newStatus);
                setHasPermission(newStatus === "granted");
            } else {
                console.log("Already has camera permission");
                setHasPermission(true);
            }
        })();
    }, []);

    useEffect(() => {
        return () => {
            console.log("Cleaning up camera...");
        };
    }, []);

    useEffect(() => {
        console.log("All devices from useCameraDevices():", devices);
        if (devices?.back) {
            console.log("Back camera device found:", devices.back);
        } else {
            console.warn("No back camera device found!");
        }
    }, [devices]);

    const takePhoto = async () => {
        try {
            console.log("Attempting to take photo...");
            if (!cameraRef.current) {
                console.log("Camera ref is null, aborting");
                return;
            }

            const photo = await cameraRef.current.takePhoto({
                quality: 85,
                enableAutoRedEyeReduction: true,
            });
            console.log("Raw photo captured:", photo.path);

            console.log("Starting image cropping...");
            const croppedPhoto = await ImagePicker.openCropper({
                path: Platform.OS === "android" ? `file://${photo.path}` : photo.path,
                width: 800,
                height: 600,
                compressImageQuality: 0.8,
            });
            console.log("Cropped photo saved at:", croppedPhoto.path);

            setPhotos((prev) => [...prev, croppedPhoto.path]);
            console.log("Photo added to local state");
        } catch (error) {
            console.error("Error in takePhoto:", error);
            Alert.alert("Error", error.message);
        }
    };

    const handleDone = () => {
        console.log("Handling done with photos:", photos);
        if (photos.length === 0) {
            console.warn("No photos taken!");
            Alert.alert("No photos", "Please take at least one photo.");
            return;
        }

        const remainingSlots = 5 - storedPhotos.length;
        console.log("Remaining photo slots:", remainingSlots);

        const photosToAdd = photos.slice(0, remainingSlots);
        console.log("Dispatching photos:", photosToAdd);

        photosToAdd.forEach((photo) => dispatch(addPhoto(photo)));
        setPhotos([]);
        navigation.navigate("EditableWarehouse");
    };

    if (hasPermission === null) {
        console.warn("Rendering permission loading view");
        return (
            <View style={styles.loadingContainer}>
                <Text>Checking camera permission...</Text>
            </View>
        );
    }

    if (!hasPermission) {
        console.warn("Rendering no permission view");
        return (
            <View style={styles.loadingContainer}>
                <Text>Camera permission required</Text>
                <Button
                    title="Grant Permission"
                    onPress={async () => {
                        const newStatus = await Camera.requestCameraPermission();
                        setHasPermission(newStatus === "granted");
                    }}
                />
            </View>
        );
    }

    if (!isDevicesLoaded || !devices || devices.length === 0) {
        console.warn("Rendering camera loading view");
        return (
            <View style={styles.loadingContainer}>
                <Text>Initializing camera...</Text>
            </View>
        );
    }

    const device = devices.find((device) => device.position === "back");
    if (!device) {
        console.warn("No back camera found!");
        return (
            <View style={styles.loadingContainer}>
                <Text>No back camera found!</Text>
            </View>
        );
    }

    console.log("Rendering main camera view");
    return (
        <View style={{ flex: 1 }}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                video={false}
                enableZoomGesture={true}
                onInitialized={() => console.log("Camera initialized!")}
                onError={(error) => console.log("Camera error:", error)}
            />

            {isPortrait && (
                <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                        Use landscape mode for better results
                    </Text>
                </View>
            )}

            <FlatList
                data={photos}
                horizontal
                contentContainerStyle={styles.photoList}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={styles.previewImage}
                        onLoad={() => console.log("Preview image loaded:", item)}
                    />
                )}
            />

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.captureButton, isMaxPhotos && styles.disabledButton]}
                    onPress={takePhoto}
                    disabled={isMaxPhotos}
                >
                    <Text style={styles.buttonText}>
                        {isMaxPhotos ? "Max Reached (5/5)" : "Take Photo"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                    <Text style={styles.buttonText}>Done ({totalPhotos}/5)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    warningContainer: {
        position: "absolute",
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: "rgba(255, 165, 0, 0.8)",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    warningText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    photoList: {
        position: "absolute",
        bottom: 100,
        left: 0,
        right: 0,
    },
    previewImage: {
        width: 80,
        // height: 80,
        height: 60,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    buttonsContainer: {
        position: "absolute",
        bottom: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
    },
    captureButton: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 15,
        borderRadius: 50,
    },
    doneButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 50,
    },
    disabledButton: {
        backgroundColor: "gray",
    },
    buttonText: {
        color: "#fff",
    },
});