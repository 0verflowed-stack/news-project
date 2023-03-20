import { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';
import IAuthContext from '../interfaces/authContext';
import IAction from '../interfaces/action';
import IUserData from '../interfaces/userData';

interface IToken {
    username: string
    email: string
    user_id: string
    exp: number
    iat: number
} 

const initialState : IAuthContext = {
    user: null,
    login: (userData) => {},
    logout: () => {}
};

const token = localStorage.getItem('token');

if (token) {
    const decodedToken : IToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
    } else {
        initialState.user = { username: decodedToken.username, email: decodedToken.email};
    }
}

const contextValue = initialState;

const AuthContext = createContext(contextValue);

function authReducer(state: IAuthContext, action: IAction) : IAuthContext {
    switch(action.type) {
        case 'LOGIN':
            console.log('action.payload', action.payload)
            return {
                ...state,
                user: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}

function AuthProvider(props: any) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (userData: IUserData) => {
        localStorage.setItem('token', userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({
            type: 'LOGOUT'
        });
    };

    return (
        <AuthContext.Provider value={{ user: state.user, login, logout }} {...props} />
    );
};

export { AuthContext, AuthProvider };