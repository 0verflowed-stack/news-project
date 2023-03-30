import { useContext } from 'react';
//import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import IAuthContext from '../interfaces/authContext';
import { View, StyleSheet, Text, Button } from 'react-native';

const Navbar = (): JSX.Element => {
    //const navigate = useNavigate();
    const { user, logout } = useContext<IAuthContext>(AuthContext);

    const onLogout = () => {
        logout();
        //navigate('/');
    };

    return (
        <View>
            {/* <Link to="/" style={{ textDecoration: "none", color: "white" }}>React Login</Link>
            {
                user ? (
                    <Button onClick={onLogout} style={{ color: "white" }}>Logout</Button>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: "none", color: "white", marginRight: "10px" }}>Login</Link>
                        <Link to="/register" style={{ textDecoration: "none", color: "white" }}>Register</Link>
                    </>
                )
            } */}
        </View>
    );
};

export default Navbar;