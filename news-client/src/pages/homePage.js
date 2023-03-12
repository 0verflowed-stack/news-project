import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const HomePage = () => {
    const { user, logout } = useContext(AuthContext);

    
    return (
       <>
        <h2>Home Page</h2>
        {user ? (
            <h2>{user.email} is logined</h2>
        ) : (
            <p>Log in to access news</p>
        )}
        </>
    );
};

export default HomePage;