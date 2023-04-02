import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'graphql-tag';
import IAuthContext from '../interfaces/authContext';
import { GraphQLErrors } from '@apollo/client/errors';
import { View, StyleSheet, Text, Button, TextInput } from 'react-native';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

const LOGIN_USER = gql`
    mutation Mutation(
        $loginInput: LoginInput
    ) {
        loginUser(
            loginInput: $loginInput
        ) {
            email
            username
            token
        }
    }
`;

interface ILogicProps {
    navigation: any
}

const Login = ({ navigation } : ILogicProps) : JSX.Element => {
    const context = useContext<IAuthContext>(AuthContext);
    const [errors, setErrors] = useState<GraphQLErrors>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUserCallback = (e: GestureResponderEvent) => {
        e.preventDefault();
        loginUser();
    };

    const [loginUser] = useMutation(LOGIN_USER, {
        update(_, { data: { loginUser: userData } }) {
            context.login(userData);
            navigation.navigate('Home');
        },
        onError({graphQLErrors}) {
            setErrors(graphQLErrors);
        },
        variables: {
            loginInput: { email, password }
        }
    });

    return (
        <View style={styles.container}>
            <Text>This is login page, login below!</Text>
            <TextInput
                style={styles.input}
                placeholder={'Email'}
                onChangeText={name => setEmail(name)} 
            />
            <TextInput
                style={styles.input}
                placeholder={'Password'}
                onChangeText={pass => setPassword(pass)}  
            />
            <Button
                onPress={loginUserCallback}
                title="Login"
                color="#841584"
            />
            {errors.map((error, idx) => (
                <View key={idx}>
                    <Text style={styles.error}>{error.message}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '60%'
    },
    input: {
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        marginBottom: 5,
        marginTop: 5
    },
    error: {
        color: 'red'
    }
});

export default Login;