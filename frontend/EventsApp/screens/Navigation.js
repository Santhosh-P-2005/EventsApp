import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AdminScreen from "./AdminScreen";
import SuperAdminScreen from "./SuperAdminScreen";
import AddEventScreen from "./AddEventsScreen";
import EditScreen from "./EditScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import UserScreen from "./UserScreen";

const Stack = createStackNavigator();

const Navigation = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
                <Stack.Screen name="Signup" component={SignupScreen}></Stack.Screen>
                <Stack.Screen name="User" component={UserScreen}></Stack.Screen>
                <Stack.Screen name="Admin" component={AdminScreen}></Stack.Screen>
                <Stack.Screen name="Superadmin" component={SuperAdminScreen}></Stack.Screen>
                <Stack.Screen name="AddEvent" component={AddEventScreen}></Stack.Screen>
                <Stack.Screen name="EditEvent" component={EditScreen}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;