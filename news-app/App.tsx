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

AppRegistry.registerComponent('X', () => App);


export default function App() {
  const context = useContext<IAuthContext>(AuthContext);
      

    useEffect(() => {
      const setUser = async () => {
        const token : string | null | undefined = await getData('token');
        console.log('awaited token', token);
    
        if (token) {
            const decodedToken : IToken = jwtDecode(token);
            console.log('123context', context, { username: decodedToken.username, email: decodedToken.email });
    
            if (decodedToken.exp * 1000 < Date.now()) {
                await storeData('token', undefined);
            } else {
                context.login({ username: decodedToken.username, email: decodedToken.email, token, password: '' });
            }
        }
      };
      setUser();
    }, []);

  return (
    <AuthProvider>
      <AuthConsumer>
        <ApolloProvider client={client}>
          <Navigator />
        </ApolloProvider>
      </AuthConsumer>
  </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
