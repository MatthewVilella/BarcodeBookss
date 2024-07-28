// Importing necessary modules and components from React, React Native, and other libraries
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, Modal, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Scanner from "./Scanner";
import axios from "axios";
import { useGlobal } from "../GlobalProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ROUTE_FOUR, ROUTE_PORT, ROUTE_THREE, ROUTE_TWO } from '@env';

// Defining the interface for BookData
interface BookData {
    title: string;
    authors: string;
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: string;
    categories: string;
    image: string;
};

// Defining the type for route props
type CollectionRouteProp = RouteProp<{ params: { bookData: BookData } }, "params">;

// Functional component for displaying book details
const BookDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
    const {
        email,
        UID,
        scannerModal,
        setScannerModal,
        chooseTheme,
        filterFavorites,
        setUpdateBookInfo
    } = useGlobal();

    const [isFavorite, setIsFavorite] = useState<boolean>(true);
    const route = useRoute<CollectionRouteProp>();
    const { bookData } = route.params;

    // Function to add a book to favorites
    const addToFavorites = async () => {
        setUpdateBookInfo(true);
        const deleteBook = { userUidDeleting: UID, userDeleting: email, deleteBook: bookData.title };
        try { await axios.post(`http://${ROUTE_PORT}${ROUTE_THREE}`, deleteBook); }
        catch (error) { console.log(error); };
        setIsFavorite(false);
    };

    // Function to remove a book from favorites
    const removeFromFavorites = async () => {
        setUpdateBookInfo(true);
        const deleteBook = { userUidDeleting: UID, userDeleting: email, deleteBook: bookData.title };
        try { await axios.post(`http://${ROUTE_PORT}${ROUTE_FOUR}`, deleteBook); }
        catch (error) { console.log(error); };
        setIsFavorite(true);
    };

    // Function to delete a book
    const apiPostDeleteBook = async () => {
        setUpdateBookInfo(true);
        const deleteBook = { userUidDeleting: UID, userDeleting: email, deleteBook: bookData.title };
        try { await axios.post(`http://${ROUTE_PORT}${ROUTE_TWO}`, deleteBook); }
        catch (error) { console.log(error); };
    };

    // Function to open the scanner modal
    const openScanner = () => { setScannerModal(true); };

    // Function to close the scanner modal
    const closeScanner = () => { setScannerModal(false); };

    // Displays an alert to confirm the deletion of a book
    const deleteBook = () => {
        Alert.alert("Delete Book", `${bookData.title}`, [
            { text: "NO" },
            { text: "YES", onPress: () => { apiPostDeleteBook(); } },
        ]);
    };

    // Effect to set the favorite status of the book
    useEffect(() => {
        const favoriteTitles = filterFavorites.map(fav => fav.title);
        if (!favoriteTitles.includes(bookData.title)) { setIsFavorite(true); }
        else { setIsFavorite(false); };
    }, []);

    // Returning the JSX to render the book details screen
    return (
        <SafeAreaProvider>
            <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).backgroundImage}>
                <View style={chooseTheme(styles, darkTheme, lightTheme).buttonContainer}>
                    {/* Button for navigating back to the Collection */}
                    <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginRight: 10 }} onPress={() => navigation.navigate("Collection")}>
                        <Ionicons name="arrow-back-circle-sharp" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                    </TouchableOpacity>

                    {/* Button for adding or removing the book from favorites */}
                    {isFavorite ? (
                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={addToFavorites}>
                            <MaterialCommunityIcons name="star-check" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={removeFromFavorites}>
                            <MaterialCommunityIcons name="star-off" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                        </TouchableOpacity>
                    )}

                    {/* Button for opening the barcode scanner modal */}
                    <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10 }} onPress={openScanner}>
                        <MaterialCommunityIcons name="barcode-scan" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                    </TouchableOpacity>

                    {/* Modal for displaying the barcode scanner */}
                    <Modal visible={scannerModal} animationType="slide">
                        <Scanner navigation={navigation} closeScanner={closeScanner} />
                    </Modal>
                </View>

                {/* Display book title */}
                <Text style={chooseTheme(styles, darkTheme, lightTheme).title} minimumFontScale={2} adjustsFontSizeToFit numberOfLines={1}>{bookData.title}</Text>
                <Text style={chooseTheme(styles, darkTheme, lightTheme).author} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Author: {bookData.authors}</Text>

                {/* Display book image */}
                {bookData.image !== "NO IMAGE" ? (
                    <Image style={chooseTheme(styles, darkTheme, lightTheme).image} source={{ uri: bookData.image }} />
                ) : (
                    <View style={chooseTheme(styles, darkTheme, lightTheme).noImageContainer}>
                        <Text style={chooseTheme(styles, darkTheme, lightTheme).title} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>{bookData.image}</Text>
                    </View>
                )}

                {/* Display page count */}
                <Text style={chooseTheme(styles, darkTheme, lightTheme).pageCount} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Pages: {bookData.pageCount}</Text>

                {/* Display book description */}
                <View style={chooseTheme(styles, darkTheme, lightTheme).textContainer}>
                    <Text style={chooseTheme(styles, darkTheme, lightTheme).description} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={10}>{bookData.description}</Text>
                </View>

                {/* Display publisher information */}
                <Text style={chooseTheme(styles, darkTheme, lightTheme).publish} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Published by: {bookData.publisher}</Text>
                <Text style={chooseTheme(styles, darkTheme, lightTheme).publish} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Published date: {bookData.publishedDate}</Text>

                {/* Button for deleting the book */}
                <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).deleteContainer} onPress={deleteBook}>
                    <FontAwesome name="trash" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

