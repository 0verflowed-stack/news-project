import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from './src/pages/homePage';
import Login from './src/pages/login';
import { AppRegistry, Platform } from 'react-native';
import Navigator from './src/routes/homeStack';
import client from './apolloClient';
import { AuthContext, AuthProvider } from './src/context/authContext';
import { ApolloProvider } from '@apollo/react-hooks';
import IAuthContext from './src/interfaces/authContext';
import { getData, storeData } from './src/storage';
import jwtDecode from 'jwt-decode';
import IToken from './src/interfaces/token';
import AuthConsumer from './src/components/authConsumer';
import store from './src/store';
import { Provider } from 'react-redux';

AppRegistry.registerComponent('X', () => App);


export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthConsumer>
          <ApolloProvider client={client}>
            <Navigator />
          </ApolloProvider>
        </AuthConsumer>
      </AuthProvider>
    </Provider>
  );
}
