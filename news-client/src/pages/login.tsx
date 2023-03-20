import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useMutation } from '@apollo/react-hooks';

import { TextField, Button, Container, Stack, Alert } from '@mui/material';

import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import IAuthContext from '../interfaces/authContext';
import { GraphQLErrors } from '@apollo/client/errors';

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

const Login = () : JSX.Element => {
    const context = useContext<IAuthContext>(AuthContext);
    let navigate = useNavigate();
    const [errors, setErrors] = useState<GraphQLErrors>([]);

    const loginUserCallback = () => {
        console.log('Callback');
        loginUser();
    };
    
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        email: '',
        password: ''
    });

    const [loginUser] = useMutation(LOGIN_USER, {
        update(_, { data: { loginUser: userData } }) {
            context.login(userData);
            navigate('/');
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
        variables: {
            loginInput: values
        }
    });

    return (
        <Container maxWidth="sm">
            <h3>Login</h3>
            <p>This is th login page, login below!</p>
            <Stack spacing={2} paddingBottom={2}>
                <TextField
                    label="Email"
                    name="email"
                    onChange={onChange}
                />
                <TextField
                    label="Password"
                    name="password"
                    onChange={onChange}
                />
            </Stack>
            {errors.map((error, idx) => {
                return (
                    <Alert severity="error" key={idx}>
                        {error.message}
                    </Alert>
                );
            })}
            <Button variant="contained" onClick={onSubmit}>Login</Button>
        </Container>
    );
};

export default Login;