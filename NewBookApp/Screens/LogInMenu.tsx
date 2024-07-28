import React, { useEffect, } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Modal, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CheckBox } from "react-native-elements";
import BarcodeImage from "../Images/barcode.jpg"
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useGlobal } from "../GlobalProvider";
import { signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { auth, } from "../FireBase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPassword from "./ForgotPassword";
import { useIsFocused } from "@react-navigation/native";

const LogInMenu: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isChecked,
    setChecked,
    resetUser,
    setUID,
    forgetPasswordModal,
    openForgetPassword,
    closeForgetPassword,
    setTheme,
    chooseTheme,
    apiPostUser,
  } = useGlobal();
  const isFocused = useIsFocused();


  async function logIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        const isEmailVerified = user.emailVerified;
        if (!isEmailVerified) {
          user.sendEmailVerification();
          userSignOut();
          setChecked(false);
          return Alert.alert("Account not verified", "Please check your email for instructions on of verifying your account.", [{ text: "Close" },]);
        };
      };

      if (isChecked) {
        AsyncStorage.setItem("checkBox", "true");
        AsyncStorage.setItem("email", email);
        AsyncStorage.setItem("password", password);
      }
      else {
        AsyncStorage.setItem("checkBox", "false");
        AsyncStorage.setItem("email", "");
        AsyncStorage.setItem("password", "");
      };
    }

    catch (error: any) {
      resetUser();
      setChecked(isChecked);
      if (error.code === "auth/user-not-found") {
        return Alert.alert("User account does not exist", "Create an account or Check that information entered was spelled correctly", [{ text: "Close" },]);
      };
      if (error.code === "auth/invalid-email") {
        return Alert.alert("Invalid Email", "Please enter a valid email address.", [{ text: "Close" },]);
      };
      if (error.code === "auth/wrong-password") {
        return Alert.alert("Incorrect Password", "The Password you have entered is Incorrect.", [{ text: "Close" },]);
      };
      if (error.code === "auth/missing-password") {
        return Alert.alert("Password Missing", "There is no Password entered.", [{ text: "Close" },]);
      };
      if (error.code === "auth/internal-error") {
        return Alert.alert("Server Error", "Please try again later.", [{ text: "Close" },]);
      };
      if (error.code === "auth/network-request-failed") {
        return Alert.alert("Network Connectivity Issue", "Check your internet connection or try again later..", [{ text: "Close" },]);
      };
      throw error;
    };
  };

  async function getLogInInfo() {
    try {
      const remeberState = await AsyncStorage.getItem("checkBox");
      if (remeberState == "true") {
        AsyncStorage.getItem("email").then((value) => { if (value != undefined || value != null) { setEmail(value); }; });
        AsyncStorage.getItem("password").then((value) => { if (value != undefined || value != null) { setPassword(value); }; });
      };
    }
    catch (error) { console.error("Error retrieving value:", error); };
  };

  async function autoLogIn() {
    const savedUserEmail = await AsyncStorage.getItem("email");
    const savedUserPassword = await AsyncStorage.getItem("password");
    if (savedUserEmail && savedUserPassword) {
      try { signInWithEmailAndPassword(auth, savedUserEmail, savedUserPassword); }
      catch (error) { console.error("Error authenticating user:", error); };
    }
  };

  async function userSignOut() {
    try { const userCredential = await signOut(auth); resetUser(); }
    catch (error: any) { throw error; };
  };

  const checkAuthState = auth.onAuthStateChanged((user) => {
    if (user) {
      if (user.email === email && user?.emailVerified === true) {
        setUID(user.uid);
        apiPostUser();
        navigation.replace("Collection");
      };
    };
  });

  const goToRegistrationScreen = async () => {
    resetUser();
    navigation.navigate("UserRegistration");
  };

  const getTheme = async () => {
    const theme = await AsyncStorage.getItem("Theme");
    if (theme) { setTheme(theme); };
  };


  useEffect(() => {
    if (isFocused) {
      getTheme();
      getLogInInfo();
      autoLogIn();
      checkAuthState();
    };
  }, []);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).container}>
        <View>
          <Text style={chooseTheme(styles, darkTheme, lightTheme).barcodeBooksText}>BarCodeBooks</Text>
        </View>

        <View>
          <Image source={BarcodeImage} style={{ width: 210, height: 50 }} />
        </View>

        <View style={chooseTheme(styles, darkTheme, lightTheme).inputContainer}>
          <View>
            <TextInput
              placeholder="Email"
              placeholderTextColor={chooseTheme(styles, darkTheme, lightTheme).placeholderColor.color}
              value={email}
              onChangeText={text => setEmail(text)}
              style={chooseTheme(styles, darkTheme, lightTheme).input}
            />
            <Fontisto
              name="email"
              size={20}
              color="#8e8e8e"
              style={chooseTheme(styles, darkTheme, lightTheme).icons}
            />
          </View>

          <View>
            <TextInput
              placeholder="Password"
              placeholderTextColor={chooseTheme(styles, darkTheme, lightTheme).placeholderColor.color}
              value={password}
              onChangeText={text => setPassword(text)}
              style={chooseTheme(styles, darkTheme, lightTheme).input}
              secureTextEntry
            />
            <MaterialIcons
              name="lock-outline"
              size={20}
              color="#8e8e8e"
              style={chooseTheme(styles, darkTheme, lightTheme).icons}
            />
          </View>
        </View>

        <View style={chooseTheme(styles, darkTheme, lightTheme).sideBySideContainer}>
          <CheckBox
            title="Remember me"
            checked={isChecked}
            onPress={() => setChecked(!isChecked)}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
            checkedColor={chooseTheme(styles, darkTheme, lightTheme).checkColor.color}
            uncheckedColor={chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color}
            titleProps={{ style: [chooseTheme(styles, darkTheme, lightTheme).checkboxText, { color: isChecked ? chooseTheme(styles, darkTheme, lightTheme).checkColor.color : chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color }], }}
          />

          <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).forgetPasswordButton} onPress={() => openForgetPassword()}>
            <Text style={chooseTheme(styles, darkTheme, lightTheme).forgetPasswordText}>Forget Password?</Text>
          </TouchableOpacity>

          <Modal visible={forgetPasswordModal} animationType="slide">
            <ForgotPassword closeForgetPassword={closeForgetPassword} navigation={navigation} />
          </Modal>
        </View>

        <View style={chooseTheme(styles, darkTheme, lightTheme).buttonContainer}>
          <TouchableOpacity onPress={() => logIn(email, password)} style={chooseTheme(styles, darkTheme, lightTheme).signInButton}>
            <Text style={chooseTheme(styles, darkTheme, lightTheme).signInText}>Sign in</Text>
          </TouchableOpacity>
          <Text style={chooseTheme(styles, darkTheme, lightTheme).orText}>or</Text>

          <TouchableOpacity onPress={() => goToRegistrationScreen()}>
            <Text style={chooseTheme(styles, darkTheme, lightTheme).registerText}>Register now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#324d6f",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 7,
    paddingLeft: 35,
  },
  icons: {
    position: "absolute",
    top: 20.5,
    left: 10,
    color: "#324d6f",
  },
  barcodeBooksText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 20,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  signInButton: {
    backgroundColor: "#949ba3",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  signInText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center"
  },
  orText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 15,
    paddingTop: 10
  },
  registerText: {
    color: "#949ba3",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    paddingTop: 5,
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  checkboxText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 15,
  },
  placeholderColor: {
    color: "#949ba3",
  },
  checkColor: {
    color: "#949ba3",
  },
  uncheckColor: {
    color: "#f5f5f5",
  },
  forgetPasswordButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingTop: 18,
  },
  forgetPasswordText: {
    color: "#949ba3",
    fontWeight: "700",
    fontSize: 15,
  },
});

const darkTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 7,
    paddingLeft: 35,
    color: "#000000",
  },
  icons: {
    position: "absolute",
    top: 20.5,
    left: 10,
    color: "#000000",
  },
  barcodeBooksText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 20,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  signInButton: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  signInText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center"
  },
  orText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 15,
    paddingTop: 10
  },
  registerText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    paddingTop: 5,
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkboxText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 15,
  },
  placeholderColor: {
    color: "#000000",
  },
  checkColor: {
    color: "#949ba3",
  },
  uncheckColor: {
    color: "#f5f5f5",
  },
  forgetPasswordButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingTop: 18,
  },
  forgetPasswordText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 15,
  },
});

const lightTheme = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#000000",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 7,
    paddingLeft: 35,
    color: "#f5f5f5",
  },
  icons: {
    position: "absolute",
    top: 20.5,
    left: 10,
    color: "#f5f5f5",
  },
  barcodeBooksText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 20,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  signInButton: {
    backgroundColor: "#000000",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  signInText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center"
  },
  orText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 15,
    paddingTop: 10
  },
  registerText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    paddingTop: 5,
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkboxText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 15,
  },
  placeholderColor: {
    color: "#f5f5f5",
  },
  checkColor: {
    color: "#949ba3",
  },
  uncheckColor: {
    color: "#000000",
  },
  forgetPasswordButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingTop: 18,
  },
  forgetPasswordText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 15,
  },
});




export default LogInMenu;