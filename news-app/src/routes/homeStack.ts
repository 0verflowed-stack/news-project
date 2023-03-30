import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../pages/homePage';
import Login from '../pages/login';
import Register from '../pages/register';

const screens = {
    Home: {
        screen: Home
    },
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    }
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);