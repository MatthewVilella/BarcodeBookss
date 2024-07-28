import React, { useEffect, } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal, } from "react-native";
import { CheckBox } from "react-native-elements";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useGlobal } from "../GlobalProvider";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Scanner from "./Scanner";

interface Data { [key: string]: string; };

const FilterModal: React.FC<{ navigation: any, closeCollectionFilter: any, applyFilter: any, closeBookFilter: any }> = ({ navigation, closeCollectionFilter, applyFilter, closeBookFilter, }) => {
    const {
        scannerModal,
        setScannerModal,
        arrayHolderFilter,
        setArrayHolderFilter,
        setDataSourceFilter,
        filterFavorites,
        filterAuthors,
        filterPublisher,
        filterCategories,
        filterPublishedDate,
        isCheckedFavorites,
        setIsCheckedFavorites,
        isCheckedAuthors,
        setIsCheckedAuthors,
        isCheckedCategories,
        setIsCheckedCategories,
        isCheckedPublishedDate,
        setIsCheckedPublishedDate,
        isCheckedPublisher,
        setIsCheckedPublisher,
        chooseTheme,
    } = useGlobal();

    const Apply = (isChecked: boolean, setChecked: any, filterFunction: Data[], category: string) => {
        setChecked(!isChecked);
        if (!isChecked) {
            if (filterFunction == filterFavorites) {
                if (arrayHolderFilter.some(item => item.hasOwnProperty("favorites"))) { return };
                arrayHolderFilter.push({ "favorites": "favorites" });
                return;
            }
            setArrayHolderFilter(arrayHolderFilter.concat(filterFunction));
        }
        else { setArrayHolderFilter(arrayHolderFilter.filter(item => !item.hasOwnProperty(category))); };
    };


    useEffect(() => { setDataSourceFilter(arrayHolderFilter); }, [arrayHolderFilter, setArrayHolderFilter]);

    const openScanner = () => { setScannerModal(true); };
    const closeScanner = () => { setScannerModal(false); };
    const closeFilter = (which: any, set: boolean) => { which(set); };

    const clearFilter = () => {
        setArrayHolderFilter([]);
        setIsCheckedFavorites(false);
        setIsCheckedAuthors(false);
        setIsCheckedCategories(false);
        setIsCheckedPublishedDate(false);
        setIsCheckedPublisher(false);
        setDataSourceFilter(arrayHolderFilter);
    };


    return (
        <SafeAreaProvider >
            <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).viewStyle}>
                <View style={chooseTheme(styles, darkTheme, lightTheme).backgroundImage}>
                    <View style={chooseTheme(styles, darkTheme, lightTheme).header}>
                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10, }} onPress={() => closeFilter(closeCollectionFilter, closeBookFilter)}>
                            <AntDesign name="back" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10, }} onPress={() => openScanner()}>
                            <MaterialCommunityIcons name="barcode-scan" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10, }} onPress={() => applyFilter()}>
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).applyText}>Apply</Text>
                        </TouchableOpacity>

                        <Modal visible={scannerModal} animationType="slide">
                            <Scanner closeScanner={closeScanner} navigation={navigation} />
                        </Modal>
                    </View>

                    <View style={chooseTheme(styles, darkTheme, lightTheme).filterBooksView}>
                        <Text style={chooseTheme(styles, darkTheme, lightTheme).filterBooksText}>Filter books</Text>
                    </View>

                    <View style={chooseTheme(styles, darkTheme, lightTheme).checkBoxView}>
                        <CheckBox
                            title="Favorites"
                            checked={isCheckedFavorites}
                            onPress={() => Apply(isCheckedFavorites, setIsCheckedFavorites, filterFavorites, "favorites")}
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
                            checkedColor={chooseTheme(styles, darkTheme, lightTheme).checkColor.color}
                            uncheckedColor={chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color}
                            titleProps={{ style: [chooseTheme(styles, darkTheme, lightTheme).checkColor.color, { color: isCheckedFavorites ? chooseTheme(styles, darkTheme, lightTheme).checkColor.color : chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color }], }}
                        />

                        <CheckBox
                            title="Authors"
                            checked={isCheckedAuthors}
                            onPress={() => Apply(isCheckedAuthors, setIsCheckedAuthors, filterAuthors, "authors")}
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
                            checkedColor={chooseTheme(styles, darkTheme, lightTheme).checkColor.color}
                            uncheckedColor={chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color}
                            titleProps={{ style: [chooseTheme(styles, darkTheme, lightTheme).checkColor.color, { color: isCheckedAuthors ? chooseTheme(styles, darkTheme, lightTheme).checkColor.color : chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color }], }}
                        />
                        <CheckBox
                            title="Categories"
                            checked={isCheckedCategories}
                            onPress={() => Apply(isCheckedCategories, setIsCheckedCategories, filterCategories, "categories")}
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
                            checkedColor={chooseTheme(styles, darkTheme, lightTheme).checkColor.color}
                            uncheckedColor={chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color}
                            titleProps={{ style: [chooseTheme(styles, darkTheme, lightTheme).checkColor.color, { color: isCheckedCategories ? chooseTheme(styles, darkTheme, lightTheme).checkColor.color : chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color }], }}
                        />
                        <CheckBox
                            title="Published Date"
                            checked={isCheckedPublishedDate}
                            onPress={() => Apply(isCheckedPublishedDate, setIsCheckedPublishedDate, filterPublishedDate, "publishedDate")}
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
                            checkedColor={chooseTheme(styles, darkTheme, lightTheme).checkColor.color}
                            uncheckedColor={chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color}
                            titleProps={{ style: [chooseTheme(styles, darkTheme, lightTheme).checkColor.color, { color: isCheckedPublishedDate ? chooseTheme(styles, darkTheme, lightTheme).checkColor.color : chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color }], }}
                        />
                        <CheckBox
                            title="Publisher"
                            checked={isCheckedPublisher}
                            onPress={() => Apply(isCheckedPublisher, setIsCheckedPublisher, filterPublisher, "publisher")}
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0, }}
                            checkedColor={chooseTheme(styles, darkTheme, lightTheme).checkColor.color}
                            uncheckedColor={chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color}
                            titleProps={{ style: [chooseTheme(styles, darkTheme, lightTheme).checkColor.color, { color: isCheckedPublisher ? chooseTheme(styles, darkTheme, lightTheme).checkColor.color : chooseTheme(styles, darkTheme, lightTheme).uncheckColor.color }], }}
                        />

                    </View>

                    <View style={chooseTheme(styles, darkTheme, lightTheme).clearButtonView}>
                        <TouchableOpacity onPress={() => clearFilter()}>
                            <Text style={chooseTheme(styles, darkTheme, lightTheme).clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        justifyContent: "center",
        flex: 1,
    },
    checkBoxView: {
        width: 300,
        height: 290,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: 30,
        borderWidth: 5,
        borderColor: "#f5f5f5",
        flexDirection: "column",
    },
    checkboxText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 15,
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: "#324d6f",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
        zIndex: 1,
    },
    button: {
        backgroundColor: "#949ba3",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
    },
    buttonIcon: {
        fontSize: 30,
        color: "#f5f5f5",
    },
    filterBooksText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 50,
    },
    filterBooksView: {
        alignItems: "center",
        marginBottom: 25,
        marginTop: 70
    },
    checkColor: {
        color: "#949ba3",
    },
    uncheckColor: {
        color: "#f5f5f5",
    },
    clearButtonView: {
        alignItems: "center",
        marginTop: 60
    },
    clearButton: {
        backgroundColor: "#949ba3",
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    clearButtonText: {
        fontWeight: "700",
        fontSize: 23,
        color: "#f5f5f5",
        backgroundColor: "#949ba3",
        padding: 10,
        borderRadius: 5,
    },
    applyText: {
        fontWeight: "700",
        fontSize: 23,
        color: "#f5f5f5",
    }

});

