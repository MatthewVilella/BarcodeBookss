import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Text, View, Alert, TouchableOpacity, Modal, Image, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Scanner from "./Scanner";
import axios from "axios";
import { useGlobal } from "../GlobalProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ROUTE_FOUR, ROUTE_PORT, ROUTE_THREE, ROUTE_TWO } from '@env';

// Defining the data structure for book information
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

// Type definition for route parameters expected by the component
type CollectionRouteProp = RouteProp<{ params: { bookData: BookData } }, "params">;

// Functional component to display details about a book
const BookDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
    // Global state and functions provided by the GlobalProvider
    const {
        email,
        UID,
        scannerModal,
        setScannerModal,
        chooseTheme,
        filterFavorites,
        setUpdateBookInfo,
    } = useGlobal();

    // Local state to track if the current book is marked as a favorite
    const [isFavorite, setIsFavorite] = useState<boolean>(true);

    // Extracting book data from the route parameters
    const route = useRoute<CollectionRouteProp>();
    const { bookData } = route.params;

    // Function to add the book to the user's list of favorites
    const addToFavorites = async () => {
        const deleteBook = { userUidDeleting: UID, userDeleting: email, deleteBook: bookData.title };
        if (Object.values(deleteBook).some(value => value === undefined || value === null)) return;
        setUpdateBookInfo(true);

        try { await axios.post(`http://${ROUTE_PORT}${ROUTE_THREE}`, deleteBook); }
        catch (error) { console.log(error); };
        setIsFavorite(false);
    };

    // Function to remove the book from the user's list of favorites
    const removeFromFavorites = async () => {
        const deleteBook = { userUidDeleting: UID, userDeleting: email, deleteBook: bookData.title };
        if (Object.values(deleteBook).some(value => value === undefined || value === null)) return;
        setUpdateBookInfo(true);

        try { await axios.post(`http://${ROUTE_PORT}${ROUTE_FOUR}`, deleteBook); }
        catch (error) { console.log(error); };
        setIsFavorite(true);
    };

    // Function to delete the book from the user's collection
    const apiPostDeleteBook = async () => {
        const deleteBook = { userUidDeleting: UID, userDeleting: email, deleteBook: bookData.title };
        if (Object.values(deleteBook).some(value => value === undefined || value === null)) return;

        try {
            await axios.post(`http://${ROUTE_PORT}${ROUTE_TWO}`, deleteBook);
            setUpdateBookInfo(true);
            navigation.navigate("Collection");
        }
        catch (error) { console.log(error); };
    };

    const openScanner = () => { setScannerModal(true); };
    const closeScanner = () => { setScannerModal(false); };

    const deleteBook = () => {
        Alert.alert("Delete Book", `${bookData.title}`, [
            { text: "NO" },
            { text: "YES", onPress: () => { apiPostDeleteBook(); } },
        ]);
    };

    // Effect hook to check if the book is already in the list of favorites
    useEffect(() => {
        const favoriteTitles = filterFavorites.map(fav => fav.title);
        setIsFavorite(!favoriteTitles.includes(bookData.title));
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).backgroundImage}>
                <View style={chooseTheme(styles, darkTheme, lightTheme).buttonContainer}>
                    {/* Button to navigate back to the collection screen */}
                    <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginRight: 10 }} onPress={() => navigation.navigate("Collection")}>
                        <Ionicons name="arrow-back-circle-sharp" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                    </TouchableOpacity>

                    {/* Button to add or remove the book from favorites */}
                    {isFavorite ? (
                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={addToFavorites}>
                            <MaterialCommunityIcons name="star-check" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={removeFromFavorites}>
                            <MaterialCommunityIcons name="star-off" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                        </TouchableOpacity>
                    )}

                    {/* Button to open the barcode scanner modal */}
                    <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10 }} onPress={openScanner}>
                        <MaterialCommunityIcons name="barcode-scan" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                    </TouchableOpacity>

                    {/* Modal to display the barcode scanner */}
                    <Modal visible={scannerModal} animationType="slide">
                        <Scanner navigation={navigation} closeScanner={closeScanner} />
                    </Modal>
                </View>

                {/* Displaying the book title */}
                <Text style={chooseTheme(styles, darkTheme, lightTheme).title} minimumFontScale={2} adjustsFontSizeToFit numberOfLines={1}>{bookData.title}</Text>
                <Text style={chooseTheme(styles, darkTheme, lightTheme).author} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Author: {bookData.authors}</Text>

                {/* Displaying the book cover image */}
                {bookData.image !== "NO IMAGE" ? (
                    <Image style={chooseTheme(styles, darkTheme, lightTheme).image} source={{ uri: bookData.image }} />
                ) : (
                    <View style={chooseTheme(styles, darkTheme, lightTheme).noImageContainer}>
                        <Text style={chooseTheme(styles, darkTheme, lightTheme).title} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>{bookData.image}</Text>
                    </View>
                )}

                {/* Displaying the page count of the book */}
                <Text style={chooseTheme(styles, darkTheme, lightTheme).pageCount} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Pages: {bookData.pageCount}</Text>

                {/* Displaying the description of the book */}
                <View style={chooseTheme(styles, darkTheme, lightTheme).textContainer}>
                    <Text style={chooseTheme(styles, darkTheme, lightTheme).description} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={10}>Description: {bookData.description}</Text>
                </View>

                {/* Displaying the publisher information */}
                <Text style={chooseTheme(styles, darkTheme, lightTheme).publish} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Published by: {bookData.publisher}</Text>
                <Text style={chooseTheme(styles, darkTheme, lightTheme).publish} minimumFontScale={0.7} adjustsFontSizeToFit numberOfLines={1}>Published date: {bookData.publishedDate}</Text>

                {/* Button to delete the book from the collection */}
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