// Defining the default styles
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: "#324d6f",
        justifyContent: "center",
        paddingHorizontal: 16,
        alignItems: "center"
    },
    image: {
        width: "50%",
        height: 250,
    },
    title: {
        fontSize: 20,
        marginBottom: 5,
        color: "#f5f5f5",
    },
    publish: {
        marginTop: 8,
        color: "#949ba3",
    },
    description: {
        color: "#f5f5f5",
    },
    textContainer: {
        maxWidth: "100%",
        alignItems: "center",
    },
    author: {
        marginBottom: 5,
        color: "#949ba3",
    },
    pageCount: {
        marginBottom: 3,
        marginTop: 3,
        color: "#949ba3",
    },
    deleteContainer: {
        backgroundColor: "#949ba3",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#949ba3",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
    },
    button2: {
        backgroundColor: "#949ba3",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonIcon: {
        fontSize: 30,
        color: "#f5f5f5",
    },
    noImageContainer: {
        width: "60%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },
})

// Defining the dark theme styles
const darkTheme = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        paddingHorizontal: 16,
        alignItems: "center"
    },
    image: {
        width: "50%",
        height: 250,
    },
    title: {
        fontSize: 20,
        marginBottom: 5,
        color: "#f5f5f5",
    },
    publish: {
        marginTop: 8,
        color: "#f5f5f5",
    },
    description: {
        color: "#f5f5f5",
    },
    textContainer: {
        maxWidth: "100%",
        alignItems: "center",
    },
    author: {
        marginBottom: 5,
        color: "#f5f5f5",
    },
    pageCount: {
        marginBottom: 3,
        marginTop: 3,
        color: "#f5f5f5",
    },
    deleteContainer: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
    },
    button2: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonIcon: {
        fontSize: 30,
        color: "#000000",
    },
    noImageContainer: {
        width: "60%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },
})

// Defining the light theme styles
const lightTheme = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        paddingHorizontal: 16,
        alignItems: "center"
    },
    image: {
        width: "50%",
        height: 250,
    },
    title: {
        fontSize: 20,
        marginBottom: 5,
        color: "#000000",
    },
    publish: {
        marginTop: 8,
        color: "#000000",
    },
    description: {
        color: "#000000",
    },
    textContainer: {
        maxWidth: "100%",
        alignItems: "center",
    },
    author: {
        marginBottom: 5,
        color: "#000000",
    },
    pageCount: {
        marginBottom: 3,
        marginTop: 3,
        color: "#000000",
    },
    deleteContainer: {
        backgroundColor: "#000000",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
    },
    button2: {
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonIcon: {
        fontSize: 30,
        color: "#f5f5f5",
    },
    noImageContainer: {
        width: "60%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },
})

export default BookDetails;
