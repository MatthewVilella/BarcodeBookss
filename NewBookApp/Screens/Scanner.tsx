import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useGlobal } from "../GlobalProvider";
import axios from "axios";
import { Camera, CameraType, FlashMode, BarCodeScanningResult } from "expo-camera/legacy";
import { ROUTE_ONE, ROUTE_PORT } from '@env';

const Scanner: React.FC<{ navigation: any, closeScanner: any, }> = ({ navigation, closeScanner, }) => {
    const [hasCameraPermission, setHasCameraPermission] = useState<any>(null);
    const [hasFlashPermission, setHasFlashPermission] = useState<any>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [torchOn, setTorchOn] = useState<boolean>(false);
    const [cameraType, setCameraType] = useState<any>(CameraType.back);
    const [startScanning, setStartScanning] = useState<boolean>(false);
    const { email, UID, updateBookInfo, setUpdateBookInfo } = useGlobal();

    type CustomBarCodeScanningResult = BarCodeScanningResult & { type: number; };

    // Function for barcode scanning
    const handleBarCodeScanned: (scanningResult: CustomBarCodeScanningResult) => void = (scanningResult) => {
        if (startScanning) {
            setScanned(true);
            //If barcode type is 32 the scan if not return.
            if (scanningResult.type === 32) {
                setStartScanning(false);
                let usersScannedData = { Upc: scanningResult.data, User: email, userUID: UID };

                if (Object.values(usersScannedData).some(value => value === undefined || value === null)) { return; };

                // Send scanned data to the server using axios
                const postScannedData = async () => {
                    try { const res = await axios.post(`http://${ROUTE_PORT}${ROUTE_ONE}`, usersScannedData); setUpdateBookInfo(true); }
                    catch (error) { console.log(error); };
                    setStartScanning(true);
                };

                // Display an alert asking the user to add the book to their collection
                Alert.alert(
                    "Book Scanned",
                    `Book with UPC Number  ${scanningResult.data}  has been scanned! Would you like to add it to your collection.`,
                    [
                        { text: "No", onPress: () => setStartScanning(true) },
                        { text: "Yes", onPress: () => postScannedData() },
                    ]
                );
            }
            else { Alert.alert("Item Scanned", "Not a Book", [{ text: "Close", onPress: () => setStartScanning(true) }]); };
        };
    };

    // Toggle the torch (flashlight) on/off
    const toggleTorch = () => { setTorchOn((prev: boolean) => !prev); };

    // Switch between front and back camera
    const toggleCamera = () => { setCameraType((current: CameraType) => (current === CameraType.back ? CameraType.front : CameraType.back)); };

    // Reference to the camera component
    const cameraRef = useRef(null);

    // Request camera and flash permissions on component mount
    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const flashStatus = await Camera.requestMicrophonePermissionsAsync();

            setHasCameraPermission(cameraStatus.status === "granted");
            setHasFlashPermission(flashStatus.status === "granted");
        })();
    }, []);

    // Handle camera and flashlight permissions states
    if (hasCameraPermission === null || hasFlashPermission === null) {
        return <TouchableOpacity onPress={closeScanner}>
            <Text>Requesting for camera and flashlight permissions</Text>
        </TouchableOpacity>;
    };

    if (hasCameraPermission === false || hasFlashPermission === false) { return <Text>No access to camera or flashlight</Text>; };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {/* Torch button to toggle flashlight */}
                    {hasFlashPermission && (
                        <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
                            {torchOn ? (
                                <Ionicons name="flash-off" size={30} color="#f5f5f5" />
                            ) : (
                                <Ionicons name="flash" size={30} color="#f5f5f5" />
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Camera switch button to toggle between front and back cameras */}
                    <TouchableOpacity style={styles.cameraSwitchButton} onPress={toggleCamera}>
                        {cameraType === CameraType.back ? (
                            <MaterialIcons name="camera-front" size={30} color="#f5f5f5" />
                        ) : (
                            <MaterialIcons name="camera-rear" size={30} color="#f5f5f5" />
                        )}
                    </TouchableOpacity>

                    {/* Close modal button */}
                    <TouchableOpacity style={styles.closeModalButton} onPress={closeScanner}>
                        <FontAwesome name="close" size={30} color="#f5f5f5" />
                    </TouchableOpacity>
                </View>

                {/* Camera component for barcode scanning */}
                <Camera
                    ref={cameraRef}
                    type={cameraType}
                    flashMode={torchOn ? FlashMode.torch : FlashMode.off}
                    onBarCodeScanned={handleBarCodeScanned as (scanningResult: BarCodeScanningResult) => void}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.crosshairContainer}>
                    {/* Crosshair design for better barcode scanning */}
                    <View style={styles.crosshair} />

                    {/* Start scanning button */}
                    {!startScanning && (
                        <TouchableOpacity style={styles.scanButtonContainer} onPress={() => setStartScanning(true)}>
                            <Text style={styles.textStyle}>Tap to Start</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#324d6f",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
        zIndex: 1,
    },
    crosshairContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    crosshair: {
        width: 250,
        height: 150,
        borderWidth: 2,
        borderColor: "white",
        backgroundColor: "transparent",
    },
    scanButtonContainer: {
        position: "absolute",
        bottom: 50,
        backgroundColor: "#949ba3",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    textStyle: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#f5f5f5",
    },
    closeModalButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    torchButton: {
        padding: 10,
        marginTop: 30,
        borderRadius: 5,
    },
    cameraSwitchButton: {
        padding: 10,
        marginTop: 30,
        borderRadius: 5,
    },
});



export default Scanner;