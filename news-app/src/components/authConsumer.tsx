import jwtDecode from "jwt-decode";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import IAuthContext from "../interfaces/authContext";
import IToken from "../interfaces/token";
import { getData, storeData } from "../storage";

interface IAuthConsumerProps {
    children: JSX.Element
}

export default function AuthConsumer({ children } : IAuthConsumerProps) {
    const context = useContext<IAuthContext>(AuthContext);

    useEffect(() => {
      const setUser = async () => {
        const token : string | null | undefined = await getData('token');
    
        if (token) {
            const decodedToken : IToken = jwtDecode(token);
    
            if (decodedToken.exp * 1000 < Date.now()) {
                await storeData('token', undefined);
            } else {
                context.login({ username: decodedToken.username, email: decodedToken.email, token, password: '' });
            }
        }
      };
      setUser();
    }, []);

    return <>{ children }</>;
}