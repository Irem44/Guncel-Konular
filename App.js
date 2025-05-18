import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomePage from "./screens/WelcomePage";
import GamePage from "./screens/GamePage";
import LevelSelectPage from "./screens/LevelSelectPage";
import GamePageM from "./screens/GamePageM";
import GamePageH from "./screens/GamePageH";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="LevelSelect" component={LevelSelectPage} />
        <Stack.Screen name="Game" component={GamePage} />
        <Stack.Screen name="GameM" component={GamePageM} />
        <Stack.Screen name="GameH" component={GamePageH} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
