import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "react-native-vector-icons/Fontisto";
import { auth } from "../FireBase";
import { useGlobal } from "../GlobalProvider";

const ForgotPassword: React.FC<{ navigation: any, closeForgetPassword: any }> = ({ navigation, closeForgetPassword }) => {
  const [textInputValue, setTextInputValue] = useState("");
  const { chooseTheme } = useGlobal();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const instructions = async (email: string) => {
    auth.sendPasswordResetEmail(email);
    return Alert.alert("Email Sent", "Please check your email for instructions on changing your password.", [{ text: "Close" },]);
  };

  const forgotPassword = async (email: string) => {
    if (validateEmail(email)) { instructions(email); }
    else { return Alert.alert("Invalid Email", "Please enter a valid email address.", [{ text: "Close" },]); };
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).container}>
        <View>
          <Text style={chooseTheme(styles, darkTheme, lightTheme).forgotPasswordText}>Forgot Your Password?</Text>
        </View>
        <View>
          <Text style={chooseTheme(styles, darkTheme, lightTheme).instructionsText}>Enter your email and we will send you instructions to reset your password. </Text>
        </View>

        <View style={chooseTheme(styles, darkTheme, lightTheme).inputContainer}>
          <View>
            <TextInput
              placeholder="Email"
              placeholderTextColor={chooseTheme(styles, darkTheme, lightTheme).placeholderColor.color}
              value={textInputValue}
              onChangeText={text => setTextInputValue(text)}
              style={chooseTheme(styles, darkTheme, lightTheme).input}
            />
            <Fontisto
              name="email"
              size={20}
              color="#8e8e8e"
              style={chooseTheme(styles, darkTheme, lightTheme).icons}
            />
          </View>
        </View>

        <View style={chooseTheme(styles, darkTheme, lightTheme).buttonContainer}>
          <TouchableOpacity onPress={() => forgotPassword(textInputValue)} style={chooseTheme(styles, darkTheme, lightTheme).changePasswordButton}>
            <Text style={chooseTheme(styles, darkTheme, lightTheme).changePasswordText}>Change Password</Text>
          </TouchableOpacity>

          <Text style={chooseTheme(styles, darkTheme, lightTheme).orText}>or</Text>

          <TouchableOpacity onPress={() => closeForgetPassword()} >
            <Text style={chooseTheme(styles, darkTheme, lightTheme).closeText}>Close</Text>
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
  placeholderColor: {
    color: "#949ba3",
  },
  icons: {
    position: "absolute",
    top: 20.5,
    left: 10,
    color: "#324d6f",
  },
  forgotPasswordText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 35,
    marginBottom: 20,
  },
  instructionsText: {
    color: "#f5f5f5",
    fontWeight: "100",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  changePasswordButton: {
    backgroundColor: "#949ba3",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  changePasswordText: {
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
  closeText: {
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
  forgotPasswordText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 35,
    marginBottom: 20,
  },
  instructionsText: {
    color: "#f5f5f5",
    fontWeight: "100",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  changePasswordButton: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  changePasswordText: {
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
  closeText: {
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
    color: "#f5f5f5"
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
  forgotPasswordText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 35,
    marginBottom: 20,
  },
  instructionsText: {
    color: "#000000",
    fontWeight: "100",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  changePasswordButton: {
    backgroundColor: "#000000",
    width: "100%",
    padding: 15,
    borderRadius: 20,
  },
  changePasswordText: {
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
  closeText: {
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
});


export default ForgotPassword;