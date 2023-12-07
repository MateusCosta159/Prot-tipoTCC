import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login/Login';
import Cadastrar from './components/Login/Cadastrar';
import Menu from './components/Screens/Menu';
import { AuthProvider } from './components/contexts/AuthContext'; // Removendo o uso desnecessário do useAuth

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
