import { AppRegistry } from 'react-native';
import Navigator from './src/routes/homeStack';
import client from './apolloClient';
import { AuthProvider } from './src/context/authContext';
import { ApolloProvider } from '@apollo/react-hooks';
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
