import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, Image, } from "react-native";
import { SearchBar } from "react-native-elements";
import { MaterialCommunityIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Scanner from "./Scanner"
import { useGlobal } from "../GlobalProvider"
import axios from "axios";
import FilterModal from "./FilterModal";
import { ROUTE_EIGHT, ROUTE_NINE, ROUTE_PORT, ROUTE_SEVEN } from '@env';

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

const Collection: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    scannerModal,
    setScannerModal,
    bookInfo,
    setBookInfo,
    arrayHolder,
    setArrayHolder,
    dataSource,
    setDataSource,
    setFilterAuthors,
    setFilterPublisher,
    setFilterCategories,
    setFilterPublishedDate,
    chooseTheme,
    setFilterFavorites,
    startInterval,
    apiPostUser,
    updateBookInfo, setUpdateBookInfo
  } = useGlobal();

  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterModal, setFilterModal] = useState<boolean>(false);

  let bookData: BookData = {
    title: '',
    authors: '',
    publisher: '',
    publishedDate: '',
    description: '',
    pageCount: '',
    categories: '',
    image: '',
  };

  const fetchUsersDataBase = () => {
    fetch(`http://${ROUTE_PORT}${ROUTE_SEVEN}`)
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false);
        setDataSource(responseJson);
        setArrayHolder(responseJson);

        let favoritesData: { [key: string]: string }[] = [];
        responseJson.forEach((item: any) => {
          if (item.favorites && !favoritesData.some(obj => obj.favorites === item.favorites)) {
            favoritesData.push({ title: item.favorites, favorites: "favorites", });
          };
        });
        setFilterFavorites(favoritesData);
      })
      .catch((error) => { console.error(error); });
  };

  const fetchBooks = async () => {
    let bookTitles = { titles: arrayHolder };
    try { const res = await axios.post(`http://${ROUTE_PORT}${ROUTE_EIGHT}`, bookTitles); }
    catch (error) { console.log(error); };
  };

  const fetchBookDetails = async (): Promise<void> => {
    try {
      const response = await fetch(`http://${ROUTE_PORT}${ROUTE_NINE}`);
      const responseJson = await response.json();
      let imageData: { [key: string]: string }[] = [];
      let categoriesData: { [key: string]: string }[] = [];
      let authorsData: { [key: string]: string }[] = [];
      let publisherData: { [key: string]: string }[] = [];
      let publishedDateData: { [key: string]: string }[] = [];

      if (responseJson && responseJson.books && responseJson.books.length > 0) {
        setBookInfo(responseJson);

        responseJson.books.forEach((book: { title: string; image: string; categories?: string[]; authors?: string[]; publisher: string, publishedDate: string }) => {
          imageData.push({ [book.title]: book.image });

          if (Array.isArray(book.categories)) {
            book.categories.forEach((category: string) => {
              if (!categoriesData.some(obj => Object.values(obj).includes(category))) { categoriesData.push({ [category]: category, categories: 'categories' }); };
            });
          };

          if (Array.isArray(book.authors)) {
            book.authors.forEach((author: string) => {
              if (!authorsData.some(obj => Object.values(obj).includes(author))) { authorsData.push({ [author]: author, authors: 'authors' }); };
            });
          };

          if (!publisherData.some(obj => Object.values(obj).includes(book.publisher))) { publisherData.push({ [book.publisher]: book.publisher, publisher: 'publisher' }); };

          if (!publishedDateData.some(obj => Object.values(obj).includes(book.publishedDate))) { publishedDateData.push({ [book.publishedDate]: book.publishedDate, publishedDate: 'publishedDate' }); };
        });
        setFilterAuthors(authorsData);
        setFilterCategories(categoriesData);
        setFilterPublisher(publisherData);
        setFilterPublishedDate(publishedDateData);
        setArrayHolder(imageData);
      };
    }
    catch (error) { console.error(error); };
  };

  const bookDetails = (bookClicked: string) => {
    for (let i = 0; i < bookInfo.books.length; i++) {
      if (bookInfo.books[i].title === bookClicked) {
        bookData = {
          title: bookInfo.books[i].title,
          authors: bookInfo.books[i].authors,
          publisher: bookInfo.books[i].publisher,
          publishedDate: bookInfo.books[i].publishedDate,
          description: bookInfo.books[i].description,
          pageCount: bookInfo.books[i].pageCount,
          categories: bookInfo.books[i].categories,
          image: bookInfo.books[i].image,
        };
        navigation.navigate('BookDetails', { bookData });
      };
    };
  };

  useEffect(() => {
    if (!updateBookInfo) {
      apiPostUser();
      fetchUsersDataBase();
      setDataSource(arrayHolder);
    };
  }, [ updateBookInfo]);

  useEffect(() => {
    fetchBooks();
    fetchBookDetails();
    setDataSource(arrayHolder);
    setUpdateBookInfo(false);
  }, [arrayHolder]);


  // Clears the search text and filters the data accordingly
  function clearFunction() {
    setSearch("");
    SearchFilterFunction("");
  };

  // Filters the data based on the search text
  function SearchFilterFunction(text: any) {
    const newData = arrayHolder.filter(function (item: any) {
      const keys = Object.keys(item);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const keyData = key ? key.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        if (keyData.indexOf(textData) > -1) { return true; };
      };
      return false;
    });
    setDataSource(newData);
    setSearch(text);
  };

  // Renders a separator between list items
  function ListViewItemSeparator() { return (<View style={chooseTheme(styles, darkTheme, lightTheme).itemSeparator} />); };

  // Renders a loading indicator while data is being fetched
  if (isLoading) { return (<View style={{ flex: 1, paddingTop: 21 }}><ActivityIndicator /></View>); };

  const openScanner = async () => { setScannerModal(true); };

  const closeScanner = () => { setScannerModal(false); };

  const openFilterModel = () => { setFilterModal(true); };

  const applyFilter = () => {
    setFilterModal(false);
    setTimeout(() => navigation.navigate("FilterBooks"), 100);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).viewStyle}>
        <View style={chooseTheme(styles, darkTheme, lightTheme).backgroundImage}>
          <View style={chooseTheme(styles, darkTheme, lightTheme).buttonContainer}>
            <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginRight: 10 }} onPress={() => navigation.navigate("Settings")}>
              <Ionicons name="settings-sharp" size={30} style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
            </TouchableOpacity>

            {dataSource.length < bookInfo.books.length ? (
              <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={() => navigation.navigate("FilterBooks")}>
                <AntDesign name="back" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={openFilterModel}>
                <MaterialCommunityIcons name="filter" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10, }} onPress={openScanner}>
              <MaterialCommunityIcons name="barcode-scan" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
            </TouchableOpacity>

            <Modal visible={scannerModal} animationType="slide">
              <Scanner closeScanner={closeScanner} navigation={navigation} />
            </Modal>

            <Modal visible={filterModal} animationType="slide" style={chooseTheme(styles, darkTheme, lightTheme).filterModal}>
              <FilterModal closeCollectionFilter={setFilterModal} navigation={navigation} closeBookFilter={false} applyFilter={applyFilter} />
            </Modal>
          </View>

          <SearchBar
            searchIcon={chooseTheme(styles, darkTheme, lightTheme).searchIcon}
            onChangeText={(text) => SearchFilterFunction(text)}
            onClear={() => clearFunction()}
            placeholder="Type Here to Search."
            placeholderTextColor={chooseTheme(styles, darkTheme, lightTheme).placeholderColor.color}
            value={search}
            containerStyle={chooseTheme(styles, darkTheme, lightTheme).searchContainerStyle}
            inputContainerStyle={chooseTheme(styles, darkTheme, lightTheme).searchInputContainerStyle}
            inputStyle={chooseTheme(styles, darkTheme, lightTheme).searchInputStyle}
            platform={"default"}
          />

          <FlatList
            data={dataSource}
            ItemSeparatorComponent={ListViewItemSeparator}
            numColumns={3}
            columnWrapperStyle={chooseTheme(styles, darkTheme, lightTheme).columnWrapper}
            renderItem={({ item }) => {
              const key = Object.keys(item)[0];
              const imageUrl = item[key];

              if (imageUrl !== "NO IMAGE") {
                return (
                  <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).bookContainer} onPress={() => bookDetails(key)}>
                    <View style={chooseTheme(styles, darkTheme, lightTheme).itemContainer}>
                      <Image style={chooseTheme(styles, darkTheme, lightTheme).imageStyle} source={{ uri: imageUrl }} />
                      <Text style={chooseTheme(styles, darkTheme, lightTheme).textStyle}>{key}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
              else {
                return (
                  <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).bookContainer2} onPress={() => bookDetails(key)}>
                    <Text style={chooseTheme(styles, darkTheme, lightTheme).textStyle2}>{key}</Text>
                  </TouchableOpacity>
                );
              }
            }}
            keyExtractor={(item, index) => index.toString()}
          />
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
  backgroundImage: {
    flex: 1,
    backgroundColor: "#324d6f",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 55
  },
  searchContainerStyle: {
    backgroundColor: "#949ba3",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInputContainerStyle: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  searchInputStyle: {
    color: "#324d6f",
  },
  searchIcon: {
    size: 25,
    color: "#949ba3",
  },
  placeholderColor: {
    color: "#949ba3",
  },
  textStyle: {
    color: "#f5f5f5",
    textAlign: "center",
    fontSize: 7,
    fontWeight: "bold",
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#f5f5f5',
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
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  itemSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  bookContainer: {
    width: 75,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 5,
    flexDirection: 'column',
  },
  bookContainer2: {
    width: 75,
    height: 100,
    backgroundColor: '#949ba3',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
    marginRight: 5,
  },
  imageStyle: {
    width: 75,
    height: 100,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  filterModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const darkTheme = StyleSheet.create({
  viewStyle: {
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
  searchContainerStyle: {
    backgroundColor: "#f5f5f5",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInputContainerStyle: {
    backgroundColor: "#000000",
    borderRadius: 8,
  },
  searchInputStyle: {
    color: "#f5f5f5",
  },
  searchIcon: {
    size: 25,
    color: "#f5f5f5",
  },
  placeholderColor: {
    color: "#f5f5f5",
  },
  textStyle: {
    color: "#f5f5f5",
    textAlign: "center",
    fontSize: 7,
    fontWeight: "bold",
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#000000',
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
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  itemSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  bookContainer: {
    width: 75,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 5,
    flexDirection: 'column',
  },
  bookContainer2: {
    width: 75,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
    marginRight: 5,
  },
  imageStyle: {
    width: 75,
    height: 100,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  filterModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const lightTheme = StyleSheet.create({
  viewStyle: {
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
  searchContainerStyle: {
    backgroundColor: "#000000",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInputContainerStyle: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  searchInputStyle: {
    color: "#000000",
  },
  searchIcon: {
    size: 25,
    color: "#000000",
  },
  placeholderColor: {
    color: "#000000",
  },
  textStyle: {
    color: "#000000",
    textAlign: "center",
    fontSize: 7,
    fontWeight: "bold",
  },
  textStyle2: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#f5f5f5',
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
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  itemSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#000000",
  },
  bookContainer: {
    width: 75,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 5,
    flexDirection: 'column',
  },
  bookContainer2: {
    width: 75,
    height: 100,
    backgroundColor: '#000000',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
    marginRight: 5,
  },
  imageStyle: {
    width: 75,
    height: 100,
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  filterModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});



export default Collection;