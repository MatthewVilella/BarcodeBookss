import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useGlobal } from "../GlobalProvider";
import React from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, Modal } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { signOut, } from "firebase/auth";
import { auth, } from "../FireBase";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROUTE_FIVE, ROUTE_PORT } from '@env';

const Settings: React.FC<{ navigation: any }> = ({ navigation }) => {
    const {
        email,
        resetUser,
        openForgetPassword,
        closeForgetPassword,
        forgetPasswordModal,
        setTheme,
        chooseTheme,
    } = useGlobal();

    const deleteUserAlert = () => {
        Alert.alert("Deleteing Account", `Once your Account is deleted all data regarding this account will be Gone. Are you sure you wish to procced?`, [
            { text: "YES", onPress: () => { deleteAccount(); } },
            { text: "No" },
        ]);
    };

    const deleteAccount = async () => {
        resetUser();
        navigation.replace("LogInMenu");
        const user = auth.currentUser;

        if (user) {
            const deleteUser = { deleteUserUID: user.uid, deleteUserEmail: user.email };
            user.delete();
            const res = await axios.post(`http://${ROUTE_PORT}${ROUTE_FIVE}`, deleteUser);
        }
        else { console.error("User not found"); };
    };

    const userSignOutAlert = () => {
        Alert.alert("Signing out", `Would you like to log out of your account?`, [
            { text: "Yes", onPress: () => { userSignOut(); } },
            { text: "No", },
        ]);
    };

    async function userSignOut() {
        try {
            const userCredential = await signOut(auth);
            resetUser();
            navigation.replace("LogInMenu");
        }
        catch (error: any) { throw error; };
    };

    const pickTheme = () => {
        Alert.alert("Choose Theme", `Select the theme you would like to display.`, [
            { text: "Default", onPress: () => { chosenTheme("default"); } },
            { text: "Dark", onPress: () => { chosenTheme("dark"); } },
            { text: "Light", onPress: () => { chosenTheme("light"); } },
        ]);
    };

    const chosenTheme = (themes: string) => {
        AsyncStorage.setItem("Theme", themes);
        setTheme(themes);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).container}>
                <View style={chooseTheme(styles, darkTheme, lightTheme).backgroundImage}>
                    <View style={chooseTheme(styles, darkTheme, lightTheme).acountInfo}>
                        <MaterialIcons
                            name="account-circle"
                            size={70}
                            color="#8e8e8e"
                            style={chooseTheme(styles, darkTheme, lightTheme).accountIcon}
                        />
                        <Text style={chooseTheme(styles, darkTheme, lightTheme).userName}>{email}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).optionsButton} onPress={() => pickTheme()}>
                            <MaterialCommunityIcons name="theme-light-dark" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).optionsText}>Themes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).optionsButton} onPress={() => userSignOutAlert()}>
                            <FontAwesome name="sign-out" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).optionsText} >Sign Out</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).optionsButton} onPress={() => openForgetPassword()}>
                            <MaterialIcons name="change-circle" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).optionsText}>Change Password</Text>
                        </TouchableOpacity>

                        <Modal visible={forgetPasswordModal} animationType="slide">
                            <ForgotPassword closeForgetPassword={closeForgetPassword} navigation={navigation} />
                        </Modal>

                        <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).optionsButton} onPress={() => navigation.navigate("Collection")}>
                            <AntDesign name="back" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).optionsText} >Exit</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => deleteUserAlert()}>
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).deleteAccountText} >Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: "#324d6f",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingTop: 55
    },
    acountInfo: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 120,
        marginTop: 30,
    },
    accountIcon: {
        color: "#949ba3"
    },
    userName: {
        fontSize: 20,
        color: "#f5f5f5"
    },
    optionsButton: {
        backgroundColor: "#949ba3",
        width: "100%",
        padding: 15,
        borderRadius: 20,
        marginBottom: 30,
        flexDirection: "row",
        bottom: 70,
    },
    optionsText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 22,
        textAlign: "center"
    },
    deleteAccountText: {
        color: "#949ba3",
        fontWeight: "700",
        fontSize: 20,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    buttonIcon: {
        fontSize: 30,
        color: "#f5f5f5",
        paddingRight: 5,
    },
});

const darkTheme = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingTop: 55
    },
    acountInfo: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 120,
        marginTop: 30,
    },
    accountIcon: {
        color: "#f5f5f5"
    },
    userName: {
        fontSize: 20,
        color: "#f5f5f5"
    },
    optionsButton: {
        backgroundColor: "#f5f5f5",
        width: "100%",
        padding: 15,
        borderRadius: 20,
        marginBottom: 30,
        flexDirection: "row",
        bottom: 70,
    },
    optionsText: {
        color: "#000000",
        fontWeight: "700",
        fontSize: 22,
        textAlign: "center"
    },
    buttonIcon: {
        fontSize: 30,
        color: "#000000",
        paddingRight: 5,
    },
    deleteAccountText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 20,
        textAlign: "center",
        textDecorationLine: "underline",
    },
});

const lightTheme = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingTop: 55
    },
    acountInfo: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 120,
        marginTop: 30,
    },
    accountIcon: {
        color: "#000000"
    },
    userName: {
        fontSize: 20,
        color: "#000000"
    },
    optionsButton: {
        backgroundColor: "#000000",
        width: "100%",
        padding: 15,
        borderRadius: 20,
        marginBottom: 30,
        flexDirection: "row",
        bottom: 70,
    },
    optionsText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 22,
        textAlign: "center"
    },
    deleteAccountText: {
        color: "#000000",
        fontWeight: "700",
        fontSize: 20,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    buttonIcon: {
        fontSize: 30,
        color: "#f5f5f5",
        paddingRight: 5,
    },
});


export default Settings;