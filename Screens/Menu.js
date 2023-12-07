import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';

import Home from './Home';
import Analise from './Analise';
import Loja from './Loja';
import Perfil from './Perfil';
import Bonus from './Bonus'

const Tab = createBottomTabNavigator();

export default function Menu() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#FFF',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#BAE2B0',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, }) => (
              <AntDesign name="home" size={30} color={color} />
            ),
          }}
          />
          <Tab.Screen
          name="Bonus"
          component={Bonus}
          options={{
            headerShown: false,
            tabBarIcon: ({ color,}) => (
              <AntDesign name="gift" size={30} color={color} />
            ),
          }}/>
        <Tab.Screen
          name="Analise"
          component={Analise}
          options={{
            headerShown: false,
            tabBarIcon: ({ color,}) => (
              <AntDesign name="copy1" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Loja"
          component={Loja}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, }) => (
              <MaterialIcons name="add-shopping-cart" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfil}
          options={{
            headerShown: false,
            tabBarIcon: ({ color,}) => (
              <Feather name="user" size={30} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
