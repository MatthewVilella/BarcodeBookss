import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ROUTE_PORT, ROUTE_SIX } from '@env';

interface Data { [key: string]: string; };

interface GlobalContextProps {
  // Define your global state and functions here
  email: string;
  setEmail: (name: string) => void;
  password: string;
  setPassword: (name: string) => void;
  UID: string;
  setUID: (name: string) => void;
  isChecked: boolean;
  setChecked: (name: boolean) => void;
  authOnChange: string;
  setAuthOnChange: (name: string) => void;

  scannerModal: any;
  setScannerModal: (name: any) => void;
  forgetPasswordModal: boolean;
  setForgetPasswordModal: (name: boolean) => void;

  dataSource: Data[];
  setDataSource: (name: Data[]) => void;
  arrayHolder: Data[];
  setArrayHolder: (name: Data[]) => void;
  dataSourceFilter: Data[];
  setDataSourceFilter: (name: Data[]) => void;
  arrayHolderFilter: Data[];
  setArrayHolderFilter: (name: Data[]) => void;

  bookInfo: any;
  setBookInfo: (name: any) => void;
  updateBookInfo: boolean;
  setUpdateBookInfo: (name: boolean) => void;

  filterFavorites: Data[];
  setFilterFavorites: (name: Data[]) => void;
  filterAuthors: Data[];
  setFilterAuthors: (name: Data[]) => void;
  filterCategories: Data[];
  setFilterCategories: (name: Data[]) => void;
  filterPublishedDate: Data[];
  setFilterPublishedDate: (name: Data[]) => void;
  filterPublisher: Data[];
  setFilterPublisher: (name: Data[]) => void;

  isCheckedFavorites: boolean;
  setIsCheckedFavorites: (name: boolean) => void;
  isCheckedAuthors: boolean;
  setIsCheckedAuthors: (name: boolean) => void;
  isCheckedCategories: boolean;
  setIsCheckedCategories: (name: boolean) => void;
  isCheckedPublishedDate: boolean;
  setIsCheckedPublishedDate: (name: boolean) => void;
  isCheckedPublisher: boolean;
  setIsCheckedPublisher: (name: boolean) => void;

  theme: string;
  setTheme: (name: string) => void;

  resetUser: () => void;
  startInterval: (func1: any, func2: any) => any;
  apiPostUser: () => any;
  chooseTheme: (styles: any, darkTheme: any, lightTheme: any) => any;
  openForgetPassword: () => void;
  closeForgetPassword: () => void;
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

interface GlobalProviderProps { children: ReactNode; };

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children, }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [UID, setUID] = useState<string>("");
  const [isChecked, setChecked] = useState<boolean>(false);
  const [authOnChange, setAuthOnChange] = useState<string>("");

  const [scannerModal, setScannerModal] = useState<any>(false);
  const [forgetPasswordModal, setForgetPasswordModal] = useState<boolean>(false);

  const [bookInfo, setBookInfo] = useState<any>({ books: [] });
  const [updateBookInfo, setUpdateBookInfo] = useState<boolean>(false);

  const [theme, setTheme] = useState<string>("");

  const [dataSource, setDataSource] = useState<Data[]>([]);
  const [arrayHolder, setArrayHolder] = useState<Data[]>([]);
  const [dataSourceFilter, setDataSourceFilter] = useState<Data[]>([]);
  const [arrayHolderFilter, setArrayHolderFilter] = useState<Data[]>([]);

  const [filterFavorites, setFilterFavorites] = useState<Data[]>([]);
  const [filterAuthors, setFilterAuthors] = useState<Data[]>([]);
  const [filterCategories, setFilterCategories] = useState<Data[]>([]);
  const [filterPublishedDate, setFilterPublishedDate] = useState<Data[]>([]);
  const [filterPublisher, setFilterPublisher] = useState<Data[]>([]);

  const [isCheckedFavorites, setIsCheckedFavorites] = useState<boolean>(false);
  const [isCheckedAuthors, setIsCheckedAuthors] = useState<boolean>(false);
  const [isCheckedCategories, setIsCheckedCategories] = useState<boolean>(false);
  const [isCheckedPublishedDate, setIsCheckedPublishedDate] = useState<boolean>(false);
  const [isCheckedPublisher, setIsCheckedPublisher] = useState<boolean>(false);


  const resetUser = () => {
    AsyncStorage.setItem("checkBox", "false");
    AsyncStorage.setItem("email", "");
    AsyncStorage.setItem("password", "");
    AsyncStorage.setItem("favoriteList", "[]");
    setEmail("");
    setPassword("");
    setUID("");
  };

  const startInterval = (func1: any, func2: any) => {
    const interval = setInterval(() => {
      func1();
      func2();
    }, 420000);
  };

  const apiPostUser = async () => {
    let userInfo = { user: email, userUID: UID };
    try { const res = await axios.post(`http://${ROUTE_PORT}${ROUTE_SIX}`, userInfo); }
    catch (error) { console.log(error); };
  };


  const openForgetPassword = () => { setForgetPasswordModal(true); };

  const closeForgetPassword = () => { setForgetPasswordModal(false); };

  // Define a function to render the appropriate styles based on the state
  const chooseTheme = (styles: any, darkTheme: any, lightTheme: any): any => {
    switch (theme) {
      case "default":
        return styles;
      case "dark":
        return darkTheme;
      case "light":
        return lightTheme;
      default:
        return styles;
    };
  };

  const globalValues = {
    email, setEmail,
    password, setPassword,
    UID, setUID,
    isChecked, setChecked,
    authOnChange, setAuthOnChange,

    scannerModal, setScannerModal,
    forgetPasswordModal, setForgetPasswordModal,

    resetUser, openForgetPassword, closeForgetPassword, chooseTheme, startInterval, apiPostUser,

    bookInfo, setBookInfo,
    updateBookInfo, setUpdateBookInfo,

    theme, setTheme,

    arrayHolder, setArrayHolder,
    dataSource, setDataSource,
    dataSourceFilter, setDataSourceFilter,
    arrayHolderFilter, setArrayHolderFilter,

    filterFavorites, setFilterFavorites,
    filterAuthors, setFilterAuthors,
    filterCategories, setFilterCategories,
    filterPublishedDate, setFilterPublishedDate,
    filterPublisher, setFilterPublisher,

    isCheckedFavorites, setIsCheckedFavorites,
    isCheckedAuthors, setIsCheckedAuthors,
    isCheckedCategories, setIsCheckedCategories,
    isCheckedPublishedDate, setIsCheckedPublishedDate,
    isCheckedPublisher, setIsCheckedPublisher,

  };

  return <GlobalContext.Provider value={globalValues}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) { throw new Error("useGlobal must be used within a GlobalProvider"); };
  return context;
};
