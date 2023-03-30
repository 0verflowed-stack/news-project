import React, { useContext, useEffect } from 'react';
import NewsFeed from '../components/newsFeed';
import { AuthContext } from '../context/authContext';
import IAuthContext from '../interfaces/authContext';
import { View, StyleSheet, Text, Button, Pressable } from 'react-native';

interface IHomePageProps {
    navigation: any
}

const HomePage = ({ navigation } : IHomePageProps) : JSX.Element => {
    console.log('HomePage screen');
    console.debug("text");
    console.log('use11111r', 11111);
    const context = useContext<IAuthContext>(AuthContext);
    console.log('user', context, ' - ', context?.user);

    const loginHandler = () => {
        console.log('34user', context?.user);
        navigation.navigate('Login');
    };

    const registerHandler = () => {
        navigation.navigate('Register');
    };
    
    return (
       <>
        {context?.user ? (
            <>
                <Text>{context?.user?.email} is logined</Text>
                <NewsFeed/>
            </>
        ) : (
            <View style={styles.container}>
                <Text style={styles.text}>Log in to access news</Text>
                <Pressable
                    style={styles.button}
                    onPress={loginHandler}
                >
                    <Text style={styles.btnText}>Login</Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={registerHandler}
                >
                    <Text style={styles.btnText}>Register</Text>
                </Pressable>
            </View>
        )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '65%'
    },
    button: {
        margin: 5,
        marginLeft: '20%',
        marginRight: '20%',
        backgroundColor: '#007bff',
        borderRadius: 10,
        color: 'white',
        padding: 5
    },
    btnText: {
        color: 'white'
    },
    text: {
        alignSelf: 'center',
        justifyContent: 'center'
    }
});

export default HomePage;