import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Alert, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BarcodeImage from "../Images/barcode.jpg";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { auth, } from "../FireBase";
import { createUserWithEmailAndPassword, } from "firebase/auth";
import { useGlobal } from "../GlobalProvider"
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserRegistration: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    setChecked,
    resetUser,
    chooseTheme,
  } = useGlobal();

  // async function userSignOut() {
  //   try { const userCredential = await signOut(auth); resetUser(); }
  //   catch (error: any) { throw error; }
  // };

  async function signUpWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      AsyncStorage.setItem("favoriteList", "[]");

      if (user) {
        user.sendEmailVerification()
          .then(() => { Alert.alert("Verify Account", "Please check your email for instructions on of verifying your account.", [{ text: "Close" },]); })
          .catch((error) => { console.error("Error sending email verification:", error); });
      }
    }
    catch (error: any) {
      resetUser();

      if (error.code === "auth/email-already-in-use") {
        return Alert.alert("Email in Use", "An account using this email already exists.", [{ text: "Close" },]);
      };
      if (error.code === "auth/invalid-email") {
        return Alert.alert("Invalid Email", "Please enter a valid email address.", [{ text: "Close" },]);
      };
      if (error.code === "auth/weak-password") {
        return Alert.alert("Invalid Password Length", "The password must contain 6 or more characters", [{ text: "Close" },]);
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
    }
  };

  const goToLogInScreen = async () => { resetUser(); setChecked(false); navigation.navigate("LogInMenu"); };

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
              placeholder="Enter Email"
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
              placeholder="Create Password"
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

        <View style={chooseTheme(styles, darkTheme, lightTheme).buttonContainer}>
          <TouchableOpacity onPress={() => signUpWithEmailAndPassword(email, password)} style={chooseTheme(styles, darkTheme, lightTheme).createAccountButton}>
            <Text style={chooseTheme(styles, darkTheme, lightTheme).createAccountText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={chooseTheme(styles, darkTheme, lightTheme).orText}>or</Text>

          <TouchableOpacity onPress={() => goToLogInScreen()}>
            <Text style={chooseTheme(styles, darkTheme, lightTheme).haveAccountButton}>I already have an Account</Text>
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
  placeholderColor: {
    color: "#949ba3",
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
  createAccountButton: {
    backgroundColor: "#949ba3",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  createAccountText: {
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
  haveAccountButton: {
    color: "#949ba3",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    paddingTop: 5,
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
    color: "#000000"
  },
  placeholderColor: {
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
  createAccountButton: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  createAccountText: {
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
  haveAccountButton: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    paddingTop: 5,
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
  placeholderColor: {
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
  createAccountButton: {
    backgroundColor: "#000000",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  createAccountText: {
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
  haveAccountButton: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
    textDecorationLine: "underline",
    paddingTop: 5,
  },
});



export default UserRegistration;