import { useReducer, createContext } from 'react';
import IAuthContext from '../interfaces/authContext';
import IAction from '../interfaces/action';
import IUserData from '../interfaces/userData';
import { storeData } from '../storage';

const initialState : IAuthContext = {
    user: null,
    login: (userData) => {},
    logout: () => {}
};


let AuthContext : React.Context<IAuthContext> = createContext(initialState);

function authReducer(state: IAuthContext, action: IAction) : IAuthContext {
    switch(action.type) {
        case 'LOGIN':
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

    const login = (userData: IUserData | null) => {
        storeData('token', userData?.token);
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

    return (
        <AuthContext.Provider {...props} value={{ user: state.user, login, logout }} >
            {props.children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };