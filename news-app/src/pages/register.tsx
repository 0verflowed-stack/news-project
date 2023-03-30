import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'graphql-tag';
import IAuthContext from '../interfaces/authContext';
import { GraphQLErrors } from '@apollo/client/errors';
import { View, StyleSheet, Text, Button, TextInput } from 'react-native';

const REGISTER_USER = gql`
    mutation Mutation(
        $registerInput: RegisterInput
    ) {
        registerUser(
            registerInput: $registerInput
        ) {
            email
            username
            token
        }
    }
`;

interface IRegisterProps {
    navigation: any
}

const Register = ({ navigation } : IRegisterProps) : JSX.Element => {
    const context = useContext<IAuthContext>(AuthContext);
    const [errors, setErrors] = useState<GraphQLErrors>([]);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    console.log('Register screen');
    const registerUserCallback = () => {
        registerUser();
    };

    const [registerUser] = useMutation(REGISTER_USER, {
        update(_, { data: { registerUser: userData } }) {
            context.login(userData);
            navigation.navigate('Home');
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
        variables: {
            registerInput: {
                    username,
                    email,
                    password,
                    confirmPassword
                }
        }
    });

    return (
        <View style={styles.container}>
            <Text>Register</Text>
            <Text>This is th register page, register below to create an account!</Text>
            <TextInput
                style={styles.input}
                placeholder={'Username'}
                onChangeText={name => setUsername(name)} 
            />
            <TextInput
                style={styles.input}
                placeholder={'Email'}
                onChangeText={name => setEmail(name)} 
            />
            <TextInput
                style={styles.input}
                placeholder={'Password'}
                onChangeText={name => setPassword(name)} 
            />
            <TextInput
                style={styles.input}
                placeholder={'Confirm password'}
                onChangeText={name => setConfirmPassword(name)} 
            />
            {errors.map((error, idx) => (
                <View key={idx}>
                    <Text style={styles.error}>{error.message}</Text>
                </View>
            ))}
            <Button
                onPress={registerUserCallback}
                title="Register"
                color="#841584"
            />
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
        borderRadius: 10
    },
    error: {
        color: 'red'
    }
});

export default Register;