import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Modal, } from "react-native";
import { SearchBar } from "react-native-elements";
import { MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useGlobal } from "../GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FilterModal from "./FilterModal";

const FilterBooks: React.FC<{ navigation: any, }> = ({ navigation, }) => {
  const {
    bookInfo,
    arrayHolderFilter,
    setArrayHolderFilter,
    dataSourceFilter,
    setDataSourceFilter,
    arrayHolder,
    setDataSource,
    setIsCheckedFavorites,
    setIsCheckedAuthors,
    setIsCheckedCategories,
    setIsCheckedPublishedDate,
    setIsCheckedPublisher,
    chooseTheme, filterFavorites
  } = useGlobal();
  const [search, setSearch] = useState<string>("");
  const [filterModal2, setFilterModal2] = useState<boolean>(false);

  const filterCollection = async (filterProperty: string, filterValue: string) => {
    interface ImageData { [key: string]: string; };
    let imageData: ImageData[] = [];

    for (let i = 0; i < bookInfo.books.length; i++) {
      if (filterValue === "favorites") {
        const favoriteTitles = filterFavorites.map(fav => fav.title);

        bookInfo.books.forEach((book: { title: string; image: any; }) => {
          if (favoriteTitles.includes(book.title)) {
            const existsInImageData = imageData.some(obj => Object.keys(obj).includes(book.title));
            if (!existsInImageData) { imageData.push({ [book.title]: book.image }); }
          }
        });
        continue;
      }

      if (bookInfo.books[i][filterProperty].includes(filterValue)) {
        const existsInImageData = imageData.some(obj => Object.keys(obj).includes(bookInfo.books[i].title));
        if (!existsInImageData) { imageData.push({ [bookInfo.books[i].title]: bookInfo.books[i].image }); };
      }
    }
    setDataSource(imageData);
    navigation.navigate("Collection");
  };

  // Clears the search text and filters the data accordingly
  function clearFunction() {
    setSearch("");
    SearchFilterFunction("");
    AsyncStorage.setItem("favoriteList", "[]");
  };

  // Filters the data based on the search text
  function SearchFilterFunction(text: string) {
    const newData = arrayHolderFilter.filter(function (item: any) {
      const keys = Object.keys(item);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const keyData = key ? key.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        if (keyData.indexOf(textData) > -1) { return true; };
      }
      return false;
    });
    setDataSourceFilter(newData);
    setSearch(text);
  };

  const applyFilter = () => {
    setFilterModal2(false);
    setTimeout(() => navigation.navigate("FilterBooks"), 100);
  };

  // Renders a separator between list items
  function ListViewItemSeparator() { return (<View style={chooseTheme(styles, darkTheme, lightTheme).itemSeparator} />); };

  const openFilterModel = () => { setFilterModal2(true); };
  // const closeBookFilter = () => { setFilterModal2(false); };

  const closeFilter = () => {
    setIsCheckedFavorites(false);
    setIsCheckedAuthors(false);
    setIsCheckedCategories(false);
    setIsCheckedPublishedDate(false);
    setIsCheckedPublisher(false);
    setArrayHolderFilter([]);
    setDataSource(arrayHolder);
    navigation.navigate("Collection");
  };

  useEffect(() => { setDataSourceFilter(arrayHolderFilter); }, [arrayHolderFilter, setArrayHolderFilter]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={chooseTheme(styles, darkTheme, lightTheme).viewStyle}>
        <View style={chooseTheme(styles, darkTheme, lightTheme).backgroundImage}>
          <View style={chooseTheme(styles, darkTheme, lightTheme).container}>
            {/* Button for Settings */}
            <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginRight: 10 }} onPress={() => console.log(filterFavorites)}>
              <Ionicons name="settings-sharp" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button2 }} onPress={() => openFilterModel()}>
              <MaterialCommunityIcons name="filter" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
            </TouchableOpacity>

            {/* Button for opening barcode scanner */}
            <TouchableOpacity style={{ ...chooseTheme(styles, darkTheme, lightTheme).button, marginLeft: 10, }} onPress={() => closeFilter()}>
              <FontAwesome name="close" style={chooseTheme(styles, darkTheme, lightTheme).buttonIcon} />
            </TouchableOpacity>

            <Modal visible={filterModal2} animationType="slide" style={chooseTheme(styles, darkTheme, lightTheme).viewStyle2}>
              <FilterModal closeBookFilter={false} navigation={navigation} closeCollectionFilter={setFilterModal2} applyFilter={applyFilter} />
            </Modal>
          </View>

          {/* Search bar */}
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

          {/* Flat list for displaying the data */}
          <FlatList
            data={dataSourceFilter}
            ItemSeparatorComponent={ListViewItemSeparator}
            numColumns={3}
            columnWrapperStyle={chooseTheme(styles, darkTheme, lightTheme).columnWrapper}
            renderItem={({ item }) => {
              const key = Object.keys(item)[0];

              return (
                <TouchableOpacity style={chooseTheme(styles, darkTheme, lightTheme).bookContainer2} onPress={() => filterCollection(Object.keys(item)[1], key)}>
                  <Text style={chooseTheme(styles, darkTheme, lightTheme).textStyle2}>{key}</Text>
                </TouchableOpacity>
              );

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
  textStyle2: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5,
    color: "#f5f5f5",
  },
  container: {
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
    flexDirection: "column",
  },
  bookContainer2: {
    width: 75,
    height: 100,
    backgroundColor: "#949ba3",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
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
    alignItems: "center",
    flexDirection: "column",
  },
  filterModal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
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
  textStyle2: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5,
    color: "#000000",
  },
  container: {
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
    flexDirection: "column",
  },
  bookContainer2: {
    width: 75,
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
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
    alignItems: "center",
    flexDirection: "column",
  },
  filterModal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
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

  textStyle2: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5,
    color: "#f5f5f5",
  },
  container: {
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
    flexDirection: "column",
  },
  bookContainer2: {
    width: 75,
    height: 100,
    backgroundColor: "#000000",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
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
    alignItems: "center",
    flexDirection: "column",
  },
  filterModal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});


export default FilterBooks;