const darkTheme = StyleSheet.create({
    viewStyle: {
        justifyContent: "center",
        flex: 1,
    },
    checkBoxView: {
        width: 300,
        height: 290,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: 30,
        borderWidth: 5,
        borderColor: "#f5f5f5",
        flexDirection: "column",
    },
    checkboxText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 15,
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
        zIndex: 1,
    },
    button: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
    },
    buttonIcon: {
        fontSize: 30,
        color: "#000000",
    },
    filterBooksText: {
        color: "#f5f5f5",
        fontWeight: "700",
        fontSize: 50,
    },
    filterBooksView: {
        alignItems: "center",
        marginBottom: 25,
        marginTop: 70
    },
    checkColor: {
        color: "#949ba3",
    },
    uncheckColor: {
        color: "#f5f5f5",
    },
    clearButtonView: {
        alignItems: "center",
        marginTop: 60
    },
    clearButton: {
        backgroundColor: "#949ba3",
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    clearButtonText: {
        fontWeight: "700",
        fontSize: 23,
        color: "#000000",
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 5,
    },
    applyText: {
        fontWeight: "700",
        fontSize: 23,
        color: "#000000",
    }

});

const lightTheme = StyleSheet.create({
    viewStyle: {
        justifyContent: "center",
        flex: 1,
    },
    checkBoxView: {
        width: 300,
        height: 290,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginLeft: 30,
        borderWidth: 5,
        borderColor: "#000000",
        flexDirection: "column",
    },
    checkboxText: {
        color: "#000000",
        fontWeight: "700",
        fontSize: 15,
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
        zIndex: 1,
    },
    button: {
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        flex: 1,
    },
    buttonIcon: {
        fontSize: 30,
        color: "#f5f5f5",
    },
    filterBooksText: {
        color: "#000000",
        fontWeight: "700",
        fontSize: 50,
    },
    filterBooksView: {
        alignItems: "center",
        marginBottom: 25,
        marginTop: 70
    },
    checkColor: {
        color: "#949ba3",
    },
    uncheckColor: {
        color: "#000000",
    },
    clearButtonView: {
        alignItems: "center",
        marginTop: 60
    },
    clearButton: {
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    clearButtonText: {
        fontWeight: "700",
        fontSize: 23,
        color: "#f5f5f5",
        backgroundColor: "#000000",
        padding: 10,
        borderRadius: 5,
    },
    applyText: {
        fontWeight: "700",
        fontSize: 23,
        color: "#f5f5f5",
    }

});

export default FilterModal;
