// Importing necessary components from React Navigation library
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importing screen components from respective paths
import LogInMenu from "../Screens/LogInMenu";
import UserRegistration from "../Screens/UserRegistration";
import Collection from "../Screens/Collection";
import BookDetails from "../Screens/BookDetails";
import Scanner from "../Screens/Scanner";
import Settings from "../Screens/Settings";
import FilterBooks from "../Screens/FilterBooks";
import FilterModal from "../Screens/FilterModal";
import ForgotPassword from "../Screens/ForgotPassword";


const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogInMenu" >
        <Stack.Screen name="LogInMenu" component={LogInMenu} options={{ headerShown: false }} />
        <Stack.Screen name="UserRegistration" component={UserRegistration} options={{ headerShown: false }} />
        <Stack.Screen name="Collection" component={Collection} options={{ headerShown: false }} />
        <Stack.Screen name="BookDetails" component={BookDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Scanner" component={Scanner} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="FilterBooks" component={FilterBooks} options={{ headerShown: false }} />
        <Stack.Screen name="FilterModal" component={FilterModal} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

