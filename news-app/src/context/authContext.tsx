import { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';
import IAuthContext from '../interfaces/authContext';
import IAction from '../interfaces/action';
import IUserData from '../interfaces/userData';
import { getData, storeData } from '../storage';

const initialState : IAuthContext = {
    user: null,
    login: (userData) => {},
    logout: () => {}
};


let AuthContext : React.Context<IAuthContext> = createContext(initialState);

// (async () => {
//     const token : string | null | undefined = await getData('token');
//     console.log('awaited token', token);

//     if (token) {
//         const decodedToken : IToken = jwtDecode(token);

//         if (decodedToken.exp * 1000 < Date.now()) {
//             await storeData('token', undefined);
//         } else {
//             initialState.user = { username: decodedToken.username, email: decodedToken.email};
//         }
//     }

//     const contextValue = initialState;

//     AuthContext = createContext(contextValue);
// })()

function authReducer(state: IAuthContext, action: IAction) : IAuthContext {
    console.log('reducer', state, action);
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
        storeData('token', userData.token);
        console.log('auth context login', userData)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    };

    const logout = () => {
        storeData('token', undefined);
        dispatch({
            type: 'LOGOUT'
        });
    };
    console.log('Auth Provider', { user: state.user, login, logout },{...props})

    return (
        <AuthContext.Provider {...props} value={{ user: state.user, login, logout }} >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };